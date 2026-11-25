import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateSignedUploadPayload } from '../services/cloudinaryService.js';

export const signUpload = asyncHandler(async (req, res) => {
  const payload = generateSignedUploadPayload({
    resourceType: req.body.resourceType,
    folder: req.body.folder,
  });

  res
    .status(200)
    .json(new ApiResponse(200, 'Upload signature generated', payload));
});
