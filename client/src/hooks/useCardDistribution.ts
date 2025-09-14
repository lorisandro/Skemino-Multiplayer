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
  const { setGameState, gameState, currentPlayer } = useGameStore();

  const [distributionState, setDistributionState] = useState<DistributionState>({
    isDistributing: false,
    currentCard: 0,
    phase: 'waiting',
    animationProgress: 0,
  });

  // Distribution timing configuration (chess.com inspired)
  const TIMING = {
    shuffleDuration: 800,      // Initial shuffle animation
    cardDelay: 200,           // Delay between each card deal
    dealDuration: 300,        // Individual card animation
    finalDelay: 500,          // Final pause before enabling interaction
  };

  const startDistribution = useCallback(async (whiteCards: Card[], blackCards: Card[]) => {
    if (!gameState) return;

    // Phase 1: Shuffling animation
    setDistributionState({
      isDistributing: true,
      currentCard: 0,
      phase: 'shuffling',
      animationProgress: 0,
    });

    // Simulate deck shuffle with progress
    await new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setDistributionState(prev => ({
          ...prev,
          animationProgress: progress,
        }));

        if (progress >= 100) {
          clearInterval(interval);
          resolve(void 0);
        }
      }, TIMING.shuffleDuration / 10);
    });

    // Phase 2: Card dealing
    setDistributionState(prev => ({
      ...prev,
      phase: 'dealing',
      animationProgress: 0,
    }));

    // Deal cards alternately (like real card games)
    const totalCards = 10; // 5 per player
    for (let i = 0; i < totalCards; i++) {
      const isCurrentPlayerCard = i % 2 === 0; // Alternate dealing
      const cardIndex = Math.floor(i / 2);

      setDistributionState(prev => ({
        ...prev,
        currentCard: i + 1,
        animationProgress: ((i + 1) / totalCards) * 100,
      }));

      // Update game state with new card
      if (isCurrentPlayerCard && cardIndex < whiteCards.length) {
        setGameState({
          ...gameState,
          whiteHand: whiteCards.slice(0, cardIndex + 1),
          blackHand: blackCards.slice(0, cardIndex),
        });
      } else if (!isCurrentPlayerCard && cardIndex < blackCards.length) {
        setGameState({
          ...gameState,
          whiteHand: whiteCards.slice(0, cardIndex + 1),
          blackHand: blackCards.slice(0, cardIndex + 1),
        });
      }

      // Wait between cards for visual effect
      await new Promise(resolve => setTimeout(resolve, TIMING.cardDelay));
    }

    // Phase 3: Final setup
    await new Promise(resolve => setTimeout(resolve, TIMING.finalDelay));

    // Complete distribution
    setDistributionState({
      isDistributing: false,
      currentCard: 10,
      phase: 'complete',
      animationProgress: 100,
    });

    // Ensure final state is correct
    setGameState({
      ...gameState,
      whiteHand: whiteCards,
      blackHand: blackCards,
      status: 'active',
    });

  }, [gameState, setGameState]);

  // Determine if user can interact with cards
  const canInteract = !distributionState.isDistributing &&
                     distributionState.phase === 'complete';

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