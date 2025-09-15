// Client-side game types
export type CardSuit = 'P' | 'F' | 'C';
export type CardValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '?' | 'J' | 'Q' | 'K';
export type PlayerColor = 'white' | 'black';
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
  displayName?: string;
  isStronger?: boolean;
}

export interface BoardPosition {
  cell: BoardCell;
  card: Card | null;
  owner: PlayerColor | null;
  isVertex: boolean;
  isHole: boolean;
  isHighlighted?: boolean;
  isValidMove?: boolean;
  isLastMove?: boolean;
}

export interface GameState {
  board: Map<BoardCell, BoardPosition>;
  currentTurn: PlayerColor;
  whiteHand: Card[];
  blackHand: Card[];
  whiteTime: number;
  blackTime: number;
  moveHistory: Move[];
  status: 'waiting' | 'active' | 'paused' | 'completed';
  winner?: PlayerColor;
  result?: '1-0' | '0-1' | '1/2-1/2';
}

export interface Move {
  id: string;
  player: PlayerColor;
  card: Card;
  from?: BoardCell;
  to: BoardCell;
  capturedCard?: Card;
  notation: string;
  timestamp: number;
}

export interface Player {
  id: string;
  username: string;
  rating: number;
  color: PlayerColor;
  timeRemaining: number;
  isOnline: boolean;
  avatar?: string;
  isGuest?: boolean;
}

export interface GameRoom {
  id: string;
  whitePlayer: Player;
  blackPlayer: Player;
  gameState: GameState;
  timeControl: string;
  isRated: boolean;
  spectators: number;
}

export interface DistributionState {
  phase: 'idle' | 'waiting' | 'matchmaking' | 'shuffling' | 'dealing' | 'active' | 'complete';
  currentCard: number;
  totalCards: number;
  animationProgress: number;
  isDistributing: boolean;
}