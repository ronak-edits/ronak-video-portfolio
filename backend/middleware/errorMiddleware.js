import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Fallback middleware for unmatched API routes.
 */
export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

/**
 * Centralized Express error-handling middleware.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyPattern || {})[0] || 'record';
    message = `A record with this ${duplicateField} already exists.`;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(!env.isProduction && { stack: err.stack }),
  });
};
