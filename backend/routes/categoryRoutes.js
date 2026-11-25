import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getPublicCategories,
  updateCategory,
} from '../controllers/categoryController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateCategory } from '../validators/portfolioValidators.js';

const router = Router();

// Public route
router.get('/public', getPublicCategories);

// Protected admin routes
router.use(requireAdmin);
router.get('/', getAdminCategories);
router.post('/', validateBody(validateCategory), createCategory);
router.put('/:id', validateBody(validateCategory), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
