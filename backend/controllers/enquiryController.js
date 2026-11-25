import Enquiry from '../models/Enquiry.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';
import { isValidObjectId } from '../validators/commonValidators.js';

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create({
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim().toLowerCase(),
    projectType: req.body.projectType.trim(),
    budget: (req.body.budget || '').trim(),
    message: req.body.message.trim(),
  });

  res.status(201).json(
    new ApiResponse(201, 'Thank you! Your enquiry has been received.', {
      enquiry: {
        _id: enquiry._id,
        fullName: enquiry.fullName,
        createdAt: enquiry.createdAt,
      },
    })
  );
});

export const getAdminEnquiries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 10, 50);
  const filter = {};

  if (req.query.status === 'read') {
    filter.isRead = true;
  } else if (req.query.status === 'unread') {
    filter.isRead = false;
  }

  if (req.query.search) {
    const regex = new RegExp(String(req.query.search).trim(), 'i');
    filter.$or = [
      { fullName: regex },
      { email: regex },
      { projectType: regex },
      { message: regex },
    ];
  }

  const [enquiries, total, unreadCount] = await Promise.all([
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
    Enquiry.countDocuments({ isRead: false }),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'Enquiries retrieved', {
      enquiries,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  );
});

export const getEnquiryById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid enquiry ID.');
  }

  const enquiry = await Enquiry.findById(req.params.id).lean();
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found.');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Enquiry retrieved', { enquiry }));
});

export const toggleEnquiryRead = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid enquiry ID.');
  }

  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found.');
  }

  if (typeof req.body.isRead === 'boolean') {
    enquiry.isRead = req.body.isRead;
  } else {
    enquiry.isRead = !enquiry.isRead;
  }

  await enquiry.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Enquiry status updated', { enquiry }));
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid enquiry ID.');
  }

  const deleted = await Enquiry.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Enquiry not found.');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Enquiry deleted successfully'));
});
