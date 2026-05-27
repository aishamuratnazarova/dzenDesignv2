import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero: React.FC = () => {
  const { t, language, theme, setCursorState, setShowBrief } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });

  // Custom interactive fluid wave canvas math
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool definition
    const particleCount = Math.min(60, Math.floor((width * height) / 15000));
    const particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      angle: number;
      angleSpeed: number;
    }[] = [];

    const isDark = theme === 'dark';

    for (let i = 0; i < particleCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      particles.push({
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        size: Math.random() * 4 + 1.5,
        color: isDark
          ? `hsla(${230 + Math.random() * 40}, 80%, 75%, ${Math.random() * 0.15 + 0.05})`
          : `hsla(${140 + Math.random() * 30}, 60%, 45%, ${Math.random() * 0.12 + 0.03})`,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.005,
      });
    }

    const draw = () => {
      // Clear with soft gradient trail
      ctx.fillStyle = isDark
        ? 'rgba(10, 10, 10, 0.15)'
        : 'rgba(249, 249, 249, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle mathematical fluid waves background
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark
        ? 'rgba(255, 255, 255, 0.015)'
        : 'rgba(0, 0, 0, 0.01)';
      
      const waveCount = 3;
      const time = Date.now() * 0.0003;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 30) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.002 + time + w) * 120 * Math.cos(time * 0.5 + w * 0.3);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw interactive custom particles
      particles.forEach((p) => {
        p.angle += p.angleSpeed;
        p.x += p.speedX + Math.sin(p.angle) * 0.08;
        p.y += p.speedY + Math.cos(p.angle) * 0.08;

        // Wrap around boundaries smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse reactive displacement
        const mPos = mousePosRef.current;
        if (mPos.active) {
          const dx = mPos.x - p.x;
          const dy = mPos.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = (220 - dist) / 220;
            // Pull particles closer to create fluid clustering
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Render particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = isDark ? '#3b82f6' : '#10b981';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw neat grid network lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (dist < 130) {
            const opacity = (1 - dist / 130) * (isDark ? 0.06 : 0.04);
            ctx.strokeStyle = isDark
              ? `rgba(139, 92, 246, ${opacity})`
              : `rgba(16, 185, 129, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000, active: false };
  };

  const triggerHover = () => setCursorState({ type: 'hover' });
  const resetCursor = () => setCursorState({ type: 'default' });

  // Smooth scroll helper
  const handleScrollDown = () => {
    const nextSec = document.getElementById('projects');
    if (nextSec) {
      const offset = 80;
      const elementPosition = nextSec.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500 pt-28 pb-16"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      {/* Decorative radial gradients for contrast safety */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent via-neutral-50/50 to-neutral-50 dark:via-neutral-900/50 dark:to-[#0A0A0A] pointer-events-none" />

      {/* Interactive Background Teaser (SVG Blob) */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-neutral-200/40 to-transparent dark:from-[#1a1a1a] dark:to-transparent rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 flex flex-col items-center select-none">
        
        {/* Availability Status Badge */}
        <div
          onMouseEnter={triggerHover}
          onMouseLeave={resetCursor}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neutral-200/60 bg-neutral-100 text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-white text-xs font-semibold tracking-widest uppercase shadow-sm backdrop-blur-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF00] shadow-[0_0_10px_#00FF00]"></span>
          </span>
          <span className="hidden sm:inline">{t('hero.badge')}</span>
          <span className="inline sm:hidden">{t('hero.badge.short')}</span>
        </div>

        {/* Hero title with sleek display typography */}
        <h1 className="font-display font-medium text-4xl sm:text-6xl md:text-[84px] leading-[1.05] sm:leading-[0.9] tracking-tighter text-neutral-900 dark:text-white max-w-5xl mb-6 uppercase">
          {t('hero.title.part1')}
          <br className="hidden sm:block" />
          <span 
            className="text-transparent border-t border-b border-neutral-300/40 dark:border-white/20 px-3 inline-block my-1 font-bold" 
            style={{ WebkitTextStroke: theme === 'dark' ? '1px white' : '1px black' }}
          >
            {t('hero.title.accent')}
          </span>
          <br className="hidden sm:block" />
          <span className="opacity-90 font-bold">
            {t('hero.title.part2')}
          </span>
        </h1>

        {/* Subtitle with premium line-height & negative space */}
        <p className="font-sans text-neutral-600 dark:text-white/50 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          {t('hero.desc')}
        </p>

        {/* Call to action launch brief trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => setShowBrief(true)}
            onMouseEnter={triggerHover}
            onMouseLeave={resetCursor}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-white dark:bg-[#00FF00] dark:text-black font-sans text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-neutral-900/10 dark:shadow-[#00FF00]/10 hover:scale-105 active:scale-95 duration-200 transition-all cursor-pointer flex items-center justify-center gap-3 group"
          >
            {t('hero.cta')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Flowing scroll down indicator */}
        <div
          onClick={handleScrollDown}
          onMouseEnter={triggerHover}
          onMouseLeave={resetCursor}
          className="mt-16 flex flex-col items-center gap-2 cursor-pointer transition-opacity duration-300 opacity-75 hover:opacity-100"
        >
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 dark:text-neutral-500">
            {t('hero.scroll')}
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-neutral-300 dark:border-neutral-700 flex justify-center pt-1.5 p-0.5">
            <div className="w-1.5 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-[bounce_1.5s_infinite]" />
          </div>
        </div>

      </div>
    </section>
  );
};
