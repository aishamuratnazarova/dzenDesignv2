import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const AboutTimeline: React.FC = () => {
  const { timelineEvents, language, setCursorState, t } = usePortfolio();

  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [cvState, setCvState] = useState<'idle' | 'loading' | 'success'>('idle');
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll visibility spy setup for timeline nodes
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -25% 0px', // Activate slightly before entering center screen
      threshold: 0.2,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          if (!isNaN(index)) {
            setActiveIndices((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [timelineEvents]);

  // Download simulation sequence helper
  const handleCvDownload = () => {
    if (cvState !== 'idle') return;
    setCvState('loading');

    // Simulate luxury file building delay
    setTimeout(() => {
      setCvState('success');

      // Create synthetic PDF file download trigger
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'DZEN_IT_Lead_Resume.pdf');
      document.body.appendChild(link);
      // Clean up sequence
      setTimeout(() => {
        setCvState('idle');
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 3000);
    }, 1800);
  };

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  return (
    <section
      id="about"
      className="py-24 bg-neutral-50 dark:bg-[#0A0A0A] transition-colors duration-500 overflow-hidden border-t border-neutral-200/50 dark:border-white/5"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Headings */}
        <div className="max-w-2xl mb-16 text-center mx-auto">
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
            {t('about.title')}
          </h2>
          <div className="h-[2px] w-12 bg-emerald-500 dark:bg-[#00FF00] dark:shadow-[0_0_8px_#00FF00] rounded mx-auto mb-4" />
          <p className="font-sans text-neutral-600 dark:text-white/50 text-base sm:text-lg">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Timeline structural mapping */}
        <div className="relative border-l-2 border-neutral-200 dark:border-white/10 ml-4 md:ml-32 pl-8 md:pl-12 space-y-16">
          {timelineEvents.map((ev, idx) => {
            const isActivated = activeIndices.includes(idx);
            const role = language === 'RU' ? ev.roleRu : ev.roleEn;
            const desc = language === 'RU' ? ev.descRu : ev.descEn;

            return (
              <div
                key={ev.id}
                ref={(el) => { itemsRef.current[idx] = el; }}
                data-index={idx}
                className={`relative transition-all duration-1000 transform ${
                  isActivated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Floating Date Badge aligned nicely for wider viewport */}
                <div className="hidden md:block absolute -left-44 top-1.5 w-28 text-right font-mono text-sm font-bold text-neutral-400 dark:text-white/40">
                  {ev.year}
                </div>

                {/* Timeline node node element */}
                <span
                  className={`absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full border-4 ${
                    isActivated
                      ? 'bg-emerald-500 dark:bg-[#00FF00] border-white dark:border-[#0A0A0A] shadow-md dark:shadow-[0_0_10px_#00FF00] ring-4 ring-emerald-500/10 dark:ring-[#00FF00]/10'
                      : 'bg-neutral-200 dark:bg-white/5 border-neutral-300 dark:border-white/10'
                  } transition-all duration-700`}
                />

                {/* Event content box */}
                <div className="bg-[#F9F9F9] dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-neutral-200/50 dark:border-white/10 shadow-sm hover:border-neutral-400 dark:hover:border-white/20 transition-all duration-300">
                  <span className="md:hidden inline-block font-mono text-xs font-bold text-emerald-500 dark:text-[#00FF00] mb-2 uppercase tracking-widest">
                    {ev.year}
                  </span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-neutral-900 dark:text-white">
                      {role}
                    </h3>
                    <span className="font-mono text-xs font-bold text-neutral-500 dark:text-[#00FF00] uppercase tracking-wider">
                      {ev.company}
                    </span>
                  </div>

                  <p className="font-sans text-sm text-neutral-600 dark:text-white/60 leading-relaxed font-normal">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action interactive download button */}
        <div className="flex flex-col items-center justify-center mt-20">
          <button
            onClick={handleCvDownload}
            onMouseEnter={triggerHover}
            onMouseLeave={resetCursor}
            disabled={cvState === 'loading'}
            className={`px-8 py-4 font-sans text-xs font-bold rounded-full tracking-widest uppercase transition-all duration-300 flex items-center gap-3 cursor-pointer ${
              cvState === 'loading'
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                : cvState === 'success'
                ? 'bg-[#00FF00] text-black shadow-lg shadow-[#00FF00]/10'
                : 'bg-neutral-900 text-white dark:bg-[#00FF00] dark:text-black hover:scale-105 active:scale-95 shadow-lg shadow-neutral-900/10 dark:shadow-[#00FF00]/10'
            }`}
          >
            {cvState === 'loading' ? (
              <>
                {/* SVG Loading Spinner */}
                <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-neutral-500 dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('about.downloadCv.loading')}
              </>
            ) : cvState === 'success' ? (
              <>
                {/* Checkmark icon */}
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {t('about.downloadCv.success')}
              </>
            ) : (
              <>
                {/* Download cloud icon */}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('about.downloadCv')}
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
};
