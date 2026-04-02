import asyncHandler from "express-async-handler";
import Subscription from "../models/Subscription.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { normalizeToMonthlyCost } from "../utils/analytics.js";

export const getAdminOverview = asyncHandler(async (_req, res) => {
  const [users, subscriptions, transactions] = await Promise.all([
    User.find().select("-password"),
    Subscription.find().populate("user", "name email"),
    Transaction.find(),
  ]);

  const totalTrackedRevenue = subscriptions.reduce(
    (sum, item) => sum + normalizeToMonthlyCost(item),
    0,
  );

  res.json({
    metrics: {
      totalUsers: users.length,
      totalSubscriptions: subscriptions.length,
      totalTrackedRevenue: Number(totalTrackedRevenue.toFixed(2)),
      totalTransactions: transactions.length,
    },
    users,
    subscriptions,
  });
});

