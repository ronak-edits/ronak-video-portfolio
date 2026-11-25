import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Eye,
  Loader2,
  Mail,
  MailOpen,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  deleteEnquiry,
  fetchAdminEnquiries,
  toggleEnquiryRead,
} from '../../services/portfolioService';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Pagination from '../../components/admin/Pagination';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchAdminEnquiries({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter,
      });
      setEnquiries(res.enquiries);
      setUnreadCount(res.unreadCount ?? 0);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load enquiries.');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEnquiries();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadEnquiries]);

  const handleToggleRead = async (enquiry, explicitValue = undefined) => {
    try {
      const updated = await toggleEnquiryRead(enquiry._id, explicitValue);
      setEnquiries((prev) =>
        prev.map((item) => (item._id === enquiry._id ? updated : item))
      );
      if (selectedEnquiry?._id === enquiry._id) {
        setSelectedEnquiry(updated);
      }
      setUnreadCount((prev) =>
        updated.isRead ? Math.max(0, prev - 1) : prev + 1
      );
    } catch (err) {
      setError(err.message || 'Failed to update enquiry status.');
    }
  };

  const handleViewEnquiry = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    if (!enquiry.isRead) {
      await handleToggleRead(enquiry, true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEnquiry(deleteTarget._id);
      if (selectedEnquiry?._id === deleteTarget._id) {
        setSelectedEnquiry(null);
      }
      setDeleteTarget(null);
      await loadEnquiries();
    } catch (err) {
      setError(err.message || 'Failed to delete enquiry.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Enquiries
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Contact briefs submitted from the public website.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#e50914]/40 bg-[#e50914]/15 px-3.5 py-1.5 text-xs font-semibold text-white">
          <Mail size={14} className="text-[#ff303b]" />
          <span>{unreadCount} Unread</span>
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-800 bg-[#171717] p-4 sm:grid-cols-2">
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
            placeholder="Search by name, email, or project type..."
            className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#e50914] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          aria-label="Filter enquiries by read status"
          className="rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white focus:border-[#e50914] focus:outline-none"
        >
          <option value="all">All Enquiries</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e50914]/45 bg-[#e50914]/15 p-3.5 text-xs text-red-200">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#ff303b]" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-4 sm:p-6">
        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#e50914]" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
            <Mail size={28} className="mx-auto mb-3 text-zinc-600" />
            <p className="text-sm font-medium text-white">No enquiries found</p>
            <p className="mt-1 text-xs text-zinc-500">
              Incoming messages from the Contact page will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-4">Sender</th>
                    <th className="pb-3 pr-4">Project Type</th>
                    <th className="pb-3 pr-4">Budget</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {enquiries.map((item) => (
                    <tr key={item._id} className="hover:bg-zinc-900/40">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#e50914]" />
                          )}
                          <div>
                            <p className="font-medium text-white">
                              {item.fullName}
                            </p>
                            <p className="text-xs text-zinc-500">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-zinc-300">
                        {item.projectType}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-zinc-400">
                        {item.budget || '—'}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-zinc-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleToggleRead(item)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.isRead
                              ? 'bg-zinc-800 text-zinc-300'
                              : 'bg-[#e50914]/20 text-[#ff303b]'
                          }`}
                        >
                          {item.isRead ? 'Read' : 'Unread'}
                        </button>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewEnquiry(item)}
                            aria-label={`View enquiry from ${item.fullName}`}
                            className="rounded-lg border border-zinc-800 bg-[#111111] p-2 text-zinc-300 hover:border-[#e50914]/60 hover:text-white"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleRead(item)}
                            aria-label={`Toggle read status for ${item.fullName}`}
                            className="rounded-lg border border-zinc-800 bg-[#111111] p-2 text-zinc-300 hover:border-[#e50914]/60 hover:text-white"
                          >
                            {item.isRead ? (
                              <Mail size={14} />
                            ) : (
                              <MailOpen size={14} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            aria-label={`Delete enquiry from ${item.fullName}`}
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#171717] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[#ff303b]">
                  {selectedEnquiry.projectType}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  {selectedEnquiry.fullName}
                </h2>
                <p className="text-xs text-zinc-400">{selectedEnquiry.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close enquiry detail"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 rounded-xl border border-zinc-800 bg-[#111111] p-4 text-sm">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Budget: {selectedEnquiry.budget || 'Not specified'}</span>
                <span>
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-zinc-200">
                {selectedEnquiry.message}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedEnquiry)}
                className="rounded-lg border border-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-[#e50914]"
              >
                Mark as {selectedEnquiry.isRead ? 'Unread' : 'Read'}
              </button>
              <a
                href={`mailto:${selectedEnquiry.email}`}
                className="rounded-lg bg-[#e50914] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b20710]"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Enquiry"
        message={`Delete the enquiry from "${deleteTarget?.fullName}"?`}
        confirmLabel="Delete Enquiry"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminEnquiries;
