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

  // Square color based on coordinates
  const squareColor = useMemo(() => {
    const file = cell.charCodeAt(0) - 97; // 0-5
    const rank = parseInt(cell[1]) - 1; // 0-5
    const isDark = (file + rank) % 2 === 0;

    if (isVertex) {
      return 'bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-800';
    }

    if (isDark) {
      return 'bg-slate-200 dark:bg-slate-700';
    } else {
      return 'bg-slate-100 dark:bg-slate-600';
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
        relative border border-slate-300 dark:border-slate-500
        ${squareColor} ${getHighlightStyle()}
        cursor-pointer transition-all duration-200
        hover:brightness-110
      `}
      style={{ width: size, height: size }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Vertex indicator */}
      {isVertex && (
        <div className="absolute top-1 left-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      )}

      {/* Cell label */}
      <div className="absolute top-0 right-1 text-xs font-mono text-slate-500 dark:text-slate-400 opacity-50">
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