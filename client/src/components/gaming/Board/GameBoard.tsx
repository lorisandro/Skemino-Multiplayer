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
  const [boardSize, setBoardSize] = useState(1600);

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

    // Generate all 36 squares for 6x6 grid
    const squares = [];
    for (const rank of ranks) {
      for (const file of files) {
        const cell = `${file}${rank}` as BoardCell;
        const position = gameState?.board.get(cell);
        const isValidMove = validMoves.includes(cell);
        const isVertex = ['a1', 'f1', 'a6', 'f6'].includes(cell);

        squares.push(
          <BoardSquare
            key={cell}
            cell={cell}
            position={position}
            isValidMove={isValidMove}
            isVertex={isVertex}
            onClick={() => handleSquareClick(cell)}
            size={(boardSize - 16) / 6} // Account for padding
          />
        );
      }
    }
    return squares;
  };


  return (
    <ResponsiveBoardContainer
      onSizeChange={setBoardSize}
      minSize={800}
      maxSize={2000}
    >
      {/* Game board container */}
      <div className="relative skemino-board" ref={boardRef}>
        <motion.div
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl border-2 border-gray-700 skemino-board-dark"
          style={{
            width: boardSize,
            height: boardSize,
            padding: '8px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            animation: 'board-appear-dark 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {/* Dark Gaming Background with Professional Finish */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-gray-900/20 rounded-xl" />

          {/* Professional Gaming Border Inner Glow */}
          <div className="absolute inset-1 rounded-lg ring-1 ring-white/5" />

          {/* Board Grid Dark Professional Gaming */}
          <div className="relative z-10 border border-gray-600 rounded-lg overflow-hidden bg-gray-900/20 backdrop-blur-sm">
            <div className="grid grid-cols-6 grid-rows-6 gap-0 p-0">
              {renderBoard()}
            </div>
          </div>


          {/* Vertex Control Indicators Dark Gaming */}
          <div className="absolute -top-10 left-0 right-0 flex justify-between px-6 z-30">
            <motion.div
              className="flex items-center space-x-3 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-cyan-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse"></div>
              <span className="text-cyan-300 font-semibold text-sm tracking-wide">Q I</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-3 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse"></div>
              <span className="text-emerald-300 font-semibold text-sm tracking-wide">Q II</span>
            </motion.div>
          </div>

          <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-6 z-30">
            <motion.div
              className="flex items-center space-x-3 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
              <span className="text-red-300 font-semibold text-sm tracking-wide">Q III</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-3 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              <span className="text-yellow-300 font-semibold text-sm tracking-wide">Q IV</span>
            </motion.div>
          </div>

          {/* Coordinates removed */}

          {/* Connection Status Dark Gaming */}
          {!connected && (
            <motion.div
              className="absolute top-3 right-3 px-3 py-2 bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg animate-pulse z-40 border border-red-400/50 shadow-lg shadow-red-500/50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                <span className="font-medium">Disconnected</span>
              </div>
            </motion.div>
          )}

          {/* Performance Indicator Dark Gaming */}
          <motion.div
            className={`
              absolute top-3 left-3 px-3 py-2 text-xs rounded-lg z-40 font-mono font-medium backdrop-blur-sm border shadow-lg
              ${isOptimal
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/30'
                : fps > 30
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-yellow-500/30'
                  : 'bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/30'
              }
            `}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOptimal ? 'bg-emerald-400' : fps > 30 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
              <span>{fps}FPS</span>
            </div>
          </motion.div>

          {/* Latency Indicator Dark Gaming */}
          {connected && latency && (
            <motion.div
              className={`
                absolute top-3 right-3 px-3 py-2 text-xs rounded-lg z-40 font-mono font-medium backdrop-blur-sm border shadow-lg
                ${latency < 50
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/30'
                  : latency < 100
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/30'
                }
              `}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${latency < 50 ? 'bg-emerald-400' : latency < 100 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                <span>{latency}ms</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

    </ResponsiveBoardContainer>
  );
};