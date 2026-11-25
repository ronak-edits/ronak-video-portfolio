import crypto from 'node:crypto';
import env from '../config/env.js';
import { getCloudinaryConfig } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const ALLOWED_FOLDERS = new Set([
  'ronak-portfolio/thumbnails',
  'ronak-portfolio/videos',
  'ronak-portfolio/profile',
  'ronak-portfolio/showreel',
]);

/**
 * Generates a secure Cloudinary upload signature on the server so
 * CLOUDINARY_API_SECRET is never exposed to the browser.
 */
export const generateSignedUploadPayload = ({
  resourceType,
  folder = 'ronak-portfolio/thumbnails',
}) => {
  const config = getCloudinaryConfig();

  if (!config.isConfigured) {
    throw new ApiError(
      503,
      'Cloudinary credentials are not configured on the server yet.'
    );
  }

  const safeFolder = ALLOWED_FOLDERS.has(folder)
    ? folder
    : 'ronak-portfolio/thumbnails';

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    folder: safeFolder,
    timestamp,
  };

  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');

  const signature = crypto
    .createHash('sha1')
    .update(`${signatureBase}${env.cloudinary.apiSecret}`)
    .digest('hex');

  return {
    signature,
    timestamp,
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder: safeFolder,
    resourceType,
  };
};
