import { connectDatabase } from "../../server/src/config/db.js";
import Subscription from "../../server/src/models/Subscription.js";
import User from "../../server/src/models/User.js";
import { sendEmail } from "../../server/src/utils/email.js";
import dayjs from "dayjs";

let isConnected = false;

export default async (req, res) => {
  // Verify request is from Vercel or trusted source
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
    }

    const today = dayjs();
    const tomorrowStart = today.add(1, "day").startOf("day").toDate();
    const tomorrowEnd = today.add(1, "day").endOf("day").toDate();

    const upcomingSubscriptions = await Subscription.find({
      renewalDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
      status: "active",
    }).populate("userId");

    for (const subscription of upcomingSubscriptions) {
      const user = subscription.userId;
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: `Reminder: ${subscription.name} renews tomorrow`,
          html: `<p>Hi ${user.name},</p><p>Your subscription <strong>${subscription.name}</strong> will renew tomorrow on ${tomorrowStart.toDateString()}.</p>`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Sent ${upcomingSubscriptions.length} reminder emails`,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    res.status(500).json({ error: error.message });
  }
};
