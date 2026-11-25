import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  Edit3,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  createService,
  deleteService,
  fetchAdminServices,
  updateService,
} from '../../services/portfolioService';
import ConfirmModal from '../../components/admin/ConfirmModal';

const ICON_OPTIONS = [
  'Clapperboard',
  'Zap',
  'Palette',
  'Sparkles',
  'Flame',
  'GraduationCap',
  'Film',
  'Video',
];

const INITIAL_FORM = {
  title: '',
  description: '',
  icon: 'Clapperboard',
  deliverables: '',
  pricingLabel: '',
  displayOrder: 0,
  isActive: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchAdminServices();
      setServices(data);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingId(service._id);
    setForm({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || 'Clapperboard',
      deliverables: Array.isArray(service.deliverables)
        ? service.deliverables.join('\n')
        : '',
      pricingLabel: service.pricingLabel || '',
      displayOrder: service.displayOrder ?? 0,
      isActive: Boolean(service.isActive),
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Service title and description are required.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder) || 0,
        deliverables: form.deliverables
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }
      setIsModalOpen(false);
      await loadServices();
    } catch (err) {
      setError(err.message || 'Failed to save service.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteService(deleteTarget._id);
      setDeleteTarget(null);
      await loadServices();
    } catch (err) {
      setError(err.message || 'Failed to delete service.');
    } finally {
      setIsDeleting(false);
    }
  };

  const inputClasses =
    'mt-1.5 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Services
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage editing service offerings shown on the public Services page.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e50914] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(229,9,20,0.65)] transition-colors hover:bg-[#b20710]"
        >
          <Plus size={16} />
          <span>Add Service</span>
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
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
            <Briefcase size={28} className="mx-auto mb-3 text-zinc-600" />
            <p className="text-sm font-medium text-white">No services yet</p>
            <p className="mt-1 text-xs text-zinc-500">
              Create your first video editing service card.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service._id}
                className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-[#111111] p-5"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#e50914]/15 px-2.5 py-1 font-mono-label text-[11px] text-[#ff303b]">
                      {service.icon}
                    </span>
                    <div className="flex items-center gap-2">
                      {service.pricingLabel && (
                        <span className="text-xs text-zinc-300">
                          {service.pricingLabel}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          service.isActive
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <span className="text-xs text-zinc-500">
                    Order: {service.displayOrder ?? 0}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      aria-label={`Edit ${service.title}`}
                      className="rounded-lg border border-zinc-800 bg-[#171717] p-2 text-zinc-300 hover:border-[#e50914]/60 hover:text-white"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(service)}
                      aria-label={`Delete ${service.title}`}
                      className="rounded-lg border border-zinc-800 bg-[#171717] p-2 text-zinc-400 hover:border-[#e50914] hover:text-[#ff303b]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-[#171717] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Service' : 'New Service'}
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
                  Service Title <span className="text-[#ff303b]">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Long-Form Video Editing"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                  Description <span className="text-[#ff303b]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this service includes"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                    Icon
                  </label>
                  <select
                    value={form.icon}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    className={inputClasses}
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                    Pricing Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.pricingLabel}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pricingLabel: e.target.value,
                      }))
                    }
                    placeholder="Optional label"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.deliverables}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      deliverables: e.target.value,
                    }))
                  }
                  placeholder={'Full assembly & narrative pacing\nSound mixing & color polish'}
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

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Service"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminServices;
