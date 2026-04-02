import asyncHandler from "express-async-handler";
import { stringify } from "csv-stringify/sync";
import Subscription from "../models/Subscription.js";
import Transaction from "../models/Transaction.js";
import {
  buildSavingsSuggestions,
  buildTrendSeries,
  getUpcomingWindow,
  normalizeToMonthlyCost,
  predictNextMonthSpend,
} from "../utils/analytics.js";

export const getSummary = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id });
  const transactions = await Transaction.find({ user: req.user._id }).sort({ paidAt: -1 }).limit(20);

  const totalMonthlyCost = subscriptions.reduce(
    (sum, item) => sum + normalizeToMonthlyCost(item),
    0,
  );
  const activeCount = subscriptions.filter((item) => item.status === "active").length;
  const expiredCount = subscriptions.filter((item) => item.status === "expired").length;
  const upcomingPayments = getUpcomingWindow(subscriptions, 10);

  const categoryBreakdown = Object.values(
    subscriptions.reduce((accumulator, item) => {
      const current = accumulator[item.category] || {
        name: item.category,
        value: 0,
      };

      current.value += normalizeToMonthlyCost(item);
      accumulator[item.category] = current;
      return accumulator;
    }, {}),
  );

  const trends = buildTrendSeries(subscriptions, 6);
  const predictedNextMonth = predictNextMonthSpend(trends);
  const savingsSuggestions = buildSavingsSuggestions(subscriptions);
  const entertainmentSpend = categoryBreakdown.find((item) => item.name === "Entertainment")?.value || 0;
  const entertainmentShare = totalMonthlyCost ? Math.round((entertainmentSpend / totalMonthlyCost) * 100) : 0;

  res.json({
    summary: {
      totalMonthlyCost: Number(totalMonthlyCost.toFixed(2)),
      activeCount,
      expiredCount,
      upcomingCount: upcomingPayments.length,
      predictedNextMonth,
      entertainmentShare,
      insights: [
        `You spent ${entertainmentShare}% on entertainment subscriptions.`,
        upcomingPayments.length
          ? `${upcomingPayments.length} payment(s) are due in the next 10 days.`
          : "No payments are due in the next 10 days.",
      ],
    },
    categoryBreakdown,
    trends,
    upcomingPayments,
    savingsSuggestions,
    transactions,
  });
});

export const getTrends = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id });
  res.json({ trends: buildTrendSeries(subscriptions, 12) });
});

export const exportTransactionsCsv = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate("subscription", "name")
    .sort({ paidAt: -1 });

  const csv = stringify(
    transactions.map((item) => ({
      subscription: item.subscription?.name || "Unknown",
      amount: item.amount,
      category: item.category,
      paidAt: item.paidAt,
      paymentMethod: item.paymentMethod,
      status: item.status,
    })),
    {
      header: true,
    },
  );

  res.header("Content-Type", "text/csv");
  res.attachment("transactions.csv");
  res.send(csv);
});

