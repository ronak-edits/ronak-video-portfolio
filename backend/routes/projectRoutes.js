import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getAdminProjects,
  getProjectById,
  getPublicProjectBySlug,
  getPublicProjects,
  toggleFeatured,
  toggleStatus,
  updateProject,
} from '../controllers/projectController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateProject } from '../validators/portfolioValidators.js';

const router = Router();

// Public routes
router.get('/public', getPublicProjects);
router.get('/public/:slug', getPublicProjectBySlug);

// Protected admin routes
router.use(requireAdmin);
router.get('/', getAdminProjects);
router.get('/:id', getProjectById);
router.post('/', validateBody(validateProject), createProject);
router.put('/:id', validateBody(validateProject), updateProject);
router.patch('/:id/toggle-featured', toggleFeatured);
router.patch('/:id/toggle-status', toggleStatus);
router.delete('/:id', deleteProject);

export default router;
