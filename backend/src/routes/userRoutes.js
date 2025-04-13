import { Router } from "express";
import {
  authenticationMiddleware,
  signIn,
  signUp,
} from "../middlewares/authMiddleware.js";
import { User } from "../database/db.js";
import responseHandler from "../utils/responseHandler.js";
import { hashPassword } from "../utils/passwordHasher.js";
import { updateUserBodyChecker } from "../validation/zodSchema.js";
const router = Router();

// user routes
router.post("/signup", signUp, async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = new User({
    firstName,
    lastName,
    username,
    password: hashedPassword,
  });
  const userData = await user.save();
  return responseHandler(
    res,
    201,
    "SUCCESS",
    { id: userData._id, message: "SignUp success" },
    null,
  );
});

router.post("/signin", signIn, async (req, res) => {
  return responseHandler(
    res,
    200,
    "SUCCESS",
    { message: "Login success", token: req.token },
    null,
  );
});

router.get("/", authenticationMiddleware, async (req, res) => {
  const data = await User.findById(req.user.id).select(
    "_id username firstName lastName createdAt updatedAt",
  );
  return responseHandler(res, 200, "SUCCESS", data, null);
});

router.put("/", authenticationMiddleware, async (req, res) => {
  const data = updateUserBodyChecker.safeParse(req.body);
  if (data.success) {
    const { username } = req.user;
    const { firstName, lastName, password } = req.body;
    const updates = {};
    if (data.data.firstName) updates["firstName"] = firstName;
    if (data.data.lastName) updates["lastName"] = lastName;
    if (data.data.password) updates["password"] = await hashPassword(password);
    await User.updateOne({ username }, updates);
    return responseHandler(res, 204, "SUCCESS", null, null);
  } else {
    return responseHandler(res, 411, "ERROR", null, data.error.errors);
  }
});

// get all users for sending money
router.get("/bulk", authenticationMiddleware, (req, res) => {
  res.json({});
});

export default router;
