import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["Entertainment", "Health", "Education", "Productivity", "Lifestyle", "Utilities", "Other"],
      default: "Other",
    },
    paymentMethod: {
      type: String,
      default: "Card",
    },
    logoUrl: String,
    remindersEnabled: {
      type: Boolean,
      default: true,
    },
    notes: String,
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    usageScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 65,
    },
    autoPay: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

