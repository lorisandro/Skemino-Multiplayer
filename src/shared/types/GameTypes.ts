// Core game types for Skèmino

export type CardSuit = 'P' | 'F' | 'C'; // Pietra, Forbici, Carta
export type CardValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type BoardCell = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' |
                       'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' |
                       'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' |
                       'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' |
                       'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' |
                       'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6';

export interface Card {
  id: string;
  suit: CardSuit;
  value: CardValue;
  displayName: string;
}

export interface BoardPosition {
  cell: BoardCell;
  card: Card | null;
  isVertex: boolean;
  quadrant: 1 | 2 | 3 | 4;
}

export interface GameBoard {
  positions: Map<BoardCell, BoardPosition>;
  vertexControl: {
    a1: PlayerColor | null;
    f1: PlayerColor | null;
    a6: PlayerColor | null;
    f6: PlayerColor | null;
  };
  holes: BoardCell[];
}

export type PlayerColor = 'white' | 'black';
export type GameStatus = 'waiting' | 'active' | 'paused' | 'completed' | 'aborted';
export type VictoryCondition = 'ERA1' | 'ERA2' | 'ERA3' | 'ERA4';

export interface Player {
  id: string;
  username: string;
  rating: number;
  color: PlayerColor;
  hand: Card[];
  cardsPlayed: number;
  timeRemaining: number;
}

export interface GameState {
  id: string;
  board: GameBoard;
  players: {
    white: Player;
    black: Player;
  };
  currentTurn: PlayerColor;
  status: GameStatus;
  moveCount: number;
  moveHistory: Move[];
  startTime: Date;
  endTime?: Date;
  winner?: PlayerColor;
  victoryCondition?: VictoryCondition;
  setupDice?: {
    numeric: number;
    alphabetic: string;
    bicolor: PlayerColor;
  };
}

export interface Move {
  id: string;
  turnNumber: number;
  player: PlayerColor;
  card: Card;
  fromPosition?: BoardCell;
  toPosition: BoardCell;
  capturedCard?: Card;
  isVertexControl: boolean;
  isLoopTrigger: boolean;
  notation: string;
  timestamp: Date;
  thinkTimeMs: number;
}

export interface MoveValidation {
  valid: boolean;
  reason?: string;
  validMoves?: BoardCell[];
}

export interface LoopDetection {
  hasLoop: boolean;
  type?: 'symbolic' | 'numeric';
  cells?: BoardCell[];
}

// Game rules constants
export const GAME_CONSTANTS = {
  BOARD_SIZE: 6,
  TOTAL_CARDS: 39,
  CARDS_PER_SUIT: 13,
  VERTICES: ['a1', 'f1', 'a6', 'f6'] as BoardCell[],
  QUADRANT_CENTERS: ['b2', 'e2', 'b5', 'e5'] as BoardCell[],

  // Morra Cinese rules
  SUIT_HIERARCHY: {
    'P': ['F'], // Pietra beats Forbici
    'F': ['C'], // Forbici beats Carta
    'C': ['P']  // Carta beats Pietra
  },

  // Card values for numeric comparison
  CARD_VALUES: {
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  }
};

// PSN Notation types
export interface PSNHeader {
  event: string;
  site: string;
  date: string;
  round?: string;
  white: string;
  black: string;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  whiteRating?: number;
  blackRating?: number;
  timeControl?: string;
  eco?: string;
}

export interface PSNMove {
  turnNumber: number;
  whiteMove?: string;
  blackMove?: string;
  annotation?: string;
}

export interface PSNGame {
  header: PSNHeader;
  moves: PSNMove[];
  result: string;
}