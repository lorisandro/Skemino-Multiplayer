import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeRemaining: number; // in seconds
  isActive: boolean;
  compact?: boolean;
  mobile?: boolean;
  warning?: number; // seconds for warning (default 30)
  danger?: number; // seconds for danger (default 10)
  onTimeUp?: () => void;
  className?: string;
}

/**
 * Timer component - Chess-style game timer with visual warnings
 */
export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isActive,
  compact = false,
  mobile = false,
  warning = 30,
  danger = 10,
  onTimeUp,
  className = '',
}) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  // Update display time
  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  // Handle time up
  useEffect(() => {
    if (displayTime <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [displayTime, onTimeUp]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';

    if (mobile) {
      return `${sign}${minutes}:${String(secs).padStart(2, '0')}`;
    }

    return `${sign}${minutes}:${String(secs).padStart(2, '0')}`;
  };

  // Get timer style based on time remaining
  const getTimerStyle = () => {
    if (displayTime <= 0) {
      return {
        bg: 'bg-red-600',
        text: 'text-white',
        border: 'border-red-600',
        ring: 'ring-red-200'
      };
    }

    if (displayTime <= danger) {
      return {
        bg: 'bg-red-500',
        text: 'text-white',
        border: 'border-red-500',
        ring: 'ring-red-200'
      };
    }

    if (displayTime <= warning) {
      return {
        bg: 'bg-yellow-500',
        text: 'text-white',
        border: 'border-yellow-500',
        ring: 'ring-yellow-200'
      };
    }

    if (isActive) {
      return {
        bg: 'bg-green-500',
        text: 'text-white',
        border: 'border-green-500',
        ring: 'ring-green-200'
      };
    }

    return {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      ring: 'ring-gray-100'
    };
  };

  const style = getTimerStyle();
  const isDanger = displayTime <= danger && displayTime > 0;
  const isWarning = displayTime <= warning && displayTime > danger;

  // Mobile layout
  if (mobile) {
    return (
      <motion.div
        className={`
          px-2 py-1 rounded-lg font-mono font-bold text-sm
          border-2 ${style.border} ${style.bg} ${style.text}
          ${isActive ? `ring-2 ${style.ring}` : ''}
          ${className}
        `}
        animate={isDanger ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={isDanger ? {
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {formatTime(displayTime)}
      </motion.div>
    );
  }

  // Compact layout
  if (compact) {
    return (
      <motion.div
        className={`
          px-3 py-2 rounded-lg font-mono font-bold text-lg
          border-2 ${style.border} ${style.bg} ${style.text}
          ${isActive ? `ring-2 ${style.ring}` : ''}
          flex items-center justify-center min-w-[100px]
          ${className}
        `}
        animate={isDanger ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={isDanger ? {
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {formatTime(displayTime)}
      </motion.div>
    );
  }

  // Full desktop layout
  return (
    <div className={`${className}`}>
      {/* Timer display */}
      <motion.div
        className={`
          px-4 py-3 rounded-xl font-mono font-bold text-2xl
          border-2 ${style.border} ${style.bg} ${style.text}
          ${isActive ? `ring-4 ${style.ring}` : ''}
          flex items-center justify-center min-w-[120px]
          shadow-lg
        `}
        animate={isDanger ? {
          scale: [1, 1.05, 1],
        } : isWarning ? {
          scale: [1, 1.02, 1],
        } : {}}
        transition={isDanger ? {
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : isWarning ? {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {formatTime(displayTime)}
      </motion.div>

      {/* Status indicator */}
      <div className="mt-2 text-center">
        {isActive && (
          <motion.div
            className="text-xs font-medium text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Active
          </motion.div>
        )}

        {isDanger && (
          <motion.div
            className="text-xs font-bold text-red-600"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            TIME CRITICAL!
          </motion.div>
        )}

        {isWarning && !isDanger && (
          <motion.div
            className="text-xs font-medium text-yellow-600"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Low Time
          </motion.div>
        )}
      </div>

      {/* Progress bar for full layout */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full transition-all duration-300 ${
            isDanger ? 'bg-red-500' :
            isWarning ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{
            width: `${Math.max(0, Math.min(100, (displayTime / 300) * 100))}%`
          }}
          animate={isDanger ? {
            opacity: [0.7, 1, 0.7],
          } : {}}
          transition={isDanger ? {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
      </div>
    </div>
  );
};