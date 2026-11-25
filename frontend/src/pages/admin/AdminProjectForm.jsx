import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import {
  createProject,
  fetchAdminCategories,
  fetchAdminProjectById,
  updateProject,
} from '../../services/portfolioService';
import CloudinaryUploadField from '../../components/admin/CloudinaryUploadField';

const toSlug = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const INITIAL_STATE = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  clientName: '',
  thumbnailUrl: '',
  videoUrl: '',
  videoDuration: '',
  tags: '',
  featured: false,
  status: 'draft',
  displayOrder: 0,
  seoTitle: '',
  seoDescription: '',
};

const AdminProjectForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_STATE);
  const [slugTouched, setSlugTouched] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const cats = await fetchAdminCategories();
        if (!active) return;
        setCategories(cats);

        if (isEditing) {
          const project = await fetchAdminProjectById(id);
          if (!active) return;
          setForm({
            title: project.title || '',
            slug: project.slug || '',
            shortDescription: project.shortDescription || '',
            fullDescription: project.fullDescription || '',
            category: project.category?._id || project.category || '',
            clientName: project.clientName || '',
            thumbnailUrl: project.thumbnailUrl || '',
            videoUrl: project.videoUrl || '',
            videoDuration: project.videoDuration || '',
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
            featured: Boolean(project.featured),
            status: project.status || 'draft',
            displayOrder: project.displayOrder ?? 0,
            seoTitle: project.seoTitle || '',
            seoDescription: project.seoDescription || '',
          });
          setSlugTouched(true);
        } else if (cats.length > 0) {
          setForm((prev) => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load form data.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugTouched) {
        next.slug = toSlug(value);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!form.shortDescription.trim()) {
      setError('Short description is required.');
      return;
    }
    if (!form.category) {
      setError('Please select a category. Create a category first if none exist.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder) || 0,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }

      navigate('/admin/projects');
    } catch (err) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-[#e50914]" />
      </div>
    );
  }

  const inputClasses =
    'mt-1.5 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/projects"
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Back to Projects</span>
          </Link>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h1>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
          <span>
            No categories exist yet. Create at least one category before saving a
            project.
          </span>
          <Link
            to="/admin/categories"
            className="shrink-0 rounded-lg bg-[#e50914] px-3 py-1.5 font-semibold text-white"
          >
            Create Category
          </Link>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e50914]/45 bg-[#e50914]/15 p-3.5 text-xs text-red-200">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ff303b]" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-zinc-800 bg-[#171717] p-6 sm:p-8"
      >
        {/* Core Info */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Title <span className="text-[#ff303b]">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Brand Launch Film"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                handleChange('slug', e.target.value);
              }}
              placeholder="brand-launch-film"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Category <span className="text-[#ff303b]">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Client Name (Optional)
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="Optional client or creator name"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
            Short Description <span className="text-[#ff303b]">*</span>
          </label>
          <textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            placeholder="Brief card summary shown on the portfolio grid"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
            Full Description
          </label>
          <textarea
            rows={4}
            value={form.fullDescription}
            onChange={(e) => handleChange('fullDescription', e.target.value)}
            placeholder="Detailed project breakdown, editing notes, or deliverables"
            className={inputClasses}
          />
        </div>

        {/* Media (Cloudinary Signed Upload + URL) */}
        <div className="grid grid-cols-1 gap-6 border-t border-zinc-800 pt-6">
          <CloudinaryUploadField
            label="Thumbnail Image"
            resourceType="image"
            folder="ronak-portfolio/thumbnails"
            value={form.thumbnailUrl}
            onChange={(val) => handleChange('thumbnailUrl', val)}
            helperText="Upload a JPG/PNG/WebP thumbnail directly to Cloudinary (max 10 MB) or paste an existing Cloudinary URL."
          />

          <CloudinaryUploadField
            label="Video URL"
            resourceType="video"
            folder="ronak-portfolio/videos"
            value={form.videoUrl}
            onChange={(val) => handleChange('videoUrl', val)}
            helperText="Upload MP4/WebM/MOV video directly to Cloudinary (max 200 MB) or paste an existing Cloudinary video URL."
          />
        </div>

        {/* Metadata & Visibility */}
        <div className="grid grid-cols-1 gap-5 border-t border-zinc-800 pt-6 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Video Duration
            </label>
            <input
              type="text"
              value={form.videoDuration}
              onChange={(e) => handleChange('videoDuration', e.target.value)}
              placeholder="01:45"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClasses}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              Display Order
            </label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => handleChange('displayOrder', e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-zinc-200">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 accent-[#e50914]"
              />
              <span>Featured on Home</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="Color Grading, Sound Design, Motion Graphics"
            className={inputClasses}
          />
        </div>

        {/* SEO Fields */}
        <div className="grid grid-cols-1 gap-5 border-t border-zinc-800 pt-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              SEO Title
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              placeholder="Optional SEO title"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
              SEO Description
            </label>
            <input
              type="text"
              value={form.seoDescription}
              onChange={(e) => handleChange('seoDescription', e.target.value)}
              placeholder="Optional SEO meta description"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
          <Link
            to="/admin/projects"
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#e50914] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(229,9,20,0.65)] transition-colors hover:bg-[#b20710] disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
