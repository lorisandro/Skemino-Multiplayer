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

  // Animation variants for player area (Gaming-optimized dark theme)
  const areaVariants = {
    active: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)', // slate-900 with transparency
      borderColor: 'rgb(34, 197, 94)', // green-500
      boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
      scale: 1.01,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    inactive: {
      backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800 with transparency
      borderColor: 'rgb(71, 85, 105)', // slate-600
      boxShadow: '0 0 0px rgba(34, 197, 94, 0)',
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Mobile layout
  if (mobile) {
    return (
      <motion.div
        className={`h-full border-2 backdrop-blur-sm ${className}`}
        variants={areaVariants}
        animate={isCurrentTurn ? 'active' : 'inactive'}
      >
        <div className="h-full flex flex-col p-2">
          {/* Player info and timer in header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
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
                mobile={true}
              />
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 flex items-center justify-center">
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
        className={`h-full border-2 backdrop-blur-sm ${className}`}
        variants={areaVariants}
        animate={isCurrentTurn ? 'active' : 'inactive'}
      >
        <div className="h-full flex items-center p-4 space-x-4">
          {/* Player info with timer */}
          <div className="flex items-center gap-3">
            <PlayerInfo
              player={player}
              isOpponent={isOpponent}
              isCurrentTurn={isCurrentTurn}
              compact={true}
            />
            <Timer
              timeRemaining={timeRemaining}
              isActive={isCurrentTurn}
              compact={true}
            />
          </div>

          {/* Cards */}
          <div className="flex-1 flex items-center justify-center">
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
        </div>
      </motion.div>
    );
  }

  // Desktop vertical layout
  if (orientation === 'vertical') {
    return (
      <motion.div
        className={`h-full border-2 flex flex-col backdrop-blur-sm ${className}`}
        variants={areaVariants}
        animate={isCurrentTurn ? 'active' : 'inactive'}
      >
        {/* Player header */}
        <div className="p-4 border-b border-slate-600/50">
          <div className="flex items-center justify-between">
            <PlayerInfo
              player={player}
              isOpponent={isOpponent}
              isCurrentTurn={isCurrentTurn}
            />
            <Timer
              timeRemaining={timeRemaining}
              isActive={isCurrentTurn}
            />
          </div>
        </div>

        {/* Card hand - 2 rows of 5 cards */}
        <div className="flex-1 p-4 flex items-center justify-center">
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
              className="p-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-center text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {isOpponent && player ? `${player.username}'s Turn` : 'Your Turn'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Desktop horizontal layout
  return (
    <motion.div
      className={`h-full border-2 backdrop-blur-sm ${className}`}
      variants={areaVariants}
      animate={isCurrentTurn ? 'active' : 'inactive'}
    >
      <div className="h-full flex items-center p-6 space-x-6">
        {/* Player info with timer */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <PlayerInfo
            player={player}
            isOpponent={isOpponent}
            isCurrentTurn={isCurrentTurn}
          />
          <Timer
            timeRemaining={timeRemaining}
            isActive={isCurrentTurn}
          />
        </div>

        {/* Cards - 2 rows of 5 cards */}
        <div className="flex-1 flex items-center justify-center">
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

        {/* Turn indicator */}
        <AnimatePresence>
          {isCurrentTurn && (
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-green-400 text-white text-sm font-medium rounded-full shadow-lg"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-1">
                <motion.div
                  className="w-2 h-2 bg-green-200 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                Turn
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};