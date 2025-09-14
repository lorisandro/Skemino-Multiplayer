import React from 'react';
import { GameBoard } from './GameBoard';

export const BoardDemo = () => {
  const mockGameState = {
    board: Array(6).fill(null).map(() => Array(6).fill(null))
  };

  const handleSquareClick = (row: number, col: number, position: string) => {
    console.log(`Square clicked: ${position} (${row}, ${col})`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <GameBoard
        gameState={mockGameState}
        onSquareClick={handleSquareClick}
        highlightedSquares={new Set(['d3', 'e4'])}
        selectedSquare="c2"
        isPlayerTurn={true}
      />
    </div>
  );
};