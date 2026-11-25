import ApiError from '../utils/ApiError.js';

/**
 * Lightweight in-memory sliding-window rate limiter middleware.
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 10,
  message = 'Too many requests. Please try again later.',
} = {}) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const recent = (attempts.get(key) || []).filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (recent.length >= max) {
      const oldest = recent[0];
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowMs - (now - oldest)) / 1000)
      );
      res.set('Retry-After', String(retryAfterSeconds));
      return next(new ApiError(429, message));
    }

    recent.push(now);
    attempts.set(key, recent);
    return next();
  };
};

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
});

export const enquiryRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many enquiries submitted recently. Please try again shortly.',
});
