import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Service title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      trim: true,
      default: 'Sparkles',
    },
    deliverables: {
      type: [String],
      default: [],
    },
    pricingLabel: {
      type: String,
      trim: true,
      default: '',
      maxlength: [60, 'Pricing label cannot exceed 60 characters'],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

serviceSchema.index({ displayOrder: 1, createdAt: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
