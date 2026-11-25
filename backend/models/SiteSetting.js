import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
      maxlength: [150, 'Email cannot exceed 150 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
      maxlength: [40, 'Phone number cannot exceed 40 characters'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    instagramUrl: {
      type: String,
      trim: true,
      default: '',
    },
    youtubeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    showreelVideoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    showreelThumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    seoTitle: {
      type: String,
      trim: true,
      default: 'Ronak — Video Editor Portfolio',
      maxlength: [120, 'SEO title cannot exceed 120 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      default:
        'Ronak — Professional Video Editor Portfolio. Cinematic editing, commercial storytelling, reels, color grading, and motion graphics.',
      maxlength: [320, 'Meta description cannot exceed 320 characters'],
    },
    copyrightText: {
      type: String,
      trim: true,
      default: '© 2026 RONAK. All rights reserved.',
      maxlength: [160, 'Copyright text cannot exceed 160 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);

export default SiteSetting;
