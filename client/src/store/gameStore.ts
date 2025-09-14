import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import type { GameState, Player, Card, BoardCell, PlayerColor, Move, BoardPosition } from '../types/game';

interface DistributionState {
  isDistributing: boolean;
  currentCard: number;
  phase: 'waiting' | 'matchmaking' | 'starting' | 'shuffling' | 'dealing' | 'complete';
  animationProgress: number;
}

interface GameStore {
  // Game state
  gameState: GameState | null;
  currentPlayer: Player | null;
  opponent: Player | null;
  selectedCard: Card | null;
  validMoves: BoardCell[];
  isMyTurn: boolean;

  // Distribution state
  distributionState: DistributionState;

  // UI state
  isDragging: boolean;
  highlightedCells: BoardCell[];
  lastMove: Move | null;
  showMoveIndicators: boolean;
  soundEnabled: boolean;

  // Actions
  setGameState: (state: GameState) => void;
  setPlayers: (current: Player, opponent: Player) => void;
  selectCard: (card: Card | null) => void;
  setValidMoves: (moves: BoardCell[]) => void;
  makeMove: (card: Card, to: BoardCell) => void;
  updateBoard: (cell: BoardCell, position: Partial<BoardPosition>) => void;
  setDragging: (isDragging: boolean) => void;
  highlightCells: (cells: BoardCell[]) => void;
  clearHighlights: () => void;
  updateTime: (color: PlayerColor, time: number) => void;
  toggleSound: () => void;
  reset: () => void;

  // Distribution actions
  setDistributionState: (state: Partial<DistributionState>) => void;
  triggerCardDistribution: (data: any) => void;
}

const initialGameState: GameState = {
  board: new Map(),
  currentTurn: 'white',
  whiteHand: [],
  blackHand: [],
  whiteTime: 300,
  blackTime: 300,
  moveHistory: [],
  status: 'waiting',
};

// Initialize board
const initializeBoard = (): Map<BoardCell, BoardPosition> => {
  const board = new Map<BoardCell, BoardPosition>();
  const files = ['a', 'b', 'c', 'd', 'e', 'f'];
  const ranks = ['1', '2', '3', '4', '5', '6'];
  const vertices = new Set(['a1', 'f1', 'a6', 'f6']);

  for (const file of files) {
    for (const rank of ranks) {
      const cell = `${file}${rank}` as BoardCell;
      board.set(cell, {
        cell,
        card: null,
        owner: null,
        isVertex: vertices.has(cell),
        isHole: false,
      });
    }
  }

  return board;
};

export const useGameStore = create<GameStore>()(
  devtools(
    immer((set) => ({
    // Initial state
    gameState: { ...initialGameState, board: initializeBoard() },
    currentPlayer: {
      id: 'demo-player',
      username: 'DemoPlayer',
      rating: 1500,
      color: 'white',
      avatar: null,
      isReady: false
    },
    opponent: {
      id: 'demo-opponent',
      username: 'DemoOpponent',
      rating: 1450,
      color: 'black',
      avatar: null,
      isReady: false
    },
    selectedCard: null,
    validMoves: [],
    isMyTurn: false,

    // Distribution state
    distributionState: {
      isDistributing: false,
      currentCard: 0,
      phase: 'waiting',
      animationProgress: 0,
    },

    // UI state
    isDragging: false,
    highlightedCells: [],
    lastMove: null,
    showMoveIndicators: true,
    soundEnabled: true,

    // Actions
    setGameState: (state) =>
      set((draft) => {
        draft.gameState = state;
        draft.isMyTurn = state.currentTurn === draft.currentPlayer?.color;
      }),

    setPlayers: (current, opponent) =>
      set((draft) => {
        draft.currentPlayer = current;
        draft.opponent = opponent;
        draft.isMyTurn = draft.gameState?.currentTurn === current.color;
      }),

    selectCard: (card) =>
      set((draft) => {
        draft.selectedCard = card;
        if (!card) {
          draft.validMoves = [];
        }
      }),

    setValidMoves: (moves) =>
      set((draft) => {
        draft.validMoves = moves;
      }),

    makeMove: (card, to) =>
      set((draft) => {
        if (!draft.gameState || !draft.currentPlayer) return;

        const move: Move = {
          id: crypto.randomUUID(),
          player: draft.currentPlayer.color,
          card,
          to,
          notation: `${card.suit}${card.value}:${to}`,
          timestamp: Date.now(),
        };

        // Update board
        const position = draft.gameState.board.get(to);
        if (position) {
          if (position.card) {
            move.capturedCard = position.card;
            move.notation += '*';
          }
          position.card = card;
          position.owner = draft.currentPlayer.color;
        }

        // Remove card from hand
        if (draft.currentPlayer.color === 'white') {
          draft.gameState.whiteHand = draft.gameState.whiteHand.filter(
            (c) => c.id !== card.id
          );
        } else {
          draft.gameState.blackHand = draft.gameState.blackHand.filter(
            (c) => c.id !== card.id
          );
        }

        // Update game state
        draft.gameState.moveHistory.push(move);
        draft.gameState.currentTurn = draft.gameState.currentTurn === 'white' ? 'black' : 'white';
        draft.lastMove = move;
        draft.selectedCard = null;
        draft.validMoves = [];
        draft.isMyTurn = false;
      }),

    updateBoard: (cell, position) =>
      set((draft) => {
        if (!draft.gameState) return;
        const current = draft.gameState.board.get(cell);
        if (current) {
          Object.assign(current, position);
        }
      }),

    setDragging: (isDragging) =>
      set((draft) => {
        draft.isDragging = isDragging;
      }),

    highlightCells: (cells) =>
      set((draft) => {
        draft.highlightedCells = cells;
        cells.forEach((cell) => {
          const position = draft.gameState?.board.get(cell);
          if (position) {
            position.isHighlighted = true;
          }
        });
      }),

    clearHighlights: () =>
      set((draft) => {
        draft.highlightedCells.forEach((cell) => {
          const position = draft.gameState?.board.get(cell);
          if (position) {
            position.isHighlighted = false;
          }
        });
        draft.highlightedCells = [];
      }),

    updateTime: (color, time) =>
      set((draft) => {
        if (!draft.gameState) return;
        if (color === 'white') {
          draft.gameState.whiteTime = time;
        } else {
          draft.gameState.blackTime = time;
        }
      }),

    toggleSound: () =>
      set((draft) => {
        draft.soundEnabled = !draft.soundEnabled;
      }),

    reset: () =>
      set((draft) => {
        draft.gameState = { ...initialGameState, board: initializeBoard() };
        draft.currentPlayer = null;
        draft.opponent = null;
        draft.selectedCard = null;
        draft.validMoves = [];
        draft.isMyTurn = false;
        draft.distributionState = {
          isDistributing: false,
          currentCard: 0,
          phase: 'waiting',
          animationProgress: 0,
        };
        draft.isDragging = false;
        draft.highlightedCells = [];
        draft.lastMove = null;
      }),

    // Distribution actions
    setDistributionState: (state) =>
      set((draft) => {
        Object.assign(draft.distributionState, state);
      }),

    triggerCardDistribution: (data) =>
      set((draft) => {
        // Handle individual card distribution animation
        console.log('Card distribution triggered:', data);

        // Update cards progressively based on server events
        if (draft.gameState && data.player && data.cardIndex !== undefined) {
          // This will be handled by the distribution overlay
          // Real card data comes via cards:distribution-complete
        }
      }),
    })),
    { name: 'skemino-game-store' }
  )
);