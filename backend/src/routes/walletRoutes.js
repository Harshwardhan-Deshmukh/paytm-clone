import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import { Wallet } from "../database/db.js";
import responseHandler from "../utils/responseHandler.js";
const router = Router();

router.get("/balance", authenticationMiddleware, async (req, res) => {
  const { _id } = req.user;
  const balance = await Wallet.findOne({ user: _id }).select("balance");
  return responseHandler(
    res,
    200,
    "SUCCESS",
    { _id, balance: balance.balance },
    null,
  );
});

// only works for self
router.put("/funds/:amount", authenticationMiddleware, async (req, res) => {
  const { _id } = req.user;
  const amount = req.params.amount;

  // this ensures balance never goes below 0 after update
  const balance = await Wallet.findOneAndUpdate(
    { user: _id, balance: { $gte: -amount } },
    { $inc: { balance: amount } },
    { new: true },
  ).select("balance");
  if (balance) {
    return responseHandler(res, 204, "SUCCESS", null, null);
  } else {
    return responseHandler(res, 411, "ERROR", null, "Insufficient Funds");
  }
});

export default router;
