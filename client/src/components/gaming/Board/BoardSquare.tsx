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

  // Square color based on Skèmino specifications
  const squareColor = useMemo(() => {
    // Vertex colors based on Skèmino design
    if (isVertex) {
      switch (cell) {
        case 'a1': return 'bg-gradient-to-br from-cyan-400 to-cyan-600'; // Azzurro
        case 'f1': return 'bg-gradient-to-br from-emerald-400 to-emerald-600'; // Verde
        case 'a6': return 'bg-gradient-to-br from-red-400 to-red-600'; // Rosso
        case 'f6': return 'bg-gradient-to-br from-yellow-400 to-yellow-600'; // Giallo
        default: return 'bg-gradient-to-br from-gray-800 to-gray-900'; // Nero per altri vertici
      }
    }

    // Standard squares: alternating black/white pattern
    const file = cell.charCodeAt(0) - 97; // 0-5
    const rank = parseInt(cell[1]) - 1; // 0-5
    const isDark = (file + rank) % 2 === 0;

    if (isDark) {
      return 'bg-gradient-to-br from-gray-900 to-black'; // Nero
    } else {
      return 'bg-gradient-to-br from-white to-gray-50'; // Bianco
    }
  }, [cell, isVertex]);

  // Highlight styles
  const getHighlightStyle = () => {
    if (isOver && canDrop) {
      return 'ring-4 ring-green-400 ring-opacity-75';
    }
    if (isValidMove && selectedCard) {
      return 'ring-2 ring-blue-400 ring-opacity-75 animate-pulse';
    }
    if (position?.isLastMove) {
      return 'ring-2 ring-yellow-400 ring-opacity-75';
    }
    if (position?.isHighlighted) {
      return 'ring-2 ring-purple-400 ring-opacity-75';
    }
    return '';
  };

  return (
    <motion.div
      ref={drop}
      className={`
        relative border border-gray-400
        ${squareColor} ${getHighlightStyle()}
        cursor-pointer transition-all duration-150
        hover:brightness-110 active:brightness-95
        will-change-transform
      `}
      style={{
        width: size,
        height: size,
        contain: 'layout style paint'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {/* Vertex indicator - Enhanced for Skèmino design */}
      {isVertex && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`
              w-6 h-6 rounded-full ring-2 ring-white/50 shadow-lg
              ${cell === 'a1' ? 'bg-cyan-500 shadow-cyan-500/50' : ''}
              ${cell === 'f1' ? 'bg-emerald-500 shadow-emerald-500/50' : ''}
              ${cell === 'a6' ? 'bg-red-500 shadow-red-500/50' : ''}
              ${cell === 'f6' ? 'bg-yellow-500 shadow-yellow-500/50' : ''}
            `}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      {/* Cell label - Enhanced visibility for competitive gaming */}
      <div className={`
        absolute top-0.5 right-0.5 text-xs font-mono font-bold tracking-wide
        ${isVertex ? 'text-white drop-shadow-lg' : 'text-gray-600'}
        opacity-70 hover:opacity-100 transition-opacity duration-200
      `}>
        {cell}
      </div>

      {/* Valid move indicator */}
      <AnimatePresence>
        {isValidMove && selectedCard && !position?.card && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-full opacity-50" />
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

      {/* Hole indicator */}
      {position?.isHole && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-black rounded-full opacity-50" />
        </div>
      )}

      {/* Capture preview */}
      {isValidMove && position?.card && selectedCard && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="text-red-500 text-3xl font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            ⚔️
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};