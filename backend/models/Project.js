import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [320, 'Short description cannot exceed 320 characters'],
    },
    fullDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [4000, 'Full description cannot exceed 4000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Project category is required'],
    },
    clientName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Client name cannot exceed 100 characters'],
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    videoDuration: {
      type: String,
      trim: true,
      default: '',
      maxlength: [20, 'Duration cannot exceed 20 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'SEO title cannot exceed 120 characters'],
    },
    seoDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'SEO description cannot exceed 300 characters'],
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

projectSchema.index({ status: 1, featured: 1, displayOrder: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ title: 'text', shortDescription: 'text', clientName: 'text' });

const Project = mongoose.model('Project', projectSchema);

export default Project;
