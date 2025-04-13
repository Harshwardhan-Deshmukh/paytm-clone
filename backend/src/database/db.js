import { connect, Schema, Model } from "mongoose";
import { MONGODB_CONNECTION_STRING } from "../config/configs.js";

connect(MONGODB_CONNECTION_STRING)
  .then(() => console.log("Mongodb connection successful"))
  .catch((err) => console.log(`Mongodb connection failed : ${err.message}`));

// schemas
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    username: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

const WalletSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  balance: { type: Number, default: 0 },
});

const TransactionSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now },
});

// models
export const User = Model("User", UserSchema);
export const Wallet = Model("Wallet", WalletSchema);
export const Transaction = Model("Transaction", TransactionSchema);
