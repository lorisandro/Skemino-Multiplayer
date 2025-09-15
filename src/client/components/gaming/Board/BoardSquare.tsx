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
  isSpecialVertex?: boolean;
  vertexColor?: string;
  isCentralDiamond?: boolean;
}

const VERTEX_COLORS = {
  'a1': { bg: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #4a4a4a 100%)', circle: '#5DADE2' }, // Azzurro su grigio uniforme
  'f1': { bg: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #4a4a4a 100%)', circle: '#58D68D' }, // Verde su grigio uniforme
  'a6': { bg: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #4a4a4a 100%)', circle: '#EC7063' }, // Rosso su grigio uniforme
  'f6': { bg: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #4a4a4a 100%)', circle: '#F4D03F' }  // Giallo su grigio uniforme
};

export const BoardSquare = memo(({
  position,
  row,
  col,
  card,
  onClick,
  isHighlighted,
  isSelected,
  isPlayerTurn,
  isSpecialVertex,
  vertexColor,
  isCentralDiamond
}: BoardSquareProps) => {
  const isVertex = VERTEX_COLORS[position as keyof typeof VERTEX_COLORS];

  const squareStyle = useMemo(() => {
    if (isVertex) {
      return {
        background: isVertex.bg,
        position: 'relative' as const,
        border: '1px solid #666'
      };
    }

    // Caselle del diamante centrale - grigio uniforme come le altre
    if (isCentralDiamond) {
      return {
        background: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #4a4a4a 100%)',
        border: '1px solid #666',
        position: 'relative' as const
      };
    }

    // Celle grigie uniformi con gradiente al centro come richiesto
    const isDark = (row + col) % 2 === 0;
    if (isDark) {
      return {
        background: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #4a4a4a 100%)', // Caselle grigie uniformi
        border: '1px solid #666'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #5a5a5a 0%, #4a4a4a 50%, #5a5a5a 100%)', // Caselle grigie chiare uniformi
        border: '1px solid #666'
      };
    }
  }, [row, col, isVertex, isCentralDiamond]);

  const handleClick = () => {
    if (isPlayerTurn) {
      onClick();
    }
  };

  return (
    <div
      className={`
        board-square
        ${isVertex ? 'square-vertex' : ''}
        ${isCentralDiamond ? 'square-central-diamond' : ''}
        ${isHighlighted ? 'square-highlighted' : ''}
        ${isSelected ? 'square-selected' : ''}
        ${isPlayerTurn ? 'square-interactive' : ''}
        ${card ? 'square-occupied' : ''}
      `}
      style={{
        ...squareStyle,
        background: isVertex ? squareStyle.background :
          isCentralDiamond ? squareStyle.background :
          squareStyle.background + ', radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%)'
      }}
      onClick={handleClick}
      data-position={position}
    >
      {/* Vertex circle */}
      {isVertex && (
        <div
          className="vertex-circle"
          style={{
            backgroundColor: isVertex.circle,
            boxShadow: `0 0 25px ${isVertex.circle}60, inset 0 0 10px rgba(255,255,255,0.3)`
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