import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGamePerformance } from '../../../hooks/performance';

interface ResponsiveBoardContainerProps {
  children: React.ReactNode;
  minSize?: number;
  maxSize?: number;
  aspectRatio?: number;
  onSizeChange?: (size: number) => void;
}

/**
 * Responsive container optimized for Skèmino gaming performance
 * Automatically adjusts board size based on viewport and performance metrics
 */
export const ResponsiveBoardContainer: React.FC<ResponsiveBoardContainerProps> = ({
  children,
  minSize = 800,
  maxSize = 2000,
  aspectRatio = 1,
  onSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(1600);
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const { fps, isOptimal } = useGamePerformance();

  // Determine current breakpoint
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Calculate optimal container size
  useEffect(() => {
    const calculateSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current.parentElement;
      if (!container) return;

      const { width, height } = container.getBoundingClientRect();

      // Enhanced base size calculation for larger displays
      let baseSize = Math.min(
        width * 0.8,
        (height - 160) * 0.85, // Optimized for larger boards with UI elements
        maxSize
      );

      // Additional scaling for ultra-wide displays (>2560px)
      if (width > 2560) {
        baseSize = Math.min(baseSize, width * 0.6); // More conservative on ultra-wide
      }

      // Apply breakpoint-specific adjustments
      switch (breakpoint) {
        case 'mobile':
          baseSize = Math.min(baseSize, width * 0.95, 500);
          break;
        case 'tablet':
          baseSize = Math.min(baseSize, width * 0.85, 1000);
          break;
        case 'desktop':
          baseSize = Math.min(baseSize, Math.min(width * 0.85, height * 0.90), 2000);
          break;
      }

      // Performance-based adjustments with enhanced scaling
      if (!isOptimal && fps < 30) {
        baseSize = Math.min(baseSize, 1200); // Less aggressive size reduction for larger boards
      } else if (!isOptimal && fps < 45) {
        baseSize = Math.min(baseSize, 1600); // Moderate reduction for sub-optimal performance
      }

      // Apply aspect ratio
      if (aspectRatio !== 1) {
        baseSize = baseSize / Math.sqrt(aspectRatio);
      }

      // Enforce limits
      const finalSize = Math.max(minSize, Math.min(maxSize, baseSize));

      setContainerSize(finalSize);
      onSizeChange?.(finalSize);
    };

    calculateSize();

    const resizeObserver = new ResizeObserver(calculateSize);
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [breakpoint, fps, isOptimal, minSize, maxSize, aspectRatio, onSizeChange]);

  // Container styles based on breakpoint with enhanced scaling
  const getContainerClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center w-full';

    switch (breakpoint) {
      case 'mobile':
        return `${baseClasses} min-h-screen px-2 py-4`;
      case 'tablet':
        return `${baseClasses} min-h-[700px] px-4 py-6`;
      case 'desktop':
        return `${baseClasses} min-h-[800px] px-6 py-8`;
      default:
        return `${baseClasses} min-h-[800px] p-4`;
    }
  };

  // Motion variants for different breakpoints with enhanced scaling
  const containerVariants = {
    mobile: {
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    tablet: {
      scale: 1,
      y: -20,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    desktop: {
      scale: 1,
      y: -30,
      transition: {
        duration: containerSize > 1600 ? 0.6 : 0.5,
        ease: 'easeOut',
        // Optimize for larger boards
        type: containerSize > 1800 ? 'spring' : 'tween',
        stiffness: containerSize > 1800 ? 100 : undefined,
        damping: containerSize > 1800 ? 20 : undefined
      }
    },
  };

  return (
    <div className={getContainerClasses()}>
      <motion.div
        ref={containerRef}
        className="relative flex flex-col items-center"
        variants={containerVariants}
        initial={false}
        animate={breakpoint}
        style={{
          width: containerSize,
          height: containerSize * aspectRatio,
        }}
      >
        {children}

        {/* Enhanced debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -bottom-20 left-0 right-0 text-center">
            <div className="text-xs text-gray-500 space-y-1 bg-white/90 rounded-lg p-2 inline-block">
              <div>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}</div>
              <div>Breakpoint: {breakpoint}</div>
              <div>Performance: {fps}fps {isOptimal ? '✓ Optimal' : '⚠️ Sub-optimal'}</div>
              <div className={containerSize > 1600 ? 'text-green-600 font-medium' : 'text-blue-600'}>
                {containerSize > 1600 ? '🎯 Large Board Mode' : '📱 Standard Mode'}
              </div>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
};

/**
 * Hook for responsive board sizing
 */
export function useResponsiveBoardSize(
  minSize = 400,
  maxSize = 1800,
  performanceThreshold = 45
) {
  const [size, setSize] = useState(1400);
  const [isReduced, setIsReduced] = useState(false);
  const { fps } = useGamePerformance();

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let calculatedSize: number;

      // Breakpoint-based sizing with enhanced scaling
      if (vw < 768) {
        calculatedSize = Math.min(vw * 0.95, 500);
      } else if (vw < 1024) {
        calculatedSize = Math.min(vw * 0.85, 1000);
      } else {
        calculatedSize = Math.min(vw * 0.85, vh * 0.90, maxSize);
      }

      // Performance adjustment with larger board support
      if (fps < performanceThreshold) {
        calculatedSize = Math.min(calculatedSize, 1200);
        setIsReduced(true);
      } else {
        setIsReduced(false);
      }

      setSize(Math.max(minSize, calculatedSize));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [fps, minSize, maxSize, performanceThreshold]);

  return { size, isReduced };
}