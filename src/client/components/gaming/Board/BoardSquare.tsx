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
  'a1': { bg: 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 50%, #e0e0e0 100%)', circle: '#5DADE2' }, // Azzurro su grigio chiaro
  'f1': { bg: 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 50%, #e0e0e0 100%)', circle: '#58D68D' }, // Verde su grigio chiaro
  'a6': { bg: 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 50%, #e0e0e0 100%)', circle: '#EC7063' }, // Rosso su grigio chiaro
  'f6': { bg: 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 50%, #e0e0e0 100%)', circle: '#F4D03F' }  // Giallo su grigio chiaro
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
        border: '1px solid #999'
      };
    }

    // Caselle del diamante centrale - grigio chiaro come le altre
    if (isCentralDiamond) {
      return {
        background: 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 50%, #e0e0e0 100%)',
        border: '1px solid #999',
        position: 'relative' as const
      };
    }

    // Celle grigio chiaro/bianche uniformi con gradiente al centro come richiesto - TUTTE uniformi
    return {
      background: 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 50%, #e0e0e0 100%)', // Gradiente chiaro uniforme per tutte le celle
      border: '1px solid #999'
    };
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
          squareStyle.background + ', radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)'
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