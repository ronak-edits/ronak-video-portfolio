import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Edit3,
  FolderKanban,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from '../../services/portfolioService';
import ConfirmModal from '../../components/admin/ConfirmModal';

const INITIAL_FORM = {
  name: '',
  slug: '',
  description: '',
  displayOrder: 0,
  isActive: true,
};

const toSlug = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reassignTo, setReassignTo] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchAdminCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setSlugTouched(false);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      displayOrder: cat.displayOrder ?? 0,
      isActive: Boolean(cat.isActive),
    });
    setSlugTouched(true);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder) || 0,
      };
      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (cat) => {
    setDeleteTarget(cat);
    const otherCategories = categories.filter((c) => c._id !== cat._id);
    setReassignTo(otherCategories[0]?._id || '');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError('');
    try {
      const needsReassign = deleteTarget.projectCount > 0;
      await deleteCategory(
        deleteTarget._id,
        needsReassign ? reassignTo : undefined
      );
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const availableReassignTargets = categories.filter(
    (c) => deleteTarget && c._id !== deleteTarget._id
  );

  const inputClasses =
    'mt-1.5 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Organize portfolio projects into filterable editing categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e50914] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(229,9,20,0.65)] transition-colors hover:bg-[#b20710]"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e50914]/45 bg-[#e50914]/15 p-3.5 text-xs text-red-200">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ff303b]" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-4 sm:p-6">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#e50914]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
            <FolderKanban size={28} className="mx-auto mb-3 text-zinc-600" />
            <p className="text-sm font-medium text-white">No categories yet</p>
            <p className="mt-1 text-xs text-zinc-500">
              Add categories such as Commercial, YouTube, or Reels &amp; Shorts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Slug</th>
                  <th className="pb-3 pr-4">Projects</th>
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-zinc-900/40">
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-white">{cat.name}</p>
                      {cat.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                          {cat.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 font-mono-label text-xs text-zinc-400">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-zinc-300">
                      {cat.projectCount ?? 0}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-zinc-400">
                      {cat.displayOrder ?? 0}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          cat.isActive
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          aria-label={`Edit ${cat.name}`}
                          className="rounded-lg border border-zinc-800 bg-[#111111] p-2 text-zinc-300 hover:border-[#e50914]/60 hover:text-white"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(cat)}
                          aria-label={`Delete ${cat.name}`}
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
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#171717] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                  Category Name <span className="text-[#ff303b]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name: val,
                      slug: slugTouched ? prev.slug : toSlug(val),
                    }));
                  }}
                  placeholder="e.g. Commercial"
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
                    setForm((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  placeholder="commercial"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Optional category summary"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        displayOrder: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[#e50914]"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e50914] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b20710] disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Reassignment Modal */}
      {deleteTarget && deleteTarget.projectCount > 0 ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#171717] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white">
              Category Has Assigned Projects
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              &ldquo;{deleteTarget.name}&rdquo; is currently assigned to{' '}
              <span className="font-semibold text-white">
                {deleteTarget.projectCount}
              </span>{' '}
              project(s).{' '}
              {availableReassignTargets.length > 0
                ? 'Choose another category to reassign those projects before deleting:'
                : 'Create another category first so you can reassign those projects before deleting this one.'}
            </p>

            {availableReassignTargets.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                  Reassign Projects To
                </label>
                <select
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                  className={inputClasses}
                >
                  {availableReassignTargets.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              {availableReassignTargets.length > 0 && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting || !reassignTo}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e50914] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b20710] disabled:opacity-60"
                >
                  {isDeleting && <Loader2 size={14} className="animate-spin" />}
                  <span>Reassign &amp; Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
          confirmLabel="Delete Category"
          isProcessing={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCategories;
