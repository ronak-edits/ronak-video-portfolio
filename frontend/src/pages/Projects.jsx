import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import MotionReveal from '../components/ui/MotionReveal';
import SectionHeader from '../components/ui/SectionHeader';
import VideoPreviewModal from '../components/ui/VideoPreviewModal';
import ProjectCard from '../components/projects/ProjectCard';
import { PROJECT_CATEGORIES, PROJECTS_DATA } from '../data/projectsData';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') {
      return PROJECTS_DATA;
    }
    return PROJECTS_DATA.filter(
      (project) => project.category === selectedCategory
    );
  }, [selectedCategory]);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="Portfolio Showcase"
            title="REAL"
            highlightedText="PROJECTS."
            subtitle="Explore categorized video editing placeholders. Dynamic MongoDB records and Cloudinary video streams will connect here in Phase 3."
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
            {PROJECT_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 font-mono-label text-xs uppercase tracking-[0.14em] transition-all duration-200 ${
                    isSelected
                      ? 'btn-purple-glow border border-purple-300/40 text-white'
                      : 'border border-border bg-surface/70 text-muted hover:border-purple-400/45 hover:text-ink'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </MotionReveal>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <MotionReveal key={project.id} delay={index * 0.04}>
                <ProjectCard
                  project={project}
                  onPreview={(item) => setActiveProject(item)}
                />
              </MotionReveal>
            ))}
          </div>
        ) : (
          <div className="surface-card mt-10 rounded-2xl p-12 text-center">
            <p className="font-display text-2xl font-bold uppercase text-ink">
              No projects in this category yet
            </p>
            <p className="mt-2 text-sm text-muted">
              Select another category filter to view available placeholders.
            </p>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
        item={activeProject}
      />
    </div>
  );
};

export default Projects;
