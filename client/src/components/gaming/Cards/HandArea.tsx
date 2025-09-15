import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import type { Card as CardType, PlayerColor } from '../../../types/game';

interface HandAreaProps {
  cards: CardType[];
  playerColor: PlayerColor;
  selectedCard?: CardType | null;
  isPlayerTurn: boolean;
  isCurrentPlayer: boolean;
  layout: 'fan' | 'linear' | 'grid' | 'compact';
  orientation: 'horizontal' | 'vertical';
  onCardSelect?: (card: CardType) => void;
  className?: string;
  showCardBacks?: boolean;
}

export const HandArea: React.FC<HandAreaProps> = ({
  cards,
  playerColor,
  selectedCard,
  isPlayerTurn,
  isCurrentPlayer,
  layout,
  orientation,
  onCardSelect,
  className = '',
  showCardBacks = false,
}) => {
  // Card container style based on layout and orientation
  const containerStyle = useMemo(() => {
    const baseStyles = 'relative transition-all duration-300 ease-out';

    switch (layout) {
      case 'fan':
        return `${baseStyles} flex justify-center items-end ${
          orientation === 'vertical' ? 'flex-col h-full' : 'w-full'
        }`;

      case 'linear':
        return `${baseStyles} flex gap-2 ${
          orientation === 'vertical'
            ? 'flex-col items-center'
            : 'justify-center items-center'
        }`;

      case 'grid':
        return `${baseStyles} grid grid-cols-3 grid-rows-2 gap-2 max-w-[280px]`;

      case 'compact':
        return `${baseStyles} flex ${
          orientation === 'vertical' ? 'flex-col gap-1' : 'gap-1'
        }`;

      default:
        return baseStyles;
    }
  }, [layout, orientation]);

  // Animation variants for initial card distribution
  const cardVariants = {
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
      y: orientation === 'vertical' ? -100 : 0,
      x: orientation === 'horizontal' ? -100 : 0,
    },
    animate: (index: number) => ({
      scale: 1,
      rotate: layout === 'fan' ? getFanRotation(index, cards.length) : 0,
      opacity: 1,
      y: layout === 'fan' && orientation === 'horizontal' ? getFanYOffset(index, cards.length) : 0,
      x: layout === 'fan' && orientation === 'vertical' ? getFanXOffset(index, cards.length) : 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: index * 0.1 + 0.3, // Staggered animation
      },
    }),
    hover: {
      scale: layout === 'fan' ? 1.05 : 1.02,
      rotate: 0,
      y: layout === 'fan' ? -10 : -5,
      z: 10,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    selected: {
      scale: 1.1,
      rotate: 0,
      y: -15,
      z: 20,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Fan layout positioning helpers
  const getFanRotation = (index: number, total: number): number => {
    if (total <= 1) return 0;
    const maxRotation = 30;
    const step = (maxRotation * 2) / (total - 1);
    return -maxRotation + (step * index);
  };

  const getFanYOffset = (index: number, total: number): number => {
    if (total <= 1) return 0;
    const maxOffset = 15;
    const center = (total - 1) / 2;
    const distance = Math.abs(index - center);
    return distance * (maxOffset / center);
  };

  const getFanXOffset = (index: number, total: number): number => {
    if (total <= 1) return 0;
    const maxOffset = 20;
    const center = (total - 1) / 2;
    const distance = Math.abs(index - center);
    return distance * (maxOffset / center);
  };

  // Grid positioning for 5 cards (3+2 layout)
  const getGridPosition = (index: number) => {
    if (index < 3) {
      return {}; // First row, handled by CSS grid
    } else {
      return {
        gridColumn: index === 3 ? '1 / 2' : '3 / 4',
        gridRow: '2 / 3',
      };
    }
  };

  return (
    <div
      className={`hand-area ${containerStyle} ${className}`}
      data-player={playerColor}
      data-layout={layout}
      data-orientation={orientation}
    >
      {/* Hand header for vertical layouts */}
      {orientation === 'vertical' && (
        <div className="text-xs font-medium text-gray-600 mb-2">
          {isCurrentPlayer ? 'Your Hand' : `${playerColor} Hand`}
          <span className="ml-2 text-gray-400">({cards.length}/5)</span>
        </div>
      )}

      {/* Cards container */}
      <div className={containerStyle}>
        <AnimatePresence mode="sync">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              custom={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover={isCurrentPlayer && isPlayerTurn ? "hover" : undefined}
              style={layout === 'grid' ? getGridPosition(index) : undefined}
              className={`
                card-wrapper relative cursor-pointer
                ${layout === 'fan' ? 'absolute' : ''}
                ${selectedCard?.id === card.id ? 'z-20' : 'z-10'}
              `}
            >
              {/* Card component */}
              {showCardBacks && !isCurrentPlayer ? (
                <CardBack size={getCardSize(layout)} />
              ) : (
                <Card
                  card={card}
                  size={getCardSize(layout)}
                  owner={playerColor}
                  interactive={isCurrentPlayer && isPlayerTurn}
                  selected={selectedCard?.id === card.id}
                  disabled={!isCurrentPlayer || !isPlayerTurn}
                  onClick={() => onCardSelect?.(card)}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                />
              )}

              {/* Card selection indicator */}
              {selectedCard?.id === card.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-yellow-400 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty slots indicator for incomplete hands */}
      {cards.length < 5 && isCurrentPlayer && (
        <div className="text-xs text-gray-400 mt-2 text-center">
          Waiting for {5 - cards.length} more cards...
        </div>
      )}
    </div>
  );
};

// Card back component for opponent
const CardBack: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const dimensions = useMemo(() => {
    switch (size) {
      case 'small': return { width: 56, height: 78 };
      case 'medium': return { width: 60, height: 84 };
      case 'large': return { width: 80, height: 112 };
      default: return { width: 60, height: 84 };
    }
  }, [size]);

  return (
    <motion.div
      className="relative rounded-lg shadow-lg bg-gradient-to-br from-blue-900 to-purple-900"
      style={dimensions}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 rounded-lg bg-pattern opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-opacity-60 text-2xl">♠</div>
      </div>
    </motion.div>
  );
};

// Helper function to determine card size based on layout
const getCardSize = (layout: string): 'small' | 'medium' | 'large' => {
  switch (layout) {
    case 'fan': return 'medium';
    case 'linear': return 'medium';
    case 'grid': return 'small';
    case 'compact': return 'small';
    default: return 'medium';
  }
};