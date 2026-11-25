import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileEdit,
  Film,
  FolderKanban,
  Loader2,
  Mail,
  MailWarning,
  Plus,
} from 'lucide-react';
import { fetchDashboardStats } from '../../services/portfolioService';

const STAT_CARDS = [
  { key: 'totalProjects', label: 'Total Projects', icon: Film },
  { key: 'publishedProjects', label: 'Published', icon: CheckCircle2 },
  { key: 'draftProjects', label: 'Drafts', icon: FileEdit },
  { key: 'totalCategories', label: 'Categories', icon: FolderKanban },
  { key: 'totalServices', label: 'Services', icon: Briefcase },
  { key: 'totalEnquiries', label: 'Total Enquiries', icon: Mail },
  {
    key: 'unreadEnquiries',
    label: 'Unread Enquiries',
    icon: MailWarning,
    highlight: true,
  },
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetchDashboardStats();
        if (active) setData(res);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load dashboard data.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadStats();
    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#e50914]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-[#e50914]/40 bg-[#171717] p-5 text-sm text-red-200">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#ff303b]" />
        <div>
          <p className="font-semibold text-white">Unable to load dashboard</p>
          <p className="mt-1 text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentProjects = data?.recentProjects || [];
  const recentEnquiries = data?.recentEnquiries || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Live portfolio metrics and recent activity from MongoDB.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e50914] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(229,9,20,0.65)] transition-colors hover:bg-[#b20710]"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key] ?? 0;
          const isHighlighted = card.highlight && value > 0;
          return (
            <div
              key={card.key}
              className={`rounded-2xl border p-4 transition-colors ${
                isHighlighted
                  ? 'border-[#e50914]/60 bg-[#1c1012]'
                  : 'border-zinc-800 bg-[#171717]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  {card.label}
                </span>
                <Icon
                  size={16}
                  className={
                    isHighlighted ? 'text-[#ff303b]' : 'text-[#e50914]'
                  }
                />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-white">
                {value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <section className="rounded-2xl border border-zinc-800 bg-[#171717] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Recent Projects
            </h2>
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#ff303b] hover:text-white"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
              <p className="text-sm text-zinc-400">No projects added yet.</p>
              <Link
                to="/admin/projects/new"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff303b] hover:underline"
              >
                <Plus size={13} />
                <span>Add your first project</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/admin/projects/edit/${project._id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-[#111111] p-3 transition-colors hover:border-[#e50914]/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {project.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {project.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      project.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Enquiries */}
        <section className="rounded-2xl border border-zinc-800 bg-[#171717] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Recent Enquiries
            </h2>
            <Link
              to="/admin/enquiries"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#ff303b] hover:text-white"
            >
              <span>View Inbox</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
              <p className="text-sm text-zinc-400">
                No contact enquiries received yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enquiry) => (
                <Link
                  key={enquiry._id}
                  to="/admin/enquiries"
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800/80 bg-[#111111] p-3 transition-colors hover:border-[#e50914]/50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!enquiry.isRead && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#e50914]" />
                      )}
                      <p className="truncate text-sm font-medium text-white">
                        {enquiry.fullName}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {enquiry.projectType} • {enquiry.email}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-zinc-500">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
