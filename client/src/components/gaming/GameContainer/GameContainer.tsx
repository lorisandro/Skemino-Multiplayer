import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBoard } from '../Board/GameBoard';
import { PlayerPanel } from '../PlayerPanel/PlayerPanel';
import { GameTimer } from '../Timer/GameTimer';
import { MoveHistory } from '../MoveHistory/MoveHistory';
import { GameChat } from '../Chat/GameChat';
import { GameControls } from '../Controls/GameControls';
import { HandDisplay } from '../Cards/HandDisplay';
import { GameStatus } from '../Status/GameStatus';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';

export const GameContainer: React.FC = () => {
  const {
    gameState,
    currentPlayer,
    opponent,
    isMyTurn
  } = useGameStore();

  const { connected, latency } = useSocket();
  const [showChat, setShowChat] = useState(true);
  const [showMoveHistory, setShowMoveHistory] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Top Status Bar - Chess.com Style */}
      <div className="h-16 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-6">
        <GameStatus
          connected={connected}
          latency={latency}
          gameState={gameState}
        />
      </div>

      {/* Main Gaming Interface */}
      <div className="flex-1 flex">
        {/* Left Panel - Player Info & Controls */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 flex flex-col">
          {/* Opponent Panel */}
          <div className="p-4 border-b border-slate-700">
            <PlayerPanel
              player={opponent}
              isOpponent={true}
              gameState={gameState}
            />
          </div>

          {/* Game Timer */}
          <div className="p-4 border-b border-slate-700">
            <GameTimer
              whiteTime={gameState?.whiteTime || 0}
              blackTime={gameState?.blackTime || 0}
              currentTurn={gameState?.currentTurn || 'white'}
              isMyTurn={isMyTurn}
            />
          </div>

          {/* Game Controls */}
          <div className="p-4 border-b border-slate-700">
            <GameControls
              gameState={gameState}
              isMyTurn={isMyTurn}
            />
          </div>

          {/* Current Player Panel */}
          <div className="flex-1 p-4">
            <PlayerPanel
              player={currentPlayer}
              isOpponent={false}
              gameState={gameState}
            />
          </div>
        </div>

        {/* Center - Game Board Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Opponent Hand */}
          <div className="mb-4">
            <HandDisplay
              cards={gameState?.blackHand || []}
              isOpponent={true}
              playerColor="black"
            />
          </div>

          {/* Game Board */}
          <div className="relative">
            <GameBoard />
          </div>

          {/* Current Player Hand */}
          <div className="mt-4">
            <HandDisplay
              cards={gameState?.whiteHand || []}
              isOpponent={false}
              playerColor="white"
            />
          </div>
        </div>

        {/* Right Panel - History & Chat */}
        <div className="w-96 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setShowMoveHistory(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                showMoveHistory
                  ? 'bg-slate-600 text-white border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Move History
            </button>
            <button
              onClick={() => setShowMoveHistory(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                !showMoveHistory
                  ? 'bg-slate-600 text-white border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {showMoveHistory ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <MoveHistory
                    moves={gameState?.moveHistory || []}
                    currentPlayer={currentPlayer}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <GameChat
                    gameId={gameState?.board ? 'game-1' : ''}
                    currentPlayer={currentPlayer}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};