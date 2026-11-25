import { Router } from 'express';
import { getMe, login, logout } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateLogin } from '../validators/portfolioValidators.js';

const router = Router();

router.post('/login', loginRateLimiter, validateBody(validateLogin), login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);

export default router;
