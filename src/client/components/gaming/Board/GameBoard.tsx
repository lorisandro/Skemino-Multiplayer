import React, { memo, useMemo } from 'react';
import { BoardSquare } from './BoardSquare';

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

  // Funzione helper per determinare se una casella è un vertice speciale
  const isSpecialVertex = (position: string) => {
    return ['a1', 'f1', 'a6', 'f6'].includes(position);
  };

  // Funzione helper per ottenere il colore del cerchio per i vertici speciali
  const getVertexCircleColor = (position: string) => {
    const colors = {
      'a1': '#5DADE2', // azzurro
      'f1': '#58D68D', // verde
      'a6': '#EC7063', // rosso
      'f6': '#F4D03F'  // giallo
    };
    return colors[position as keyof typeof colors];
  };

  // Funzione helper per determinare se una casella fa parte del diamante centrale
  const isCentralDiamond = (position: string) => {
    return ['c3', 'd3', 'c4', 'd4'].includes(position);
  };

  const boardSquares = useMemo(() => {
    const squares = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const position = `${String.fromCharCode(97 + col)}${6 - row}`;
        const isHighlighted = highlightedSquares.has(position);
        const isSelected = selectedSquare === position;
        const isVertex = isSpecialVertex(position);
        const isDiamond = isCentralDiamond(position);

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
            isSpecialVertex={isVertex}
            vertexColor={isVertex ? getVertexCircleColor(position) : undefined}
            isCentralDiamond={isDiamond}
          />
        );
      }
    }
    return squares;
  }, [gameState, highlightedSquares, selectedSquare, isPlayerTurn, onSquareClick]);

  return (
    <div className="skemino-board-container">

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

          {/* Diamante centrale con triangoli colorati e logo */}
          <div className="central-diamond">
            {/* Triangoli colorati */}
            <div className="diamond-triangle triangle-north" />
            <div className="diamond-triangle triangle-east" />
            <div className="diamond-triangle triangle-south" />
            <div className="diamond-triangle triangle-west" />

            {/* Logo Skèmino centrale */}
            <div className="skemino-logo">
              <span className="logo-text">Skèmino</span>
            </div>
          </div>
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