import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { startReminderJob } from "./jobs/reminderJob.js";

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDatabase();
  startReminderJob();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
