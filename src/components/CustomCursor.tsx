import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const CustomCursor: React.FC = () => {
  const { cursorState, language } = usePortfolio();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detect touch device
    const touchCheck = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouchDevice(touchCheck);
    if (touchCheck) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isVisible]);

  // Handle smooth trailing position
  const trailingRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (isTouchDevice) return;

    let animId: number;
    const updatePosition = () => {
      const targetX = coords.x;
      const targetY = coords.y;

      const currentX = trailingRef.current.x;
      const currentY = trailingRef.current.y;

      // Elastic easing calculation
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      trailingRef.current.x += dx * 0.15;
      trailingRef.current.y += dy * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(calc(${trailingRef.current.x}px - 50%), calc(${trailingRef.current.y}px - 50%), 0)`;
      }

      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, [coords, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  // Render content based on mouse trigger state
  let scaleClass = 'w-6 h-6';
  let cursorContent: React.ReactNode = null;
  const isDarkCursor = cursorState.type === 'view' || cursorState.type === 'play' || cursorState.type === 'slider' || cursorState.type === 'left-right';

  switch (cursorState.type) {
    case 'hover':
      scaleClass = 'w-14 h-14 bg-white/20 dark:bg-black/20 invert mix-blend-difference border-none scale-110';
      break;
    case 'view':
      scaleClass = 'w-20 h-20 bg-[#00FF00] border-none scale-100 flex items-center justify-center';
      cursorContent = (
        <span className="text-black font-sans text-xs font-bold tracking-wider uppercase select-none pointer-events-none">
          {language === 'RU' ? 'Смотреть' : 'View'}
        </span>
      );
      break;
    case 'play':
      scaleClass = 'w-20 h-20 bg-[#00FF00] border-none scale-100 flex items-center justify-center';
      cursorContent = (
        <span className="text-black font-sans text-xs font-bold tracking-wider uppercase select-none pointer-events-none">
          {language === 'RU' ? 'Пуск' : 'Play'}
        </span>
      );
      break;
    case 'slider':
      scaleClass = 'w-16 h-16 bg-white border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700 flex items-center justify-center shadow-lg';
      cursorContent = (
        <div className="flex gap-1 items-center justify-center text-neutral-800 dark:text-neutral-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      );
      break;
    case 'left-right':
      scaleClass = 'w-20 h-20 bg-neutral-900/90 text-white border-none flex items-center justify-center';
      cursorContent = (
        <div className="flex items-center justify-between w-full px-3 text-xs font-medium uppercase tracking-wider">
          <span>{language === 'RU' ? 'Пред' : 'Prev'}</span>
          <span>•</span>
          <span>{language === 'RU' ? 'След' : 'Next'}</span>
        </div>
      );
      break;
    case 'hidden':
      return null;
    default:
      // Default: small elegant dot inside larger circle
      scaleClass = 'w-6 h-6 border-2 border-neutral-900/40 dark:border-white/40';
      cursorContent = <div className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />;
      break;
  }

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out flex items-center justify-center will-change-transform ${scaleClass}`}
      style={{
        zIndex: 99999,
        mixBlendMode: cursorState.type === 'hover' ? 'difference' : 'normal',
      }}
    >
      {cursorContent}
    </div>
  );
};
