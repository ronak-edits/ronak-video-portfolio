import { Router } from 'express';
import {
  createEnquiry,
  deleteEnquiry,
  getAdminEnquiries,
  getEnquiryById,
  toggleEnquiryRead,
} from '../controllers/enquiryController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { enquiryRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateEnquiry } from '../validators/portfolioValidators.js';

const router = Router();

// Public enquiry submission
router.post('/', enquiryRateLimiter, validateBody(validateEnquiry), createEnquiry);

// Protected admin routes
router.use(requireAdmin);
router.get('/', getAdminEnquiries);
router.get('/:id', getEnquiryById);
router.patch('/:id/read', toggleEnquiryRead);
router.delete('/:id', deleteEnquiry);

export default router;
