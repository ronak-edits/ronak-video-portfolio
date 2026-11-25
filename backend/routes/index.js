import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/health', healthRoutes);

/**
 * Future Phase Module Mount Points (not implemented in Phase 1):
 * - /auth        -> Authentication (JWT + HTTP-only cookies)
 * - /projects    -> Portfolio projects
 * - /categories  -> Project categories
 * - /enquiries   -> Contact enquiries
 * - /uploads     -> Cloudinary upload signatures / management
 * - /settings    -> Site settings
 */

export default router;
