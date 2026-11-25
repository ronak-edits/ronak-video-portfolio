import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ExternalLink,
  Film,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: Film },
  { label: 'Categories', path: '/admin/categories', icon: FolderKanban },
  { label: 'Services', path: '/admin/services', icon: Briefcase },
  { label: 'Profile', path: '/admin/profile', icon: UserCircle },
  { label: 'Enquiries', path: '/admin/enquiries', icon: Mail },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col justify-between bg-[#111111] text-white">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800/80 px-4">
          <Link
            to="/admin/dashboard"
            onClick={() => mobile && setIsMobileOpen(false)}
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e50914] font-display text-lg font-extrabold text-white shadow-[0_0_20px_-4px_rgba(229,9,20,0.7)]">
              R
            </span>
            {(!isCollapsed || mobile) && (
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold uppercase tracking-wider text-white">
                  RONAK
                </p>
                <p className="truncate font-mono-label text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                  Admin Studio
                </p>
              </div>
            )}
          </Link>

          {mobile ? (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close sidebar"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white lg:inline-flex"
            >
              {isCollapsed ? (
                <PanelLeftOpen size={17} />
              ) : (
                <PanelLeftClose size={17} />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav aria-label="Admin Navigation" className="p-3">
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => mobile && setIsMobileOpen(false)}
                    title={isCollapsed && !mobile ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#e50914] text-white shadow-[0_4px_18px_-4px_rgba(229,9,20,0.65)]'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      } ${isCollapsed && !mobile ? 'justify-center px-2' : ''}`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    {(!isCollapsed || mobile) && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="border-t border-zinc-800/80 p-3">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white ${
            isCollapsed && !mobile ? 'justify-center px-2' : ''
          }`}
        >
          <ExternalLink size={16} className="shrink-0" />
          {(!isCollapsed || mobile) && <span>View Public Site</span>}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-[#e50914]/15 hover:text-[#ff303b] ${
            isCollapsed && !mobile ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut size={17} className="shrink-0" />
          {(!isCollapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-zinc-800/80 bg-[#111111] transition-all duration-200 lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <aside
            className="h-full w-64 border-r border-zinc-800 bg-[#111111]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-[#0a0a0a]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation sidebar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-[#111111] text-zinc-300 hover:border-[#e50914]/60 hover:text-white lg:hidden"
            >
              <Menu size={18} />
            </button>
            <span className="font-mono-label text-xs uppercase tracking-[0.2em] text-zinc-400">
              Portfolio Management
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 rounded-full border border-zinc-800 bg-[#171717] px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#e50914]" />
              <span className="text-xs font-medium text-white">
                {admin?.name || 'Admin'}
              </span>
              <span className="text-[11px] text-zinc-500">{admin?.email}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#171717] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-[#e50914]/60 hover:text-white lg:hidden"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
