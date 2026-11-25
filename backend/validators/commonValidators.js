import mongoose from 'mongoose';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

export const isValidEmail = (value) =>
  typeof value === 'string' && EMAIL_REGEX.test(value.trim());

export const isValidOptionalUrl = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return true;
  }
  try {
    const parsed = new URL(String(value).trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(String(value || ''));
