import { useState, useEffect, useCallback, RefObject } from 'react';
import { useGamePerformance } from './performance';

export type Breakpoint = 'mobile' | 'mobileLg' | 'tablet' | 'tabletLg' | 'desktop' | 'desktopLg' | 'ultrawide';

export interface ResponsiveGameLayout {
  breakpoint: Breakpoint;
  boardSize: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltrawide: boolean;
  containerWidth: number;
  containerHeight: number;
  cardAreaWidth: number;
  optimalFontSize: number;
  touchOptimized: boolean;
}

/**
 * Hook for responsive gaming layout optimization
 * Optimizes board size, card areas, and touch targets for competitive gaming
 */
export const useResponsiveGameLayout = (
  containerRef: RefObject<HTMLElement>
): ResponsiveGameLayout => {
  const { fps } = useGamePerformance();
  const [layout, setLayout] = useState<ResponsiveGameLayout>({
    breakpoint: 'desktop',
    boardSize: 600,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isUltrawide: false,
    containerWidth: 1200,
    containerHeight: 800,
    cardAreaWidth: 200,
    optimalFontSize: 14,
    touchOptimized: false,
  });

  // Gaming-specific breakpoints
  const getBreakpoint = useCallback((width: number): Breakpoint => {
    if (width >= 2560) return 'ultrawide';
    if (width >= 1920) return 'desktopLg';
    if (width >= 1280) return 'desktop';
    if (width >= 1024) return 'tabletLg';
    if (width >= 768) return 'tablet';
    if (width >= 480) return 'mobileLg';
    return 'mobile';
  }, []);

  // Optimal board size calculation with performance consideration
  const calculateOptimalBoardSize = useCallback((
    containerWidth: number,
    containerHeight: number,
    breakpoint: Breakpoint,
    currentFps: number
  ): number => {
    const performanceMultiplier = currentFps >= 55 ? 1.0 : 0.8;

    switch (breakpoint) {
      case 'mobile':
        return Math.min(containerWidth * 0.9, containerHeight * 0.6, 320) * performanceMultiplier;
      case 'mobileLg':
        return Math.min(containerWidth * 0.85, containerHeight * 0.65, 400) * performanceMultiplier;
      case 'tablet':
        return Math.min(containerWidth * 0.7, containerHeight * 0.7, 500) * performanceMultiplier;
      case 'tabletLg':
        return Math.min(containerWidth * 0.6, containerHeight * 0.75, 600) * performanceMultiplier;
      case 'desktop':
        return Math.min(containerWidth * 0.5, containerHeight * 0.8, 700) * performanceMultiplier;
      case 'desktopLg':
        return Math.min(containerWidth * 0.45, containerHeight * 0.85, 800) * performanceMultiplier;
      case 'ultrawide':
        return Math.min(containerWidth * 0.4, containerHeight * 0.9, 900) * performanceMultiplier;
      default:
        return 600 * performanceMultiplier;
    }
  }, []);

  // Card area width calculation for gaming UX
  const calculateCardAreaWidth = useCallback((breakpoint: Breakpoint, boardSize: number): number => {
    switch (breakpoint) {
      case 'mobile':
      case 'mobileLg':
        return 0; // Cards below board on mobile
      case 'tablet':
        return boardSize * 0.15;
      case 'tabletLg':
        return boardSize * 0.2;
      case 'desktop':
        return boardSize * 0.25;
      case 'desktopLg':
        return boardSize * 0.3;
      case 'ultrawide':
        return boardSize * 0.35;
      default:
        return boardSize * 0.25;
    }
  }, []);

  // Optimal font size for readability
  const calculateOptimalFontSize = useCallback((breakpoint: Breakpoint): number => {
    switch (breakpoint) {
      case 'mobile':
        return 12;
      case 'mobileLg':
        return 13;
      case 'tablet':
        return 14;
      case 'tabletLg':
        return 15;
      case 'desktop':
        return 16;
      case 'desktopLg':
        return 17;
      case 'ultrawide':
        return 18;
      default:
        return 14;
    }
  }, []);

  // Touch optimization detection
  const isTouchOptimized = useCallback((breakpoint: Breakpoint): boolean => {
    return ['mobile', 'mobileLg', 'tablet'].includes(breakpoint);
  }, []);

  // Main layout update function
  const updateLayout = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;

    const breakpoint = getBreakpoint(width);
    const boardSize = calculateOptimalBoardSize(width, height, breakpoint, fps);
    const cardAreaWidth = calculateCardAreaWidth(breakpoint, boardSize);
    const optimalFontSize = calculateOptimalFontSize(breakpoint);
    const touchOptimized = isTouchOptimized(breakpoint);

    const newLayout: ResponsiveGameLayout = {
      breakpoint,
      boardSize: Math.round(boardSize),
      isMobile: ['mobile', 'mobileLg'].includes(breakpoint),
      isTablet: ['tablet', 'tabletLg'].includes(breakpoint),
      isDesktop: ['desktop', 'desktopLg'].includes(breakpoint),
      isUltrawide: breakpoint === 'ultrawide',
      containerWidth: Math.round(width),
      containerHeight: Math.round(height),
      cardAreaWidth: Math.round(cardAreaWidth),
      optimalFontSize,
      touchOptimized,
    };

    setLayout(newLayout);
  }, [
    containerRef,
    fps,
    getBreakpoint,
    calculateOptimalBoardSize,
    calculateCardAreaWidth,
    calculateOptimalFontSize,
    isTouchOptimized,
  ]);

  // Debounced resize handler for performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateLayout, 100);
    };

    // Initial update
    updateLayout();

    // Resize observer for accurate container size tracking
    const resizeObserver = new ResizeObserver(debouncedUpdate);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Fallback window resize listener
    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, [updateLayout]);

  // Update layout when FPS changes significantly
  useEffect(() => {
    updateLayout();
  }, [fps, updateLayout]);

  return layout;
};

export default useResponsiveGameLayout;