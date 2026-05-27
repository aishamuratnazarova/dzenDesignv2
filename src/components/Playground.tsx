import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PlaygroundItem } from '../types';

export const Playground: React.FC = () => {
  const { playgroundItems, language, setCursorState, t } = usePortfolio();

  const [activeItem, setActiveItem] = useState<PlaygroundItem | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem]);

  const handleClose = () => {
    setActiveItem(null);
    setImageLoaded(false);
    setCursorState({ type: 'default' });
  };

  const currentIdx = activeItem ? playgroundItems.findIndex((item) => item.id === activeItem.id) : -1;

  const handleNext = () => {
    if (currentIdx === -1) return;
    const nextItem = playgroundItems[(currentIdx + 1) % playgroundItems.length];
    setImageLoaded(false);
    setActiveItem(nextItem);
  };

  const handlePrev = () => {
    if (currentIdx === -1) return;
    const prevItem = playgroundItems[(currentIdx - 1 + playgroundItems.length) % playgroundItems.length];
    setImageLoaded(false);
    setActiveItem(prevItem);
  };

  // Mobile Swipe Gesture Listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setTouchStart(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || !e.changedTouches[0]) return;
    const touchEnd = e.changedTouches[0].clientX;
    const deltaX = touchEnd - touchStart;

    // Swipe horizontally trigger threshold (50px)
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrev(); // Swipe user fingers right displays previous
      } else {
        handleNext(); // Swipe user fingers left displays next
      }
    }
    setTouchStart(null);
  };

  const handleItemClick = (item: PlaygroundItem) => {
    setActiveItem(item);
  };

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  return (
    <section
      id="playground"
      className="py-24 bg-white dark:bg-[#0A0A0A] transition-colors duration-500 border-t border-neutral-200/50 dark:border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Headings */}
        <div className="max-w-3xl mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
            {t('playground.title')}
          </h2>
          <div className="h-[2px] w-12 bg-emerald-500 dark:bg-[#00FF00] dark:shadow-[0_0_8px_#00FF00] rounded mb-4" />
          <p className="font-sans text-neutral-600 dark:text-white/50 text-base sm:text-lg leading-relaxed">
            {t('playground.subtitle')}
          </p>
        </div>

        {/* Grid of uniform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playgroundItems.map((item) => {
            const title = language === 'RU' ? item.titleRu : item.titleEn;
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setCursorState({ type: 'play' })}
                onMouseLeave={resetCursor}
                className="relative group rounded-2xl overflow-hidden cursor-zoom-in border border-neutral-200/50 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 aspect-video flex flex-col justify-end"
              >
                {/* Background glow color */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0`} />

                {/* Media Image item */}
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover select-none z-10 relative"
                  loading="lazy"
                />

                {/* Floating Meta tags and Title */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end z-20">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00FF00] mb-1.5">
                    {item.category}
                  </span>
                  <h4 className="font-display text-sm font-semibold tracking-wide">
                    {title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* LIGHTBOX LAYOUT VIEWER OVERLAY */}
        {activeItem && (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 bg-[#0A0A0Ac0] backdrop-blur-lg flex flex-col justify-center items-center select-none overflow-hidden"
          >
            {/* Visual Header Controls */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50 text-white">
              <span className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest leading-relaxed">
                Playground / {activeItem.category}
              </span>

              {/* Bottom Close icon */}
              <button
                onClick={handleClose}
                onMouseEnter={triggerHover}
                onMouseLeave={resetCursor}
                className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close Lightbox"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Previous slide index controller */}
            <button
              onClick={handlePrev}
              onMouseEnter={() => setCursorState({ type: 'slider' })}
              onMouseLeave={resetCursor}
              className="absolute left-4 sm:left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer z-40"
              aria-label="Previous sketch"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next sketch controller */}
            <button
              onClick={handleNext}
              onMouseEnter={() => setCursorState({ type: 'slider' })}
              onMouseLeave={resetCursor}
              className="absolute right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer z-40"
              aria-label="Next sketch"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image display container */}
            <div className="relative w-full max-w-4xl max-h-[75vh] px-12 flex items-center justify-center">
              {!imageLoaded && (
                /* Infinite loaders loading placeholder */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 gap-3 z-30">
                  <svg className="animate-spin h-8 w-8 text-[#00FF00]" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
                    Loading sketch...
                  </span>
                </div>
              )}

              <img
                src={activeItem.image}
                alt={language === 'RU' ? activeItem.titleRu : activeItem.titleEn}
                onLoad={() => setImageLoaded(true)}
                className={`max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-500 transform ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />
            </div>

            {/* Bottom titles with current media slide count indicator */}
            <div className="absolute bottom-6 left-6 right-6 text-center text-white flex flex-col items-center gap-1 z-30">
              <span className="font-display text-base font-semibold leading-relaxed">
                {language === 'RU' ? activeItem.titleRu : activeItem.titleEn}
              </span>
              <span className="font-mono text-xs text-neutral-500">
                {currentIdx + 1} / {playgroundItems.length}
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
