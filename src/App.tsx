/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { CaseBuilder } from './components/CaseBuilder';
import { AboutTimeline } from './components/AboutTimeline';
import { BriefWizard } from './components/BriefWizard';
import { Playground } from './components/Playground';

function PortfolioAppLayout() {
  const { language, setCursorState } = usePortfolio();

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-800 dark:text-neutral-150 transition-colors duration-500 selection:bg-[#00FF00]/20 selection:text-[#00FF00] font-sans">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Floating Header */}
      <Header />

      {/* Main Blocks Viewport */}
      <main>
        {/* HERO SECTION */}
        <Hero />

        {/* PROJECTS PORTFOLIO */}
        <Portfolio />

        {/* TIMELINE ABOUT ME */}
        <AboutTimeline />

        {/* PLAYGROUND EXPERIMENTS */}
        <Playground />
      </main>

      {/* INTERACTIVE IN-PREVIEW OVERLAYS */}
      <CaseBuilder />
      <BriefWizard />

      {/* Luxury Footer component */}
      <footer className="bg-neutral-100 dark:bg-[#0A0A0A] border-t border-neutral-200/50 dark:border-white/5 py-16 text-center select-none relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          
          {/* Logo element with 3 ticking graphics clockwise */}
          <div className="flex gap-1.5 items-center justify-center mb-6 h-10">
            {/* SVG 1 */}
            <svg
              className="w-8 h-8 text-neutral-400 dark:text-white/40 transition-opacity duration-300 animate-[spin_12s_linear_infinite]"
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
              className="w-8 h-8 text-neutral-400 dark:text-white/40 transition-opacity duration-300 animate-[spin_8s_linear_infinite]"
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
              className="w-8 h-8 text-neutral-400 dark:text-white/40 transition-opacity duration-300 animate-[spin_16s_linear_infinite]"
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

          <h3 className="font-display font-bold text-base uppercase tracking-widest text-neutral-700 dark:text-white/80 mb-2">
            {language === 'RU' ? 'ДЗЕН IT • MedTech Решения' : 'DZEN IT • MedTech Solutions'}
          </h3>
          <p className="font-mono text-[10px] text-neutral-400 dark:text-white/40 max-w-sm mx-auto mb-8 uppercase tracking-wider">
            {language === 'RU' ? 'Проектирование надежных ИИ-систем и медицинских порталов' : 'Architecting dependable clinical AI systems & medical portals'}
          </p>

          <p className="font-sans text-[11px] text-neutral-400 dark:text-white/30">
            © {new Date().getFullYear()} DZEN IT Creative Portfolio. All rights reserved. Made for Q3 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioAppLayout />
    </PortfolioProvider>
  );
}
