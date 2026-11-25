import { ArrowRight, Briefcase, CheckCircle2, Sparkles, User, Wrench } from 'lucide-react';
import Button from '../components/ui/Button';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import { ABOUT_DATA } from '../data/aboutData';

const About = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top Asymmetric Split: Intro + Portrait Placeholder */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <MotionReveal className="lg:col-span-7">
            <SectionHeader
              eyebrow={ABOUT_DATA.eyebrow}
              title={ABOUT_DATA.headline}
              highlightedText={ABOUT_DATA.highlightedHeadline}
            />

            <p className="mt-6 rounded-xl border border-accent/25 bg-surface/80 px-4 py-3 font-mono-label text-xs text-accent-bright">
              {ABOUT_DATA.introPlaceholder}
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              {ABOUT_DATA.biographyParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/projects" size="lg">
                <span>Explore Projects</span>
                <ArrowRight size={16} />
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                <span>Contact Ronak</span>
              </Button>
            </div>
          </MotionReveal>

          {/* Right Column: Portrait Image Placeholder */}
          <MotionReveal delay={0.1} className="lg:col-span-5">
            <div className="surface-card overflow-hidden rounded-3xl p-4 sm:p-5">
              <div className="hero-grid-bg flex aspect-[4/5] w-full flex-col items-center justify-center rounded-2xl border border-accent/25 p-6 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-accent-bright shadow-[0_0_28px_rgba(229,9,20,0.28)]">
                  <User size={34} />
                </div>
                <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-accent-bright">
                  {ABOUT_DATA.portraitPlaceholder.label}
                </p>
                <p className="mt-2 max-w-xs text-xs text-muted">
                  Ready for Ronak&apos;s high-resolution Cloudinary portrait image.
                </p>
              </div>
              <p className="mt-3 text-center font-mono-label text-[11px] uppercase tracking-wider text-muted">
                {ABOUT_DATA.portraitPlaceholder.caption}
              </p>
            </div>
          </MotionReveal>
        </div>

        {/* Experience & Creative Approach Asymmetric Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Professional Experience Placeholders */}
          <MotionReveal className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-2.5 font-mono-label text-xs uppercase tracking-[0.2em] text-accent-bright">
              <Briefcase size={15} />
              <span>Professional Experience (Placeholders)</span>
            </div>

            <div className="space-y-4">
              {ABOUT_DATA.experiencePlaceholders.map((item, idx) => (
                <article
                  key={idx}
                  className="surface-card surface-card-hover rounded-2xl p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-label text-xs uppercase tracking-wider text-accent-bright">
                      {item.period}
                    </span>
                    <span className="rounded-full border border-border bg-canvas/80 px-2.5 py-0.5 font-mono-label text-[10px] uppercase tracking-wider text-muted">
                      Placeholder
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase text-ink">
                    {item.role}
                  </h3>
                  <p className="text-xs font-medium text-muted/90">
                    {item.context}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </MotionReveal>

          {/* Creative Approach & Editing Expertise */}
          <MotionReveal delay={0.1} className="space-y-6 lg:col-span-5">
            <div className="surface-card rounded-2xl p-6 sm:p-7">
              <div className="mb-3 flex items-center gap-2 font-mono-label text-xs uppercase tracking-[0.2em] text-accent-bright">
                <Sparkles size={15} />
                <span>Creative Approach</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                {ABOUT_DATA.creativeApproach}
              </p>
            </div>

            <div className="surface-card rounded-2xl p-6 sm:p-7">
              <h3 className="mb-4 font-display text-2xl font-bold uppercase text-ink">
                Editing Expertise
              </h3>
              <ul className="space-y-4">
                {ABOUT_DATA.expertiseAreas.map((area) => (
                  <li key={area.title} className="flex items-start gap-3">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-accent-bright"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {area.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted">
                        {area.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </div>

        {/* Software & Tools Section */}
        <MotionReveal className="mt-16">
          <div className="surface-card rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5 font-mono-label text-xs uppercase tracking-[0.2em] text-accent-bright">
                <Wrench size={15} />
                <span>Software &amp; Tool Stack (Configurable Placeholders)</span>
              </div>
              <span className="text-xs text-muted">
                Updated with Ronak&apos;s exact software stack once confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ABOUT_DATA.toolsPlaceholders.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-xl border border-border bg-canvas/75 p-4"
                >
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-accent-bright">
                    {tool.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-ink">
                    {tool.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </div>
  );
};

export default About;
