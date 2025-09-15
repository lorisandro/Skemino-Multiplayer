import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import type { Card as CardType, Player } from '../../../types/game';

interface MobileCardAreaProps {
  player: Player | null;
  cards: CardType[];
  isCurrentPlayer: boolean;
  selectedCard?: CardType | null;
  onCardSelect?: (card: CardType | null) => void;
  className?: string;
}

export const MobileCardArea: React.FC<MobileCardAreaProps> = ({
  player,
  cards,
  isCurrentPlayer,
  selectedCard,
  onCardSelect,
  className = '',
}) => {
  const [showExpanded, setShowExpanded] = useState(false);

  // Handle card selection
  const handleCardClick = (card: CardType) => {
    if (!isCurrentPlayer || !onCardSelect) return;

    // Toggle selection
    if (selectedCard?.id === card.id) {
      onCardSelect(null);
    } else {
      onCardSelect(card);
    }
  };

  const totalCards = cards.length;
  const displayCards = showExpanded ? cards : cards.slice(0, 3);

  return (
    <div className={`mobile-card-area ${className}`}>
      {/* Player Header */}
      {player && (
        <div className="flex items-center justify-between p-3 bg-slate-800 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {player.username[0].toUpperCase()}
            </div>
            <div className="text-white text-sm font-medium">
              {isCurrentPlayer ? 'You' : player.username}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-slate-700 rounded-full text-xs font-bold text-white">
              {totalCards}/10
            </div>
            {totalCards > 3 && (
              <button
                onClick={() => setShowExpanded(!showExpanded)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded-full text-xs text-white transition-colors"
              >
                {showExpanded ? '−' : '+'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cards Display */}
      <motion.div
        className="bg-slate-900 p-2 rounded-b-lg overflow-x-auto"
        layout
      >
        <AnimatePresence mode="popLayout">
          <div className="flex gap-1 min-w-max">
            {displayCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                {isCurrentPlayer ? (
                  <motion.div
                    className={`
                      cursor-pointer transition-all duration-200
                      ${selectedCard?.id === card.id ? 'border-2 border-green-400 rounded-lg shadow-lg' : ''}
                    `}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCardClick(card)}
                  >
                    <Card
                      card={card}
                      size="small"
                      interactive={true}
                      selected={selectedCard?.id === card.id}
                      className="shadow-md"
                    />
                  </motion.div>
                ) : (
                  // Opponent's card (face down)
                  <div className="w-10 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md shadow-md border border-slate-600 flex items-center justify-center">
                    <div className="text-white text-lg opacity-70">🂠</div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Show more indicator */}
            {!showExpanded && totalCards > 3 && (
              <motion.div
                className="flex items-center justify-center w-10 h-14 bg-slate-700 rounded-md border border-slate-600 cursor-pointer"
                onClick={() => setShowExpanded(true)}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-slate-300 text-xs font-bold">
                  +{totalCards - 3}
                </span>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};