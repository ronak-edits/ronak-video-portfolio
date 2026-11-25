import { useEffect } from 'react';
import { X, Film, ExternalLink } from 'lucide-react';

const VideoPreviewModal = ({ isOpen, onClose, item }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="surface-card relative w-full max-w-4xl overflow-hidden rounded-2xl border border-accent/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-5 py-4 sm:px-6">
          <div>
            {item.category && (
              <p className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-accent-bright">
                {item.category}
              </p>
            )}
            <h3
              id="video-modal-title"
              className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl"
            >
              {item.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video preview"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-canvas/80 text-muted transition-colors hover:border-accent hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video w-full bg-canvas">
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              poster={item.thumbnailUrl || undefined}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="hero-grid-bg flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent/45 bg-surface-elevated text-accent-bright shadow-[0_0_28px_rgba(229,9,20,0.28)]">
                <Film size={28} />
              </div>
              <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-accent-bright">
                Cloudinary Video Slot — Placeholder
              </p>
              <p className="mt-2 max-w-md text-sm text-muted">
                This preview modal is wired and ready for Cloudinary video playback.
                Attach a valid <code className="text-ink">videoUrl</code> in Phase 3 to stream the video here.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        {(item.description || item.externalUrl) && (
          <div className="flex flex-col gap-3 border-t border-border/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {item.description && (
              <p className="text-sm text-muted">{item.description}</p>
            )}
            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-accent-bright hover:text-ink"
              >
                <span>External Link</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreviewModal;
