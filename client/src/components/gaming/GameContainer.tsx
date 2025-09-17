import React, { useEffect, useState } from 'react';
import { GameInterface } from './GameInterface';
import { useGameStore } from '../../store/gameStore';
import type { Card } from '../../types/game';

/**
 * GameContainer - Main container that initializes the game and provides data
 */
export const GameContainer: React.FC = () => {
  const {
    setPlayers,
    setGameState,
    gameState,
    currentPlayer,
    opponent
  } = useGameStore();

  // Initialize game on mount
  useEffect(() => {
    // Mock players for development
    const mockCurrentPlayer = {
      id: 'player1',
      username: 'YourName',
      rating: 1000,
      color: 'white' as const,
      timeRemaining: 1800,
      isOnline: false,
    };

    const mockOpponent = {
      id: 'player2',
      username: 'Opponent',
      rating: 1000,
      color: 'black' as const,
      timeRemaining: 1800,
      isOnline: false,
    };

    // Mock cards for testing
    const createMockCard = (suit: 'P' | 'F' | 'C', value: string, id: string): Card => ({
      id,
      suit,
      value,
      displayName: `${suit}${value}`,
      isStronger: false,
    });

    const mockWhiteHand: Card[] = [
      createMockCard('P', '7', 'p7-1'),
      createMockCard('F', '3', 'f3-1'),
      createMockCard('C', '11', 'c11-1'),
      createMockCard('P', '2', 'p2-1'),
      createMockCard('F', '9', 'f9-1'),
    ];

    const mockBlackHand: Card[] = [
      createMockCard('C', '5', 'c5-1'),
      createMockCard('P', '12', 'p12-1'),
      createMockCard('F', '6', 'f6-1'),
      createMockCard('C', '1', 'c1-1'),
      createMockCard('P', '10', 'p10-1'),
    ];

    // Initialize game state
    const initialGameState = {
      board: new Map(),
      currentTurn: 'white' as const,
      whiteHand: mockWhiteHand,
      blackHand: mockBlackHand,
      whiteTime: 1800,
      blackTime: 1800,
      moveHistory: [],
      status: 'active' as const,
    };

    // Initialize board
    const files = ['a', 'b', 'c', 'd', 'e', 'f'];
    const ranks = ['1', '2', '3', '4', '5', '6'];
    const vertices = new Set(['a1', 'f1', 'a6', 'f6']);

    for (const file of files) {
      for (const rank of ranks) {
        const cell = `${file}${rank}` as any;
        initialGameState.board.set(cell, {
          cell,
          card: null,
          owner: null,
          isVertex: vertices.has(cell),
          isHole: false,
        });
      }
    }

    setPlayers(mockCurrentPlayer, mockOpponent);
    setGameState(initialGameState);
  }, [setPlayers, setGameState]);

  return <GameInterface />;
};