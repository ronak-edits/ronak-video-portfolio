import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ExternalLink, Mail, ShieldCheck, X } from 'lucide-react';
import { BRAND, CONTACT_PLACEHOLDERS, NAV_LINKS } from '../utils/constants';

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="border-t border-purple-500/20 bg-[#050308] text-sm text-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand & Description */}
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-400/40 bg-purple-600/20 font-display text-base font-extrabold text-accent-soft">
                  R
                </span>
                <span className="font-display text-xl font-extrabold tracking-[0.12em] text-accent-soft">
                  {BRAND.name}
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                {BRAND.description}
              </p>
            </div>

            {/* Quick Navigation */}
            <div>
              <h3 className="mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-ink">
                Navigation
              </h3>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted transition-colors hover:text-accent-soft"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Placeholder */}
            <div>
              <h3 className="mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-ink">
                Direct Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${CONTACT_PLACEHOLDERS.email}`}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-soft"
                  >
                    <Mail size={15} className="shrink-0 text-accent-soft" />
                    <span className="break-all">{CONTACT_PLACEHOLDERS.email}</span>
                  </a>
                </li>
                <li className="text-xs text-muted/80">
                  {CONTACT_PLACEHOLDERS.location}
                </li>
              </ul>
            </div>

            {/* Social Placeholders & Back to Top */}
            <div className="flex flex-col justify-between gap-6">
              <div>
                <h3 className="mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-ink">
                  Socials (Placeholders)
                </h3>
                <ul className="space-y-2.5">
                  {CONTACT_PLACEHOLDERS.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent-soft"
                      >
                        <ExternalLink size={13} className="shrink-0" />
                        <span>{social.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
              <span>
                &copy; {currentYear} {BRAND.name}. All rights reserved.
              </span>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="underline decoration-border underline-offset-4 transition-colors hover:text-ink"
              >
                Privacy Policy
              </button>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent/60 hover:text-ink"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </footer>

      {/* Lightweight Privacy Policy Placeholder Modal */}
      {isPrivacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsPrivacyOpen(false)}
        >
          <div
            className="surface-card w-full max-w-lg rounded-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-accent-soft">
                <ShieldCheck size={18} />
                <span className="font-mono-label text-xs uppercase tracking-[0.18em]">
                  Legal Placeholder
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                aria-label="Close privacy policy dialog"
                className="rounded-full border border-border p-1.5 text-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
            <h3
              id="privacy-modal-title"
              className="font-display text-2xl font-bold uppercase text-ink"
            >
              Privacy Policy (Placeholder)
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This is a Phase 2 privacy notice placeholder for Ronak&apos;s
              portfolio website. Contact form data handling and privacy terms
              will be finalized alongside backend API integration in Phase 3.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
