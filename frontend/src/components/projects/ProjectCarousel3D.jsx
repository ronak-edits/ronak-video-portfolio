import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Loader2,
  Maximize2,
  Play,
} from 'lucide-react';

const ROTATION_SPEED_DEG_PER_SEC = 14;
const MIN_RING_SLOTS = 6;

const getViewportTier = () => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 640) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
};

const TIER_CONFIG = {
  mobile: { cardWidth: 194, cardHeight: 304, baseRadius: 210 },
  tablet: { cardWidth: 224, cardHeight: 348, baseRadius: 295 },
  desktop: { cardWidth: 256, cardHeight: 396, baseRadius: 365 },
};

const CarouselVideoCard = ({
  slot,
  baseAngle,
  radius,
  cardWidth,
  cardHeight,
  rotation,
  isHovered,
  isInView,
  shouldReduceMotion,
  onHoverStart,
  onHoverEnd,
  onOpenPreview,
  registerVideoRef,
}) => {
  const { project, slotKey } = slot;
  const [videoState, setVideoState] = useState(
    project.videoUrl ? 'loading' : 'no-url'
  );

  const categoryName =
    typeof project.category === 'object'
      ? project.category?.name
      : project.category;
  const duration = project.videoDuration || project.duration || '';

  // Continuous 3D depth shading via MotionValues (zero React re-renders per frame)
  const cosAngle = useTransform(rotation, (r) => {
    const rad = ((r + baseAngle) * Math.PI) / 180;
    return Math.cos(rad);
  });

  const cardOpacity = useTransform(
    cosAngle,
    [-1, -0.25, 0.35, 1],
    [0.24, 0.45, 0.88, 1]
  );
  const scrimOpacity = useTransform(
    cosAngle,
    [-1, -0.2, 0.45, 1],
    [0.74, 0.54, 0.18, 0.04]
  );

  useEffect(() => {
    setVideoState(project.videoUrl ? 'loading' : 'no-url');
  }, [project.videoUrl]);

  const handleVideoRef = useCallback(
    (node) => {
      registerVideoRef(slotKey, node);
    },
    [registerVideoRef, slotKey]
  );

  const handleMouseEnter = () => {
    // Only allow hover activation when card is in the front hemisphere
    if (cosAngle.get() < -0.1) return;
    onHoverStart(slotKey);
  };

  return (
    <motion.div
      style={{
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        opacity: cardOpacity,
        transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
      }}
      className="absolute left-1/2 top-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => onHoverEnd(slotKey)}
    >
      <motion.article
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: isHovered ? 1.06 : 1 }
        }
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => onOpenPreview(project)}
        role="button"
        tabIndex={0}
        aria-label={`Preview ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenPreview(project);
          }
        }}
        className={`group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl bg-[#0e0a0b] text-left transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright ${
          isHovered
            ? 'border-2 border-accent-bright shadow-[0_0_40px_-6px_rgba(229,9,20,0.65)]'
            : 'border border-accent/30 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* HTML5 Video Element (Lazy-mounted when carousel approaches viewport) */}
        {project.videoUrl && isInView && (
          <video
            ref={handleVideoRef}
            src={project.videoUrl}
            muted
            playsInline
            loop
            preload="metadata"
            onLoadedData={() => setVideoState('ready')}
            onCanPlay={() => setVideoState('ready')}
            onError={() => setVideoState('error')}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              videoState === 'ready' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Loading State (Never shows a blank or broken card while loading) */}
        {project.videoUrl && videoState === 'loading' && (
          <div className="hero-grid-bg absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Loader2
              size={24}
              className="mb-2 animate-spin text-accent-bright"
            />
            <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted">
              Loading Video...
            </span>
          </div>
        )}

        {/* Fallback when no video URL is configured or video fails to load */}
        {(!project.videoUrl || videoState === 'error') && (
          <div className="hero-grid-bg absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-accent/35 bg-accent/15 text-accent-bright">
              <Film size={20} />
            </div>
            <span className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-accent-bright">
              {videoState === 'error'
                ? 'Video Unavailable'
                : 'Video Stream Slot'}
            </span>
            <span className="mt-1 text-[11px] text-muted">
              {project.title}
            </span>
          </div>
        )}

        {/* Depth Subduing Scrim for Side & Rear Cards */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="pointer-events-none absolute inset-0 bg-[#050505]"
        />

        {/* Bottom Readability Vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/35"
        />

        {/* Top Bar: Duration + Expand Cue */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          {duration ? (
            <span className="rounded-full border border-accent/40 bg-black/75 px-2.5 py-0.5 font-mono-label text-[10px] tracking-wider text-ink backdrop-blur-sm">
              {duration}
            </span>
          ) : (
            <span />
          )}

          <span
            aria-hidden="true"
            className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white/80 backdrop-blur-sm transition-all duration-200 ${
              isHovered
                ? 'border-accent-bright/60 bg-accent text-white scale-105'
                : 'opacity-75 group-hover:opacity-100'
            }`}
          >
            <Maximize2 size={12} />
          </span>
        </div>

        {/* Center Play Indicator when Idle (hides smoothly while hovered video plays) */}
        {!isHovered && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-bright/40 bg-black/60 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play size={16} className="ml-0.5 fill-current" />
            </span>
          </span>
        )}

        {/* Bottom Metadata Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-accent-bright">
            {categoryName || 'Video Edit'}
          </p>
          <h3 className="mt-1 line-clamp-2 font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink">
            {project.title}
          </h3>
          {project.clientName && (
            <p className="mt-1 truncate text-[11px] text-muted">
              {project.clientName}
            </p>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
};

const ProjectCarousel3D = ({ projects = [], onPreview }) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const videoRefs = useRef(new Map());
  const isPausedRef = useRef(false);
  const pointerStartXRef = useRef(null);
  const pointerStartRotRef = useRef(0);
  const didDragRef = useRef(false);

  const rotation = useMotionValue(0);

  const [viewportTier, setViewportTier] = useState(getViewportTier);
  const [hoveredSlotKey, setHoveredSlotKey] = useState(null);
  const [isInView, setIsInView] = useState(false);

  // Track responsive breakpoints without per-frame re-renders
  useEffect(() => {
    const handleResize = () => {
      const next = getViewportTier();
      setViewportTier((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lazy-load video metadata only once carousel enters/approaches viewport
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Build balanced 3D ring slots (minimum 6 slots for circular depth even with fewer projects)
  const slots = useMemo(() => {
    if (!projects.length) return [];
    const targetCount = Math.max(projects.length, MIN_RING_SLOTS);
    const result = [];
    for (let i = 0; i < targetCount; i += 1) {
      const project = projects[i % projects.length];
      result.push({
        project,
        slotKey: `${project._id || project.id}-${i}`,
      });
    }
    return result;
  }, [projects]);

  const registerVideoRef = useCallback((slotKey, node) => {
    if (node) {
      videoRefs.current.set(slotKey, node);
    } else {
      videoRefs.current.delete(slotKey);
    }
  }, []);

  const pauseAllVideos = useCallback((exceptKey = null) => {
    videoRefs.current.forEach((videoEl, key) => {
      if (key !== exceptKey && videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    });
  }, []);

  // Cleanup all playback on unmount
  useEffect(() => {
    const refsMap = videoRefs.current;
    return () => {
      refsMap.forEach((videoEl) => {
        if (videoEl) {
          videoEl.pause();
        }
      });
      refsMap.clear();
    };
  }, []);

  // Smooth 60fps continuous rotation using Framer Motion's animation frame loop
  useAnimationFrame((_time, delta) => {
    if (shouldReduceMotion || isPausedRef.current || projects.length <= 1) return;
    const step = (ROTATION_SPEED_DEG_PER_SEC * delta) / 1000;
    rotation.set((rotation.get() - step) % 360);
  });

  const handleHoverStart = useCallback(
    (slotKey) => {
      isPausedRef.current = true;
      setHoveredSlotKey(slotKey);
      pauseAllVideos(slotKey);

      const videoEl = videoRefs.current.get(slotKey);
      if (videoEl) {
        videoEl.muted = true;
        try {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Gracefully ignore browser autoplay blocks
            });
          }
        } catch {
          // Gracefully ignore playback exceptions
        }
      }
    },
    [pauseAllVideos]
  );

  const handleHoverEnd = useCallback((slotKey) => {
    const videoEl = videoRefs.current.get(slotKey);
    if (videoEl && !videoEl.paused) {
      videoEl.pause();
    }
    setHoveredSlotKey((prev) => (prev === slotKey ? null : prev));
    isPausedRef.current = false;
  }, []);

  const handleOpenPreview = useCallback(
    (project) => {
      if (didDragRef.current) return;
      pauseAllVideos();
      onPreview(project);
    },
    [onPreview, pauseAllVideos]
  );

  const stepAngle = slots.length > 0 ? 360 / slots.length : 60;

  const rotateBy = (deltaDeg) => {
    isPausedRef.current = true;
    animate(rotation, rotation.get() + deltaDeg, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        isPausedRef.current = false;
      },
    });
  };

  // Touch / pointer drag support for mobile & tablet swiping
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    pointerStartXRef.current = event.clientX;
    pointerStartRotRef.current = rotation.get();
    didDragRef.current = false;
    isPausedRef.current = true;
  };

  const handlePointerMove = (event) => {
    if (pointerStartXRef.current === null) return;
    const dx = event.clientX - pointerStartXRef.current;
    if (Math.abs(dx) > 8) {
      didDragRef.current = true;
    }
    rotation.set(pointerStartRotRef.current + dx * 0.35);
  };

  const handlePointerUp = () => {
    if (pointerStartXRef.current === null) return;
    pointerStartXRef.current = null;
    isPausedRef.current = false;
    setTimeout(() => {
      didDragRef.current = false;
    }, 60);
  };

  const { cardWidth, cardHeight, baseRadius } = TIER_CONFIG[viewportTier];
  const radius =
    slots.length > 0
      ? Math.max(
          baseRadius,
          Math.round((cardWidth + 32) / (2 * Math.tan(Math.PI / slots.length)))
        )
      : baseRadius;

  if (projects.length === 1) {
    const singleSlot = {
      project: projects[0],
      slotKey: `${projects[0]._id || projects[0].id}-single`,
    };
    return (
      <div
        ref={containerRef}
        className="relative mt-10 flex justify-center select-none"
      >
        <div
          style={{ width: cardWidth, height: cardHeight }}
          className="relative"
        >
          <CarouselVideoCard
            slot={singleSlot}
            baseAngle={0}
            radius={0}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            rotation={rotation}
            isHovered={hoveredSlotKey === singleSlot.slotKey}
            isInView={isInView}
            shouldReduceMotion={shouldReduceMotion}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onOpenPreview={handleOpenPreview}
            registerVideoRef={registerVideoRef}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative mt-10 select-none">
      {/* Ambient Radial Spotlight Behind 3D Ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[100px] sm:h-96 sm:w-96"
      />

      {/* 3D Perspective Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ perspective: viewportTier === 'mobile' ? '950px' : '1350px' }}
        className="relative flex h-[370px] w-full items-center justify-center overflow-hidden touch-pan-y sm:h-[430px] lg:h-[480px]"
      >
        {/* Rotating 3D Cylinder Stage */}
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            rotateY: rotation,
          }}
          className="relative h-full w-full"
        >
          {slots.map((slot, index) => (
            <CarouselVideoCard
              key={slot.slotKey}
              slot={slot}
              baseAngle={index * stepAngle}
              radius={radius}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              rotation={rotation}
              isHovered={hoveredSlotKey === slot.slotKey}
              isInView={isInView}
              shouldReduceMotion={shouldReduceMotion}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
              onOpenPreview={handleOpenPreview}
              registerVideoRef={registerVideoRef}
            />
          ))}
        </motion.div>
      </div>

      {/* Subtle Navigation Controls & Hint */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted">
          Hover a card to play • Click to expand
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => rotateBy(stepAngle)}
            aria-label="Rotate carousel left"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent-bright/60 hover:text-ink"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => rotateBy(-stepAngle)}
            aria-label="Rotate carousel right"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent-bright/60 hover:text-ink"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel3D;
