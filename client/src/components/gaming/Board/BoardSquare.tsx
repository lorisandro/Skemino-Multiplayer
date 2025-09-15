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
  size?: number;
  zoomResistant?: boolean;
}

export const BoardSquare: React.FC<BoardSquareProps> = ({
  cell,
  position,
  isValidMove,
  isVertex,
  onClick,
  size,
  zoomResistant = false,
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
    // Base classes
    const baseClass = zoomResistant ? 'skemino-cell-zoom-resistant' : 'skemino-square-dark';

    // Vertex colors with gradient center - Custom colors requested
    if (isVertex) {
      const vertexClass = zoomResistant ? 'skemino-vertex-zoom-resistant' : '';
      switch (cell) {
        case 'a1': return `${baseClass} ${vertexClass} skemino-vertex-a1`; // Blue with gradient center
        case 'f1': return `${baseClass} ${vertexClass} skemino-vertex-f1`; // Green with gradient center
        case 'a6': return `${baseClass} ${vertexClass} skemino-vertex-a6`; // Red with gradient center
        case 'f6': return `${baseClass} ${vertexClass} skemino-vertex-f6`; // Yellow with gradient center
        default: return baseClass; // Altri vertici dark
      }
    }

    // Central strategic cells with specific diagonal patterns
    if (cell === 'c3') {
      return `${baseClass} skemino-central-c3`; // c3: Blue/Black diagonal
    }
    if (cell === 'c4') {
      return `${baseClass} skemino-central-c4`; // c4: Red/Black diagonal
    }
    if (cell === 'd3') {
      return `${baseClass} skemino-central-d3`; // d3: Green/Black diagonal
    }
    if (cell === 'd4') {
      return `${baseClass} skemino-central-d4`; // d4: Yellow/Black diagonal
    }

    // Standard squares: Pure white circular gradient for all non-vertex cells
    // Professional gaming board style with subtle white depth gradient
    return `${baseClass}`; // Default white gradient from CSS
  }, [cell, isVertex, zoomResistant]);

  // Dark Gaming Highlight styles - Pure CSS Professional competitive
  const getHighlightStyle = () => {
    if (isOver && canDrop) {
      return 'skemino-highlight-drop';
    }
    if (isValidMove && selectedCard) {
      return 'skemino-highlight-valid';
    }
    if (position?.isLastMove) {
      return 'skemino-highlight-last';
    }
    if (position?.isHighlighted) {
      return 'skemino-highlight-selected';
    }
    return '';
  };

  // Get classes for algebraic notation if zoom resistant
  const getNotationClasses = () => {
    if (zoomResistant) {
      return 'skemino-notation-zoom-resistant';
    }
    return '';
  };

  return (
    <motion.div
      ref={drop}
      className={`
        ${squareColor} ${getHighlightStyle()} ${getNotationClasses()}
        ${isValidMove && selectedCard ? 'valid-move' : ''}
      `}
      data-notation={cell} // For CSS content display
      style={{
        // Only use size for legacy mode
        ...(!zoomResistant && size && {
          '--square-size': `${size}px`,
          width: `${size}px`,
          height: `${size * 1.4}px`
        })
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

      {/* Cell label - Show only for legacy mode (zoom-resistant uses CSS notation) */}
      {!zoomResistant && (
        <div className={`skemino-cell-label ${isVertex ? 'skemino-cell-label-vertex' : 'skemino-cell-label-normal'}`}>
          <span className={`${!isVertex ? 'bg-black/30 px-1.5 py-0.5 rounded text-xs backdrop-blur-sm text-black font-bold' : ''}`}>
            {cell}
          </span>
        </div>
      )}

      {/* Valid move indicator - Dark Gaming Enhanced */}
      <AnimatePresence>
        {isValidMove && selectedCard && !position?.card && (
          <motion.div
            className="skemino-valid-move-container"
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
              className="skemino-valid-move-indicator"
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
            className="skemino-card-container"
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
        <div className="skemino-hole-container">
          <motion.div
            className="skemino-hole-indicator"
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
            <div className="skemino-hole-inner"></div>
          </motion.div>
        </div>
      )}

      {/* Capture preview - Dark Gaming Enhanced */}
      {isValidMove && position?.card && selectedCard && (
        <div className="skemino-capture-preview">
          <motion.div
            className="skemino-capture-icon"
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