import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Film,
  Loader2,
  Play,
  Quote,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import VideoPreviewModal from '../components/ui/VideoPreviewModal';
import ProjectCarousel3D from '../components/projects/ProjectCarousel3D';
import {
  CLIENT_PLACEHOLDERS,
  CLIENT_REVIEWS_PLACEHOLDERS,
  HERO_DATA,
  SHOWREEL_DATA,
} from '../data/homeData';
import { useSiteSettings } from '../context/SiteContext';
import { fetchPublicProjects } from '../services/portfolioService';

const Home = () => {
  const shouldReduceMotion = useReducedMotion();
  const { settings } = useSiteSettings();
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    let active = true;
    const loadSelectedProjects = async () => {
      setIsLoadingProjects(true);
      try {
        let projects = await fetchPublicProjects({ featured: true });
        if (projects.length === 0) {
          const published = await fetchPublicProjects();
          projects = published.slice(0, 4);
        }
        if (active) setFeaturedProjects(projects);
      } catch {
        if (active) setFeaturedProjects([]);
      } finally {
        if (active) setIsLoadingProjects(false);
      }
    };
    loadSelectedProjects();
    return () => {
      active = false;
    };
  }, []);

  const showreelVideoUrl =
    settings?.showreelVideoUrl || SHOWREEL_DATA.videoUrl;
  const showreelThumbnailUrl =
    settings?.showreelThumbnailUrl || SHOWREEL_DATA.thumbnailUrl;

  const openShowreelModal = () => {
    setActiveVideoItem({
      title: SHOWREEL_DATA.modalTitle,
      category: 'Showreel',
      videoUrl: showreelVideoUrl,
      thumbnailUrl: showreelThumbnailUrl,
      description: SHOWREEL_DATA.modalDescription,
    });
  };

  const openProjectModal = (selected) => {
    setActiveVideoItem({
      title: selected.title,
      category:
        typeof selected.category === 'object'
          ? selected.category?.name
          : selected.category,
      videoUrl: selected.videoUrl,
      thumbnailUrl: selected.thumbnailUrl,
      description: selected.fullDescription || selected.shortDescription,
    });
  };

  return (
    <>
      {/* SECTION A: HERO */}
      <section className="hero-grid-bg relative overflow-hidden border-b border-border/50 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pt-28">
        <motion.div
          aria-hidden="true"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[110px] sm:h-[28rem] sm:w-[28rem]"
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent/35 bg-[#120b0c]/85 px-4 py-1.5 font-mono-label text-[11px] tracking-wider text-muted shadow-[0_0_22px_-6px_rgba(229,9,20,0.42)]">
            <span className="h-2 w-2 rounded-full bg-accent-bright shadow-[0_0_8px_#ff303b]" />
            <span>{HERO_DATA.statusText}</span>
          </div>

          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl font-extrabold uppercase leading-[0.88] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[7rem]"
          >
            <span className="block">{HERO_DATA.headlineLineOne}</span>
            <span className="text-gradient-accent block">
              {HERO_DATA.headlineLineTwo}
            </span>
          </motion.h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {HERO_DATA.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href="#showreel" size="lg" className="min-w-[180px]">
              <Play size={16} className="fill-current" />
              <span>{HERO_DATA.primaryCta}</span>
            </Button>

            <Button
              to="/contact"
              variant="secondary"
              size="lg"
              className="min-w-[160px]"
            >
              <span>{HERO_DATA.secondaryCta}</span>
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-14 hidden flex-col items-center gap-2 sm:flex">
            <span className="h-7 w-px bg-gradient-to-b from-accent/70 to-transparent" />
            <span className="font-mono-label text-[10px] uppercase tracking-[0.28em] text-muted/70">
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* SECTION B: OUR CLIENTS */}
      <section className="border-b border-border/50 bg-[#080808] py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <div className="mb-8 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              <p className="font-mono-label text-xs uppercase tracking-[0.22em] text-accent-bright">
                Trusted By — Placeholder Strip
              </p>
              <p className="text-xs text-muted">
                Client logos will replace these placeholders once supplied.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CLIENT_PLACEHOLDERS.map((client) => (
                <div
                  key={client.id}
                  className="surface-card flex flex-col items-center justify-center rounded-xl px-4 py-5 text-center"
                >
                  <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 text-accent-bright">
                    <Sparkles size={15} />
                  </div>
                  <span className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                    {client.name}
                  </span>
                  <span className="mt-0.5 text-[10px] text-muted">
                    {client.category}
                  </span>
                </div>
              ))}
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* SECTION C: SHOWREEL */}
      <section id="showreel" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <SectionHeader
              eyebrow={SHOWREEL_DATA.eyebrow}
              title={SHOWREEL_DATA.title}
              highlightedText={SHOWREEL_DATA.highlightedTitle}
              subtitle={SHOWREEL_DATA.subtitle}
              align="center"
            />
          </MotionReveal>

          <MotionReveal delay={0.1} className="mt-12">
            <button
              type="button"
              onClick={openShowreelModal}
              aria-label="Play Ronak showreel preview"
              className="surface-card group relative block aspect-video w-full overflow-hidden rounded-3xl border border-accent/35 text-left shadow-[0_0_55px_-16px_rgba(229,9,20,0.34)] transition-all duration-300 hover:border-accent-bright/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
            >
              {showreelThumbnailUrl ? (
                <img
                  src={showreelThumbnailUrl}
                  alt="Ronak Showreel Thumbnail"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="hero-grid-bg flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <Film
                    size={36}
                    className="mb-3 text-accent-bright/70 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="font-mono-label text-xs uppercase tracking-[0.22em] text-accent-bright">
                    Showreel Frame Placeholder (16:9)
                  </span>
                  <span className="mt-1.5 text-xs text-muted sm:text-sm">
                    {showreelVideoUrl
                      ? 'Showreel video configured — click to play'
                      : 'Configure Showreel Video URL in Admin Settings'}
                  </span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30"
              />

              <span className="absolute inset-0 flex items-center justify-center">
                <span className="btn-accent-glow flex h-16 w-16 items-center justify-center rounded-full border border-accent-bright/45 text-white transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                  <Play size={26} className="ml-1 fill-current" />
                </span>
              </span>

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 sm:px-7">
                <span className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-ink/90">
                  {showreelVideoUrl
                    ? 'Watch Showreel'
                    : 'Click to preview showreel modal'}
                </span>
                <span className="rounded-full border border-accent/40 bg-black/75 px-3 py-1 font-mono-label text-[10px] uppercase tracking-wider text-accent-bright">
                  {showreelVideoUrl ? 'HD Showreel' : SHOWREEL_DATA.durationLabel}
                </span>
              </div>
            </button>
          </MotionReveal>
        </div>
      </section>

      {/* SECTION D: SELECTED REAL PROJECTS */}
      <section className="overflow-x-clip border-t border-border/50 bg-[#0d0d0d] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <SectionHeader
              eyebrow="Selected Work"
              title="REAL"
              highlightedText="PROJECTS."
              subtitle="Featured portfolio edits managed dynamically from the studio dashboard."
              action={
                <Button to="/projects" variant="secondary">
                  <span>View All Projects</span>
                  <ArrowRight size={15} />
                </Button>
              }
            />
          </MotionReveal>

          {isLoadingProjects ? (
            <div className="mt-12 flex min-h-[220px] items-center justify-center">
              <Loader2 size={28} className="animate-spin text-accent-bright" />
            </div>
          ) : featuredProjects.length > 0 ? (
            <ProjectCarousel3D
              projects={featuredProjects}
              onPreview={openProjectModal}
            />
          ) : (
            <div className="surface-card mt-12 rounded-2xl p-10 text-center">
              <Film size={28} className="mx-auto mb-3 text-accent-bright/70" />
              <p className="font-display text-2xl font-bold uppercase text-ink">
                No Featured Projects Published Yet
              </p>
              <p className="mt-2 text-sm text-muted">
                Publish and feature projects in the Admin Panel to showcase them
                here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION E: CLIENT REVIEWS */}
      <section className="border-t border-border/50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <SectionHeader
              eyebrow="Client Love"
              title="WHAT CLIENTS"
              highlightedText="SAY."
              subtitle="Clearly labelled placeholder slots reserved for verified client testimonials."
            />
          </MotionReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CLIENT_REVIEWS_PLACEHOLDERS.map((review, index) => (
              <MotionReveal key={review.id} delay={index * 0.06}>
                <article className="surface-card surface-card-hover flex h-full flex-col justify-between rounded-2xl p-6 sm:p-7">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <Quote size={20} className="text-accent-bright" />
                      <span className="rounded-full border border-border bg-canvas/80 px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-wider text-muted">
                        Placeholder
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-ink/90 sm:text-base">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/20 font-display text-lg font-bold text-accent-bright">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {review.clientName}
                      </p>
                      <p className="font-mono-label text-[11px] text-muted">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <VideoPreviewModal
        isOpen={Boolean(activeVideoItem)}
        onClose={() => setActiveVideoItem(null)}
        item={activeVideoItem}
      />
    </>
  );
};

export default Home;
