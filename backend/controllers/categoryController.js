import Category from '../models/Category.js';
import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { isValidObjectId } from '../validators/commonValidators.js';

export const getPublicCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, 'Public categories retrieved', { categories }));
});

export const getAdminCategories = asyncHandler(async (_req, res) => {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ displayOrder: 1, name: 1 }).lean(),
    Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = new Map(
    counts.map((item) => [String(item._id), item.count])
  );

  const enriched = categories.map((cat) => ({
    ...cat,
    projectCount: countMap.get(String(cat._id)) || 0,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(200, 'Categories retrieved', { categories: enriched })
    );
});

export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name.trim();
  const slug = slugify(req.body.slug || name);

  if (!slug) {
    throw new ApiError(400, 'Please provide a valid category name or slug.');
  }

  const category = await Category.create({
    name,
    slug,
    description: (req.body.description || '').trim(),
    displayOrder: Number(req.body.displayOrder) || 0,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Category created', { category }));
});

export const updateCategory = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid category ID.');
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found.');
  }

  const name = req.body.name.trim();
  const slug = slugify(req.body.slug || name);

  if (!slug) {
    throw new ApiError(400, 'Please provide a valid category name or slug.');
  }

  category.name = name;
  category.slug = slug;
  category.description = (req.body.description || '').trim();
  category.displayOrder = Number(req.body.displayOrder) || 0;
  if (req.body.isActive !== undefined) {
    category.isActive = Boolean(req.body.isActive);
  }

  await category.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Category updated', { category }));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid category ID.');
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found.');
  }

  const assignedCount = await Project.countDocuments({ category: category._id });

  if (assignedCount > 0) {
    const reassignTo = req.query.reassignTo;
    if (!reassignTo) {
      throw new ApiError(
        409,
        `Cannot delete "${category.name}" because ${assignedCount} project(s) are assigned to it. Reassign those projects first.`
      );
    }

    if (!isValidObjectId(reassignTo) || String(reassignTo) === String(category._id)) {
      throw new ApiError(400, 'Please provide a valid different target category for reassignment.');
    }

    const targetCategory = await Category.findById(reassignTo).select('_id').lean();
    if (!targetCategory) {
      throw new ApiError(404, 'Target reassignment category does not exist.');
    }

    await Project.updateMany(
      { category: category._id },
      { $set: { category: targetCategory._id } }
    );
  }

  await category.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, 'Category deleted successfully'));
});
