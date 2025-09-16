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
      return `${baseClasses} min-h-[1200px] px-2 py-4`;
    }

    switch (currentBreakpoint) {
      case 'mobile':
        return `${baseClasses} min-h-screen px-2 py-4`;
      case 'tablet':
        return `${baseClasses} min-h-[1300px] px-4 py-6`;
      case 'desktop':
        return `${baseClasses} min-h-[1500px] px-6 py-8`;
      case '2k':
        return `${baseClasses} min-h-[1700px] px-8 py-10`;
      case 'ultrawide':
        return `${baseClasses} min-h-[1900px] px-10 py-12`;
      default:
        return `${baseClasses} min-h-[1500px] p-4`;
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
            // Demo mode overrides with smaller fixed sizes (rectangular for 5:7 cells)
            ...(demoMode && {
              width: '33rem',
              height: '46.2rem', // Height adjusted for 5:7 cells (33 * 1.4)
              minWidth: '33rem',
              minHeight: '46.2rem',
              maxWidth: '38rem',
              maxHeight: '53.2rem', // Max height adjusted for 5:7 cells (38 * 1.4)
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
        return { width: '38rem', height: '53.2rem' }; // Height adjusted for 5:7 cells (38 * 1.4)
      case 'tablet':
        return { width: '46rem', height: '64.4rem' }; // Height adjusted for 5:7 cells (46 * 1.4)
      case 'desktop':
        return { width: '52rem', height: '72.8rem' }; // Height adjusted for 5:7 cells (52 * 1.4)
      case '2k':
        return { width: '60rem', height: '84rem' }; // Height adjusted for 5:7 cells (60 * 1.4)
      case 'ultrawide':
        return { width: '65rem', height: '91rem' }; // Height adjusted for 5:7 cells (65 * 1.4)
      default:
        return { width: '46rem', height: '64.4rem' }; // Height adjusted for 5:7 cells
    }
  };

  const getCellSize = () => {
    const boardSize = getBoardSize();
    // Calculate cell size based on board size (6x6 grid with padding and gaps)
    const baseSizeRem = parseFloat(boardSize.width.replace('rem', ''));
    const cellWidthRem = (baseSizeRem - 2) / 6; // Account for padding and gaps
    const cellHeightRem = (cellWidthRem * 7) / 5; // Playing card aspect ratio (5:7)

    return {
      width: `${cellWidthRem}rem`,
      height: `${cellHeightRem}rem`, // Playing card proportioned cells
    };
  };

  return {
    boardSize: getBoardSize(),
    cellSize: getCellSize(),
    currentBreakpoint,
  };
};