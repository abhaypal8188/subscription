import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: String,
    status: {
      type: String,
      enum: ["paid", "failed", "refunded"],
      default: "paid",
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

