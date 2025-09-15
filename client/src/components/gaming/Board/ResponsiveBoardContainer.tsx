import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveBoardContainerProps {
  children: React.ReactNode;
  minSize?: number;
  maxSize?: number;
  aspectRatio?: number;
  demoMode?: boolean;
  onSizeChange?: (size: number) => void;
}

/**
 * Responsive container optimized for Skèmino gaming performance
 * Automatically adjusts board size based on viewport and performance metrics
 */
export const ResponsiveBoardContainer: React.FC<ResponsiveBoardContainerProps> = ({
  children,
  minSize = 400,
  maxSize = 1800, // Increased for larger board display
  aspectRatio = 1,
  demoMode = false,
  onSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(1600);
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | '2k' | 'ultrawide'>('desktop');

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

      // Demo mode: much more restrictive sizing
      if (demoMode) {
        let demoSize = Math.min(
          width * 0.6,
          height * 0.6,
          600 // Maximum 600px in demo mode
        );

        switch (breakpoint) {
          case 'mobile':
            demoSize = Math.min(demoSize, 300);
            break;
          case 'tablet':
            demoSize = Math.min(demoSize, 400);
            break;
          case 'desktop':
            demoSize = Math.min(demoSize, 500);
            break;
          case '2k':
            demoSize = Math.min(demoSize, 600);
            break;
          case 'ultrawide':
            demoSize = Math.min(demoSize, 600);
            break;
        }

        const finalSize = Math.max(minSize, Math.min(maxSize, demoSize));
        setContainerSize(finalSize);
        onSizeChange?.(finalSize);
        return;
      }

      // Regular mode: improved calculations with better container fitting
      // Account for 1.4:1 aspect ratio of board squares (rectangular cells)
      let baseSize = Math.min(
        width * 0.99, // ULTRA MAXIMIZED space utilization
        (height - 20) * 1.0 / 1.4, // Divide by 1.4 to account for rectangular cells, ultra minimal margin
        maxSize
      );

      // Apply breakpoint-specific adjustments
      switch (breakpoint) {
        case 'mobile':
          baseSize = Math.min(baseSize, width * 0.9, 400);
          break;
        case 'tablet':
          baseSize = Math.min(baseSize, width * 0.8, 600);
          break;
        case 'desktop':
          baseSize = Math.min(baseSize, width * 0.97, height * 1.0 / 1.4, 1500); // Ultra maximum desktop utilization
          break;
        case '2k':
          // Optimized sizing for 2K displays - better space utilization
          baseSize = Math.min(
            width * 0.85, // Ultra maximum 2K space utilization
            height * 0.92 / 1.4, // Divide by 1.4 for rectangular cells
            1700 // Ultra maximum 2K size
          );
          break;
        case 'ultrawide':
          baseSize = Math.min(baseSize, width * 0.4, height * 0.75 / 1.4, 1000);
          break;
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
  }, [breakpoint, minSize, maxSize, aspectRatio, onSizeChange]);

  // Container styles based on breakpoint with enhanced scaling
  const getContainerClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center w-full';

    switch (breakpoint) {
      case 'mobile':
        return `${baseClasses} min-h-screen px-2 py-4 overflow-hidden`;
      case 'tablet':
        return `${baseClasses} min-h-[700px] px-4 py-6 overflow-hidden`;
      case 'desktop':
        return `${baseClasses} min-h-[800px] px-6 py-8 overflow-hidden`;
      case '2k':
        return `${baseClasses} min-h-[900px] px-8 py-10 overflow-hidden`; // Enhanced spacing for 2K
      case 'ultrawide':
        return `${baseClasses} min-h-[1000px] px-10 py-12 overflow-hidden`; // Extra spacing for ultrawide
      default:
        return `${baseClasses} min-h-[800px] p-4 overflow-hidden`;
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
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    desktop: {
      scale: 1,
      y: 0,
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
      y: 0,
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
      y: 0,
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
        className="relative flex flex-col items-center overflow-hidden"
        variants={containerVariants}
        initial={false}
        animate={breakpoint}
        style={{
          width: containerSize,
          height: containerSize * 1.4, // Height accounts for 1.4:1 cell aspect ratio
          maxWidth: '100%',
          maxHeight: '100%',
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
  maxSize = 2000,
  performanceThreshold = 45
) {
  const [size, setSize] = useState(1400);
  const [isReduced, setIsReduced] = useState(false);

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
        calculatedSize = Math.min(vw * 0.9, vh * 0.95, maxSize);
      }

      setIsReduced(false);

      setSize(Math.max(minSize, calculatedSize));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [minSize, maxSize, performanceThreshold]);

  return { size, isReduced };
}