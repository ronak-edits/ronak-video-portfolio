import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  if (!env.jwt.secret) {
    throw new ApiError(
      500,
      'Server authentication secret (JWT_SECRET) is not configured.'
    );
  }

  const email = String(req.body.email).toLowerCase().trim();
  const password = String(req.body.password);

  const admin = await Admin.findOne({ email }).select('+passwordHash');
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), role: admin.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  admin.lastLoginAt = new Date();
  await admin.save();

  res.cookie(env.cookie.name, token, env.cookie.options);

  const safeAdmin = {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    lastLoginAt: admin.lastLoginAt,
  };

  res
    .status(200)
    .json(new ApiResponse(200, 'Logged in successfully', { admin: safeAdmin }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookie.name, {
    httpOnly: true,
    secure: env.cookie.options.secure,
    sameSite: env.cookie.options.sameSite,
    path: '/',
  });

  res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, 'Session active', {
        admin: {
          _id: req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          lastLoginAt: req.admin.lastLoginAt,
        },
      })
    );
});
