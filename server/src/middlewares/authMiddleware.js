import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const error = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch (_error) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  next();
};
