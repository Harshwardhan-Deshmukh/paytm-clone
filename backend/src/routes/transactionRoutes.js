import { Router } from "express";
import mongoose from "mongoose";
import { Transaction, User, Wallet } from "../database/db.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import responseHandler from "../utils/responseHandler.js";
import { transferMoneyCheck } from "../validation/zodSchema.js";
const router = Router();

router.post("/", authenticationMiddleware, async (req, res) => {
  const { _id } = req.user;
  const data = transferMoneyCheck.safeParse(req.body);
  if (data.success) {
    const { to, amount } = data.data;
    const session = await mongoose.startSession();
    session.startTransaction();
    // check for validating the to {user id} is a valid one
    try {
      await User.findById({ _id: to }).session(session);
    } catch (err) {
      session.abortTransaction();
      session.endSession();
      err.statusCode = 404;
      err.message = "Invalid User";
      throw err;
    }
    const senderBalance = await Wallet.findOneAndUpdate(
      { user: _id, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
    )
      .select("balance")
      .session(session);

    const receiverBalance = await Wallet.findOneAndUpdate(
      { user: to },
      { $inc: { balance: amount } },
    )
      .select("balance")
      .session(session);

    if (senderBalance && receiverBalance) {
      const transaction = await Transaction.create({
        sender: _id,
        receiver: to,
        amount,
      });
      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
      return responseHandler(res, 200, "SUCCESS", transaction, null);
    } else {
      return responseHandler(res, 411, "ERROR", null, "Insufficient Funds");
    }
  } else {
    return responseHandler(res, 411, "ERROR", null, data.error.errors);
  }
});

export default router;
