import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Film, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import VideoPreviewModal from '../components/ui/VideoPreviewModal';
import ProjectCard from '../components/projects/ProjectCard';
import {
  fetchPublicCategories,
  fetchPublicProjects,
} from '../services/portfolioService';

const Projects = () => {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('all');
  const [activeProject, setActiveProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPortfolio = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [cats, projs] = await Promise.all([
          fetchPublicCategories(),
          fetchPublicProjects(),
        ]);
        if (!active) return;
        setCategories(cats);
        setProjects(projs);
      } catch (err) {
        if (active) setError(err.message || 'Unable to load projects.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadPortfolio();
    return () => {
      active = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedSlug === 'all') {
      return projects;
    }
    return projects.filter(
      (project) => project.category?.slug === selectedSlug
    );
  }, [projects, selectedSlug]);

  const handleOpenPreview = (project) => {
    setActiveProject({
      title: project.title,
      category: project.category?.name,
      videoUrl: project.videoUrl,
      thumbnailUrl: project.thumbnailUrl,
      description: project.fullDescription || project.shortDescription,
    });
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="Portfolio Showcase"
            title="REAL"
            highlightedText="PROJECTS."
            subtitle="Explore published video editing projects filtered by category."
            action={
              <Button to="/contact" variant="secondary">
                <span>Start a Project</span>
                <ArrowRight size={15} />
              </Button>
            }
          />
        </MotionReveal>

        {/* Category Filters */}
        <MotionReveal delay={0.05} className="mt-10">
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedSlug === 'all'}
              onClick={() => setSelectedSlug('all')}
              className={`rounded-full px-4 py-2 font-mono-label text-xs uppercase tracking-[0.14em] transition-all duration-200 ${
                selectedSlug === 'all'
                  ? 'btn-accent-glow border border-accent-bright/45 font-semibold text-white'
                  : 'border border-border bg-surface/70 text-muted hover:border-accent/45 hover:text-ink'
              }`}
            >
              All
            </button>

            {categories.map((category) => {
              const isSelected = selectedSlug === category.slug;
              return (
                <button
                  key={category._id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedSlug(category.slug)}
                  className={`rounded-full px-4 py-2 font-mono-label text-xs uppercase tracking-[0.14em] transition-all duration-200 ${
                    isSelected
                      ? 'btn-accent-glow border border-accent-bright/45 font-semibold text-white'
                      : 'border border-border bg-surface/70 text-muted hover:border-accent/45 hover:text-ink'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </MotionReveal>

        {isLoading ? (
          <div className="mt-16 flex min-h-[240px] items-center justify-center">
            <Loader2 size={30} className="animate-spin text-accent-bright" />
          </div>
        ) : error ? (
          <div className="surface-card mt-10 rounded-2xl p-10 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <MotionReveal key={project._id} delay={index * 0.04}>
                <ProjectCard project={project} onPreview={handleOpenPreview} />
              </MotionReveal>
            ))}
          </div>
        ) : (
          <div className="surface-card mt-10 rounded-2xl p-12 text-center">
            <Film size={28} className="mx-auto mb-3 text-accent-bright/70" />
            <p className="font-display text-2xl font-bold uppercase text-ink">
              No published projects found
            </p>
            <p className="mt-2 text-sm text-muted">
              {selectedSlug === 'all'
                ? 'Published projects added from the Admin Panel will appear here.'
                : 'No published projects match this category yet.'}
            </p>
          </div>
        )}
      </div>

      <VideoPreviewModal
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
        item={activeProject}
      />
    </div>
  );
};

export default Projects;
