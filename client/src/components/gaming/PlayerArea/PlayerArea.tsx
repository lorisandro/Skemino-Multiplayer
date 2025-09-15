import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardHand } from '../Cards/CardHand';
import { PlayerInfo } from './PlayerInfo';
import { Timer } from './Timer';
import type { Player, Card } from '../../../types/game';

interface PlayerAreaProps {
  player: Player | null;
  hand: Card[];
  isOpponent: boolean;
  isCurrentTurn: boolean;
  timeRemaining: number;
  selectedCard?: Card | null;
  onCardSelect?: (card: Card) => void;
  showCards?: boolean;
  orientation?: 'horizontal' | 'vertical';
  compact?: boolean;
  mobile?: boolean;
  className?: string;
}

/**
 * PlayerArea component - Displays player information, timer, and card hand
 * Optimized for different screen sizes and gaming performance
 */
export const PlayerArea: React.FC<PlayerAreaProps> = ({
  player,
  hand,
  isOpponent,
  isCurrentTurn,
  timeRemaining,
  selectedCard,
  onCardSelect,
  showCards = true,
  orientation = 'vertical',
  compact = false,
  mobile = false,
  className = '',
}) => {
  // Calculate hand size for display (always show 10 cards - 2 rows of 5)
  const displayHand = showCards ? hand : Array(10).fill(null);

  // Animation variants for player area
  const areaVariants = {
    active: {
      backgroundColor: 'rgba(34, 197, 94, 0.05)',
      borderColor: 'rgb(34, 197, 94)',
      transition: { duration: 0.3 }
    },
    inactive: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgb(226, 232, 240)',
      transition: { duration: 0.3 }
    }
  };

  // Mobile layout
  if (mobile) {
    return (
      <motion.div
        className={`h-full bg-white border-2 ${className}`}
        variants={areaVariants}
        animate={isCurrentTurn ? 'active' : 'inactive'}
      >
        <div className="h-full flex flex-col p-2">
          {/* Player info and timer in header */}
          <div className="flex items-center justify-between mb-2">
            <PlayerInfo
              player={player}
              isOpponent={isOpponent}
              isCurrentTurn={isCurrentTurn}
              compact={true}
              mobile={true}
            />
            <Timer
              timeRemaining={timeRemaining}
              isActive={isCurrentTurn}
              compact={true}
            />
          </div>

          {/* Cards */}
          <div className="flex-1">
            <CardHand
              cards={displayHand}
              selectedCard={selectedCard}
              onCardSelect={onCardSelect}
              orientation="horizontal"
              layout="linear"
              showHidden={!showCards}
              compact={true}
              mobile={true}
              maxCards={10}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Tablet/Compact layout
  if (compact) {
    return (
      <motion.div
        className={`h-full bg-white border-2 ${className}`}
        variants={areaVariants}
        animate={isCurrentTurn ? 'active' : 'inactive'}
      >
        <div className="h-full flex items-center p-4 space-x-4">
          {/* Player info */}
          <PlayerInfo
            player={player}
            isOpponent={isOpponent}
            isCurrentTurn={isCurrentTurn}
            compact={true}
          />

          {/* Cards */}
          <div className="flex-1">
            <CardHand
              cards={displayHand}
              selectedCard={selectedCard}
              onCardSelect={onCardSelect}
              orientation={orientation}
              layout="grid"
              showHidden={!showCards}
              compact={true}
              maxCards={10}
            />
          </div>

          {/* Timer */}
          <Timer
            timeRemaining={timeRemaining}
            isActive={isCurrentTurn}
            compact={true}
          />
        </div>
      </motion.div>
    );
  }

  // Desktop vertical layout
  if (orientation === 'vertical') {
    return (
      <motion.div
        className={`h-full bg-white border-2 flex flex-col ${className}`}
        variants={areaVariants}
        animate={isCurrentTurn ? 'active' : 'inactive'}
      >
        {/* Player header */}
        <div className="p-4 border-b border-slate-200">
          <PlayerInfo
            player={player}
            isOpponent={isOpponent}
            isCurrentTurn={isCurrentTurn}
          />
          <div className="mt-3">
            <Timer
              timeRemaining={timeRemaining}
              isActive={isCurrentTurn}
            />
          </div>
        </div>

        {/* Card hand - 2 rows of 5 cards */}
        <div className="flex-1 p-4">
          <CardHand
            cards={displayHand}
            selectedCard={selectedCard}
            onCardSelect={onCardSelect}
            orientation="vertical"
            layout="grid"
            showHidden={!showCards}
            maxCards={10}
          />
        </div>

        {/* Turn indicator */}
        <AnimatePresence>
          {isCurrentTurn && (
            <motion.div
              className="p-2 bg-green-500 text-white text-center text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {isOpponent ? 'Opponent\'s Turn' : 'Your Turn'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Desktop horizontal layout
  return (
    <motion.div
      className={`h-full bg-white border-2 ${className}`}
      variants={areaVariants}
      animate={isCurrentTurn ? 'active' : 'inactive'}
    >
      <div className="h-full flex items-center p-6 space-x-6">
        {/* Player info */}
        <div className="flex-shrink-0">
          <PlayerInfo
            player={player}
            isOpponent={isOpponent}
            isCurrentTurn={isCurrentTurn}
          />
        </div>

        {/* Cards - 2 rows of 5 cards */}
        <div className="flex-1">
          <CardHand
            cards={displayHand}
            selectedCard={selectedCard}
            onCardSelect={onCardSelect}
            orientation="horizontal"
            layout="grid"
            showHidden={!showCards}
            maxCards={10}
          />
        </div>

        {/* Timer */}
        <div className="flex-shrink-0">
          <Timer
            timeRemaining={timeRemaining}
            isActive={isCurrentTurn}
          />
        </div>

        {/* Turn indicator */}
        <AnimatePresence>
          {isCurrentTurn && (
            <motion.div
              className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              Turn
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};