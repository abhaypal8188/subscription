import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/config/db.js";
import { startReminderJob } from "../server/src/jobs/reminderJob.js";

let isConnected = false;

const initializeApp = async () => {
  if (!isConnected) {
    await connectDatabase();
    startReminderJob();
    isConnected = true;
  }
  return app;
};

export default async (req, res) => {
  const application = await initializeApp();
  return application(req, res);
};
