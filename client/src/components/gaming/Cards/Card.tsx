import React, { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import type { Card as CardType, PlayerColor } from '../../../types/game';

interface CardProps {
  card: CardType;
  size?: 'small' | 'medium' | 'large' | 'board';
  owner?: PlayerColor | null;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  card,
  size = 'medium',
  owner,
  interactive = true,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  // Drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card },
    canDrag: interactive && !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [card, interactive, disabled]);

  // Card dimensions based on size
  const dimensions = useMemo(() => {
    switch (size) {
      case 'small':
        return { width: 56, height: 78, fontSize: 'text-xs' };
      case 'medium':
        return { width: 60, height: 84, fontSize: 'text-sm' };
      case 'large':
        return { width: 80, height: 112, fontSize: 'text-base' };
      case 'board':
        return { width: 50, height: 70, fontSize: 'text-xs' };
      default:
        return { width: 60, height: 84, fontSize: 'text-sm' };
    }
  }, [size]);

  // Suit colors and symbols
  const suitConfig = useMemo(() => {
    switch (card.suit) {
      case 'P': // Pietra (Rock)
        return {
          color: 'from-gray-400 to-gray-600',
          textColor: 'text-gray-800',
          symbol: '🪨',
          name: 'Pietra',
        };
      case 'F': // Forbici (Scissors)
        return {
          color: 'from-blue-400 to-blue-600',
          textColor: 'text-blue-800',
          symbol: '✂️',
          name: 'Forbici',
        };
      case 'C': // Carta (Paper)
        return {
          color: 'from-green-400 to-green-600',
          textColor: 'text-green-800',
          symbol: '📄',
          name: 'Carta',
        };
      default:
        return {
          color: 'from-gray-400 to-gray-600',
          textColor: 'text-gray-800',
          symbol: '?',
          name: 'Unknown',
        };
    }
  }, [card.suit]);

  // Display value (handle face cards)
  const displayValue = useMemo(() => {
    switch (card.value) {
      case '1':
        return 'A';
      case '11':
        return 'J';
      case '12':
        return 'Q';
      case '13':
        return 'K';
      default:
        return card.value;
    }
  }, [card.value]);

  return (
    <motion.div
      ref={drag}
      className={`
        relative rounded-lg shadow-lg cursor-pointer
        bg-gradient-to-br ${suitConfig.color}
        ${interactive && !disabled ? 'hover:shadow-xl hover:scale-105' : ''}
        ${selected ? 'ring-4 ring-yellow-400 scale-110' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transition: 'all 0.2s ease',
      }}
      onClick={interactive && !disabled ? onClick : undefined}
      whileHover={interactive && !disabled ? { y: -4 } : {}}
      whileTap={interactive && !disabled ? { scale: 0.95 } : {}}
    >
      {/* Card background pattern */}
      <div className="absolute inset-0 rounded-lg bg-white bg-opacity-90">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-white to-transparent opacity-30" />
      </div>

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between p-1">
        {/* Top corner */}
        <div className={`${dimensions.fontSize} font-bold ${suitConfig.textColor} text-left`}>
          <div>{displayValue}</div>
          <div className="text-lg leading-none">{suitConfig.symbol}</div>
        </div>

        {/* Center symbol */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-2xl opacity-20">{suitConfig.symbol}</div>
        </div>

        {/* Bottom corner (rotated) */}
        <div
          className={`${dimensions.fontSize} font-bold ${suitConfig.textColor} text-right transform rotate-180`}
        >
          <div>{displayValue}</div>
          <div className="text-lg leading-none">{suitConfig.symbol}</div>
        </div>
      </div>

      {/* Owner indicator */}
      {owner && (
        <div
          className={`
            absolute -top-1 -right-1 w-3 h-3 rounded-full
            ${owner === 'white' ? 'bg-white border border-gray-400' : 'bg-gray-800 border border-gray-600'}
          `}
        />
      )}

      {/* Selected glow */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-yellow-400 opacity-30"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
  );
};