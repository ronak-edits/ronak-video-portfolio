import Project from '../models/Project.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Enquiry from '../models/Enquiry.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalCategories,
    totalServices,
    totalEnquiries,
    unreadEnquiries,
    recentProjects,
    recentEnquiries,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'published' }),
    Project.countDocuments({ status: 'draft' }),
    Category.countDocuments(),
    Service.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ isRead: false }),
    Project.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'Dashboard statistics retrieved', {
      stats: {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalCategories,
        totalServices,
        totalEnquiries,
        unreadEnquiries,
      },
      recentProjects,
      recentEnquiries,
    })
  );
});
