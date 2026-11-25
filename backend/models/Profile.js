import mongoose from 'mongoose';

const experienceItemSchema = new mongoose.Schema(
  {
    period: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    summary: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const skillItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    detail: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const toolItemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'Ronak',
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    professionalTitle: {
      type: String,
      trim: true,
      default: 'Video Editor & Visual Storyteller',
      maxlength: [120, 'Professional title cannot exceed 120 characters'],
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    shortBio: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Short bio cannot exceed 500 characters'],
    },
    fullBiography: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Full biography cannot exceed 5000 characters'],
    },
    experience: {
      type: [experienceItemSchema],
      default: [],
    },
    editingSkills: {
      type: [skillItemSchema],
      default: [],
    },
    softwareTools: {
      type: [toolItemSchema],
      default: [],
    },
    creativeApproach: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1500, 'Creative approach cannot exceed 1500 characters'],
    },
    socialUrls: {
      youtube: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
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

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
