import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeminoCard } from './SkeminoCard';
import type { Card } from '../../../types/game';

interface CardHandProps {
  cards: (Card | null)[];
  selectedCard?: Card | null;
  onCardSelect?: (card: Card) => void;
  orientation?: 'horizontal' | 'vertical';
  layout?: 'fan' | 'grid' | 'linear' | 'stack';
  showHidden?: boolean;
  compact?: boolean;
  mobile?: boolean;
  maxCards?: number;
  className?: string;
}

/**
 * CardHand component - Displays hand of cards with different layouts
 * Optimized for Skèmino gaming with 5-card hand management
 */
export const CardHand: React.FC<CardHandProps> = ({
  cards,
  selectedCard,
  onCardSelect,
  orientation = 'horizontal',
  layout = 'fan',
  showHidden = false,
  compact = false,
  mobile = false,
  maxCards = 5,
  className = '',
}) => {
  // Ensure we always show exactly 5 cards (pad with nulls if needed)
  const displayCards = Array(maxCards).fill(null).map((_, index) =>
    cards[index] || null
  );

  // Handle card click
  const handleCardClick = (card: Card | null, index: number) => {
    if (card && onCardSelect && !showHidden) {
      onCardSelect(card);
    }
  };

  // Get container classes based on layout and orientation
  const getContainerClasses = () => {
    const baseClasses = 'relative';

    if (mobile) {
      return `${baseClasses} flex justify-center items-center h-full w-full`;
    }

    if (compact) {
      if (orientation === 'horizontal') {
        return `${baseClasses} flex justify-center items-center space-x-1 h-full`;
      } else {
        return `${baseClasses} flex flex-col justify-center items-center space-y-1 w-full`;
      }
    }

    switch (layout) {
      case 'fan':
        return `${baseClasses} ${orientation === 'horizontal' ? 'h-24' : 'w-32'} flex justify-center items-center`;
      case 'grid':
        return `${baseClasses} grid grid-cols-3 grid-rows-2 gap-2 w-full`;
      case 'linear':
        return `${baseClasses} flex ${orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2'} justify-center items-center`;
      case 'stack':
        return `${baseClasses} relative w-16 h-20`;
      default:
        return `${baseClasses} flex justify-center items-center`;
    }
  };

  // Fan layout animation variants
  const getFanTransform = (index: number, total: number) => {
    if (layout !== 'fan') return {};

    const center = (total - 1) / 2;
    const offset = index - center;
    const angle = offset * 15; // 15 degrees spread
    const yOffset = Math.abs(offset) * 8; // Slight curve

    if (orientation === 'horizontal') {
      return {
        rotate: angle,
        y: yOffset,
        zIndex: total - Math.abs(offset),
      };
    } else {
      return {
        rotate: angle,
        x: yOffset,
        zIndex: total - Math.abs(offset),
      };
    }
  };

  // Grid layout positioning
  const getGridPosition = (index: number) => {
    if (layout !== 'grid' || maxCards !== 5) return {};

    // 5 cards in 3x2 grid with card 5 centered
    const positions = [
      { gridColumn: 1, gridRow: 1 }, // Card 1
      { gridColumn: 2, gridRow: 1 }, // Card 2
      { gridColumn: 3, gridRow: 1 }, // Card 3
      { gridColumn: 1, gridRow: 2 }, // Card 4
      { gridColumn: 2, gridRow: 2 }, // Card 5 (centered)
    ];

    return positions[index] || {};
  };

  // Stack layout positioning
  const getStackTransform = (index: number) => {
    if (layout !== 'stack') return {};

    return {
      x: index * 2,
      y: -index * 2,
      zIndex: index,
    };
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    selected: {
      scale: mobile ? 1.05 : 1.1,
      y: mobile ? -4 : -8,
      zIndex: 100
    },
    hover: {
      scale: mobile ? 1.02 : 1.05,
      y: mobile ? -2 : -4
    }
  };

  // Mobile layout
  if (mobile) {
    return (
      <div className={`${getContainerClasses()} ${className}`}>
        <div className="flex space-x-1 overflow-x-auto w-full justify-center px-2">
          {displayCards.map((card, index) => (
            <motion.div
              key={`mobile-card-${index}`}
              className="flex-shrink-0"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <SkeminoCard
                card={card}
                isSelected={card ? selectedCard?.id === card.id : false}
                isHidden={showHidden}
                onClick={() => handleCardClick(card, index)}
                size="small"
                mobile={true}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <div className={`${getContainerClasses()} ${className}`}>
        {displayCards.map((card, index) => (
          <motion.div
            key={`grid-card-${index}`}
            style={getGridPosition(index)}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <SkeminoCard
              card={card}
              isSelected={card ? selectedCard?.id === card.id : false}
              isHidden={showHidden}
              onClick={() => handleCardClick(card, index)}
              size={compact ? "small" : "medium"}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Fan layout
  if (layout === 'fan') {
    return (
      <div className={`${getContainerClasses()} ${className}`}>
        <AnimatePresence>
          {displayCards.map((card, index) => (
            <motion.div
              key={`fan-card-${index}`}
              className="absolute"
              style={getFanTransform(index, displayCards.length)}
              variants={cardVariants}
              initial="hidden"
              animate={card && selectedCard?.id === card.id ? "selected" : "visible"}
              whileHover={card ? "hover" : undefined}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              <SkeminoCard
                card={card}
                isSelected={card ? selectedCard?.id === card.id : false}
                isHidden={showHidden}
                onClick={() => handleCardClick(card, index)}
                size={compact ? "small" : "medium"}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Linear layout
  if (layout === 'linear') {
    return (
      <div className={`${getContainerClasses()} ${className}`}>
        {displayCards.map((card, index) => (
          <motion.div
            key={`linear-card-${index}`}
            variants={cardVariants}
            initial="hidden"
            animate={card && selectedCard?.id === card.id ? "selected" : "visible"}
            whileHover={card ? "hover" : undefined}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <SkeminoCard
              card={card}
              isSelected={card ? selectedCard?.id === card.id : false}
              isHidden={showHidden}
              onClick={() => handleCardClick(card, index)}
              size={compact ? "small" : "medium"}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Stack layout
  if (layout === 'stack') {
    return (
      <div className={`${getContainerClasses()} ${className}`}>
        {displayCards.map((card, index) => (
          <motion.div
            key={`stack-card-${index}`}
            className="absolute"
            style={getStackTransform(index)}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <SkeminoCard
              card={card}
              isSelected={card ? selectedCard?.id === card.id : false}
              isHidden={showHidden}
              onClick={() => handleCardClick(card, index)}
              size="small"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Default layout
  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {displayCards.map((card, index) => (
        <motion.div
          key={`default-card-${index}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <SkeminoCard
            card={card}
            isSelected={card ? selectedCard?.id === card.id : false}
            isHidden={showHidden}
            onClick={() => handleCardClick(card, index)}
            size="medium"
          />
        </motion.div>
      ))}
    </div>
  );
};