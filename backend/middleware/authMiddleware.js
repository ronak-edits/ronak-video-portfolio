import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from './asyncHandler.js';

/**
 * Protects admin endpoints using JWT stored in an HTTP-only cookie.
 */
export const requireAdmin = asyncHandler(async (req, _res, next) => {
  if (!env.jwt.secret) {
    throw new ApiError(
      500,
      'Authentication is not configured on the server (missing JWT_SECRET).'
    );
  }

  const token = req.cookies?.[env.cookie.name];

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please log in.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid authentication session.');
  }

  const admin = await Admin.findById(decoded.sub);
  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists.');
  }

  req.admin = admin;
  next();
});
