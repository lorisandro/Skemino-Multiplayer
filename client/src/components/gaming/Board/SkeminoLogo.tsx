import React from 'react';
import { motion } from 'framer-motion';

interface SkeminoLogoProps {
  size?: number;
  animated?: boolean;
}

export const SkeminoLogo: React.FC<SkeminoLogoProps> = ({
  size = 120,
  animated = true
}) => {
  const logoVariants = {
    idle: {
      rotate: 0,
      scale: 1,
    },
    hover: {
      rotate: 360,
      scale: 1.05,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const diamondVariants = {
    idle: {
      rotate: 0,
    },
    hover: {
      rotate: 45,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center cursor-pointer select-none"
      style={{ width: size, height: size }}
      variants={animated ? logoVariants : undefined}
      initial="idle"
      whileHover="hover"
    >
      {/* Outer ring */}
      <div className="relative w-full h-full">
        {/* Main diamond logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={animated ? diamondVariants : undefined}
        >
          <div className="relative w-16 h-16">
            {/* Four-colored diamond */}
            <div className="absolute inset-0 transform rotate-45">
              {/* Top triangle - Cyan */}
              <div
                className="absolute w-0 h-0 left-1/2 top-0 transform -translate-x-1/2"
                style={{
                  borderLeft: '32px solid transparent',
                  borderRight: '32px solid transparent',
                  borderBottom: '32px solid #06b6d4'
                }}
              />

              {/* Right triangle - Green */}
              <div
                className="absolute w-0 h-0 right-0 top-1/2 transform -translate-y-1/2"
                style={{
                  borderTop: '32px solid transparent',
                  borderBottom: '32px solid transparent',
                  borderLeft: '32px solid #10b981'
                }}
              />

              {/* Bottom triangle - Red */}
              <div
                className="absolute w-0 h-0 left-1/2 bottom-0 transform -translate-x-1/2"
                style={{
                  borderLeft: '32px solid transparent',
                  borderRight: '32px solid transparent',
                  borderTop: '32px solid #ef4444'
                }}
              />

              {/* Left triangle - Yellow */}
              <div
                className="absolute w-0 h-0 left-0 top-1/2 transform -translate-y-1/2"
                style={{
                  borderTop: '32px solid transparent',
                  borderBottom: '32px solid transparent',
                  borderRight: '32px solid #eab308'
                }}
              />
            </div>

            {/* Center circle with logo text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-xs font-bold text-gray-800 tracking-tight">SK</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skèmino text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.span
            className="text-lg font-bold text-gray-700 tracking-wider"
            animate={animated ? {
              textShadow: [
                '0 0 0px rgba(0,0,0,0)',
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 0px rgba(0,0,0,0)'
              ]
            } : {}}
            transition={animated ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            SKÈMINO
          </motion.span>
        </div>

        {/* Animated ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        )}
      </div>
    </motion.div>
  );
};