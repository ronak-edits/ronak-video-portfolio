import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateProfile } from '../validators/portfolioValidators.js';

const router = Router();

router.get('/', getProfile);
router.put('/', requireAdmin, validateBody(validateProfile), updateProfile);

export default router;
