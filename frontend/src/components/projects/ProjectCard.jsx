import { Film, Play } from 'lucide-react';

const ProjectCard = ({ project, onPreview }) => {
  const categoryName =
    typeof project.category === 'object'
      ? project.category?.name
      : project.category;
  const description = project.shortDescription || project.description || '';
  const clientLabel = project.clientName || project.clientLabel || '';
  const duration = project.videoDuration || project.duration || '';

  return (
    <article className="surface-card surface-card-hover group flex flex-col overflow-hidden rounded-2xl">
      {/* Thumbnail / Video Preview Trigger */}
      <button
        type="button"
        onClick={() => onPreview(project)}
        aria-label={`Preview ${project.title}`}
        className="relative aspect-video w-full overflow-hidden bg-[#100c0d] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
      >
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="hero-grid-bg flex h-full w-full flex-col items-center justify-center px-4 text-center">
            <Film
              size={28}
              className="mb-2 text-accent-bright/70 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted">
              {project.aspectRatio || '16:9'} Video Preview
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 via-transparent to-black/20"
        />

        {/* Centered Play Button */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="btn-accent-glow flex h-12 w-12 items-center justify-center rounded-full border border-accent-bright/45 text-white transition-transform duration-300 group-hover:scale-110">
            <Play size={18} className="ml-0.5 fill-current" />
          </span>
        </span>

        {/* Top-Right Duration Badge */}
        {duration && (
          <span className="absolute right-3 top-3 rounded-full border border-accent/40 bg-black/75 px-2.5 py-0.5 font-mono-label text-[10px] tracking-wider text-ink backdrop-blur-sm">
            {duration}
          </span>
        )}
      </button>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-bright">
            <span>{categoryName || 'Video Edit'}</span>
            {clientLabel && (
              <>
                <span className="text-muted/50">•</span>
                <span className="text-muted">{clientLabel}</span>
              </>
            )}
          </div>

          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink transition-colors group-hover:text-accent-bright">
            {project.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-canvas/80 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wider text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onPreview(project)}
            className="shrink-0 font-mono-label text-xs uppercase tracking-[0.14em] text-accent-bright transition-colors hover:text-ink"
          >
            Preview &rarr;
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
