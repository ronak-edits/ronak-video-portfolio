import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import projectRoutes from './projectRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import profileRoutes from './profileRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/projects', projectRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/profile', profileRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);

export default router;
