import React, { useState, useEffect } from 'react';
import { SectionHeading } from './SectionHeading';
import { Project } from '../types';
import { ArrowUpRight, PlayCircle, Smartphone, X } from 'lucide-react';

interface ProjectsData {
  longForm: Project[];
  shortForm: Project[];
}

export const Portfolio: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectsData>({ longForm: [], shortForm: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  const openVideoModal = (project: Project) => {
    if (project.driveVideoId) {
      setSelectedProject(project);
    }
  };

  const closeVideoModal = () => {
    setSelectedProject(null);
  };

  const renderProjectCard = (project: Project, isVertical: boolean = false) => (
    <div
      key={project.id}
      className="group relative cursor-pointer overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-white/30 transition-colors duration-500"
      onMouseEnter={() => setHoveredId(project.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => openVideoModal(project)}
    >
      <div className={`${isVertical ? 'aspect-[9/16]' : 'aspect-video'} w-full overflow-hidden relative`}>
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${hoveredId === project.id
              ? 'scale-110 opacity-100 grayscale-0'
              : 'scale-100 opacity-60 grayscale'
            }`}
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {/* Center Icon */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${hoveredId === project.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
          {isVertical ? <Smartphone className="w-12 h-12 text-white/80 drop-shadow-lg" strokeWidth={1} /> : <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-lg" strokeWidth={1} />}
        </div>

        {/* Video indicator */}
        {project.driveVideoId && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
            ▶ Video
          </div>
        )}
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
        <div className={`transform transition-all duration-500 ease-out ${hoveredId === project.id
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0'
          }`}>
          <div className="flex justify-between items-end border-t border-white/20 pt-4 backdrop-blur-sm">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{project.title}</h3>
              <p className="text-xs text-neutral-300 uppercase tracking-widest font-medium">{project.category} — {project.year}</p>
            </div>
            <div className="bg-white text-black p-2 rounded-full">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section id="work" className="py-24 bg-black border-t border-neutral-900 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="text-neutral-500">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="work" className="py-24 bg-black border-t border-neutral-900 relative">
        {/* Subtle grid background for the section */}
        <div className="absolute inset-0 bg-dot-grid-fade bg-grid-sm pointer-events-none opacity-50"></div>

        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            title="Selected Works"
            subtitle="A curation of projects defining my visual style and narrative approach."
          />

          {/* Long Form Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Long Form</h3>
              <div className="h-[1px] flex-grow bg-neutral-800"></div>
              <span className="text-xs text-neutral-500 font-mono">16:9</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.longForm.map(project => renderProjectCard(project, false))}
            </div>
          </div>

          {/* Short Form Section */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Short Form</h3>
              <div className="h-[1px] flex-grow bg-neutral-800"></div>
              <span className="text-xs text-neutral-500 font-mono">9:16</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {projects.shortForm.map(project => renderProjectCard(project, true))}
            </div>
          </div>

        </div>
      </section>

      {/* Video Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video container */}
            <div className="aspect-video w-full bg-neutral-900 rounded-lg overflow-hidden">
              <iframe
                src={`https://drive.google.com/file/d/${selectedProject.driveVideoId}/preview`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>

            {/* Video info */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
              <p className="text-sm text-neutral-400">{selectedProject.category} — {selectedProject.year}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};