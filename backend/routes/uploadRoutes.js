import { Router } from 'express';
import { signUpload } from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { validateUploadSign } from '../validators/portfolioValidators.js';

const router = Router();

router.use(requireAdmin);
router.post('/sign', validateBody(validateUploadSign), signUpload);

export default router;
