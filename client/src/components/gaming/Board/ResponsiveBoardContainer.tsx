import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGamePerformance } from '../../../hooks/useGamePerformance';

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
  maxSize = 2400, // Increased for 2K displays
  aspectRatio = 1,
  onSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(1600);
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | '2k' | 'ultrawide'>('desktop');
  const { fps, isOptimal } = useGamePerformance();

  // Determine current breakpoint with 2K support
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else if (width < 1920) {
        setBreakpoint('desktop');
      } else if (width >= 1920 && width <= 2880 && height >= 1080) {
        setBreakpoint('2k'); // 2K resolution support
      } else {
        setBreakpoint('ultrawide');
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

      // Enhanced base size calculation for larger displays with 2K optimization
      let baseSize = Math.min(
        width * 0.8,
        (height - 160) * 0.85, // Optimized for larger boards with UI elements
        maxSize
      );

      // Apply breakpoint-specific adjustments with 2K optimization
      switch (breakpoint) {
        case 'mobile':
          baseSize = Math.min(baseSize, width * 0.95, 500);
          break;
        case 'tablet':
          baseSize = Math.min(baseSize, width * 0.85, 1000);
          break;
        case 'desktop':
          baseSize = Math.min(baseSize, Math.min(width * 0.70, height * 0.80), 1800);
          break;
        case '2k':
          // Optimized for 2K displays (1920x1080, 2560x1440, etc.)
          baseSize = Math.min(
            Math.max(width * 0.55, 1200), // Minimum 1200px for 2K
            Math.min(width * 0.65, height * 0.85),
            2400
          );
          break;
        case 'ultrawide':
          // Ultra-wide displays (>2880px)
          baseSize = Math.min(baseSize, width * 0.45, height * 0.85, 2400);
          break;
      }

      // Performance-based adjustments optimized for modern hardware
      if (!isOptimal && fps < 30) {
        // More aggressive reduction only for very poor performance
        baseSize = Math.min(baseSize, breakpoint === '2k' ? 1400 : 1200);
      } else if (!isOptimal && fps < 45) {
        // Moderate reduction for sub-optimal performance, maintain larger boards on 2K
        baseSize = Math.min(baseSize, breakpoint === '2k' ? 1800 : 1600);
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
      case '2k':
        return `${baseClasses} min-h-[900px] px-8 py-10`; // Enhanced spacing for 2K
      case 'ultrawide':
        return `${baseClasses} min-h-[1000px] px-10 py-12`; // Extra spacing for ultrawide
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
    '2k': {
      scale: 1,
      y: -40,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 80,
        damping: 25
      }
    },
    ultrawide: {
      scale: 1,
      y: -50,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 60,
        damping: 30
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