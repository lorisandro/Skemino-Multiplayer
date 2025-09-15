import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../Cards/Card';
import type { BoardPosition, Card as CardType } from '../../../types/game';
import { useGameStore } from '../../../store/gameStore';

interface BoardSquareProps {
  cell: string;
  position?: BoardPosition;
  isValidMove: boolean;
  isVertex: boolean;
  onClick: () => void;
  size: number;
  cardAspectRatio?: number; // Playing card aspect ratio (width/height)
}

export const BoardSquare: React.FC<BoardSquareProps> = ({
  cell,
  position,
  isValidMove,
  isVertex,
  onClick,
  size,
  cardAspectRatio = 0.67, // Playing card ratio: 2:3 (width/height)
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
    // Vertex colors based on Dark Skèmino design - Professional Gaming
    if (isVertex) {
      switch (cell) {
        case 'a1': return 'bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-lg shadow-cyan-500/50'; // Q I - Dark Azzurro
        case 'f1': return 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/50'; // Q II - Dark Verde
        case 'a6': return 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50'; // Q III - Dark Rosso
        case 'f6': return 'bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-lg shadow-yellow-500/50'; // Q IV - Dark Giallo
        default: return 'bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg'; // Altri vertici dark
      }
    }

    // Standard squares: Dark gaming alternating pattern
    const file = cell.charCodeAt(0) - 97; // 0-5
    const rank = parseInt(cell[1]) - 1; // 0-5
    const isDark = (file + rank) % 2 === 0;

    if (isDark) {
      return 'bg-gradient-to-br from-gray-900 via-black to-gray-900'; // Caselle scure - Professional dark
    } else {
      return 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700'; // Caselle chiare - Dark optimized
    }
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

  // Calculate card dimensions
  const cardWidth = size;
  const cardHeight = size / cardAspectRatio;

  return (
    <motion.div
      ref={drop}
      className={`
        relative border border-gray-600/80 skemino-card-cell-dark
        ${squareColor} ${getHighlightStyle()}
        cursor-pointer transition-all duration-200 ease-out
        hover:brightness-125 hover:scale-[1.02] active:scale-[0.98] active:brightness-90
        backdrop-blur-sm
      `}
      style={{
        width: cardWidth,
        height: cardHeight,
        contain: 'layout style paint',
        background: isVertex ? undefined : 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)',
        borderRadius: '6px', // More rounded for card appearance
        position: 'relative'
      }}
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
              w-8 h-8 rounded-full ring-3 ring-white/30 shadow-2xl skemino-vertex-dark backdrop-blur-sm
              ${cell === 'a1' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-cyan-500/70' : ''}
              ${cell === 'f1' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/70' : ''}
              ${cell === 'a6' ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/70' : ''}
              ${cell === 'f6' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/70' : ''}
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
            <div className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm"></div>
          </motion.div>
        </div>
      )}

      {/* Cell label - Dark Gaming Enhanced visibility */}
      <div className={`
        absolute top-1 right-1 text-xs font-mono font-bold tracking-wide z-30
        ${isVertex ? 'text-white drop-shadow-2xl shadow-black' : 'text-gray-300'}
        opacity-60 hover:opacity-90 transition-all duration-200
        bg-black/20 backdrop-blur-sm rounded px-1 py-0.5
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
              className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 backdrop-blur-sm ring-2 ring-blue-300/30"
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
            className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-full border border-gray-700 shadow-2xl backdrop-blur-sm"
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
            <div className="absolute inset-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full"></div>
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