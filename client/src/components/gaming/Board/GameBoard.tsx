import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardSquare } from './BoardSquare';
import { SkeminoLogo } from './SkeminoLogo';
import { ResponsiveBoardContainer } from './ResponsiveBoardContainer';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';
import { useGamePerformance, PerformanceUtils } from '../../../hooks/performance';
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

  const { emitMove, connected, latency } = useSocket();
  const { fps, isOptimal, frameTime, memoryUsage } = useGamePerformance();
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(800);

  // Responsive board sizing with performance optimization
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const container = boardRef.current.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          const size = PerformanceUtils.getOptimalBoardSize(width, height, fps);
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
        {/* File coordinates - Enhanced for gaming */}
        <div className="absolute -bottom-8 left-0 w-full flex z-40">
          {files.map((file) => (
            <div
              key={file}
              className="flex-1 text-center text-sm font-bold text-gray-800 bg-white/80 backdrop-blur-sm rounded-full mx-1 py-1"
              style={{ width: `${boardSize / 6}px` }}
            >
              {file}
            </div>
          ))}
        </div>

        {/* Rank coordinates - Enhanced for gaming */}
        <div className="absolute -left-8 top-0 h-full flex flex-col z-40">
          {ranks.map((rank) => (
            <div
              key={rank}
              className="flex-1 flex items-center justify-center text-sm font-bold text-gray-800 bg-white/80 backdrop-blur-sm rounded-full my-1 px-1"
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
    <ResponsiveBoardContainer
      onSizeChange={setBoardSize}
      minSize={400}
      maxSize={800}
    >
      {/* Game board container */}
      <div className="relative skemino-board" ref={boardRef}>
        <motion.div
          className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-2xl p-1 border-2 border-gray-300 skemino-responsive"
          style={{
            width: boardSize,
            height: boardSize,
            animation: 'board-appear 0.5s ease-out'
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Board background with Skèmino styling */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-gray-100/30 rounded-lg" />

          {/* Board grid */}
          <div className="relative z-10 border border-gray-400 rounded">
            {renderBoard()}
          </div>


          {/* Vertex control indicators */}
          <div className="absolute -top-8 left-0 right-0 flex justify-between px-4 z-30">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-gray-700">Q I</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-700">Q II</span>
            </div>
          </div>

          <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-4 z-30">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Q III</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Q IV</span>
            </div>
          </div>

          {/* Coordinates */}
          {renderCoordinates()}

          {/* Connection status */}
          {!connected && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse z-40">
              Disconnected
            </div>
          )}

          {/* Performance indicator */}
          <div className={`
            absolute top-2 left-2 px-2 py-1 text-xs rounded z-40 font-mono
            ${isOptimal ? 'bg-green-900/80 text-green-300' : 'bg-red-900/80 text-red-300'}
          `}>
            {fps}FPS
          </div>
        </motion.div>
      </div>

      {/* Board statistics for competitive gaming */}
      <div className="mt-4 flex space-x-6 text-sm text-gray-600 skemino-ui-text">
        <div className="flex items-center space-x-1">
          <span className="font-medium">Latency:</span>
          <span className={`font-mono ${connected && latency && latency < 100 ? 'text-green-600' : 'text-red-600'}`}>
            {connected && latency ? `${latency}ms` : 'N/A'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-medium">Board:</span>
          <span className="font-mono text-blue-600">6×6</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-medium">Vertices:</span>
          <span className="font-mono text-purple-600">4 Active</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-medium">Performance:</span>
          <span className={`font-mono ${isOptimal ? 'text-green-600' : 'text-yellow-600'}`}>
            {fps}FPS • {frameTime.toFixed(1)}ms
          </span>
        </div>
        {memoryUsage && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">Memory:</span>
            <span className="font-mono text-blue-600">{memoryUsage}MB</span>
          </div>
        )}
      </div>
    </ResponsiveBoardContainer>
  );
};