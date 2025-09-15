import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameBoard } from './Board/GameBoard';
import { PlayerArea } from './PlayerArea/PlayerArea';
// import { GameHeader } from './GameHeader/GameHeader'; // Removed header as requested
import { GameSidebar } from './GameSidebar/GameSidebar';
import { useGameStore } from '../../store/gameStore';
import { useSocket } from '../../hooks/useSocket';
import type { Card } from '../../types/game';

interface GameInterfaceProps {
  className?: string;
}

/**
 * Main game interface component - Professional chess.com-style layout
 * Optimized for competitive Skèmino gaming with full-screen responsive design
 */
export const GameInterface: React.FC<GameInterfaceProps> = ({ className = '' }) => {
  const {
    gameState,
    currentPlayer,
    opponent,
    selectedCard,
    isMyTurn,
    selectCard,
    makeMove,
  } = useGameStore();

  // Detect demo mode from className
  const isDemoMode = className?.includes('demo-mode');

  const { connected, latency } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock player hands for development - replace with real data
  const playerHand: Card[] = gameState?.whiteHand || [];
  const opponentHand: Card[] = gameState?.blackHand || [];

  // Handle card selection
  const handleCardSelect = (card: Card) => {
    if (isMyTurn) {
      selectCard(selectedCard?.id === card.id ? null : card);
    }
  };

  // Determine layout based on screen size with 2K support
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop' | '2k'>('desktop');

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 768) {
        setLayout('mobile');
        setSidebarOpen(false);
      } else if (width < 1024) {
        setLayout('tablet');
        setSidebarOpen(false);
      } else if (width >= 1920 && height >= 1080) {
        setLayout('2k'); // 2K layout for enhanced gaming experience
        setSidebarOpen(true);
      } else {
        setLayout('desktop');
        setSidebarOpen(true);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // 2K Layout (1920px+ optimized)
  if (layout === '2k') {
    return (
      <div className={`h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col ${className}`}>
        {/* Header removed as requested */}

        {/* Main Game Area - Optimized for 2K displays */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Combined players with card slots */}
          <div className="w-80 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900 border-r border-gray-800/50 flex flex-col shadow-2xl">
            {/* Opponent Area - Top half */}
            <div className="flex-1 border-b border-gray-800/50 backdrop-blur-sm bg-black/20 p-3">
              <PlayerArea
                player={opponent}
                hand={opponentHand}
                isOpponent={true}
                isCurrentTurn={!isMyTurn}
                timeRemaining={gameState?.blackTime || 0}
                showCards={true}
                orientation="vertical"
              />
            </div>

            {/* Current Player Area - Bottom half */}
            <div className="flex-1 backdrop-blur-sm bg-black/30 p-3">
              <PlayerArea
                player={currentPlayer}
                hand={playerHand}
                isOpponent={false}
                isCurrentTurn={isMyTurn}
                timeRemaining={gameState?.whiteTime || 0}
                selectedCard={selectedCard}
                onCardSelect={handleCardSelect}
                showCards={true}
                orientation="vertical"
              />
            </div>
          </div>

          {/* Center - Game Board with enhanced space for 2K */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900">
            <GameBoard demoMode={isDemoMode} />
          </div>


          {/* Game Sidebar (collapsible) - Optimized width for 2K */}
          {sidebarOpen && (
            <motion.div
              className="w-72 bg-slate-800 border-l border-slate-700"
              initial={{ x: 288 }}
              animate={{ x: 0 }}
              exit={{ x: 288 }}
              transition={{ duration: 0.3 }}
            >
              <GameSidebar
                onClose={() => setSidebarOpen(false)}
                gameState={gameState}
                currentPlayer={currentPlayer}
                opponent={opponent}
              />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Layout (1024px+)
  if (layout === 'desktop') {
    return (
      <div className={`h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col ${className}`}>
        {/* Header removed as requested */}

        {/* Main Game Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Combined players with card slots */}
          <div className="w-96 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900 border-r border-gray-800/50 flex flex-col shadow-2xl">
            {/* Opponent Area - Top half */}
            <div className="flex-1 border-b border-gray-800/50 backdrop-blur-sm bg-black/20 p-4">
              <PlayerArea
                player={opponent}
                hand={opponentHand}
                isOpponent={true}
                isCurrentTurn={!isMyTurn}
                timeRemaining={gameState?.blackTime || 0}
                showCards={true}
                orientation="vertical"
              />
            </div>

            {/* Current Player Area - Bottom half */}
            <div className="flex-1 backdrop-blur-sm bg-black/30 p-3">
              <PlayerArea
                player={currentPlayer}
                hand={playerHand}
                isOpponent={false}
                isCurrentTurn={isMyTurn}
                timeRemaining={gameState?.whiteTime || 0}
                selectedCard={selectedCard}
                onCardSelect={handleCardSelect}
                showCards={true}
                orientation="vertical"
              />
            </div>
          </div>

          {/* Center - Game Board */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900">
            <GameBoard demoMode={isDemoMode} />
          </div>


          {/* Game Sidebar (collapsible) */}
          {sidebarOpen && (
            <motion.div
              className="w-80 bg-slate-800 border-l border-slate-700"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.3 }}
            >
              <GameSidebar
                onClose={() => setSidebarOpen(false)}
                gameState={gameState}
                currentPlayer={currentPlayer}
                opponent={opponent}
              />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Tablet Layout (768px - 1023px)
  if (layout === 'tablet') {
    return (
      <div className={`h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col ${className}`}>
        {/* Header removed as requested */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Opponent Area - Top */}
          <div className="h-24 bg-slate-800 border-b border-slate-700">
            <PlayerArea
              player={opponent}
              hand={opponentHand}
              isOpponent={true}
              isCurrentTurn={!isMyTurn}
              timeRemaining={gameState?.blackTime || 0}
              showCards={false}
              orientation="horizontal"
              compact={true}
            />
          </div>

          {/* Game Board - Center */}
          <div className="flex-1 flex items-center justify-center">
            <GameBoard demoMode={isDemoMode} />
          </div>

          {/* Current Player Area - Bottom */}
          <div className="h-32 bg-slate-800 border-t border-slate-700">
            <PlayerArea
              player={currentPlayer}
              hand={playerHand}
              isOpponent={false}
              isCurrentTurn={isMyTurn}
              timeRemaining={gameState?.whiteTime || 0}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              showCards={true}
              orientation="horizontal"
              compact={true}
            />
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout (< 768px)
  return (
    <div className={`h-screen bg-gradient-to-br from-gray-900 to-slate-900 flex flex-col ${className}`}>
      {/* Header removed as requested */}

      {/* Game Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Opponent Info - Compact */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <div className="text-sm font-medium">{opponent?.username || 'Opponent'}</div>
              <div className="text-xs text-gray-500">{opponent?.rating || 1500}</div>
            </div>
          </div>
          <div className="text-lg font-mono font-bold">
            {Math.floor((gameState?.blackTime || 0) / 60)}:{String((gameState?.blackTime || 0) % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Game Board - Main Area */}
        <div className="flex-1 flex items-center justify-center">
          <GameBoard demoMode={isDemoMode} />
        </div>

        {/* Current Player Cards - Bottom */}
        <div className="h-28 bg-slate-800 border-t border-slate-700">
          <PlayerArea
            player={currentPlayer}
            hand={playerHand}
            isOpponent={false}
            isCurrentTurn={isMyTurn}
            timeRemaining={gameState?.whiteTime || 0}
            selectedCard={selectedCard}
            onCardSelect={handleCardSelect}
            showCards={true}
            orientation="horizontal"
            compact={true}
            mobile={true}
          />
        </div>
      </div>
    </div>
  );
};