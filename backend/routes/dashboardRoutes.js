import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', requireAdmin, getDashboardStats);

export default router;
