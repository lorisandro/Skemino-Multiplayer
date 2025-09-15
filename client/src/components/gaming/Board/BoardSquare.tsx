import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../Cards/Card';
import type { BoardPosition, Card as CardType } from '../../../types/game';
import { useGameStore } from '../../../store/gameStore';
import '../../../styles/board-dark-animations.css';

interface BoardSquareProps {
  cell: string;
  position?: BoardPosition;
  isValidMove: boolean;
  isVertex: boolean;
  onClick: () => void;
  size: number;
}

export const BoardSquare: React.FC<BoardSquareProps> = ({
  cell,
  position,
  isValidMove,
  isVertex,
  onClick,
  size,
}) => {
  const { selectedCard, isMyTurn } = useGameStore();

  // Drag and drop support
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'card',
    canDrop: (item: { card: CardType }) => isValidMove && isMyTurn,
    drop: (item: { card: CardType }) => {
      onClick();
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [isValidMove, isMyTurn, onClick]);

  // Square color based on Skèmino Dark Gaming specifications
  const squareColor = useMemo(() => {
    // Vertex colors with gradient center - Custom colors requested
    if (isVertex) {
      switch (cell) {
        case 'a1': return 'skemino-vertex-blue'; // Blue with gradient center
        case 'f1': return 'skemino-vertex-green'; // Green with gradient center
        case 'a6': return 'skemino-vertex-red'; // Red with gradient center
        case 'f6': return 'skemino-vertex-yellow'; // Yellow with gradient center
        default: return ''; // Altri vertici dark
      }
    }

    // Standard squares: Pure white circular gradient for all non-vertex cells
    // Professional gaming board style with subtle white depth gradient
    return 'skemino-cell-gradient'; // Apply white circular gradient with gray center
  }, [cell, isVertex]);

  // Dark Gaming Highlight styles - Professional competitive
  const getHighlightStyle = () => {
    if (isOver && canDrop) {
      return 'ring-4 ring-emerald-400/80 ring-offset-2 ring-offset-gray-900 shadow-lg shadow-emerald-500/50';
    }
    if (isValidMove && selectedCard) {
      return 'ring-3 ring-blue-400/80 ring-offset-1 ring-offset-gray-900 animate-pulse shadow-lg shadow-blue-500/40';
    }
    if (position?.isLastMove) {
      return 'ring-3 ring-yellow-400/80 ring-offset-1 ring-offset-gray-900 shadow-lg shadow-yellow-500/40';
    }
    if (position?.isHighlighted) {
      return 'ring-3 ring-purple-400/80 ring-offset-1 ring-offset-gray-900 shadow-lg shadow-purple-500/40';
    }
    return '';
  };

  return (
    <motion.div
      ref={drop}
      className={`
        relative border border-gray-600/80 skemino-square-dark
        ${squareColor} ${getHighlightStyle()}
        cursor-pointer transition-all duration-200 ease-out
        hover:brightness-125 hover:scale-[1.02] active:scale-[0.98] active:brightness-90
        rounded-lg
      `}
      style={{
        '--square-size': `${size}px`,
        width: `${size}px`,
        height: `${size * 1.4}px`
      } as React.CSSProperties}
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 500, damping: 30 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 600, damping: 35 }
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {/* Vertex indicator - Dark Gaming Enhanced for Skèmino */}
      {isVertex && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            className={`
              w-8 h-8 rounded-full ring-3 ring-white/30 shadow-2xl skemino-vertex-dark
              ${cell === 'a1' ? 'skemino-vertex-indicator-blue' : ''}
              ${cell === 'f1' ? 'skemino-vertex-indicator-green' : ''}
              ${cell === 'a6' ? 'skemino-vertex-indicator-red' : ''}
              ${cell === 'f6' ? 'skemino-vertex-indicator-yellow' : ''}
            `}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.9, 1, 0.9],
              boxShadow: [
                '0 0 20px rgba(0,0,0,0.5)',
                '0 0 40px rgba(255,255,255,0.3)',
                '0 0 20px rgba(0,0,0,0.5)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Inner vertex glow effect */}
            <div className="absolute inset-1 rounded-full bg-white/20"></div>
          </motion.div>
        </div>
      )}

      {/* Cell label - Dark Gaming Enhanced visibility */}
      <div className={`
        absolute top-1 right-1 text-xs font-mono font-bold tracking-wide z-30
        ${isVertex ? 'text-white drop-shadow-2xl shadow-black' : 'text-gray-300'}
        opacity-60 hover:opacity-90 transition-all duration-200
        bg-black/20 rounded px-1 py-0.5
      `}>
        {cell}
      </div>

      {/* Valid move indicator - Dark Gaming Enhanced */}
      <AnimatePresence>
        {isValidMove && selectedCard && !position?.card && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <motion.div
              className="w-4 h-4 rounded-full shadow-lg shadow-blue-500/50 ring-2 ring-blue-300/30 skemino-valid-move-indicator"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card on square */}
      <AnimatePresence mode="wait">
        {position?.card && (
          <motion.div
            key={position.card.id}
            className="absolute inset-1 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card
              card={position.card}
              size="board"
              owner={position.owner}
              interactive={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hole indicator - Dark Gaming Enhanced */}
      {position?.isHole && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            className="w-10 h-10 rounded-full border border-gray-500 shadow-2xl skemino-hole-indicator"
            animate={{
              scale: [1, 0.9, 1],
              opacity: [0.8, 0.6, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-2 rounded-full skemino-hole-inner"></div>
          </motion.div>
        </div>
      )}

      {/* Capture preview - Dark Gaming Enhanced */}
      {isValidMove && position?.card && selectedCard && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div
            className="text-4xl font-bold drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))',
              textShadow: '0 0 20px rgba(239, 68, 68, 0.9)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut"
            }}
          >
            ⚔️
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};