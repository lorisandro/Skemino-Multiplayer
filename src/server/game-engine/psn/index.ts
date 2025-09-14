/**
 * PSN (Portable Skèmino Notation) System
 *
 * Complete implementation of PSN format for Skèmino games including:
 * - PSN generation from game state
 * - PSN parsing and validation
 * - File I/O operations
 * - Format conversion utilities
 * - Archive management tools
 */

export { PSNGenerator } from './PSNGenerator';
export { PSNParser, PSNParseOptions } from './PSNParser';
export { PSNUtils, PSNArchiveStats, PSNValidationReport } from './PSNUtils';

// Re-export types for convenience
export {
  GameState,
  Move,
  Card,
  GameHeaders,
  PSNParseResult,
  GameResult,
  PlayerId,
  BoardPosition,
  CardSuit,
  CardValue
} from '../../../shared/types/game';

/**
 * Quick PSN operations - convenience functions
 */
import { PSNGenerator } from './PSNGenerator';
import { PSNParser } from './PSNParser';
import { PSNUtils } from './PSNUtils';
import { GameState, PSNParseResult } from '../../../shared/types/game';

// Singleton instances for quick operations
const generator = new PSNGenerator();
const parser = new PSNParser();
const utils = new PSNUtils();

/**
 * Quick generation of PSN from game state
 */
export function generatePSN(gameState: GameState): string {
  return generator.generateGamePSN(gameState);
}

/**
 * Quick parsing of PSN string
 */
export function parsePSN(psnString: string): PSNParseResult {
  return parser.parseGame(psnString);
}

/**
 * Quick validation of PSN format
 */
export function validatePSN(psnString: string): { isValid: boolean; errors: string[] } {
  const result = parser.validatePSNFormat(psnString);
  return { isValid: result.isValid, errors: result.errors };
}

/**
 * Quick move notation generation
 */
export function generateMoveNotation(move: any): string {
  return generator.generateMoveNotation(move);
}

/**
 * Quick move parsing
 */
export function parseMove(moveNotation: string): any {
  return parser.parseMove(moveNotation);
}

/**
 * Quick PSN repair for common issues
 */
export function repairPSN(psnString: string): { repaired: string; changes: string[] } {
  return utils.repairPSNString(psnString);
}

/**
 * PSN System Information
 */
export const PSN_VERSION = '1.0.0';
export const PSN_FORMAT_NAME = 'Portable Skèmino Notation';

/**
 * Supported PSN features
 */
export const PSN_FEATURES = {
  BASIC_MOVES: true,
  CAPTURES: true,
  VERTEX_CONTROL: true,
  LOOP_DETECTION: true,
  CHECK_NOTATION: true,
  TIMING_SUPPORT: true,
  HEADERS_SUPPORT: true,
  SETUP_LINE_SUPPORT: true,
  COMMENTS_SUPPORT: false, // Future feature
  VARIATIONS_SUPPORT: false, // Future feature
} as const;

/**
 * PSN special symbols
 */
export const PSN_SYMBOLS = {
  CAPTURE: '*',
  VERTEX_CONTROL: '#',
  LOOP: '@',
  CHECK: '+',
  SETUP_DELIMITER: ':',
  TIME_DELIMITER: '/',
  MOVE_SEPARATOR: ' ',
  TURN_DELIMITER: '.',
} as const;

/**
 * Default PSN parse options
 */
export const DEFAULT_PSN_OPTIONS = {
  strict: false,
  validateMoves: true,
  includeTimings: true,
  maxErrors: 10,
} as const;