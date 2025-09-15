import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import type { Card as CardType, Player } from '../../../types/game';

interface PlayerZoneProps {
  player: Player | null;
  cards: CardType[];
  isCurrentPlayer: boolean;
  selectedCard?: CardType | null;
  onCardSelect?: (card: CardType | null) => void;
  position: 'left' | 'right';
  className?: string;
}

interface CardZoneState {
  activeCards: CardType[];
  reserveCards: CardType[];
  showReserve: boolean;
}

export const PlayerZone: React.FC<PlayerZoneProps> = ({
  player,
  cards,
  isCurrentPlayer,
  selectedCard,
  onCardSelect,
  position,
  className = '',
}) => {
  // State management for active/reserve cards (5+5 system)
  const cardState = useMemo((): CardZoneState => {
    const activeCards = cards.slice(0, 5);
    const reserveCards = cards.slice(5, 10);

    return {
      activeCards,
      reserveCards,
      showReserve: false
    };
  }, [cards]);

  const [showReserve, setShowReserve] = useState(false);

  // Counter display
  const totalCards = cards.length;
  const maxCards = 10;
  const counterText = `${totalCards}/${maxCards}`;

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

  // Toggle reserve cards visibility
  const toggleReserve = () => {
    if (cardState.reserveCards.length > 0) {
      setShowReserve(!showReserve);
    }
  };

  return (
    <motion.div
      className={`
        player-zone flex flex-col h-full
        w-36 xl:w-36 lg:w-32 md:w-28
        fixed top-0 ${position === 'left' ? 'left-64 xl:left-64 lg:left-60' : 'right-0'}
        bg-slate-900 border-l border-slate-700
        hidden lg:flex
        ${className}
      `}
      initial={{ x: position === 'left' ? -144 : 144, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Player Header */}
      {player && (
        <div className="relative p-3 bg-slate-800 border-b border-slate-700">
          {/* Card Counter Badge */}
          <div className="absolute top-2 right-2 z-10">
            <div className="px-2 py-1 bg-slate-700 rounded-full text-xs font-bold text-white shadow-md">
              {counterText}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm mb-2">
              {player.username[0].toUpperCase()}
            </div>
            <div className="text-white text-sm font-medium truncate w-full text-center">
              {player.username}
            </div>
            <div className="text-slate-400 text-xs">
              {player.rating}
            </div>
            {player.isOnline && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mt-1" />
            )}
          </div>
        </div>
      )}

      {/* Cards Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Active Cards Section */}
        <div className="flex-1 p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
              ACTIVE ({cardState.activeCards.length})
            </span>
          </div>

          <div className="space-y-1 bg-slate-800 rounded-lg p-2">
            <AnimatePresence mode="popLayout">
              {cardState.activeCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.03,
                  }}
                >
                  {isCurrentPlayer ? (
                    <motion.div
                      className={`
                        cursor-pointer transition-all duration-200
                        ${selectedCard?.id === card.id ? 'border-l-4 border-green-400 shadow-lg' : ''}
                      `}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardClick(card)}
                    >
                      <Card
                        card={card}
                        size="small"
                        interactive={true}
                        selected={selectedCard?.id === card.id}
                        className="w-full shadow-md hover:shadow-lg"
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
            </AnimatePresence>

            {/* Empty active slots */}
            {cardState.activeCards.length < 5 && (
              <div className="space-y-1">
                {Array.from({ length: 5 - cardState.activeCards.length }, (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-10 h-14 border-2 border-dashed border-slate-600 rounded-md flex items-center justify-center opacity-30"
                  >
                    <div className="text-slate-500 text-xs">•</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reserve Cards Section (if any) */}
        {cardState.reserveCards.length > 0 && (
          <motion.div
            className="border-t border-slate-700"
            layout
          >
            <button
              onClick={toggleReserve}
              className="w-full p-2 bg-slate-700 hover:bg-slate-600 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                  RISERVA ({cardState.reserveCards.length})
                </span>
                <motion.div
                  animate={{ rotate: showReserve ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-400"
                >
                  ↓
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {showReserve && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-850 p-2 space-y-1"
                >
                  {cardState.reserveCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {isCurrentPlayer ? (
                        <motion.div
                          className={`
                            cursor-pointer transition-all duration-200
                            ${selectedCard?.id === card.id ? 'border-l-4 border-green-400 shadow-lg' : ''}
                          `}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCardClick(card)}
                        >
                          <Card
                            card={card}
                            size="small"
                            interactive={true}
                            selected={selectedCard?.id === card.id}
                            className="w-full shadow-md hover:shadow-lg opacity-80"
                          />
                        </motion.div>
                      ) : (
                        // Opponent's reserve card (face down)
                        <div className="w-10 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md shadow-md border border-slate-600 flex items-center justify-center opacity-60">
                          <div className="text-white text-lg opacity-50">🂠</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="p-2 bg-slate-800 border-t border-slate-700 text-center">
        <div className="text-xs text-slate-400">
          {isCurrentPlayer ? 'Your Cards' : 'Opponent'}
        </div>
      </div>
    </motion.div>
  );
};