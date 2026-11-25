import { Router } from 'express';
import {
  createService,
  deleteService,
  getAdminServices,
  getPublicServices,
  updateService,
} from '../controllers/serviceController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateService } from '../validators/portfolioValidators.js';

const router = Router();

// Public route
router.get('/public', getPublicServices);

// Protected admin routes
router.use(requireAdmin);
router.get('/', getAdminServices);
router.post('/', validateBody(validateService), createService);
router.put('/:id', validateBody(validateService), updateService);
router.delete('/:id', deleteService);

export default router;
