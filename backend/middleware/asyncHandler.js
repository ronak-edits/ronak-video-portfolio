/**
 * Wraps async Express route handlers and forwards rejected promises
 * to the centralized error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
