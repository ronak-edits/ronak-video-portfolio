import { useSearchParams } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import ContactForm from '../components/contact/ContactForm';
import { CONTACT_PLACEHOLDERS } from '../utils/constants';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading, Intro & Contact Placeholders */}
          <MotionReveal className="lg:col-span-5">
            <SectionHeader
              eyebrow="Contact"
              title="LET'S BUILD"
              highlightedText="SOMETHING."
              subtitle="Ready to collaborate on your next video edit? Share your project brief using the form, or reach out through the placeholder channels below."
            />

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-surface px-4 py-1.5 font-mono-label text-[11px] text-accent-soft">
              <span className="h-2 w-2 rounded-full bg-accent-bright" />
              <span>{CONTACT_PLACEHOLDERS.availability}</span>
            </div>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${CONTACT_PLACEHOLDERS.email}`}
                className="surface-card surface-card-hover flex items-center gap-4 rounded-2xl p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-600/20 text-accent-soft">
                  <Mail size={17} />
                </span>
                <div>
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted">
                    Email Placeholder
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {CONTACT_PLACEHOLDERS.email}
                  </p>
                </div>
              </a>

              <div className="surface-card flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-600/20 text-accent-soft">
                  <Phone size={17} />
                </span>
                <div>
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted">
                    Phone Placeholder
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {CONTACT_PLACEHOLDERS.phone}
                  </p>
                </div>
              </div>

              <div className="surface-card flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-600/20 text-accent-soft">
                  <MapPin size={17} />
                </span>
                <div>
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-muted">
                    Location Placeholder
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {CONTACT_PLACEHOLDERS.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Placeholders */}
            <div className="mt-8">
              <p className="mb-3 font-mono-label text-[11px] uppercase tracking-[0.2em] text-muted">
                Elsewhere (Placeholders)
              </p>
              <div className="flex flex-wrap gap-2.5">
                {CONTACT_PLACEHOLDERS.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted transition-colors hover:border-purple-400/50 hover:text-ink"
                  >
                    <span>{social.label}</span>
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          </MotionReveal>

          {/* Right Column: Contrasting Light-Colored Form Card */}
          <MotionReveal delay={0.1} className="lg:col-span-7">
            <ContactForm initialProjectType={initialService} />
          </MotionReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
