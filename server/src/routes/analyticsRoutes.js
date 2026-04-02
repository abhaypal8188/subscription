import express from "express";
import {
  exportTransactionsCsv,
  getSummary,
  getTrends,
} from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.get("/trends", getTrends);
router.get("/export.csv", exportTransactionsCsv);

export default router;

