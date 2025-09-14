import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Move } from '../../../types/game';

interface SimpleMoveHistoryProps {
  moves: Move[];
  currentMoveIndex?: number;
  onMoveClick?: (moveIndex: number) => void;
  compact?: boolean;
  className?: string;
}

/**
 * Simple MoveHistory component - Basic move history display
 */
export const SimpleMoveHistory: React.FC<SimpleMoveHistoryProps> = ({
  moves,
  currentMoveIndex = moves.length,
  onMoveClick,
  compact = false,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest move
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  // Group moves by turn (white + black = 1 turn)
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    const turnNumber = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];

    groupedMoves.push({
      turnNumber,
      whiteMove,
      blackMove,
    });
  }

  // Handle move click
  const handleMoveClick = (moveIndex: number) => {
    if (onMoveClick) {
      onMoveClick(moveIndex);
    }
  };

  // Format move notation for display
  const formatMove = (move: Move) => {
    return move.notation;
  };

  // Get move timing
  const getMoveTiming = (move: Move) => {
    return new Date(move.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (compact) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Move History</h3>
        </div>

        <div ref={scrollRef} className="h-40 overflow-y-auto p-2">
          {moves.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-4">
              No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {moves.map((move, index) => (
                <motion.div
                  key={move.id}
                  className={`
                    px-2 py-1 rounded text-xs font-mono cursor-pointer
                    ${index === currentMoveIndex - 1 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                  `}
                  onClick={() => handleMoveClick(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span>{Math.floor(index / 2) + 1}.{index % 2 === 1 ? '..' : ''} {formatMove(move)}</span>
                    <span className="text-gray-400">{getMoveTiming(move)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full desktop layout
  return (
    <div className={`bg-white ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Move History</h3>
        <p className="text-sm text-gray-500">Click on any move to review position</p>
      </div>

      <div ref={scrollRef} className="h-96 overflow-y-auto">
        {moves.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🎯</div>
            <div>No moves yet</div>
            <div className="text-sm">Game will begin shortly...</div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {groupedMoves.map((turn) => (
              <div key={turn.turnNumber} className="flex items-center space-x-2">
                {/* Turn number */}
                <div className="w-8 text-sm font-semibold text-gray-500 text-right">
                  {turn.turnNumber}.
                </div>

                {/* White move */}
                <motion.div
                  className={`
                    flex-1 px-3 py-2 rounded-lg font-mono text-sm cursor-pointer border
                    ${turn.whiteMove && moves.indexOf(turn.whiteMove) === currentMoveIndex - 1
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => turn.whiteMove && handleMoveClick(moves.indexOf(turn.whiteMove))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span>{turn.whiteMove ? formatMove(turn.whiteMove) : '...'}</span>
                    {turn.whiteMove && (
                      <span className="text-xs text-gray-400">
                        {getMoveTiming(turn.whiteMove)}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Black move */}
                <motion.div
                  className={`
                    flex-1 px-3 py-2 rounded-lg font-mono text-sm cursor-pointer border
                    ${turn.blackMove && moves.indexOf(turn.blackMove) === currentMoveIndex - 1
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => turn.blackMove && handleMoveClick(moves.indexOf(turn.blackMove))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span>{turn.blackMove ? formatMove(turn.blackMove) : '...'}</span>
                    {turn.blackMove && (
                      <span className="text-xs text-gray-400">
                        {getMoveTiming(turn.blackMove)}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move history footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total moves: {moves.length}</span>
          <span>Current: {currentMoveIndex}</span>
        </div>
      </div>
    </div>
  );
};