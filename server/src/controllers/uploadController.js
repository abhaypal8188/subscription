import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";

// Configure Cloudinary if env vars are present
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localUploadDir = path.join(__dirname, "..", "..", "uploads");
const isServerlessRuntime = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const sanitizeFilename = (filename) => filename.replace(/[^a-zA-Z0-9.-]+/g, "-").replace(/-+/g, "-");

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "subscription-manager/logos",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });

export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const result = await uploadToCloudinary(req.file);

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  if (isServerlessRuntime) {
    res.status(503);
    throw new Error("Logo uploads require Cloudinary when deployed to Vercel");
  }

  await fs.mkdir(localUploadDir, { recursive: true });
  const filename = `${Date.now()}-${sanitizeFilename(req.file.originalname)}`;
  await fs.writeFile(path.join(localUploadDir, filename), req.file.buffer);

  res.status(201).json({
    url: `/uploads/${filename}`,
  });
});
