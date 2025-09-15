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
  minSize = 400,
  maxSize = 1000, // Reduced significantly for 2K compatibility
  aspectRatio = 1,
  onSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(800);
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

      // Card aspect ratio adjustment - taller board needs more height consideration
      const cardBoardAspectRatio = 0.67; // Playing card ratio
      const boardHeightMultiplier = 1 / cardBoardAspectRatio; // ~1.49 for taller board

      // Enhanced base size calculation accounting for card-shaped cells - SIGNIFICANTLY REDUCED for 2K
      let baseSize = Math.min(
        width * 0.45, // Drastically reduced to prevent overflow
        (height - 350) * 0.6 / boardHeightMultiplier, // Much more height reservation for UI elements
        maxSize
      );

      // Apply breakpoint-specific adjustments with card aspect ratio considerations
      switch (breakpoint) {
        case 'mobile':
          baseSize = Math.min(baseSize, width * 0.90, (height - 100) * 0.6 / boardHeightMultiplier);
          break;
        case 'tablet':
          baseSize = Math.min(baseSize, width * 0.80, (height - 150) * 0.65 / boardHeightMultiplier);
          break;
        case 'desktop':
          baseSize = Math.min(baseSize, width * 0.65, (height - 180) * 0.70 / boardHeightMultiplier);
          break;
        case '2k':
          // DRASTICALLY OPTIMIZED for 2K displays - PREVENT OVERFLOW
          baseSize = Math.min(
            width * 0.35, // Major reduction for 2K width
            (height - 450) * 0.45 / boardHeightMultiplier, // Massive height reduction
            900 // Much smaller max size to ensure no overflow
          );
          break;
        case 'ultrawide':
          // Ultra-wide displays with card considerations
          baseSize = Math.min(baseSize, width * 0.40, (height - 240) * 0.80 / boardHeightMultiplier, 2000);
          break;
      }

      // Performance-based adjustments optimized for modern hardware - REDUCED for 2K
      if (!isOptimal && fps < 30) {
        // More aggressive reduction for poor performance
        baseSize = Math.min(baseSize, breakpoint === '2k' ? 700 : 1000);
      } else if (!isOptimal && fps < 45) {
        // Moderate reduction for sub-optimal performance - smaller for 2K
        baseSize = Math.min(baseSize, breakpoint === '2k' ? 800 : 1200);
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

  // Container styles based on breakpoint with better centering for card-shaped board
  const getContainerClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center w-full overflow-hidden';

    switch (breakpoint) {
      case 'mobile':
        return `${baseClasses} min-h-screen max-h-screen px-2 py-2`;
      case 'tablet':
        return `${baseClasses} min-h-[100vh] max-h-[100vh] px-3 py-4`;
      case 'desktop':
        return `${baseClasses} min-h-[100vh] max-h-[100vh] px-4 py-6`;
      case '2k':
        return `${baseClasses} min-h-[100vh] max-h-[100vh] px-4 py-4`; // Reduced padding for 2K to prevent overflow
      case 'ultrawide':
        return `${baseClasses} min-h-[100vh] max-h-[100vh] px-8 py-10`; // Centered for ultrawide
      default:
        return `${baseClasses} min-h-[100vh] max-h-[100vh] p-4`;
    }
  };

  // Motion variants optimized for card-shaped board centering
  const containerVariants = {
    mobile: {
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    tablet: {
      scale: 1,
      y: 0, // Center vertically
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    desktop: {
      scale: 1,
      y: 0, // Perfect centering
      transition: {
        duration: containerSize > 1600 ? 0.6 : 0.5,
        ease: 'easeOut',
        type: containerSize > 1800 ? 'spring' : 'tween',
        stiffness: containerSize > 1800 ? 100 : undefined,
        damping: containerSize > 1800 ? 20 : undefined
      }
    },
    '2k': {
      scale: 1,
      y: 0, // Centered for 2K displays
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
      y: 0, // Centered for ultrawide
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
          height: containerSize * aspectRatio / 0.67, // Adjust for card-shaped board height
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
  minSize = 300,
  maxSize = 900,
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

      // Breakpoint-based sizing - DRASTICALLY REDUCED for 2K
      if (vw < 768) {
        calculatedSize = Math.min(vw * 0.90, 400);
      } else if (vw < 1024) {
        calculatedSize = Math.min(vw * 0.75, 600);
      } else if (vw >= 1920) {
        // 2K display - MAJOR reduction
        calculatedSize = Math.min(vw * 0.35, vh * 0.45, maxSize);
      } else {
        calculatedSize = Math.min(vw * 0.65, vh * 0.70, maxSize);
      }

      // Performance adjustment - reduced for 2K compatibility
      if (fps < performanceThreshold) {
        calculatedSize = Math.min(calculatedSize, vw >= 1920 ? 600 : 800);
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