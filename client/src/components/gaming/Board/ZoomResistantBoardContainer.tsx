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
            // Demo mode overrides with larger fixed sizes (rectangular for 5:7 cells) - INCREASED BY 43.75% TOTAL
            ...(demoMode && {
              width: '64.531rem', // Increased width only by additional 10% from 58.664rem
              height: '85.02rem', // Height unchanged
              minWidth: '64.531rem',
              minHeight: '85.02rem',
              maxWidth: '73.75rem', // Increased width only by additional 10% from 67.045rem
              maxHeight: '97.147rem', // Height unchanged
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
<<<<<<< HEAD
        return { width: '73.75rem', height: '97.147rem' }; // Width increased +10% from 67.045rem, height unchanged
      case 'tablet':
        return { width: '82.969rem', height: '109.291rem' }; // Width increased +10% from 75.426rem, height unchanged
      case 'desktop':
        return { width: '92.187rem', height: '121.435rem' }; // Width increased +10% from 83.806rem, height unchanged
      case '2k':
        return { width: '101.406rem', height: '133.578rem' }; // Width increased +10% from 92.187rem, height unchanged
      case 'ultrawide':
        return { width: '110.625rem', height: '145.709rem' }; // Width increased +10% from 100.568rem, height unchanged
      default:
        return { width: '82.969rem', height: '109.291rem' }; // Width increased +10% from 75.426rem, height unchanged
=======
        return { width: '28rem', height: '39rem' };
      case 'tablet':
        return { width: '35rem', height: '49rem' };
      case 'desktop':
        return { width: '36rem', height: '50rem' };
      case '2k':
        return { width: '42rem', height: '59rem' };
      case 'ultrawide':
        return { width: '48rem', height: '67rem' };
      default:
        return { width: '35rem', height: '49rem' };
>>>>>>> 41074f74de8bf59adbe35cc2236ec7c22d29f4d4
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