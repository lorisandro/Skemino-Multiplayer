import React, { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardSquare } from './BoardSquare';
import { PlayerHand } from '../Cards/PlayerHand';
import { GameControls } from '../GameUI/GameControls';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';
import type { BoardCell } from '../../../types/game';

export const GameBoard: React.FC = () => {
  const {
    gameState,
    currentPlayer,
    opponent,
    selectedCard,
    validMoves,
    isMyTurn,
    makeMove,
    selectCard,
  } = useGameStore();

  const { emitMove, connected } = useSocket();
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(600);

  // Responsive board sizing
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const container = boardRef.current.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          const size = Math.min(width * 0.9, height * 0.7, 800);
          setBoardSize(size);
        }
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  const handleSquareClick = (cell: BoardCell) => {
    if (!isMyTurn || !selectedCard || !validMoves.includes(cell)) return;

    // Make the move
    makeMove(selectedCard, cell);

    // Emit to server
    emitMove({
      card: selectedCard,
      to: cell,
    });

    // Play move sound
    playMoveSound();
  };

  const playMoveSound = () => {
    const audio = new Audio('/sounds/move.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const renderBoard = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f'];
    const ranks = currentPlayer?.color === 'white'
      ? ['6', '5', '4', '3', '2', '1']
      : ['1', '2', '3', '4', '5', '6'];

    return ranks.map((rank) => (
      <div key={rank} className="flex">
        {files.map((file) => {
          const cell = `${file}${rank}` as BoardCell;
          const position = gameState?.board.get(cell);
          const isValidMove = validMoves.includes(cell);
          const isVertex = ['a1', 'f1', 'a6', 'f6'].includes(cell);

          return (
            <BoardSquare
              key={cell}
              cell={cell}
              position={position}
              isValidMove={isValidMove}
              isVertex={isVertex}
              onClick={() => handleSquareClick(cell)}
              size={boardSize / 6}
            />
          );
        })}
      </div>
    ));
  };

  const renderCoordinates = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f'];
    const ranks = currentPlayer?.color === 'white'
      ? ['6', '5', '4', '3', '2', '1']
      : ['1', '2', '3', '4', '5', '6'];

    return (
      <>
        {/* File coordinates */}
        <div className="absolute -bottom-6 left-0 w-full flex">
          {files.map((file) => (
            <div
              key={file}
              className="flex-1 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
              style={{ width: `${boardSize / 6}px` }}
            >
              {file}
            </div>
          ))}
        </div>

        {/* Rank coordinates */}
        <div className="absolute -left-6 top-0 h-full flex flex-col">
          {ranks.map((rank) => (
            <div
              key={rank}
              className="flex-1 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400"
              style={{ height: `${boardSize / 6}px` }}
            >
              {rank}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        {/* Opponent's hand */}
        <div className="mb-4">
          <PlayerHand
            cards={currentPlayer?.color === 'white' ? gameState?.blackHand || [] : gameState?.whiteHand || []}
            player={opponent}
            isOpponent={true}
          />
        </div>

        {/* Game board */}
        <div className="relative mb-4" ref={boardRef}>
          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-2"
            style={{ width: boardSize, height: boardSize }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/10 to-amber-300/10 dark:from-amber-900/10 dark:to-amber-700/10 rounded-lg" />

            {/* Board grid */}
            <div className="relative z-10">
              {renderBoard()}
            </div>

            {/* Coordinates */}
            {renderCoordinates()}

            {/* Connection status */}
            {!connected && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                Disconnected
              </div>
            )}
          </motion.div>
        </div>

        {/* Current player's hand */}
        <div className="mb-4">
          <PlayerHand
            cards={currentPlayer?.color === 'white' ? gameState?.whiteHand || [] : gameState?.blackHand || []}
            player={currentPlayer}
            isOpponent={false}
            onCardSelect={selectCard}
            selectedCard={selectedCard}
            canSelect={isMyTurn}
          />
        </div>

        {/* Game controls */}
        <GameControls />
      </div>
    </DndProvider>
  );
};