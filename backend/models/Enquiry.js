import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [150, 'Email cannot exceed 150 characters'],
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      trim: true,
      maxlength: [120, 'Project type cannot exceed 120 characters'],
    },
    budget: {
      type: String,
      trim: true,
      default: '',
      maxlength: [80, 'Budget cannot exceed 80 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
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

enquirySchema.index({ isRead: 1, createdAt: -1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
