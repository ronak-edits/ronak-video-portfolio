import Project from '../models/Project.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { parsePagination } from '../utils/pagination.js';
import { isValidObjectId } from '../validators/commonValidators.js';

const ensureUniqueSlug = async (baseText, excludeId = null) => {
  const baseSlug = slugify(baseText) || `project-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Project.findOne(query).select('_id').lean();
    if (!existing) {
      return candidate;
    }
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

export const getPublicProjects = asyncHandler(async (req, res) => {
  const filter = { status: 'published' };

  if (req.query.featured === 'true') {
    filter.featured = true;
  }

  if (req.query.category && req.query.category !== 'all') {
    if (isValidObjectId(req.query.category)) {
      filter.category = req.query.category;
    } else {
      const cat = await Category.findOne({
        slug: String(req.query.category).toLowerCase().trim(),
        isActive: true,
      })
        .select('_id')
        .lean();
      if (!cat) {
        return res.status(200).json(
          new ApiResponse(200, 'Public projects retrieved', {
            projects: [],
          })
        );
      }
      filter.category = cat._id;
    }
  }

  if (req.query.search) {
    const regex = new RegExp(String(req.query.search).trim(), 'i');
    filter.$or = [
      { title: regex },
      { shortDescription: regex },
      { clientName: regex },
      { tags: regex },
    ];
  }

  const projects = await Project.find(filter)
    .populate('category', 'name slug')
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, 'Public projects retrieved', {
      projects,
    })
  );
});

export const getPublicProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: String(req.params.slug).toLowerCase().trim(),
    status: 'published',
  })
    .populate('category', 'name slug')
    .lean();

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Project retrieved', { project }));
});

export const getAdminProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, 10, 50);
  const filter = {};

  if (req.query.status && ['published', 'draft'].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (req.query.category && isValidObjectId(req.query.category)) {
    filter.category = req.query.category;
  }

  if (req.query.featured === 'true') {
    filter.featured = true;
  } else if (req.query.featured === 'false') {
    filter.featured = false;
  }

  if (req.query.search) {
    const regex = new RegExp(String(req.query.search).trim(), 'i');
    filter.$or = [
      { title: regex },
      { shortDescription: regex },
      { clientName: regex },
      { tags: regex },
    ];
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate('category', 'name slug')
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'Projects retrieved', {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  );
});

export const getProjectById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid project ID.');
  }

  const project = await Project.findById(req.params.id)
    .populate('category', 'name slug')
    .lean();

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Project retrieved', { project }));
});

export const createProject = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category).select('_id').lean();
  if (!category) {
    throw new ApiError(400, 'Selected category does not exist.');
  }

  const slug = await ensureUniqueSlug(req.body.slug || req.body.title);

  const created = await Project.create({
    title: req.body.title.trim(),
    slug,
    shortDescription: req.body.shortDescription.trim(),
    fullDescription: (req.body.fullDescription || '').trim(),
    category: req.body.category,
    clientName: (req.body.clientName || '').trim(),
    thumbnailUrl: (req.body.thumbnailUrl || '').trim(),
    videoUrl: (req.body.videoUrl || '').trim(),
    videoDuration: (req.body.videoDuration || '').trim(),
    tags: normalizeTags(req.body.tags),
    featured: Boolean(req.body.featured),
    status: req.body.status || 'draft',
    displayOrder: Number(req.body.displayOrder) || 0,
    seoTitle: (req.body.seoTitle || '').trim(),
    seoDescription: (req.body.seoDescription || '').trim(),
  });

  const populated = await Project.findById(created._id)
    .populate('category', 'name slug')
    .lean();

  res
    .status(201)
    .json(new ApiResponse(201, 'Project created', { project: populated }));
});

export const updateProject = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid project ID.');
  }

  const existing = await Project.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Project not found.');
  }

  const category = await Category.findById(req.body.category).select('_id').lean();
  if (!category) {
    throw new ApiError(400, 'Selected category does not exist.');
  }

  const slug = await ensureUniqueSlug(
    req.body.slug || req.body.title,
    existing._id
  );

  existing.title = req.body.title.trim();
  existing.slug = slug;
  existing.shortDescription = req.body.shortDescription.trim();
  existing.fullDescription = (req.body.fullDescription || '').trim();
  existing.category = req.body.category;
  existing.clientName = (req.body.clientName || '').trim();
  existing.thumbnailUrl = (req.body.thumbnailUrl || '').trim();
  existing.videoUrl = (req.body.videoUrl || '').trim();
  existing.videoDuration = (req.body.videoDuration || '').trim();
  existing.tags = normalizeTags(req.body.tags);
  existing.featured = Boolean(req.body.featured);
  existing.status = req.body.status || existing.status;
  existing.displayOrder = Number(req.body.displayOrder) || 0;
  existing.seoTitle = (req.body.seoTitle || '').trim();
  existing.seoDescription = (req.body.seoDescription || '').trim();

  await existing.save();

  const populated = await Project.findById(existing._id)
    .populate('category', 'name slug')
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, 'Project updated', { project: populated }));
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid project ID.');
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  project.featured = !project.featured;
  await project.save();

  res.status(200).json(
    new ApiResponse(200, 'Project featured status updated', {
      project,
    })
  );
});

export const toggleStatus = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid project ID.');
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  project.status = project.status === 'published' ? 'draft' : 'published';
  await project.save();

  res.status(200).json(
    new ApiResponse(200, 'Project status updated', {
      project,
    })
  );
});

export const deleteProject = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new ApiError(400, 'Invalid project ID.');
  }

  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Project not found.');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Project deleted successfully'));
});
