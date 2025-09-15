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
 * Timer component - Circular chess-style game timer with visual warnings
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

  // Mobile layout - circular timer
  if (mobile) {
    return (
      <motion.div
        className={`
          w-12 h-12 rounded-full font-mono font-bold text-xs
          border-2 ${style.border} ${style.bg} ${style.text}
          ${isActive ? `ring-2 ${style.ring}` : ''}
          flex items-center justify-center
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

  // Compact layout - circular timer
  if (compact) {
    return (
      <motion.div
        className={`
          w-16 h-16 rounded-full font-mono font-bold text-sm
          border-2 ${style.border} ${style.bg} ${style.text}
          ${isActive ? `ring-2 ${style.ring}` : ''}
          flex items-center justify-center
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

  // Full desktop layout - circular timer with ring progress
  return (
    <div className={`relative ${className}`}>
      {/* Circular timer with SVG progress ring */}
      <motion.div
        className="relative"
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
        {/* SVG progress ring */}
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.max(0, Math.min(1, displayTime / 300)))}`}
            className={`${
              isDanger ? 'text-red-500' :
              isWarning ? 'text-yellow-500' :
              isActive ? 'text-green-500' :
              'text-gray-400'
            } transition-all duration-300`}
          />
        </svg>

        {/* Timer display in center */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            font-mono font-bold text-lg
            ${style.text}
          `}
        >
          {formatTime(displayTime)}
        </div>
      </motion.div>
    </div>
  );
};