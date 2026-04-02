import asyncHandler from "express-async-handler";
import dayjs from "dayjs";
import Subscription from "../models/Subscription.js";
import Transaction from "../models/Transaction.js";

const syncTransaction = async (subscription) => {
  const exists = await Transaction.findOne({
    user: subscription.user,
    subscription: subscription._id,
    paidAt: {
      $gte: dayjs(subscription.nextBillingDate).startOf("month").toDate(),
      $lte: dayjs(subscription.nextBillingDate).endOf("month").toDate(),
    },
  });

  if (!exists) {
    await Transaction.create({
      user: subscription.user,
      subscription: subscription._id,
      amount: subscription.price,
      category: subscription.category,
      paidAt: subscription.nextBillingDate,
      paymentMethod: subscription.paymentMethod,
    });
  }
};

export const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id }).sort({
    nextBillingDate: 1,
  });

  res.json({ subscriptions });
});

export const createSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.create({
    ...req.body,
    user: req.user._id,
  });

  await syncTransaction(subscription);
  res.status(201).json({ subscription });
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  await syncTransaction(subscription);
  res.json({ subscription });
});

export const deleteSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  await Transaction.deleteMany({ subscription: subscription._id });
  res.json({ message: "Subscription deleted" });
});

