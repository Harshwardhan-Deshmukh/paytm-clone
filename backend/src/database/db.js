import mongoose from "mongoose";
import { MONGODB_CONNECTION_STRING } from "../config/configs.js";

mongoose
  .connect(MONGODB_CONNECTION_STRING)
  .then(() => console.log("Mongodb connection successful"))
  .catch((err) => console.log(`Mongodb connection failed : ${err.message}`));

// schemas
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    username: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: { type: Number, default: 0 },
});

const TransactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

// models
export const User = mongoose.model("User", UserSchema);
export const Wallet = mongoose.model("Wallet", WalletSchema);
export const Transaction = mongoose.model("Transaction", TransactionSchema);
