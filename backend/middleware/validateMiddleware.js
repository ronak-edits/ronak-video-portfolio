import ApiError from '../utils/ApiError.js';

/**
 * Express middleware factory that runs a validator function on req.body.
 */
export const validateBody = (validator) => (req, _res, next) => {
  const errors = validator(req.body || {});
  if (errors.length > 0) {
    return next(new ApiError(400, errors[0], errors));
  }
  return next();
};
