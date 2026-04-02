import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadLogo } from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const upload = multer({ storage });

router.post("/logo", protect, upload.single("logo"), uploadLogo);

export default router;

