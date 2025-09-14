import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import type { Card as CardType, Player } from '../../../types/game';

interface PlayerHandProps {
  cards: CardType[];
  player: Player | null;
  isOpponent: boolean;
  selectedCard?: CardType | null;
  onCardSelect?: (card: CardType | null) => void;
  canSelect?: boolean;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  player,
  isOpponent,
  selectedCard,
  onCardSelect,
  canSelect = false,
}) => {
  // Sort cards by suit and value
  const sortedCards = [...cards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return a.suit.localeCompare(b.suit);
    }
    const aValue = a.value === 'J' ? 11 : a.value === 'Q' ? 12 : a.value === 'K' ? 13 : parseInt(a.value);
    const bValue = b.value === 'J' ? 11 : b.value === 'Q' ? 12 : b.value === 'K' ? 13 : parseInt(b.value);
    return aValue - bValue;
  });

  const handleCardClick = (card: CardType) => {
    if (!canSelect || !onCardSelect) return;

    // Toggle selection
    if (selectedCard?.id === card.id) {
      onCardSelect(null);
    } else {
      onCardSelect(card);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Player info */}
      {player && (
        <motion.div
          className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-md"
          initial={{ opacity: 0, y: isOpponent ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {player.username[0].toUpperCase()}
          </div>

          {/* Player details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{player.username}</span>
              <span
                className={`
                  w-3 h-3 rounded-full
                  ${player.color === 'white' ? 'bg-white border border-gray-400' : 'bg-gray-800'}
                `}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Rating: {player.rating}</span>
              {player.isOnline && (
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* Time display */}
          <div className="ml-4 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
            <span className="font-mono text-lg font-semibold">
              {Math.floor(player.timeRemaining / 60)}:
              {(player.timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Cards container */}
      <motion.div
        className={`
          flex gap-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg
          ${isOpponent ? 'perspective-1000' : ''}
        `}
        style={{
          minHeight: '100px',
          perspective: isOpponent ? '1000px' : undefined,
        }}
      >
        <AnimatePresence mode="popLayout">
          {sortedCards.map((card, index) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.8, rotateY: isOpponent ? 180 : 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: isOpponent ? 180 : 0,
                x: 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: index * 0.05,
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {isOpponent ? (
                // Opponent's cards (face down)
                <div
                  className="w-14 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md border-2 border-white dark:border-slate-700"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
                  }}
                >
                  <div className="h-full flex items-center justify-center text-white text-2xl opacity-50">
                    ♠
                  </div>
                </div>
              ) : (
                // Player's cards (face up)
                <Card
                  card={card}
                  size="medium"
                  interactive={canSelect}
                  selected={selectedCard?.id === card.id}
                  disabled={!canSelect}
                  onClick={() => handleCardClick(card)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty hand message */}
        {cards.length === 0 && (
          <motion.div
            className="flex items-center justify-center w-full h-20 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No cards remaining
          </motion.div>
        )}
      </motion.div>

      {/* Card count */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {cards.length} card{cards.length !== 1 ? 's' : ''} remaining
      </div>
    </div>
  );
};