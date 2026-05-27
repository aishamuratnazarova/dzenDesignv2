import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CaseBlock, CaseStudy } from '../types';

export const CaseBuilder: React.FC = () => {
  const {
    selectedCaseId,
    setSelectedCaseId,
    cases,
    language,
    setCursorState,
    t,
  } = usePortfolio();

  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);
  const [footerColorActive, setFooterColorActive] = useState(false);

  const activeCase = cases.find((c) => c.id === selectedCaseId);

  // Disable body scroll when case study is active
  useEffect(() => {
    if (selectedCaseId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCaseId]);

  if (!activeCase) return null;

  // Next and Previous Case selection helpers
  const currentIdx = cases.findIndex((c) => c.id === activeCase.id);
  const nextCase = cases[(currentIdx + 1) % cases.length];

  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const pos = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPos(pos);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSlider(true);
    setCursorState({ type: 'slider' });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSlider) return;
    const container = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, container);
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
    setCursorState({ type: 'default' });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDraggingSlider(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    const container = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, container);
  };

  // Scroll color tracker for Module 5 transition effect
  const handleScroll = () => {
    const element = containerRef.current;
    if (!element) return;
    const totalHeight = element.scrollHeight;
    const scrolledOffset = element.scrollTop + element.clientHeight;

    // Trigger color morph if user scrolled near the very bottom (150px)
    if (totalHeight - scrolledOffset < 150) {
      setFooterColorActive(true);
    } else {
      setFooterColorActive(false);
    }
  };

  const handleNextCaseClick = () => {
    setSelectedCaseId(nextCase.id);
    setActiveEmbedId(null);
    setFooterColorActive(false);
    setSliderPos(50);
    // Scroll container to top
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      id="case-study-overlay"
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-neutral-50 dark:bg-[#0A0A0A] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col will-change-transform"
      style={{
        backgroundColor: footerColorActive ? nextCase.accentColor : undefined,
        transition: 'background-color 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Dynamic Overlay Header Controls */}
      <div className="sticky top-0 left-0 right-0 py-4 px-6 z-50 flex justify-between items-center bg-gradient-to-b from-neutral-50/90 to-transparent dark:from-[#0A0A0A]/95 backdrop-blur-md">
        <button
          onClick={() => setSelectedCaseId(null)}
          onMouseEnter={triggerHover}
          onMouseLeave={resetCursor}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900/10 text-neutral-800 hover:bg-neutral-900/20 dark:bg-white/5 dark:border dark:border-white/10 dark:text-neutral-200 dark:hover:bg-white/10 transition-all text-xs font-semibold rounded-full uppercase tracking-wider cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          {t('case.close')}
        </button>

        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          CMS Case Layout Builder Mode
        </span>
      </div>

      {/* Case Blocks Iterator */}
      {activeCase.blocks.map((block: CaseBlock, index: number) => {
        switch (block.type) {
          
          /* MODULE 1: Full-width cover hero layer */
          case 'hero':
            const role = language === 'RU' ? block.roleRu : block.roleEn;
            const duration = language === 'RU' ? block.durationRu : block.durationEn;
            const title = language === 'RU' ? activeCase.titleRu : activeCase.titleEn;

            return (
              <div key={index} className="w-full relative z-10 px-6 py-12 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <span className="text-emerald-500 font-mono text-xs font-semibold tracking-wider uppercase mb-3">
                    {activeCase.category} Project
                  </span>
                  <h1 className="font-display font-bold text-4xl sm:text-6xl text-neutral-900 dark:text-white leading-tight tracking-tight mb-6">
                    {title}
                  </h1>

                  {/* Metadata key value list */}
                  <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-sans text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        {t('case.client')}
                      </span>
                      <span className="col-span-2 font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {block.client}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-sans text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        {t('case.role')}
                      </span>
                      <span className="col-span-2 font-sans text-sm text-neutral-600 dark:text-neutral-300">
                        {role}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-sans text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        {t('case.duration')}
                      </span>
                      <span className="col-span-2 font-sans text-sm text-neutral-600 dark:text-neutral-300">
                        {duration}
                      </span>
                    </div>
                    {block.liveUrl && (
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <span className="font-sans text-xs font-medium text-neutral-400 uppercase tracking-wider">
                          Link
                        </span>
                        <span className="col-span-2">
                          <a
                            href={block.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={triggerHover}
                            onMouseLeave={resetCursor}
                            className="inline-flex items-center gap-1 font-sans text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            {t('case.liveProject')}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-md">
                  <img
                    src={block.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );

          /* MODULE 2: Before After Interactive slider */
          case 'beforeAfter':
            const slideTitle = language === 'RU' ? block.titleRu : block.titleEn;

            return (
              <div key={index} className="w-full p-6 md:p-12 max-w-7xl mx-auto border-b border-neutral-200/50 dark:border-neutral-800/50 relative z-10">
                <h3 className="font-display font-medium text-xl sm:text-2xl text-neutral-800 dark:text-neutral-200 mb-8 max-w-3xl">
                  {slideTitle}
                </h3>

                <div
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                  className="relative aspect-video w-full rounded-2xl overflow-hidden select-none cursor-ew-resize bg-neutral-900 shadow-inner border border-neutral-300 dark:border-neutral-800 flex items-center justify-center group"
                >
                  {/* Before state backdrop image */}
                  <img
                    src={block.beforeImage}
                    alt="Before Layout"
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div className="absolute left-6 bottom-6 px-4 py-2 bg-neutral-900/75 backdrop-blur-md rounded-lg z-10 select-none">
                    <span className="font-mono text-xs text-white tracking-widest uppercase font-bold">
                      {t('case.before')}
                    </span>
                  </div>

                  {/* After state slider image layer with width constraint */}
                  <div
                    className="absolute inset-y-0 left-0 h-full overflow-hidden select-none pointer-events-none"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={block.afterImage}
                      alt="After Layout"
                      className="absolute inset-y-0 left-0 h-full object-cover select-none pointer-events-none"
                      style={{ width: '100%', height: '100%', maxWidth: 'none' }}
                    />
                    <div className="absolute right-6 bottom-6 px-4 py-2 bg-emerald-500/75 backdrop-blur-md rounded-lg z-10 select-none">
                      <span className="font-mono text-xs text-white tracking-widest uppercase font-bold">
                        {t('case.after')}
                      </span>
                    </div>
                  </div>

                  {/* Drag Handle with vertical bar and cursor indicator */}
                  <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className="absolute inset-y-0 z-20 cursor-ew-resize flex items-center justify-center w-1"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="h-full w-[2px] bg-white group-hover:bg-emerald-400 absolute transition-colors shadow" />
                    <div className={`w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-2xl border-2 ${isDraggingSlider ? 'border-emerald-500 ring-4 ring-emerald-500/25 scale-110' : 'border-neutral-400'} transition-transform duration-200`}>
                      <svg className="w-5 h-5 text-neutral-800 dark:text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );

          /* MODULE 3: Grid Layout Templates */
          case 'gridTemplates':
            let gridCols = 'grid-cols-1';
            let itemAspect = 'aspect-video';

            if (block.layout === 'half') {
              gridCols = 'grid-cols-1 md:grid-cols-2';
              itemAspect = 'aspect-[4/3]';
            } else if (block.layout === 'third') {
              gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
              itemAspect = 'aspect-[3/4]';
            }

            return (
              <div key={index} className="w-full p-6 md:p-12 max-w-7xl mx-auto border-b border-neutral-200/50 dark:border-neutral-800/50 relative z-10">
                <div className={`grid ${gridCols} gap-8`}>
                  {block.items.map((item, itemIdx) => {
                    const itemTitle = language === 'RU' ? item.titleRu : item.titleEn;
                    const itemDesc = language === 'RU' ? item.descriptionRu : item.descriptionEn;

                    return (
                      <div key={itemIdx} className="flex flex-col bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm p-4">
                        <div className={`relative ${itemAspect} rounded-xl overflow-hidden mb-6 bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50`}>
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1541462608141-2c099a1a8187?auto=format&fit=crop&w=400&q=80'}
                            alt={itemTitle || 'Layout snapshot'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {itemTitle && (
                          <div className="px-2">
                            <h4 className="font-display font-medium text-lg text-neutral-900 dark:text-white mb-2">
                              {itemTitle}
                            </h4>
                            {itemDesc && (
                              <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                                {itemDesc}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );

          /* MODULE 4: Sandbox/Prototype iframe launcher embed */
          case 'embed':
            const embedTitle = language === 'RU' ? block.titleRu : block.titleEn;
            const embedActive = activeEmbedId === `${activeCase.id}-${index}`;

            return (
              <div key={index} className="w-full p-6 md:p-12 max-w-7xl mx-auto border-b border-neutral-200/50 dark:border-neutral-800/50 relative z-10">
                <h3 className="font-display font-semibold text-xl sm:text-2xl text-neutral-800 dark:text-neutral-200 mb-6 uppercase tracking-wider">
                  {embedTitle}
                </h3>

                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-md bg-neutral-900 flex items-center justify-center">
                  {embedActive ? (
                    /* Living interactive sandbox/iframe system mock representation (safe in iframes) */
                    <div className="absolute inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 animate-[pulse_2s_infinite]">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="font-sans text-white text-base font-semibold mb-2">
                        {t('case.embedActive')}
                      </p>
                      <button
                        onClick={() => setActiveEmbedId(null)}
                        onMouseEnter={triggerHover}
                        onMouseLeave={resetCursor}
                        className="px-4 py-2 bg-white/10 text-xs font-semibold uppercase tracking-wider text-white border border-white/15 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                      >
                        Reset Demo
                      </button>
                    </div>
                  ) : (
                    /* Initial previews block to avoid layout/CPU lag */
                    <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-8 text-white">
                      <img
                        src={block.previewImage}
                        alt="Prototype snapshot"
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                      />
                      <div className="absolute inset-0 bg-neutral-950/40" />

                      <div className="relative z-10" />

                      {/* Large Centered WebGL Prototype action trigger button */}
                      <div className="relative z-10 flex flex-col items-center my-auto">
                        <button
                          onClick={() => setActiveEmbedId(`${activeCase.id}-${index}`)}
                          onMouseEnter={triggerHover}
                          onMouseLeave={resetCursor}
                          className="w-16 h-16 rounded-full bg-[#00FF00] border border-[#00FF00] text-black flex items-center justify-center hover:scale-110 duration-300 transition-transform cursor-pointer shadow-[0_0_15px_#00FF00c0] animate-[pulse_3s_infinite]"
                        >
                          <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" stroke="none" />
                          </svg>
                        </button>
                        <span className="font-sans text-xs uppercase tracking-widest font-bold text-white/90 mt-4 leading-relaxed bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                          {t('case.launchEmbed')}
                        </span>
                      </div>

                      <div className="relative z-10 flex justify-between items-center text-[10px] tracking-wider uppercase font-mono text-neutral-300">
                        <span>Spline 3D & Figma Sandbox</span>
                        <span>Full HD 1920x1080</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}

      {/* MODULE 5: Infinite next project scroll container */}
      <div className="w-full relative z-10 mt-auto bg-neutral-100 dark:bg-[#0A0A0A] py-24 transition-all border-t border-neutral-200/50 dark:border-white/5 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl px-6">
          <span className="font-mono text-xs font-bold tracking-widest text-[#00FF00] uppercase mb-4 block">
            {t('case.nextProject')}
          </span>
          <h2 className="font-display font-medium text-4xl sm:text-6xl text-neutral-900 dark:text-white leading-tight mb-8">
            {language === 'RU' ? nextCase.titleRu : nextCase.titleEn}
          </h2>

          <button
            onClick={handleNextCaseClick}
            onMouseEnter={triggerHover}
            onMouseLeave={resetCursor}
            className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white dark:bg-[#00FF00] dark:text-black font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:scale-105 duration-200 transition-all cursor-pointer shadow-xl border border-neutral-200/10 dark:shadow-[#00FF00]/10"
          >
            {language === 'RU' ? 'Исследовать кейс' : 'Explore Case'}
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
