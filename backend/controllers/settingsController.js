import SiteSetting from '../models/SiteSetting.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getOrCreateSettings = async () => {
  let settings = await SiteSetting.findOne({ key: 'main' });
  if (!settings) {
    settings = await SiteSetting.create({ key: 'main' });
  }
  return settings;
};

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  res
    .status(200)
    .json(new ApiResponse(200, 'Site settings retrieved', { settings }));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  settings.contactEmail = (req.body.contactEmail || '').trim();
  settings.phoneNumber = (req.body.phoneNumber || '').trim();
  settings.location = (req.body.location || '').trim();
  settings.instagramUrl = (req.body.instagramUrl || '').trim();
  settings.youtubeUrl = (req.body.youtubeUrl || '').trim();
  settings.linkedinUrl = (req.body.linkedinUrl || '').trim();
  settings.showreelVideoUrl = (req.body.showreelVideoUrl || '').trim();
  settings.showreelThumbnailUrl = (req.body.showreelThumbnailUrl || '').trim();
  settings.seoTitle = (req.body.seoTitle || '').trim();
  settings.metaDescription = (req.body.metaDescription || '').trim();
  settings.copyrightText = (req.body.copyrightText || '').trim();

  await settings.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Site settings updated successfully', { settings }));
});
