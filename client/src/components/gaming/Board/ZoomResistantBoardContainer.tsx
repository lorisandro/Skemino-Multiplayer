import React from 'react';
import { motion } from 'framer-motion';
import { useBreakpoints } from '../../../hooks/useMediaQuery';

interface ZoomResistantBoardContainerProps {
  children: React.ReactNode;
  demoMode?: boolean;
  className?: string;
}

/**
 * Zoom-resistant board container for Skèmino gaming
 * Uses CSS Container Queries and rem units to maintain consistent size across all zoom levels
 * Professional gaming design optimized for competitive play
 */
export const ZoomResistantBoardContainer: React.FC<ZoomResistantBoardContainerProps> = ({
  children,
  demoMode = false,
  className = '',
}) => {
  const { currentBreakpoint, isMobile } = useBreakpoints();

  // Container classes based on breakpoint and mode
  const getContainerClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center w-full';

    if (demoMode) {
      return `${baseClasses} min-h-screen px-2 py-4`;
    }

    switch (currentBreakpoint) {
      case 'mobile':
        return `${baseClasses} min-h-screen px-2 py-4`;
      case 'tablet':
        return `${baseClasses} min-h-[700px] px-4 py-6`;
      case 'desktop':
        return `${baseClasses} min-h-[800px] px-6 py-8`;
      case '2k':
        return `${baseClasses} min-h-[900px] px-8 py-10`;
      case 'ultrawide':
        return `${baseClasses} min-h-[1000px] px-10 py-12`;
      default:
        return `${baseClasses} min-h-[800px] p-4`;
    }
  };

  // Motion variants optimized for different breakpoints
  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: 'easeOut',
        type: 'spring',
        stiffness: currentBreakpoint === '2k' || currentBreakpoint === 'ultrawide' ? 80 : 100,
        damping: 25,
      },
    },
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Zoom-resistant board container */}
        <div
          className={`
            skemino-board-zoom-resistant
            ${demoMode ? 'demo-mode' : ''}
          `}
          style={{
            // Demo mode overrides with smaller fixed sizes
            ...(demoMode && {
              width: '20rem',
              height: '20rem',
              minWidth: '18rem',
              minHeight: '18rem',
              maxWidth: '25rem',
              maxHeight: '25rem',
            })
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Hook for getting optimal board container size
 * Returns consistent sizes regardless of zoom level
 */
export const useBoardContainerSize = () => {
  const { currentBreakpoint } = useBreakpoints();

  const getBoardSize = () => {
    switch (currentBreakpoint) {
      case 'mobile':
        return { width: '28rem', height: '39rem' };
      case 'tablet':
        return { width: '35rem', height: '49rem' };
      case 'desktop':
        return { width: '42rem', height: '58rem' };
      case '2k':
        return { width: '60rem', height: '84rem' };
      case 'ultrawide':
        return { width: '55rem', height: '77rem' };
      default:
        return { width: '35rem', height: '49rem' };
    }
  };

  const getCellSize = () => {
    const boardSize = getBoardSize();
    // Calculate cell size based on board size (6x6 grid with padding and gaps)
    const baseSizeRem = parseFloat(boardSize.width.replace('rem', ''));
    const cellSizeRem = (baseSizeRem - 2) / 6; // Account for padding and gaps

    return {
      width: `${cellSizeRem}rem`,
      height: `${cellSizeRem * 1.4}rem`, // Gaming aspect ratio 1:1.4
    };
  };

  return {
    boardSize: getBoardSize(),
    cellSize: getCellSize(),
    currentBreakpoint,
  };
};