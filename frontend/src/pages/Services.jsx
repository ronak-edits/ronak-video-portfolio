import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clapperboard,
  Film,
  Flame,
  GraduationCap,
  Loader2,
  Palette,
  Sparkles,
  Video,
  Zap,
} from 'lucide-react';
import Button from '../components/ui/Button';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import { PROCESS_STEPS } from '../data/servicesData';
import { fetchPublicServices } from '../services/portfolioService';

const SERVICE_ICONS = {
  Clapperboard,
  Zap,
  Palette,
  Sparkles,
  Flame,
  GraduationCap,
  Film,
  Video,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchPublicServices()
      .then((data) => {
        if (active) setServices(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load services.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="What I Do"
            title="SERVICES &"
            highlightedText="CAPABILITIES."
            subtitle="Tailored post-production services structured for creators, brands, and educators."
          />
        </MotionReveal>

        {isLoading ? (
          <div className="mt-16 flex min-h-[220px] items-center justify-center">
            <Loader2 size={28} className="animate-spin text-accent-bright" />
          </div>
        ) : error ? (
          <div className="surface-card mt-12 rounded-2xl p-10 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="surface-card mt-12 rounded-2xl p-10 text-center">
            <p className="font-display text-2xl font-bold uppercase text-ink">
              No active services configured yet
            </p>
            <p className="mt-2 text-sm text-muted">
              Add active services in the Admin Panel to showcase them here.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = SERVICE_ICONS[service.icon] || Sparkles;
              return (
                <MotionReveal key={service._id} delay={index * 0.05}>
                  <article className="surface-card surface-card-hover flex h-full flex-col justify-between rounded-2xl p-6 sm:p-7">
                    <div>
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 text-accent-bright">
                          <IconComponent size={20} />
                        </div>
                        {service.pricingLabel && (
                          <span className="font-mono-label text-xs text-accent-bright">
                            {service.pricingLabel}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">
                        {service.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>

                      {service.deliverables?.length > 0 && (
                        <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
                          {service.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-xs text-ink/85"
                            >
                              <Check
                                size={14}
                                className="mt-0.5 shrink-0 text-accent-bright"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-6 pt-2">
                      <Button
                        to={`/contact?service=${encodeURIComponent(service.title)}`}
                        variant="secondary"
                        className="w-full"
                      >
                        <span>Enquire Now</span>
                        <ArrowRight size={15} />
                      </Button>
                    </div>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        )}

        {/* How It Works Process Section */}
        <section className="mt-24 border-t border-border/50 pt-20">
          <MotionReveal>
            <SectionHeader
              eyebrow="Process"
              title="HOW IT"
              highlightedText="WORKS."
              subtitle="A clear, collaborative 5-step editing workflow from initial brief to final delivery."
              align="center"
            />
          </MotionReveal>

          <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-10 right-10 top-6 hidden h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent lg:block"
            />

            {PROCESS_STEPS.map((item, index) => (
              <MotionReveal
                key={item.step}
                delay={index * 0.06}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent/45 bg-surface-elevated font-mono-label text-xs font-semibold text-accent-bright shadow-[0_0_24px_-2px_rgba(229,9,20,0.42)]">
                  {item.step}
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                  {item.description}
                </p>
              </MotionReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
