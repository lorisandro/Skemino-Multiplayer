import React from 'react';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import type { Card } from '../../../types/game';

interface SkeminoCardProps {
  card: Card | null;
  isSelected?: boolean;
  isHidden?: boolean;
  isPlayable?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: (card: Card) => void;
  onDragEnd?: () => void;
  size?: 'small' | 'medium' | 'large';
  mobile?: boolean;
  className?: string;
}

/**
 * SkeminoCard component - Individual card display with Skèmino game mechanics
 * Supports drag & drop, visual feedback, and responsive sizing
 */
export const SkeminoCard: React.FC<SkeminoCardProps> = ({
  card,
  isSelected = false,
  isHidden = false,
  isPlayable = true,
  onClick,
  onDragStart,
  onDragEnd,
  size = 'medium',
  mobile = false,
  className = '',
}) => {
  // Drag and drop setup
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      if (card && onDragStart) {
        onDragStart(card);
      }
      return { card };
    },
    end: () => {
      if (onDragEnd) {
        onDragEnd();
      }
    },
    canDrag: Boolean(card && isPlayable && !isHidden && !mobile),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Get card dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return mobile ? 'w-10 h-14' : 'w-12 h-16';
      case 'medium':
        return mobile ? 'w-12 h-16' : 'w-16 h-22';
      case 'large':
        return mobile ? 'w-14 h-19' : 'w-20 h-28';
      default:
        return mobile ? 'w-12 h-16' : 'w-16 h-22';
    }
  };

  // Get suit color and symbol
  const getSuitInfo = (suit: string) => {
    switch (suit) {
      case 'P': // Pietra
        return {
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          symbol: '🗿',
          name: 'Pietra'
        };
      case 'F': // Forbici
        return {
          color: 'text-blue-700',
          bgColor: 'bg-blue-100',
          symbol: '✂️',
          name: 'Forbici'
        };
      case 'C': // Carta
        return {
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          symbol: '📄',
          name: 'Carta'
        };
      default:
        return {
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          symbol: '❓',
          name: 'Unknown'
        };
    }
  };

  // Get display value for card
  const getDisplayValue = (value: string) => {
    switch (value) {
      case '1':
        return 'A';
      case '11':
        return 'J';
      case '12':
        return 'Q';
      case '13':
        return 'K';
      default:
        return value;
    }
  };

  // Handle click with proper event handling
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (card && isPlayable && !isHidden && onClick) {
      onClick();
    }
  };

  // Empty card slot (no card)
  if (!card) {
    return (
      <div
        className={`
          ${getDimensions()}
          bg-gray-200/30
          border-2 border-dashed border-gray-300
          rounded-lg
          ${className}
        `}
      />
    );
  }

  // Card back (hidden card with actual card data)
  if (isHidden) {
    return (
      <motion.div
        className={`
          ${getDimensions()}
          bg-gradient-to-br from-slate-800 to-slate-900
          border-2 border-slate-700
          rounded-lg
          shadow-md
          cursor-default
          flex items-center justify-center
          relative
          ${className}
        `}
        whileHover={!mobile ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {/* Card back pattern */}
        <div className="absolute inset-1 rounded-md bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-slate-400 text-xs font-bold">
            SKÈMINO
          </div>
        </div>
      </motion.div>
    );
  }

  const suitInfo = getSuitInfo(card.suit);
  const displayValue = getDisplayValue(card.value);

  return (
    <motion.div
      ref={!mobile ? drag : undefined}
      className={`
        ${getDimensions()}
        bg-white
        border-2
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
        ${isPlayable ? 'cursor-pointer hover:border-blue-400' : 'cursor-not-allowed opacity-50'}
        rounded-lg
        shadow-md
        relative
        transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
      onClick={handleClick}
      whileHover={
        !mobile && isPlayable && !isDragging
          ? { scale: 1.05, y: -2 }
          : undefined
      }
      whileTap={mobile ? { scale: 0.95 } : undefined}
      animate={{
        scale: isSelected ? 1.1 : 1,
        y: isSelected ? -4 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {/* Card face */}
      <div className={`absolute inset-1 rounded-md ${suitInfo.bgColor} flex flex-col`}>
        {/* Top-left value */}
        <div className={`absolute top-0.5 left-0.5 ${suitInfo.color} font-bold text-xs leading-none`}>
          {displayValue}
        </div>

        {/* Top-left suit */}
        <div className="absolute top-2 left-0.5 text-xs">
          {suitInfo.symbol}
        </div>

        {/* Center suit symbol (larger) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">
            {suitInfo.symbol}
          </div>
        </div>

        {/* Bottom-right value (rotated) */}
        <div className={`absolute bottom-0.5 right-0.5 ${suitInfo.color} font-bold text-xs leading-none transform rotate-180`}>
          {displayValue}
        </div>

        {/* Bottom-right suit (rotated) */}
        <div className="absolute bottom-2 right-0.5 text-xs transform rotate-180">
          {suitInfo.symbol}
        </div>

        {/* Stronger card indicator */}
        {card.isStronger && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-500 rounded-md bg-blue-100 bg-opacity-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Playable indicator */}
        {isPlayable && !isHidden && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Tooltip for desktop */}
      {!mobile && card && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          {suitInfo.name} {displayValue}
        </div>
      )}
    </motion.div>
  );
};