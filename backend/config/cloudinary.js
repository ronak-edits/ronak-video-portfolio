import env from './env.js';

/**
 * Cloudinary Configuration Blueprint (Phase 2+).
 * All portfolio videos and images will be hosted on Cloudinary rather than
 * stored on the application server.
 */
export const getCloudinaryConfig = () => ({
  cloudName: env.cloudinary.cloudName,
  apiKey: env.cloudinary.apiKey,
  apiSecret: env.cloudinary.apiSecret,
  isConfigured: Boolean(
    env.cloudinary.cloudName &&
      env.cloudinary.apiKey &&
      env.cloudinary.apiSecret
  ),
});
