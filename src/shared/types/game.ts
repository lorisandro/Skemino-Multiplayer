// DEPRECATED: This file is deprecated in favor of GameTypes.ts
// This file remains for backward compatibility but all new code should use GameTypes.ts

// Re-export all types from GameTypes.ts for backward compatibility
export * from "./GameTypes";

// Legacy type aliases for compatibility - these are deprecated
/**
 * @deprecated Use types from GameTypes.ts instead
 */
export type BoardPosition = string; // 'a1' to 'f6' (6x6 board)

/**
 * @deprecated Use GameResult from GameTypes.ts instead
 */
export type GameResult = "1-0" | "0-1" | "1/2-1/2" | "*";

/**
 * @deprecated Use PlayerColor from GameTypes.ts instead
 */
export type PlayerId = "white" | "black";

// Legacy interfaces that are deprecated
/**
 * @deprecated Use PSNHeader from GameTypes.ts instead
 */
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

/**
 * @deprecated This interface is no longer used
 */
export interface PSNParseResult {
  isValid: boolean;
  game?: any;
  errors: string[];
  warnings: string[];
}
