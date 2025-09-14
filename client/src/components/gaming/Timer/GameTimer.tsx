import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, Play, Pause } from 'lucide-react';
import type { PlayerColor } from '../../../types/game';

interface GameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: PlayerColor;
  isMyTurn: boolean;
  timeControl?: string;
  increment?: number;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  whiteTime,
  blackTime,
  currentTurn,
  isMyTurn,
  timeControl = '5+3',
  increment = 3
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [lowTimeWarning, setLowTimeWarning] = useState<PlayerColor | null>(null);

  // Check for low time warnings
  useEffect(() => {
    if (whiteTime <= 30) {
      setLowTimeWarning('white');
    } else if (blackTime <= 30) {
      setLowTimeWarning('black');
    } else {
      setLowTimeWarning(null);
    }
  }, [whiteTime, blackTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimePercentage = (time: number, maxTime: number = 300): number => {
    return Math.max(0, Math.min(100, (time / maxTime) * 100));
  };

  const TimerDisplay: React.FC<{
    time: number;
    color: PlayerColor;
    isActive: boolean;
    isLowTime: boolean;
  }> = ({ time, color, isActive, isLowTime }) => (
    <motion.div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${isActive
          ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-400 shadow-lg shadow-blue-400/20'
          : 'bg-slate-700/50 border-slate-600'
        }
        ${isLowTime && isActive ? 'animate-pulse' : ''}
      `}
      animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
    >
      {/* Player Color Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`
            w-3 h-3 rounded-full
            ${color === 'white' ? 'bg-gray-200' : 'bg-gray-800 border border-gray-600'}
          `} />
          <span className="text-sm font-medium text-slate-300 capitalize">
            {color}
          </span>
        </div>
        {isActive && (
          <Play className="w-4 h-4 text-green-400" />
        )}
      </div>

      {/* Time Display */}
      <div className={`
        text-2xl font-mono font-bold text-center
        ${isLowTime ? 'text-red-400' : 'text-white'}
      `}>
        {formatTime(time)}
      </div>

      {/* Time Bar */}
      <div className="mt-2 w-full bg-slate-600 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`
            h-full rounded-full transition-all duration-300
            ${isLowTime
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : isActive
                ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                : 'bg-gradient-to-r from-slate-500 to-slate-400'
            }
          `}
          style={{ width: `${getTimePercentage(time)}%` }}
          animate={isLowTime && isActive ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
          transition={{ duration: 0.5, repeat: isLowTime && isActive ? Infinity : 0 }}
        />
      </div>

      {/* Low Time Warning */}
      {isLowTime && isActive && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <AlertCircle className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Timer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">Game Timer</span>
        </div>
        <div className="text-xs text-slate-400">
          {timeControl} (+{increment}s)
        </div>
      </div>

      {/* Black Timer (Opponent - Top) */}
      <TimerDisplay
        time={blackTime}
        color="black"
        isActive={currentTurn === 'black'}
        isLowTime={lowTimeWarning === 'black'}
      />

      {/* Timer Controls */}
      <div className="flex items-center justify-center space-x-4 py-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
          disabled={!isMyTurn}
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* White Timer (Current Player - Bottom) */}
      <TimerDisplay
        time={whiteTime}
        color="white"
        isActive={currentTurn === 'white'}
        isLowTime={lowTimeWarning === 'white'}
      />

      {/* Move Increment Indicator */}
      {increment > 0 && (
        <div className="text-center text-xs text-slate-400">
          +{increment}s per move
        </div>
      )}

      {/* Critical Time Warning */}
      {lowTimeWarning && (
        <motion.div
          className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-sm text-red-300 font-medium">
            {lowTimeWarning === 'white' ? 'Your time' : 'Opponent\'s time'} is running low!
          </div>
        </motion.div>
      )}
    </div>
  );
};