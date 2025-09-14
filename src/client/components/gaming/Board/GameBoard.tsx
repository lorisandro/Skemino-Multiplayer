import React, { memo, useMemo } from 'react';
import { BoardSquare } from './BoardSquare';
import { SkeminoLogo } from './SkeminoLogo';
import { useGamePerformance } from '../../../hooks/useGamePerformance';

interface GameBoardProps {
  gameState?: any;
  onSquareClick?: (row: number, col: number, position: string) => void;
  highlightedSquares?: Set<string>;
  selectedSquare?: string | null;
  isPlayerTurn?: boolean;
}

export const GameBoard = memo(({
  gameState,
  onSquareClick,
  highlightedSquares = new Set(),
  selectedSquare = null,
  isPlayerTurn = false
}: GameBoardProps) => {
  const { fps, latency, memoryUsage } = useGamePerformance();

  const boardSquares = useMemo(() => {
    const squares = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const position = `${String.fromCharCode(97 + col)}${6 - row}`;
        const isHighlighted = highlightedSquares.has(position);
        const isSelected = selectedSquare === position;

        squares.push(
          <BoardSquare
            key={position}
            position={position}
            row={row}
            col={col}
            card={gameState?.board?.[row]?.[col]}
            onClick={() => isPlayerTurn && onSquareClick?.(row, col, position)}
            isHighlighted={isHighlighted}
            isSelected={isSelected}
            isPlayerTurn={isPlayerTurn}
          />
        );
      }
    }
    return squares;
  }, [gameState, highlightedSquares, selectedSquare, isPlayerTurn, onSquareClick]);

  return (
    <div className="skemino-board-container">
      <div className="performance-overlay">
        <span className="fps-counter" data-fps={fps}>FPS: {fps}</span>
        <span className="latency-indicator">Latency: {latency}ms</span>
        <span className="memory-usage">Memory: {memoryUsage}MB</span>
      </div>

      {/* Coordinate Labels - Top */}
      <div className="coordinates-top">
        {['a', 'b', 'c', 'd', 'e', 'f'].map(letter => (
          <span key={`top-${letter}`} className="coord-label">{letter}</span>
        ))}
      </div>

      {/* Coordinate Labels - Left */}
      <div className="coordinates-left">
        {[6, 5, 4, 3, 2, 1].map(number => (
          <span key={`left-${number}`} className="coord-label">{number}</span>
        ))}
      </div>

      {/* Coordinate Labels - Right */}
      <div className="coordinates-right">
        {[6, 5, 4, 3, 2, 1].map(number => (
          <span key={`right-${number}`} className="coord-label">{number}</span>
        ))}
      </div>

      <div className="game-board-wrapper">
        <div className="game-board">
          {boardSquares}
          <SkeminoLogo />
        </div>
      </div>

      {/* Coordinate Labels - Bottom */}
      <div className="coordinates-bottom">
        {['a', 'b', 'c', 'd', 'e', 'f'].map(letter => (
          <span key={`bottom-${letter}`} className="coord-label">{letter}</span>
        ))}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';