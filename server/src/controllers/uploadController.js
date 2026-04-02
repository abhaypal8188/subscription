import asyncHandler from "express-async-handler";

export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
  });
});

