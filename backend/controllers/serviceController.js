import Service from '../models/Service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { isValidObjectId } from '../validators/commonValidators.js';

const normalizeDeliverables = (deliverables) => {
  if (Array.isArray(deliverables)) {
    return deliverables.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof deliverables === 'string') {
    return deliverables
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const getPublicServices = asyncHandler(async (_req, res) => {
  const services = await Service.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, 'Public services retrieved', { services }));
});

export const getAdminServices = asyncHandler(async (_req, res) => {
  const services = await Service.find()
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, 'Services retrieved', { services }));
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create({
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    icon: (req.body.icon || 'Sparkles').trim(),
    deliverables: normalizeDeliverables(req.body.deliverables),
    pricingLabel: (req.body.pricingLabel || '').trim(),
    displayOrder: Number(req.body.displayOrder) || 0,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Service created', { service }));
});

export const updateService = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid service ID.');
  }

  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new ApiError(404, 'Service not found.');
  }

  service.title = req.body.title.trim();
  service.description = req.body.description.trim();
  service.icon = (req.body.icon || service.icon || 'Sparkles').trim();
  if (req.body.deliverables !== undefined) {
    service.deliverables = normalizeDeliverables(req.body.deliverables);
  }
  service.pricingLabel = (req.body.pricingLabel || '').trim();
  service.displayOrder = Number(req.body.displayOrder) || 0;
  if (req.body.isActive !== undefined) {
    service.isActive = Boolean(req.body.isActive);
  }

  await service.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Service updated', { service }));
});

export const deleteService = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid service ID.');
  }

  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Service not found.');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Service deleted successfully'));
});
