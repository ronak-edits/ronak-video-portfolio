import Profile from '../models/Profile.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getOrCreateProfile = async () => {
  let profile = await Profile.findOne({ key: 'main' });
  if (!profile) {
    profile = await Profile.create({ key: 'main' });
  }
  return profile;
};

const sanitizeExperience = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      period: String(item?.period || '').trim(),
      role: String(item?.role || '').trim(),
      company: String(item?.company || '').trim(),
      summary: String(item?.summary || '').trim(),
    }))
    .filter((item) => item.role || item.company || item.period || item.summary);
};

const sanitizeSkills = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      title: String(item?.title || '').trim(),
      detail: String(item?.detail || '').trim(),
    }))
    .filter((item) => item.title || item.detail);
};

const sanitizeTools = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      name: String(item?.name || '').trim(),
      category: String(item?.category || '').trim(),
    }))
    .filter((item) => item.name || item.category);
};

export const getProfile = asyncHandler(async (_req, res) => {
  const profile = await getOrCreateProfile();
  res
    .status(200)
    .json(new ApiResponse(200, 'Profile retrieved', { profile }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();

  profile.name = req.body.name.trim();
  profile.professionalTitle = (req.body.professionalTitle || '').trim();
  profile.profileImage = (req.body.profileImage || '').trim();
  profile.shortBio = (req.body.shortBio || '').trim();
  profile.fullBiography = (req.body.fullBiography || '').trim();
  profile.creativeApproach = (req.body.creativeApproach || '').trim();

  if (req.body.experience !== undefined) {
    profile.experience = sanitizeExperience(req.body.experience);
  }
  if (req.body.editingSkills !== undefined) {
    profile.editingSkills = sanitizeSkills(req.body.editingSkills);
  }
  if (req.body.softwareTools !== undefined) {
    profile.softwareTools = sanitizeTools(req.body.softwareTools);
  }

  profile.socialUrls = {
    youtube: String(req.body.socialUrls?.youtube || '').trim(),
    instagram: String(req.body.socialUrls?.instagram || '').trim(),
    linkedin: String(req.body.socialUrls?.linkedin || '').trim(),
    twitter: String(req.body.socialUrls?.twitter || '').trim(),
  };

  await profile.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Profile updated successfully', { profile }));
});
