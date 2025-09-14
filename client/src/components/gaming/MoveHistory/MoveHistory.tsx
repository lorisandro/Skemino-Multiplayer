import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, RotateCcw, Download, Copy, Eye } from 'lucide-react';
import type { Move, Player } from '../../../types/game';

interface MoveHistoryProps {
  moves: Move[];
  currentPlayer: Player | null;
  onMoveClick?: (moveIndex: number) => void;
  showAnalysis?: boolean;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentPlayer,
  onMoveClick,
  showAnalysis = false
}) => {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest move
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [moves, autoScroll]);

  const handleMoveClick = (index: number) => {
    setSelectedMoveIndex(index);
    onMoveClick?.(index);
  };

  const copyMovesToClipboard = () => {
    const psnMoves = moves.map((move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      const isWhiteMove = index % 2 === 0;
      return isWhiteMove
        ? `${moveNumber}.${move.notation}`
        : move.notation;
    }).join(' ');

    navigator.clipboard.writeText(psnMoves);
  };

  const exportPSN = () => {
    const psnHeader = [
      `[Event "Skèmino Game"]`,
      `[Site "Skèmino Platform"]`,
      `[Date "${new Date().toISOString().split('T')[0]}"]`,
      `[White "${currentPlayer?.color === 'white' ? currentPlayer.username : 'Opponent'}"]`,
      `[Black "${currentPlayer?.color === 'black' ? currentPlayer.username : 'Opponent'}"]`,
      `[Result "*"]`,
      ``,
    ].join('\n');

    const psnMoves = moves.map((move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      const isWhiteMove = index % 2 === 0;
      return isWhiteMove
        ? `${moveNumber}.${move.notation}`
        : move.notation;
    }).join(' ');

    const fullPSN = psnHeader + psnMoves;

    const blob = new Blob([fullPSN], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skemino-game-${Date.now()}.psn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatMoveTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getMoveIcon = (move: Move): string => {
    switch (move.card.suit) {
      case 'P': return '🗿'; // Pietra
      case 'F': return '✂️'; // Forbici
      case 'C': return '📄'; // Carta
      default: return '❓';
    }
  };

  const MoveRow: React.FC<{ move: Move; index: number; isSelected: boolean }> = ({
    move,
    index,
    isSelected
  }) => (
    <motion.div
      className={`
        flex items-center space-x-3 p-2 rounded cursor-pointer transition-all duration-200
        ${isSelected
          ? 'bg-blue-600/30 border border-blue-500/50'
          : 'hover:bg-slate-700/50'
        }
        ${move.player === currentPlayer?.color ? 'border-l-2 border-l-blue-400' : 'border-l-2 border-l-red-400'}
      `}
      onClick={() => handleMoveClick(index)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Move Number */}
      <div className="w-8 text-xs text-slate-400 font-mono">
        {Math.floor(index / 2) + 1}
        {index % 2 === 0 ? '.' : '...'}
      </div>

      {/* Card Icon */}
      <div className="text-lg">
        {getMoveIcon(move)}
      </div>

      {/* Move Notation */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm text-white">
          {move.notation}
        </div>
        {move.capturedCard && (
          <div className="text-xs text-red-400">
            Captured: {move.capturedCard.suit}{move.capturedCard.value}
          </div>
        )}
      </div>

      {/* Player Color */}
      <div className={`
        w-3 h-3 rounded-full
        ${move.player === 'white' ? 'bg-gray-200' : 'bg-gray-800 border border-gray-600'}
      `} />

      {/* Time */}
      <div className="text-xs text-slate-400 font-mono">
        {formatMoveTime(move.timestamp)}
      </div>

      {/* Analysis Indicator */}
      {showAnalysis && (
        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
      )}
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-800/30 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Move History</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`
                p-1 rounded transition-colors
                ${autoScroll ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-300'}
              `}
              title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
            >
              {autoScroll ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={copyMovesToClipboard}
              className="p-1 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              title="Copy moves to clipboard"
            >
              <Copy className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={exportPSN}
              className="p-1 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              title="Export PSN file"
            >
              <Download className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="mt-2 flex items-center space-x-4 text-xs text-slate-400">
          <span>Moves: {moves.length}</span>
          <span>Turn: {Math.ceil(moves.length / 2)}</span>
          {moves.length > 0 && (
            <span>Last: {formatMoveTime(moves[moves.length - 1].timestamp)}</span>
          )}
        </div>
      </div>

      {/* Moves List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-2 space-y-1"
      >
        <AnimatePresence>
          {moves.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-400 mt-8"
            >
              <Eye className="w-8 h-8 mx-auto mb-2" />
              <p>Game hasn't started yet</p>
              <p className="text-sm">Moves will appear here</p>
            </motion.div>
          ) : (
            moves.map((move, index) => (
              <motion.div
                key={move.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MoveRow
                  move={move}
                  index={index}
                  isSelected={selectedMoveIndex === index}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {moves.length > 0 && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedMoveIndex(null)}
              className="flex items-center space-x-2 px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Current Position</span>
            </button>

            <div className="text-xs text-slate-400">
              PSN Format • Click moves to review
            </div>
          </div>
        </div>
      )}
    </div>
  );
};