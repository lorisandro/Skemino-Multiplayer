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
  minSize = 280,
  maxSize = 800,
  aspectRatio = 1,
  onSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(800);
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

      // Base size calculation
      let baseSize = Math.min(
        width * 0.9,
        (height - 200) * 0.9, // Account for UI elements
        maxSize
      );

      // Apply breakpoint-specific adjustments
      switch (breakpoint) {
        case 'mobile':
          baseSize = Math.min(baseSize, width * 0.95, 320);
          break;
        case 'tablet':
          baseSize = Math.min(baseSize, width * 0.8, 600);
          break;
        case 'desktop':
          baseSize = Math.min(baseSize, Math.min(width * 0.6, height * 0.7), 800);
          break;
      }

      // Performance-based adjustments
      if (!isOptimal && fps < 45) {
        baseSize = Math.min(baseSize, 400); // Reduce size for better performance
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

  // Container styles based on breakpoint
  const getContainerClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center w-full';

    switch (breakpoint) {
      case 'mobile':
        return `${baseClasses} min-h-screen px-2 py-4`;
      case 'tablet':
        return `${baseClasses} min-h-[600px] px-4 py-6`;
      case 'desktop':
        return `${baseClasses} min-h-[600px] px-6 py-8`;
      default:
        return `${baseClasses} min-h-[600px] p-4`;
    }
  };

  // Motion variants for different breakpoints
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
      y: -40,
      transition: { duration: 0.5, ease: 'easeOut' }
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

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -bottom-16 left-0 right-0 text-center">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Size: {containerSize}px</div>
              <div>Breakpoint: {breakpoint}</div>
              <div>Performance: {fps}fps {isOptimal ? '✓' : '⚠️'}</div>
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
  minSize = 280,
  maxSize = 800,
  performanceThreshold = 45
) {
  const [size, setSize] = useState(600);
  const [isReduced, setIsReduced] = useState(false);
  const { fps } = useGamePerformance();

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let calculatedSize: number;

      // Breakpoint-based sizing
      if (vw < 768) {
        calculatedSize = Math.min(vw * 0.95, 320);
      } else if (vw < 1024) {
        calculatedSize = Math.min(vw * 0.8, 600);
      } else {
        calculatedSize = Math.min(vw * 0.7, vh * 0.8, maxSize);
      }

      // Performance adjustment
      if (fps < performanceThreshold) {
        calculatedSize = Math.min(calculatedSize, 400);
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