import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Card, PlayerColor } from '../types/game';

interface DistributionState {
  isDistributing: boolean;
  currentCard: number;
  phase: 'waiting' | 'shuffling' | 'dealing' | 'complete';
  animationProgress: number;
}

interface UseCardDistributionReturn {
  distributionState: DistributionState;
  startDistribution: (whiteCards: Card[], blackCards: Card[]) => Promise<void>;
  canInteract: boolean;
}

export const useCardDistribution = (): UseCardDistributionReturn => {
  const { distributionState } = useGameStore();

  // Legacy demo function - now replaced by real-time server events
  const startDistribution = useCallback(async (whiteCards: Card[], blackCards: Card[]) => {
    console.warn('startDistribution called but now handled by real-time server events');
    // This function is now handled by WebSocket events from server
    // Keeping for backward compatibility but real distribution happens via:
    // - server: cards:distribution-start
    // - server: cards:distribution-phase
    // - server: cards:card-dealt (x10)
    // - server: cards:distribution-complete
  }, []);

  // Determine if user can interact with cards
  const canInteract = !distributionState.isDistributing &&
                     (distributionState.phase === 'complete' || distributionState.phase === 'waiting');

  return {
    distributionState,
    startDistribution,
    canInteract,
  };
};

// Hook for responsive card layout
export const useResponsiveCardLayout = () => {
  const [layout, setLayout] = useState<{
    handLayout: 'fan' | 'linear' | 'grid' | 'compact';
    orientation: 'horizontal' | 'vertical';
    cardSize: 'small' | 'medium' | 'large';
  }>({
    handLayout: 'fan',
    orientation: 'horizontal',
    cardSize: 'medium',
  });

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width >= 1280) {
        // Desktop large
        setLayout({
          handLayout: 'fan',
          orientation: 'vertical',
          cardSize: 'large',
        });
      } else if (width >= 1024) {
        // Desktop
        setLayout({
          handLayout: 'fan',
          orientation: 'vertical',
          cardSize: 'medium',
        });
      } else if (width >= 768) {
        // Tablet
        setLayout({
          handLayout: 'linear',
          orientation: 'horizontal',
          cardSize: 'medium',
        });
      } else if (width >= 480) {
        // Mobile large
        setLayout({
          handLayout: 'grid',
          orientation: 'horizontal',
          cardSize: 'small',
        });
      } else {
        // Mobile compact
        setLayout({
          handLayout: 'compact',
          orientation: 'horizontal',
          cardSize: 'small',
        });
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return layout;
};

// Hook for card distribution sound effects
export const useCardSounds = () => {
  const { soundEnabled } = useGameStore();

  const playSound = useCallback((soundType: 'shuffle' | 'deal' | 'flip' | 'complete') => {
    if (!soundEnabled) return;

    // Create audio context for low-latency gaming audio
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Generate procedural card sounds (no external files needed)
      const generateCardSound = (frequency: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      switch (soundType) {
        case 'shuffle':
          // Rapid succession of clicks
          for (let i = 0; i < 8; i++) {
            setTimeout(() => generateCardSound(400 + i * 50, 0.1), i * 50);
          }
          break;
        case 'deal':
          generateCardSound(600, 0.15);
          break;
        case 'flip':
          generateCardSound(800, 0.1);
          break;
        case 'complete':
          generateCardSound(1000, 0.3);
          break;
      }
    } catch (error) {
      console.warn('Audio not available:', error);
    }
  }, [soundEnabled]);

  return { playSound };
};