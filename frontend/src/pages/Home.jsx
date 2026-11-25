import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Film,
  Play,
  Quote,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import VideoPreviewModal from '../components/ui/VideoPreviewModal';
import ProjectCard from '../components/projects/ProjectCard';
import {
  CLIENT_PLACEHOLDERS,
  CLIENT_REVIEWS_PLACEHOLDERS,
  HERO_DATA,
  SHOWREEL_DATA,
} from '../data/homeData';
import { PROJECTS_DATA } from '../data/projectsData';

const Home = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeVideoItem, setActiveVideoItem] = useState(null);

  const featuredProjects = PROJECTS_DATA.filter((project) => project.featured);

  const openShowreelModal = () => {
    setActiveVideoItem({
      title: SHOWREEL_DATA.modalTitle,
      category: 'Showreel',
      videoUrl: SHOWREEL_DATA.videoUrl,
      thumbnailUrl: SHOWREEL_DATA.thumbnailUrl,
      description: SHOWREEL_DATA.modalDescription,
    });
  };

  return (
    <>
      {/* SECTION A: HERO */}
      <section className="hero-grid-bg relative overflow-hidden border-b border-border/50 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pt-28">
        {/* Subtle Animated Purple Background Aura */}
        <motion.div
          aria-hidden="true"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.38, 0.52, 0.38] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/25 blur-[110px] sm:h-[28rem] sm:w-[28rem]"
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          {/* Availability Pill */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-purple-400/25 bg-[#130b22]/85 px-4 py-1.5 font-mono-label text-[11px] tracking-wider text-muted shadow-[0_0_24px_-6px_rgba(139,92,246,0.45)]">
            <span className="h-2 w-2 rounded-full bg-accent-bright shadow-[0_0_8px_#a855f7]" />
            <span>{HERO_DATA.statusText}</span>
          </div>

          {/* Large Bold Condensed Headline */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl font-extrabold uppercase leading-[0.88] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[7rem]"
          >
            <span className="block">{HERO_DATA.headlineLineOne}</span>
            <span className="text-gradient-purple block">
              {HERO_DATA.headlineLineTwo}
            </span>
          </motion.h1>

          {/* Short Intro */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {HERO_DATA.subtitle}
          </p>

          {/* Hero CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button
              href="#showreel"
              size="lg"
              className="min-w-[180px]"
            >
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

          {/* Scroll Indicator */}
          <div className="mt-14 hidden flex-col items-center gap-2 sm:flex">
            <span className="h-7 w-px bg-gradient-to-b from-purple-400/60 to-transparent" />
            <span className="font-mono-label text-[10px] uppercase tracking-[0.28em] text-muted/70">
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* SECTION B: OUR CLIENTS */}
      <section className="border-b border-border/50 bg-[#08050e] py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <div className="mb-8 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              <p className="font-mono-label text-xs uppercase tracking-[0.22em] text-accent-soft">
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
                  <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/25 bg-purple-600/15 text-accent-soft">
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
              className="surface-card group relative block aspect-video w-full overflow-hidden rounded-3xl border border-purple-500/35 text-left shadow-[0_0_60px_-15px_rgba(139,92,246,0.45)] transition-all duration-300 hover:border-purple-400/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
            >
              {SHOWREEL_DATA.thumbnailUrl ? (
                <img
                  src={SHOWREEL_DATA.thumbnailUrl}
                  alt="Ronak Showreel Thumbnail"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="hero-grid-bg flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <Film
                    size={36}
                    className="mb-3 text-purple-300/60 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="font-mono-label text-xs uppercase tracking-[0.22em] text-accent-soft">
                    Showreel Frame Placeholder (16:9)
                  </span>
                  <span className="mt-1.5 text-xs text-muted sm:text-sm">
                    Prepared for future Cloudinary showreel video &amp; poster URL
                  </span>
                </div>
              )}

              {/* Subtle Vignette */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30"
              />

              {/* Centered Play Button */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="btn-purple-glow flex h-16 w-16 items-center justify-center rounded-full border border-purple-300/40 text-white transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                  <Play size={26} className="ml-1 fill-current" />
                </span>
              </span>

              {/* Bottom Bar Info */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 sm:px-7">
                <span className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-ink/90">
                  Click to preview showreel modal
                </span>
                <span className="rounded-full border border-purple-400/30 bg-black/70 px-3 py-1 font-mono-label text-[10px] uppercase tracking-wider text-accent-soft">
                  {SHOWREEL_DATA.durationLabel}
                </span>
              </div>
            </button>
          </MotionReveal>
        </div>
      </section>

      {/* SECTION D: SELECTED REAL PROJECTS */}
      <section className="border-t border-border/50 bg-[#090510] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <SectionHeader
              eyebrow="Selected Work"
              title="REAL"
              highlightedText="PROJECTS."
              subtitle="Temporary placeholder showcase structured for Ronak’s upcoming Cloudinary video portfolio."
              action={
                <Button to="/projects" variant="secondary">
                  <span>View All Projects</span>
                  <ArrowRight size={15} />
                </Button>
              }
            />
          </MotionReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <MotionReveal key={project.id} delay={index * 0.06}>
                <ProjectCard
                  project={project}
                  onPreview={(selected) => setActiveVideoItem(selected)}
                />
              </MotionReveal>
            ))}
          </div>
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
                      <Quote size={20} className="text-accent-soft" />
                      <span className="rounded-full border border-border bg-canvas/80 px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-wider text-muted">
                        Placeholder
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-ink/90 sm:text-base">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-600/25 font-display text-lg font-bold text-accent-soft">
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

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={Boolean(activeVideoItem)}
        onClose={() => setActiveVideoItem(null)}
        item={activeVideoItem}
      />
    </>
  );
};

export default Home;
