// Skèmino Game Types for PSN System
export type CardSuit = 'P' | 'F' | 'C'; // Pietra, Forbici, Carta
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13; // 1-13, where 11=J, 12=Q, 13=K

export interface Card {
  suit: CardSuit;
  value: CardValue;
}

export type BoardPosition = string; // 'a1' to 'f6' (6x6 board)
export type GameResult = '1-0' | '0-1' | '1/2-1/2' | '*';
export type PlayerId = 'white' | 'black';

export interface Move {
  turn: number;
  player: PlayerId;
  card: Card;
  position: BoardPosition;
  timestamp: Date;

  // Game state effects
  isCapture: boolean;
  hasVertexControl: boolean;
  createsLoop: boolean;
  isCheck: boolean;
  capturedCards?: Card[];

  // Optional timing
  timeSpent?: number; // seconds
}

export interface GameHeaders {
  event: string;
  site: string;
  date: string; // YYYY.MM.DD format
  round: string;
  white: string;
  black: string;
  result: GameResult;
  whiteElo?: number;
  blackElo?: number;
  strategy?: string;
  whiteTime?: number;
  blackTime?: number;
  nCard?: number;
}

export interface GameState {
  id: string;
  headers: GameHeaders;
  moves: Move[];
  currentPlayer: PlayerId;
  turn: number;
  status: 'setup' | 'playing' | 'ended';
  result?: GameResult;
  board: Map<BoardPosition, Card>;
  whiteCards: Card[];
  blackCards: Card[];
}

export interface PSNParseResult {
  isValid: boolean;
  game?: GameState;
  errors: string[];
  warnings: string[];
}