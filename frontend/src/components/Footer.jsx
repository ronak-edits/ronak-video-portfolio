import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ExternalLink, Mail, ShieldCheck, X } from 'lucide-react';
import { BRAND, CONTACT_PLACEHOLDERS, NAV_LINKS } from '../utils/constants';
import { useSiteSettings } from '../context/SiteContext';

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const email = settings?.contactEmail || CONTACT_PLACEHOLDERS.email;
  const location = settings?.location || CONTACT_PLACEHOLDERS.location;
  const copyrightText =
    settings?.copyrightText ||
    `© ${currentYear} ${BRAND.name}. All rights reserved.`;

  const dynamicSocials = [
    settings?.youtubeUrl && { label: 'YouTube', href: settings.youtubeUrl },
    settings?.instagramUrl && { label: 'Instagram', href: settings.instagramUrl },
    settings?.linkedinUrl && { label: 'LinkedIn', href: settings.linkedinUrl },
  ].filter(Boolean);

  const socials =
    dynamicSocials.length > 0 ? dynamicSocials : CONTACT_PLACEHOLDERS.socials;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="border-t border-accent/20 bg-[#060606] text-sm text-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/50 bg-accent/20 font-display text-base font-extrabold text-accent-bright">
                  R
                </span>
                <span className="font-display text-xl font-extrabold tracking-[0.12em] text-accent-bright">
                  {BRAND.name}
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                {BRAND.description}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-ink">
                Navigation
              </h3>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted transition-colors hover:text-accent-bright"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-ink">
                Direct Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-bright"
                  >
                    <Mail size={15} className="shrink-0 text-accent-bright" />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
                <li className="text-xs text-muted/80">{location}</li>
              </ul>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div>
                <h3 className="mb-4 font-mono-label text-xs uppercase tracking-[0.2em] text-ink">
                  Socials
                </h3>
                <ul className="space-y-2.5">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target={
                          social.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          social.href.startsWith('http')
                            ? 'noreferrer'
                            : undefined
                        }
                        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent-bright"
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

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
              <span>{copyrightText}</span>
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
              <div className="inline-flex items-center gap-2 text-accent-bright">
                <ShieldCheck size={18} />
                <span className="font-mono-label text-xs uppercase tracking-[0.18em]">
                  Privacy Notice
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
              Privacy Policy
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Contact details submitted through this portfolio&apos;s enquiry
              form are stored securely to respond to project requests and are
              never shared with third parties.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
