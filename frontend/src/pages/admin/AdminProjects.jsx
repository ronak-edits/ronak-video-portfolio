import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Edit3,
  Film,
  Loader2,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import {
  deleteProject,
  fetchAdminCategories,
  fetchAdminProjects,
  toggleProjectFeatured,
  toggleProjectStatus,
} from '../../services/portfolioService';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Pagination from '../../components/admin/Pagination';
import VideoPreviewModal from '../../components/ui/VideoPreviewModal';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchAdminProjects({
        page,
        limit: 10,
        search: search.trim() || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      });
      setProjects(res.projects);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchAdminCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadProjects]);

  const handleToggleFeatured = async (id) => {
    try {
      const updated = await toggleProjectFeatured(id);
      setProjects((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, featured: updated.featured } : item
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update featured flag.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const updated = await toggleProjectStatus(id);
      setProjects((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: updated.status } : item
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update project status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget._id);
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Projects
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create, edit, publish, and feature portfolio video edits.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e50914] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(229,9,20,0.65)] transition-colors hover:bg-[#b20710]"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-800 bg-[#171717] p-4 sm:grid-cols-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setPage(1);
            setCategoryFilter(e.target.value);
          }}
          aria-label="Filter by category"
          className="rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white focus:border-[#e50914] focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          aria-label="Filter by status"
          className="rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white focus:border-[#e50914] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e50914]/45 bg-[#e50914]/15 p-3.5 text-xs text-red-200">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ff303b]" />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Table Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-4 sm:p-6">
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#e50914]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
            <Film size={28} className="mx-auto mb-3 text-zinc-600" />
            <p className="text-sm font-medium text-white">No projects found</p>
            <p className="mt-1 text-xs text-zinc-500">
              Try adjusting your filters or create a new portfolio project.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-4">Project</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Featured</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Order</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {projects.map((project) => (
                    <tr key={project._id} className="hover:bg-zinc-900/40">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          {project.thumbnailUrl ? (
                            <img
                              src={project.thumbnailUrl}
                              alt={project.title}
                              className="h-11 w-16 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-zinc-600">
                              <Film size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {project.title}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                              {project.clientName || project.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 text-xs text-zinc-300">
                        {project.category?.name || '—'}
                      </td>

                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project._id)}
                          aria-label={`Toggle featured for ${project.title}`}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            project.featured
                              ? 'bg-[#e50914]/20 text-[#ff303b]'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Star
                            size={12}
                            className={project.featured ? 'fill-current' : ''}
                          />
                          <span>{project.featured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(project._id)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            project.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {project.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      <td className="py-3.5 pr-4 text-xs text-zinc-400">
                        {project.displayOrder ?? 0}
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewItem({
                                title: project.title,
                                category: project.category?.name,
                                videoUrl: project.videoUrl,
                                thumbnailUrl: project.thumbnailUrl,
                                description: project.shortDescription,
                              })
                            }
                            aria-label={`Preview ${project.title}`}
                            className="rounded-lg border border-zinc-800 bg-[#111111] p-2 text-zinc-300 hover:border-[#e50914]/60 hover:text-white"
                          >
                            <Play size={14} />
                          </button>

                          <Link
                            to={`/admin/projects/edit/${project._id}`}
                            aria-label={`Edit ${project.title}`}
                            className="rounded-lg border border-zinc-800 bg-[#111111] p-2 text-zinc-300 hover:border-[#e50914]/60 hover:text-white"
                          >
                            <Edit3 size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(project)}
                            aria-label={`Delete ${project.title}`}
                            className="rounded-lg border border-zinc-800 bg-[#111111] p-2 text-zinc-400 hover:border-[#e50914] hover:text-[#ff303b]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <VideoPreviewModal
        isOpen={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        item={previewItem}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Project"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminProjects;
