import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateSettings } from '../validators/portfolioValidators.js';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAdmin, validateBody(validateSettings), updateSettings);

export default router;
