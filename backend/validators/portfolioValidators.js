import {
  isNonEmptyString,
  isValidEmail,
  isValidObjectId,
  isValidOptionalUrl,
} from './commonValidators.js';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

export const validateLogin = (body) => {
  const errors = [];
  if (!isValidEmail(body.email)) {
    errors.push('Please provide a valid email address.');
  }
  if (!isNonEmptyString(body.password)) {
    errors.push('Password is required.');
  }
  return errors;
};

export const validateCategory = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.name)) {
    errors.push('Category name is required.');
  }
  if (
    body.displayOrder !== undefined &&
    Number.isNaN(Number(body.displayOrder))
  ) {
    errors.push('Display order must be a valid number.');
  }
  return errors;
};

export const validateProject = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.title)) {
    errors.push('Project title is required.');
  }
  if (!isNonEmptyString(body.shortDescription)) {
    errors.push('Short description is required.');
  }
  if (!isValidObjectId(body.category)) {
    errors.push('Please select a valid category.');
  }
  if (!isValidOptionalUrl(body.thumbnailUrl)) {
    errors.push('Thumbnail URL must be a valid HTTP/HTTPS URL.');
  }
  if (!isValidOptionalUrl(body.videoUrl)) {
    errors.push('Video URL must be a valid HTTP/HTTPS URL.');
  }
  if (
    body.status !== undefined &&
    !['published', 'draft'].includes(body.status)
  ) {
    errors.push('Project status must be either published or draft.');
  }
  if (
    body.displayOrder !== undefined &&
    Number.isNaN(Number(body.displayOrder))
  ) {
    errors.push('Display order must be a valid number.');
  }
  return errors;
};

export const validateService = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.title)) {
    errors.push('Service title is required.');
  }
  if (!isNonEmptyString(body.description)) {
    errors.push('Service description is required.');
  }
  if (
    body.displayOrder !== undefined &&
    Number.isNaN(Number(body.displayOrder))
  ) {
    errors.push('Display order must be a valid number.');
  }
  return errors;
};

export const validateProfile = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.name)) {
    errors.push('Profile name is required.');
  }
  if (!isValidOptionalUrl(body.profileImage)) {
    errors.push('Profile image URL must be a valid HTTP/HTTPS URL.');
  }
  const socialUrls = body.socialUrls || {};
  for (const [key, val] of Object.entries(socialUrls)) {
    if (!isValidOptionalUrl(val)) {
      errors.push(`Social URL (${key}) must be a valid HTTP/HTTPS URL.`);
    }
  }
  return errors;
};

export const validateEnquiry = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.fullName)) {
    errors.push('Please enter your full name.');
  }
  if (!isValidEmail(body.email)) {
    errors.push('Please enter a valid email address.');
  }
  if (!isNonEmptyString(body.projectType)) {
    errors.push('Please select a project type.');
  }
  if (!isNonEmptyString(body.message) || body.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  }
  return errors;
};

export const validateSettings = (body) => {
  const errors = [];
  if (body.contactEmail && !isValidEmail(body.contactEmail)) {
    errors.push('Contact email must be a valid email address.');
  }
  const urlFields = [
    ['instagramUrl', 'Instagram URL'],
    ['youtubeUrl', 'YouTube URL'],
    ['linkedinUrl', 'LinkedIn URL'],
    ['showreelVideoUrl', 'Showreel Video URL'],
    ['showreelThumbnailUrl', 'Showreel Thumbnail URL'],
  ];
  for (const [field, label] of urlFields) {
    if (!isValidOptionalUrl(body[field])) {
      errors.push(`${label} must be a valid HTTP/HTTPS URL.`);
    }
  }
  return errors;
};

export const validateUploadSign = (body) => {
  const errors = [];
  const { resourceType, fileType, fileSize } = body;

  if (!['image', 'video'].includes(resourceType)) {
    errors.push('resourceType must be "image" or "video".');
    return errors;
  }

  const allowedTypes =
    resourceType === 'image'
      ? ALLOWED_IMAGE_MIME_TYPES
      : ALLOWED_VIDEO_MIME_TYPES;

  if (!fileType || !allowedTypes.includes(String(fileType).toLowerCase())) {
    errors.push(
      `Unsupported ${resourceType} file type. Allowed: ${allowedTypes.join(', ')}`
    );
  }

  const maxSize =
    resourceType === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  const numericSize = Number(fileSize);

  if (!Number.isFinite(numericSize) || numericSize <= 0) {
    errors.push('A valid positive fileSize in bytes is required.');
  } else if (numericSize > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    errors.push(
      `${resourceType === 'image' ? 'Image' : 'Video'} exceeds maximum allowed size of ${maxMb} MB.`
    );
  }

  return errors;
};
