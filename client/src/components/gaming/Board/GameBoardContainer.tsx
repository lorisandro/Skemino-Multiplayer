import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBoard } from './GameBoard';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';
import { useResponsiveGameLayout } from '../../../hooks/useResponsiveGameLayout';

interface GameBoardContainerProps {
  showCoordinates?: boolean;
  showPerformanceMetrics?: boolean;
  enableAnimations?: boolean;
  className?: string;
}

export const GameBoardContainer: React.FC<GameBoardContainerProps> = ({
  showCoordinates = true,
  showPerformanceMetrics = true,
  enableAnimations = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameState, currentPlayer, isMyTurn } = useGameStore();
  const { connected, latency } = useSocket();
  const { breakpoint, boardSize, isMobile, isTablet, isDesktop, isUltrawide, containerWidth, containerHeight } = useResponsiveGameLayout(containerRef);
  const is2K = breakpoint === '2k';

  // Performance-optimized coordinate rendering
  const coordinates = useMemo(() => {
    if (!showCoordinates) return null;

    const files = ['a', 'b', 'c', 'd', 'e', 'f'];
    const ranks = currentPlayer?.color === 'white'
      ? ['6', '5', '4', '3', '2', '1']
      : ['1', '2', '3', '4', '5', '6'];

    return { files, ranks };
  }, [showCoordinates, currentPlayer?.color]);

  // Gaming-optimized responsive layout with 2K support
  const layoutClasses = useMemo(() => {
    const baseClasses = 'relative w-full max-w-none gaming-board-container';

    if (isMobile) {
      return `${baseClasses} mobile-gaming-layout flex flex-col items-center space-y-4 p-2`;
    }

    if (isTablet) {
      return `${baseClasses} tablet-gaming-layout grid grid-cols-1 gap-4 p-4`;
    }

    if (is2K) {
      return `${baseClasses} 2k-gaming-layout grid grid-cols-1 gap-8 p-8 max-w-7xl mx-auto`;
    }

    if (isUltrawide) {
      return `${baseClasses} ultrawide-gaming-layout grid grid-cols-1 gap-10 p-10 max-w-8xl mx-auto`;
    }

    return `${baseClasses} desktop-gaming-layout grid grid-cols-3 gap-6 p-6`;
  }, [isMobile, isTablet, is2K, isUltrawide]);


  // Connection status indicator
  const ConnectionStatus = useCallback(() => (
    <AnimatePresence>
      {!connected && (
        <motion.div
          className="absolute top-2 left-2 z-50 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Reconnecting...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [connected]);

  // Coordinates component with gaming optimization
  const CoordinatesDisplay = useCallback(() => {
    if (!coordinates || !showCoordinates) return null;

    return (
      <>
        {/* Top coordinates - Files */}
        <div className="absolute -top-6 left-0 right-0 flex justify-around px-1">
          {coordinates.files.map((file, index) => (
            <motion.span
              key={file}
              className="text-sm font-semibold text-gray-700 select-none"
              initial={enableAnimations ? { opacity: 0, y: -10 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {file}
            </motion.span>
          ))}
        </div>

        {/* Bottom coordinates - Files */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-around px-1">
          {coordinates.files.map((file, index) => (
            <motion.span
              key={file}
              className="text-sm font-semibold text-gray-700 select-none"
              initial={enableAnimations ? { opacity: 0, y: 10 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {file}
            </motion.span>
          ))}
        </div>

        {/* Left coordinates - Ranks */}
        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around py-1">
          {coordinates.ranks.map((rank, index) => (
            <motion.span
              key={rank}
              className="text-sm font-semibold text-gray-700 select-none"
              initial={enableAnimations ? { opacity: 0, x: -10 } : { opacity: 1 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {rank}
            </motion.span>
          ))}
        </div>

        {/* Right coordinates - Ranks */}
        <div className="absolute -right-6 top-0 bottom-0 flex flex-col justify-around py-1">
          {coordinates.ranks.map((rank, index) => (
            <motion.span
              key={rank}
              className="text-sm font-semibold text-gray-700 select-none"
              initial={enableAnimations ? { opacity: 0, x: 10 } : { opacity: 1 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {rank}
            </motion.span>
          ))}
        </div>
      </>
    );
  }, [coordinates, showCoordinates, enableAnimations]);

  // Turn indicator
  const TurnIndicator = useCallback(() => (
    <motion.div
      className={`
        absolute -top-12 left-1/2 transform -translate-x-1/2 z-40
        px-4 py-2 rounded-full text-sm font-semibold
        ${isMyTurn
          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
          : 'bg-gray-400 text-gray-800'
        }
      `}
      animate={isMyTurn ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 4px 20px rgba(34, 197, 94, 0.3)',
          '0 4px 30px rgba(34, 197, 94, 0.6)',
          '0 4px 20px rgba(34, 197, 94, 0.3)'
        ]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {isMyTurn ? 'Your Turn' : 'Opponent Turn'}
    </motion.div>
  ), [isMyTurn]);

  return (
    <div
      ref={containerRef}
      className={`${layoutClasses} ${className}`}
      data-breakpoint={breakpoint}
      style={{
        contain: 'layout style paint',
        willChange: enableAnimations ? 'transform' : 'auto'
      }}
    >
      {/* Main board area */}
      <div className="relative flex items-center justify-center gaming-board-wrapper">
        {/* Board container with responsive sizing */}
        <motion.div
          className={`relative board-gaming-container ${is2K ? '2k-board-enhancement' : ''}`}
          style={{
            width: boardSize,
            height: boardSize,
            maxWidth: isMobile ? '90vw' : is2K ? '85vh' : '70vh',
            maxHeight: isMobile ? '90vw' : is2K ? '85vh' : '70vh',
            // Enhanced styling for 2K displays
            ...(is2K && {
              boxShadow: '0 35px 70px -12px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(0, 0, 0, 0.05)',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '24px',
            })
          }}
          initial={enableAnimations ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: is2K ? 0.7 : 0.5,
            ease: 'easeOut',
            type: is2K ? 'spring' : 'tween',
            stiffness: is2K ? 120 : undefined,
            damping: is2K ? 25 : undefined
          }}
        >
          {/* Board component */}
          <GameBoard />

          {/* Overlays and indicators */}
          <CoordinatesDisplay />
          <TurnIndicator />
          <ConnectionStatus />

          {/* 2K Display Enhancement Indicator */}
          {is2K && (
            <motion.div
              className="absolute -top-8 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-600 text-xs rounded-full border border-emerald-500/30 backdrop-blur-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              2K Gaming ({boardSize}px)
            </motion.div>
          )}

          {/* Performance boost indicator for large boards */}
          {boardSize > 1200 && (
            <motion.div
              className="absolute -top-8 left-0 px-3 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full border border-blue-500/30 backdrop-blur-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              Large Board Mode
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Gaming statistics and controls - Enhanced for 2K */}
      {!isMobile && (
        <motion.div
          className={`flex justify-center gaming-stats-container ${is2K ? 'mt-6' : 'mt-4'}`}
          initial={enableAnimations ? { opacity: 0, y: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`flex space-x-6 text-gray-600 bg-white/80 rounded-lg shadow-sm ${is2K ? 'text-base px-6 py-3' : 'text-sm px-4 py-2'}`}>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Board:</span>
              <span className="font-mono text-blue-600">6×6</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Resolution:</span>
              <span className={`font-mono ${is2K ? 'text-emerald-600' : 'text-gray-600'}`}>
                {containerWidth}×{containerHeight}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Board Size:</span>
              <span className={`font-mono ${boardSize > 1200 ? 'text-emerald-600' : 'text-blue-600'}`}>
                {boardSize}px
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Display:</span>
              <span className={`font-mono ${is2K ? 'text-emerald-600' : isUltrawide ? 'text-purple-600' : 'text-gray-600'}`}>
                {breakpoint.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Vertices:</span>
              <span className="font-mono text-purple-600">4 Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Turn:</span>
              <span className={`font-mono ${gameState?.currentTurn === 'white' ? 'text-gray-800' : 'text-gray-600'}`}>
                {gameState?.currentTurn || 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameBoardContainer;