import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils.js";

const buildAuthResponse = (user) => {
  const payload = { userId: user._id, role: user.role };

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password });
  const auth = buildAuthResponse(user);
  user.refreshToken = auth.refreshToken;
  await user.save();

  res.status(201).json(auth);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const auth = buildAuthResponse(user);
  user.refreshToken = auth.refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  res.json(auth);
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error("Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (_error) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const auth = buildAuthResponse(user);
  user.refreshToken = auth.refreshToken;
  await user.save();

  res.json(auth);
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.json({ message: "If the account exists, a reset link has been sent." });
    return;
  }

  const token = crypto.randomBytes(24).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<p>Use this token to reset your password: <strong>${token}</strong></p>`,
  });

  res.json({ message: "If the account exists, a reset link has been sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ message: "Password updated successfully" });
});
