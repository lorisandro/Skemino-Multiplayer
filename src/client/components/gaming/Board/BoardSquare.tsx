import React, { memo, useMemo } from 'react';

interface BoardSquareProps {
  position: string;
  row: number;
  col: number;
  card?: any;
  onClick: () => void;
  isHighlighted: boolean;
  isSelected: boolean;
  isPlayerTurn: boolean;
}

const VERTEX_COLORS = {
  'a1': { bg: '#1e1e1e', circle: '#5DADE2' }, // Azzurro
  'f1': { bg: '#1e1e1e', circle: '#58D68D' }, // Verde
  'a6': { bg: '#1e1e1e', circle: '#EC7063' }, // Rosso
  'f6': { bg: '#1e1e1e', circle: '#F4D03F' }  // Giallo
};

export const BoardSquare = memo(({
  position,
  row,
  col,
  card,
  onClick,
  isHighlighted,
  isSelected,
  isPlayerTurn
}: BoardSquareProps) => {
  const isVertex = VERTEX_COLORS[position as keyof typeof VERTEX_COLORS];

  const squareStyle = useMemo(() => {
    if (isVertex) {
      return {
        backgroundColor: isVertex.bg,
        position: 'relative' as const
      };
    }

    // Pattern alternato per caselle standard
    const isBlackSquare = (row + col) % 2 === 0;
    return {
      backgroundColor: isBlackSquare ? '#f0f0f0' : '#ffffff'
    };
  }, [row, col, isVertex]);

  const handleClick = () => {
    if (isPlayerTurn) {
      onClick();
    }
  };

  return (
    <div
      className={`
        board-square
        ${isHighlighted ? 'square-highlighted' : ''}
        ${isSelected ? 'square-selected' : ''}
        ${isPlayerTurn ? 'square-interactive' : ''}
        ${card ? 'square-occupied' : ''}
      `}
      style={squareStyle}
      onClick={handleClick}
      data-position={position}
    >
      {/* Vertex circle */}
      {isVertex && (
        <div
          className="vertex-circle"
          style={{
            backgroundColor: isVertex.circle,
            boxShadow: `0 0 20px ${isVertex.circle}40`
          }}
        />
      )}

      {/* Position label */}
      <div className="square-label">
        {position}
      </div>

      {/* Card display */}
      {card && (
        <div className="card-display">
          <span className="card-symbol">{card.symbol}</span>
          <span className="card-number">{card.number}</span>
        </div>
      )}
    </div>
  );
});

BoardSquare.displayName = 'BoardSquare';