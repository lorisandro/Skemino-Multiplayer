import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardSquare } from './BoardSquare';
import { SkeminoLogo } from './SkeminoLogo';
import { ZoomResistantBoardContainer } from './ZoomResistantBoardContainer';
import { useGameStore } from '../../../store/gameStore';
import { useSocket } from '../../../hooks/useSocket';
import { useBreakpoints } from '../../../hooks/useMediaQuery';
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
  const { currentBreakpoint, is2K } = useBreakpoints();

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

    // Generate all 36 squares for 6x6 grid with zoom-resistant approach
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
            zoomResistant={true} // Enable zoom-resistant mode
          />
        );
      }
    }
    return squares;
  };


  return (
    <ZoomResistantBoardContainer demoMode={demoMode}>
      {/* Zoom-resistant game board grid */}
      <div className="skemino-grid-zoom-resistant">
        {renderBoard()}
      </div>

      {/* Latency Indicator - Zoom Resistant */}
      {connected && latency && (
        <motion.div
          className={`
            absolute top-3 right-3 px-3 py-2 text-xs rounded-lg z-40 font-mono font-medium border
            ${latency < 50
              ? 'bg-black text-emerald-300 border-emerald-500/30'
              : latency < 100
                ? 'bg-black text-yellow-300 border-yellow-500/30'
                : 'bg-black text-red-300 border-red-500/30'
            }
          `}
          style={{
            // Use rem units for zoom resistance
            top: '0.75rem',
            right: '0.75rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center space-x-2">
            <span>{latency}ms</span>
          </div>
        </motion.div>
      )}
    </ZoomResistantBoardContainer>
  );
};