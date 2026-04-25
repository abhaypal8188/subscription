import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/config/db.js";
import { startReminderJob } from "../server/src/jobs/reminderJob.js";

let isConnected = false;
let connectionPromise = null;

const initializeApp = async () => {
  if (isConnected) return app;
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      await connectDatabase();
      // Only start cron in non-serverless or if explicitly enabled
      if (process.env.ENABLE_CRON === "true") {
        startReminderJob();
      }
      isConnected = true;
      console.log("Serverless function initialized");
      return app;
    } catch (error) {
      console.error("Failed to initialize app:", error);
      throw error;
    }
  })();

  return connectionPromise;
};

export default async (req, res) => {
  try {
    const application = await initializeApp();
    return application(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
