import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Category, CaseStudy } from '../types';

export const Portfolio: React.FC = () => {
  const {
    cases,
    language,
    setCursorState,
    setSelectedCaseId,
    t,
  } = usePortfolio();

  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const filters: { id: Category; labelRu: string; labelEn: string }[] = [
    { id: 'All', labelRu: 'Все', labelEn: 'All' },
    { id: 'SaaS', labelRu: 'SaaS', labelEn: 'SaaS' },
    { id: 'Mobile', labelRu: 'Мобильные', labelEn: 'Mobile' },
    { id: 'Web-sites', labelRu: 'Сайты', labelEn: 'Websites' },
  ];

  const filteredCases = activeFilter === 'All'
    ? cases
    : cases.filter((c) => c.category === activeFilter);

  const handleCardMouseEnter = (id: string) => {
    setCursorState({ type: 'view' });
  };

  const handleCardMouseLeave = () => {
    setCursorState({ type: 'default' });
  };

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  return (
    <section
      id="projects"
      className="py-24 bg-neutral-100 dark:bg-neutral-900 transition-colors duration-500 min-h-screen border-t border-neutral-200/50 dark:border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content with luxury text spacing */}
        <div className="max-w-3xl mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
            {t('projects.title')}
          </h2>
          <div className="h-1 w-20 bg-emerald-500 rounded mb-4" />
          <p className="font-sans text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Categories filtration panel */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                onMouseEnter={triggerHover}
                onMouseLeave={resetCursor}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-[#00FF00] dark:text-black shadow-md'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:bg-white/5 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {language === 'RU' ? f.labelRu : f.labelEn}
              </button>
            );
          })}
        </div>

        {/* Portfolio case grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((project, idx) => {
            const title = language === 'RU' ? project.titleRu : project.titleEn;
            const subtitle = language === 'RU' ? project.subtitleRu : project.subtitleEn;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedCaseId(project.id)}
                onMouseEnter={() => handleCardMouseEnter(project.id)}
                onMouseLeave={handleCardMouseLeave}
                className="group relative bg-[#F9F9F9] dark:bg-white/5 border border-neutral-200/60 dark:border-white/15 hover:border-neutral-400 dark:hover:border-white/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden shadow-sm"
                style={{
                  '--accent-color': project.accentColor,
                } as React.CSSProperties}
              >
                {/* Fixed aspect ratio 16:9 media slot container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  {/* Default static placeholder cover image */}
                  <img
                    src={project.image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-40"
                    loading="lazy"
                  />

                  {/* Silent aesthetic micro-video representation onHover state */}
                  <div className="absolute inset-0 bg-neutral-950/20" />
                  
                  {project.video && (
                    <video
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}

                  {/* Fallback procedural aesthetic overlay (active on video loop or image hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Top floating metadata */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-[#00FF00] uppercase border border-white/20">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs font-semibold text-white/90">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Info Text Content Container */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-[#00FF00] transition-colors duration-300 mb-1.5 flex items-center gap-1">
                      {title}
                    </h3>
                    <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                      {subtitle}
                    </p>
                  </div>

                  {/* Interactive subtle outline border element mimicking the accent color on Card hover */}
                  <div
                    className="h-1 w-0 group-hover:w-full rounded-full transition-all duration-500 mt-6"
                    style={{ backgroundColor: project.accentColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
