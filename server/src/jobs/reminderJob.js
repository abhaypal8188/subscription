import cron from "node-cron";
import dayjs from "dayjs";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

export const startReminderJob = () => {
  cron.schedule("0 9 * * *", async () => {
    const targetDate = dayjs().add(3, "day").format("YYYY-MM-DD");
    const subscriptions = await Subscription.find({
      remindersEnabled: true,
      status: "active",
    }).populate("user");

    for (const subscription of subscriptions) {
      const billingDate = dayjs(subscription.nextBillingDate).format("YYYY-MM-DD");

      if (billingDate !== targetDate) {
        continue;
      }

      const user = await User.findById(subscription.user._id);
      if (!user) {
        continue;
      }

      await sendEmail({
        to: user.email,
        subject: `${subscription.name} payment reminder`,
        html: `<p>Your ${subscription.name} subscription will renew on ${dayjs(
          subscription.nextBillingDate,
        ).format("DD MMM YYYY")} for ₹${subscription.price}.</p>`,
      });
    }
  });
};
