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
  // Check if this is a vertex cell
  const isVertex = ['a1', 'f1', 'a6', 'f6'].includes(position);

  // Check if this is a central diamond cell
  const isDiamond = ['c3', 'c4', 'd3', 'd4'].includes(position);

  const squareStyle = useMemo(() => {
    // Vertex cells - black background
    if (isVertex) {
      return {
        background: '#000000',
        position: 'relative' as const,
        border: '1px solid #666'
      };
    }

    // Central diamond cells - black background
    if (isDiamond) {
      return {
        background: '#000000',
        border: '1px solid #666',
        position: 'relative' as const
      };
    }

    // Alternating white/gray pattern for standard cells
    const file = position.charCodeAt(0) - 97; // a=0, b=1, etc.
    const rank = parseInt(position[1]) - 1; // 1=0, 2=1, etc.
    const isLight = (file + rank) % 2 === 0;

    return {
      background: isLight ? '#ffffff' : '#f5f5f5',
      border: '1px solid #cccccc'
    };
  }, [position, isVertex, isDiamond]);

  const handleClick = () => {
    if (isPlayerTurn) {
      onClick();
    }
  };

  // Get vertex circle color
  const getVertexColor = () => {
    switch (position) {
      case 'a1': return '#4A90E2'; // Blue
      case 'f1': return '#7ED321'; // Green
      case 'a6': return '#D0021B'; // Red
      case 'f6': return '#F5A623'; // Yellow
      default: return 'transparent';
    }
  };

  return (
    <div
      className={`
        board-square
        ${isVertex ? 'square-vertex' : ''}
        ${isDiamond ? 'square-diamond' : ''}
        ${isHighlighted ? 'square-highlighted' : ''}
        ${isSelected ? 'square-selected' : ''}
        ${isPlayerTurn ? 'square-interactive' : ''}
        ${card ? 'square-occupied' : ''}
      `}
      style={squareStyle}
      onClick={handleClick}
      data-position={position}
    >
      {/* Vertex colored circle */}
      {isVertex && (
        <div
          className="vertex-circle"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            backgroundColor: getVertexColor(),
          }}
        />
      )}

      {/* Position label - commented out for production */}
      {/* <div className="square-label" style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        fontSize: '10px',
        color: (isVertex || isDiamond) ? '#ffffff' : '#999999',
        opacity: 0.5
      }}>
        {position}
      </div> */}

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