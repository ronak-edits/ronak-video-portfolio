import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../utils/constants';
import Button from './ui/Button';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Primary Navigation"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-purple-500/25 bg-[#0e0818]/80 px-4 py-2.5 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.35)] backdrop-blur-xl sm:px-6"
      >
        {/* Left: Ronak Branding Placeholder */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-400/40 bg-purple-600/20 font-display text-base font-extrabold tracking-wider text-accent-soft">
            R
          </span>
          <span className="font-display text-xl font-extrabold tracking-[0.12em] text-accent-soft">
            {BRAND.name}
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <ul className="hidden items-center gap-1 lg:gap-2 md:flex">
          {NAV_LINKS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-1.5 font-mono-label text-xs uppercase tracking-[0.14em] transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-500/20 text-ink shadow-[inset_0_0_0_1px_rgba(168,85,247,0.45)]'
                      : 'text-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Hire Me CTA + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Button
            to="/contact"
            size="sm"
            className="hidden sm:inline-flex font-mono-label uppercase tracking-[0.1em]"
          >
            <span>Hire Me</span>
            <ArrowRight size={14} />
          </Button>

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/60 hover:text-ink md:hidden"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-purple-500/25 bg-[#0e0818]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-2.5 font-mono-label text-xs uppercase tracking-[0.15em] transition-colors ${
                      isActive
                        ? 'bg-purple-500/20 text-ink border border-purple-400/40'
                        : 'text-muted hover:bg-surface hover:text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-border/70 pt-3 sm:hidden">
            <Button
              to="/contact"
              onClick={closeMobileMenu}
              className="w-full font-mono-label uppercase tracking-[0.12em]"
            >
              <span>Hire Me</span>
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
