import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardSquare } from './BoardSquare';
import { SkeminoLogo } from './SkeminoLogo';
import { ResponsiveBoardContainer } from './ResponsiveBoardContainer';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';
import type { BoardCell } from '../../../types/game';
import '../../../styles/board-dark-animations.css';

interface GameBoardProps {
  demoMode?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ demoMode = false }) => {
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
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(1200);
  const [is2K, setIs2K] = useState(false);

  // Responsive board sizing with performance optimization and 2K detection
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const container = boardRef.current.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          const screenWidth = window.innerWidth;

          // Detect 2K displays
          const is2KDisplay = screenWidth >= 1920 && screenWidth <= 2880 && window.innerHeight >= 1080;
          setIs2K(is2KDisplay);

          // Account for 1.4:1 aspect ratio of cells when calculating board size
          const size = Math.min(width * 0.98, (height * 0.98) / 1.4, 1400);
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
      ? ['1', '2', '3', '4', '5', '6']
      : ['6', '5', '4', '3', '2', '1'];

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
            size={(boardSize - (is2K ? 24 : 16)) / 6} // Account for enhanced 2K padding
          />
        );
      }
    }
    return squares;
  };


  return (
    <ResponsiveBoardContainer
      onSizeChange={setBoardSize}
      minSize={demoMode ? 300 : (is2K ? 600 : 400)}
      maxSize={demoMode ? 600 : (is2K ? 1000 : 800)}
      demoMode={demoMode}
    >
      {/* Game board container */}
      <div className="relative skemino-board" ref={boardRef}>
        <motion.div
          className={`relative bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl border-2 border-gray-700 skemino-board-dark ${is2K ? 'border-3' : ''}`}
          style={{
            width: boardSize,
            height: boardSize * 1.4, // Height accounts for 1.4:1 cell aspect ratio
            padding: is2K ? '12px' : '8px', // Enhanced padding for 2K
            background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%)',
            boxShadow: is2K
              ? '0 35px 70px -12px rgba(0, 0, 0, 0.9), 0 0 0 2px rgba(255, 255, 255, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.12)' // Enhanced shadows for 2K
              : '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            borderWidth: is2K ? '3px' : '2px' // Thicker borders for 2K visibility
          }}
          initial={{ scale: 1, opacity: 1, y: 0 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0,
            type: "tween"
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

          <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-6 z-30">
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

          {/* Coordinates removed */}



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