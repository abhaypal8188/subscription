import dayjs from "dayjs";

export const normalizeToMonthlyCost = (subscription) =>
  subscription.billingCycle === "yearly" ? subscription.price / 12 : subscription.price;

export const buildSavingsSuggestions = (subscriptions) => {
  const total = subscriptions.reduce((sum, item) => sum + normalizeToMonthlyCost(item), 0);

  return subscriptions
    .filter((item) => item.usageScore <= 35 || normalizeToMonthlyCost(item) > total * 0.2)
    .slice(0, 4)
    .map((item) => {
      const monthlyCost = normalizeToMonthlyCost(item);
      const reason =
        item.usageScore <= 35
          ? "usage appears low"
          : "this takes a large share of your recurring spend";

      return {
        subscriptionId: item._id,
        title: `Cancel ${item.name} to save ₹${monthlyCost.toFixed(0)}/month`,
        description: `${item.name} costs ₹${monthlyCost.toFixed(0)} monthly and ${reason}.`,
      };
    });
};

export const buildTrendSeries = (subscriptions, months = 6) => {
  const now = dayjs();

  return Array.from({ length: months }).map((_, index) => {
    const currentMonth = now.subtract(months - index - 1, "month");
    const total = subscriptions.reduce((sum, item) => {
      if (dayjs(item.createdAt).isAfter(currentMonth.endOf("month"))) {
        return sum;
      }

      return sum + normalizeToMonthlyCost(item);
    }, 0);

    return {
      month: currentMonth.format("MMM"),
      amount: Number(total.toFixed(2)),
    };
  });
};

export const predictNextMonthSpend = (trend) => {
  if (!trend.length) {
    return 0;
  }

  const average = trend.reduce((sum, item) => sum + item.amount, 0) / trend.length;
  const last = trend[trend.length - 1]?.amount || 0;
  return Number(((average + last) / 2).toFixed(2));
};

export const getUpcomingWindow = (subscriptions, days = 7) => {
  const start = dayjs().startOf("day");
  const end = dayjs().add(days, "day").endOf("day");

  return subscriptions.filter((item) => {
    const billingDate = dayjs(item.nextBillingDate);
    return billingDate.isAfter(start) && billingDate.isBefore(end);
  });
};

