import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    cursorState,
    setCursorState,
    setShowBrief,
    activeSection,
    setActiveSection,
    t,
  } = usePortfolio();

  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const prevScrollY = useRef(0);

  // Scroll visibility and blur logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Blur trigger
      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/Show trigger
      if (currentScrollY > prevScrollY.current && currentScrollY > 100) {
        setVisible(false); // scrolling down, hide
      } else {
        setVisible(true); // scrolling up, show
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor wrappers to trigger mouse states
  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  // Scroll to section manually
  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'about', label: t('nav.about') },
    { id: 'playground', label: t('nav.playground') },
  ];

  return (
    <header
      id="smart-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-neutral-50/75 dark:bg-black/30 backdrop-blur-md shadow-sm border-b border-neutral-200/50 dark:border-white/5 py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo block with 3 spinning SVGs */}
        <div
          onClick={() => scrollTo('home')}
          onMouseEnter={triggerHover}
          onMouseLeave={resetCursor}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex items-center gap-1.5 h-10">
            {/* SVG 1 */}
            <svg
              className="w-8 h-8 text-neutral-900 dark:text-white transition-opacity duration-300 animate-[spin_12s_linear_infinite]"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(11.5, 0)">
                <path d="M39.8909 38.6442V38.6442C36.2949 50.4604 21.0438 54.2476 11.6814 45.456V45.456" stroke="currentColor" strokeLinecap="round"/>
                <path d="M39.8909 38.6442L39.7175 39.2139C36.1109 51.0649 21.0341 54.8263 11.3852 46.2823V46.2823" stroke="currentColor" strokeLinecap="round"/>
                <path d="M6.83203 31.028L6.93531 30.6782C10.4682 18.7122 25.6456 14.8233 35.4385 23.3747V23.3747" stroke="currentColor" strokeLinecap="round"/>
                <path d="M6.83203 31.028L6.98916 30.4958C10.4528 18.7644 25.4496 15.1171 34.846 23.7209V23.7209" stroke="currentColor" strokeLinecap="round"/>
                <line x1="1" y1="-1" x2="33.1661" y2="-1" transform="matrix(-0.730863 0.682524 -0.750769 -0.660565 35.2109 22.5801)" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </g>
            </svg>

            {/* SVG 2 */}
            <svg
              className="w-8 h-8 text-neutral-900 dark:text-white transition-opacity duration-300 animate-[spin_8s_linear_infinite]"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(5.5, 0)">
                <path d="M38.3517 49.2975V49.2975C27.4537 55.1101 13.9916 47.0039 13.588 34.1671V34.1671" stroke="currentColor" strokeLinecap="round"/>
                <path d="M38.3517 49.2975L37.8263 49.5778C26.8961 55.4074 13.5756 47.4062 12.7943 34.5419V34.5419" stroke="currentColor" strokeLinecap="round"/>
                <path d="M20.3616 20.5331L20.682 20.3588C31.6413 14.3957 45.1233 22.3778 46.0011 35.3492V35.3492" stroke="currentColor" strokeLinecap="round"/>
                <path d="M20.3616 20.5331L20.849 20.2679C31.5936 14.4217 44.777 22.447 45.3374 35.1751V35.1751" stroke="currentColor" strokeLinecap="round"/>
                <line x1="1" y1="-1" x2="33.1661" y2="-1" transform="matrix(-0.999415 -0.034181 -0.0637841 -0.997964 46.4023 34.626)" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </g>
            </svg>

            {/* SVG 3 */}
            <svg
              className="w-8 h-8 text-neutral-900 dark:text-white transition-opacity duration-300 animate-[spin_16s_linear_infinite]"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(3.5, 19)">
                <path d="M23.3743 30.9458V30.9458C12.8914 24.4141 13.1805 8.70245 24.0957 1.93457V1.93457" stroke="currentColor" strokeLinecap="round"/>
                <path d="M23.3743 30.9458L22.8689 30.6309C12.3551 24.0799 12.6241 8.54337 23.3743 1.43457V1.43457" stroke="currentColor" strokeLinecap="round"/>
                <path d="M39.2901 0.985345L39.6013 1.17566C50.2451 7.68521 50.0734 23.3519 39.2787 30.5979V30.5979" stroke="currentColor" strokeLinecap="round"/>
                <path d="M39.2901 0.985345L39.7635 1.27487C50.1987 7.65684 49.8403 23.0866 39.0977 29.936V29.936" stroke="currentColor" strokeLinecap="round"/>
                <line x1="1" y1="-1" x2="33.1661" y2="-1" transform="matrix(-0.470106 -0.88261 0.83237 -0.55422 40.1074 30.583)" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </g>
            </svg>
          </div>
          <span className="font-display font-semibold text-lg uppercase tracking-wider text-neutral-900 dark:text-neutral-50 group-hover:translate-x-1 duration-300 transition-transform">
            {language === 'RU' ? 'ДЗЕН IT' : 'DZEN IT'}
          </span>
        </div>

        {/* Localized navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={triggerHover}
                onMouseLeave={resetCursor}
                className={`font-sans text-sm font-medium relative py-1 transition-colors duration-200 outline-none ${
                  isActive
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4">
          {/* Capsule Language Selector */}
          <div className="flex bg-neutral-100 dark:bg-white/5 rounded-full p-0.5 border border-neutral-200/60 dark:border-white/10 select-none">
            <button
              onClick={() => setLanguage('RU')}
              onMouseEnter={triggerHover}
              onMouseLeave={resetCursor}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                language === 'RU'
                  ? 'bg-neutral-900 text-white dark:bg-white/10 dark:text-white'
                  : 'opacity-40 text-neutral-800 dark:text-white hover:opacity-100'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLanguage('EN')}
              onMouseEnter={triggerHover}
              onMouseLeave={resetCursor}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                language === 'EN'
                  ? 'bg-neutral-900 text-white dark:bg-white/10 dark:text-white'
                  : 'opacity-40 text-neutral-800 dark:text-white hover:opacity-100'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Selector with rotating icon transition */}
          <button
            onClick={toggleTheme}
            onMouseEnter={triggerHover}
            onMouseLeave={resetCursor}
            className="w-10 h-10 rounded-full border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer overflow-hidden relative"
            aria-label="Toggle theme"
          >
            <div className={`transition-transform duration-500 ${theme === 'dark' ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
              <svg className="w-5 h-5 absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <div className={`transition-transform duration-500 absolute inset-0 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-180 scale-0'}`}>
              <svg className="w-5 h-5 absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </button>

          {/* Discuss CTA action button */}
          <button
            onClick={() => setShowBrief(true)}
            onMouseEnter={triggerHover}
            onMouseLeave={resetCursor}
            className="hidden sm:inline-flex px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-sans text-sm font-bold rounded-full hover:scale-105 active:scale-95 duration-200 transition-all text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {t('nav.brief')}
          </button>
        </div>
      </div>
    </header>
  );
};
