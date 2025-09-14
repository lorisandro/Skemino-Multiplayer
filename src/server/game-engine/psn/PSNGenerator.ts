/**
 * PSNGenerator.ts - Portable Skèmino Notation Generator
 *
 * Generates standard PSN notation from Skèmino game moves and state.
 * Supports all special symbols: captures (*), vertex control (#), loops (@), check (+)
 *
 * PSN Format Examples:
 * - Basic move: C4:d3 (card:position)
 * - Capture: F1:f6*
 * - Vertex control: P2:a1#
 * - Loop creation: C7:c2@
 * - Combinations: F5:e5*#@+ (capture + vertex + loop + check)
 */

import {
  GameState,
  Move,
  Card,
  GameHeaders,
  GameResult,
  BoardPosition,
  PlayerId
} from '../../../shared/types/game';

export class PSNGenerator {
  /**
   * Generates complete PSN notation for a game
   */
  public generateGamePSN(gameState: GameState): string {
    const headers = this.generateHeaders(gameState.headers);
    const setup = this.generateSetup(gameState);
    const moves = this.generateMoves(gameState.moves);
    const result = this.generateResult(gameState.headers.result);

    return [headers, setup, moves, result].filter(Boolean).join('\n\n');
  }

  /**
   * Generates PSN headers section
   */
  private generateHeaders(headers: GameHeaders): string {
    const requiredHeaders = [
      `[Event "${headers.event}"]`,
      `[Site "${headers.site}"]`,
      `[Date "${headers.date}"]`,
      `[Round "${headers.round}"]`,
      `[White "${headers.white}"]`,
      `[Black "${headers.black}"]`,
      `[Result "${headers.result}"]`
    ];

    const optionalHeaders = [];
    if (headers.whiteElo !== undefined) {
      optionalHeaders.push(`[WhiteElo "${headers.whiteElo}"]`);
    }
    if (headers.blackElo !== undefined) {
      optionalHeaders.push(`[BlackElo "${headers.blackElo}"]`);
    }
    if (headers.strategy) {
      optionalHeaders.push(`[Strategy "${headers.strategy}"]`);
    }
    if (headers.whiteTime !== undefined) {
      optionalHeaders.push(`[WhiteTime "${headers.whiteTime}"]`);
    }
    if (headers.blackTime !== undefined) {
      optionalHeaders.push(`[BlackTime "${headers.blackTime}"]`);
    }
    if (headers.nCard !== undefined) {
      optionalHeaders.push(`[NCard "${headers.nCard}"]`);
    }

    return [...requiredHeaders, ...optionalHeaders].join('\n');
  }

  /**
   * Generates setup line (turn 0) for PSN
   */
  private generateSetup(gameState: GameState): string {
    // Extract initial setup from first move or game configuration
    // Format: 0.SETUP_CARD:position/white_cards:White/black_cards:Black

    // For now, return empty setup - this would be populated based on actual setup logic
    // This should be implemented when setup dice system is available
    return '';
  }

  /**
   * Generates move notation for all moves in the game
   */
  private generateMoves(moves: Move[]): string {
    const moveLines: string[] = [];
    let currentLine: string[] = [];

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const notation = this.generateMoveNotation(move);

      // White moves (odd turns) start new line, Black moves (even turns) complete line
      if (move.player === 'white') {
        if (currentLine.length > 0) {
          moveLines.push(currentLine.join(' '));
        }
        currentLine = [`${move.turn}.${notation}`];
      } else {
        currentLine.push(notation);
      }

      // Handle end of game or single white move
      if (i === moves.length - 1 && currentLine.length > 0) {
        moveLines.push(currentLine.join(' '));
      }
    }

    return moveLines.join('\n');
  }

  /**
   * Generates PSN notation for a single move
   */
  public generateMoveNotation(move: Move): string {
    const cardNotation = this.formatCard(move.card);
    const positionNotation = move.position;

    // Build special symbols
    let symbols = '';
    if (move.isCapture) symbols += '*';
    if (move.hasVertexControl) symbols += '#';
    if (move.createsLoop) symbols += '@';
    if (move.isCheck) symbols += '+';

    // Add timing if present
    const timing = move.timeSpent ? `/${move.timeSpent}` : '';

    return `${cardNotation}:${positionNotation}${symbols}${timing}`;
  }

  /**
   * Formats a card for PSN notation
   */
  private formatCard(card: Card): string {
    const valueStr = card.value <= 10 ? card.value.toString() :
                     card.value === 11 ? 'J' :
                     card.value === 12 ? 'Q' : 'K';
    return `${card.suit}${valueStr}`;
  }

  /**
   * Generates result line
   */
  private generateResult(result: GameResult): string {
    return result === '*' ? '' : result;
  }

  /**
   * Validates PSN move notation syntax
   */
  public validateMoveNotation(notation: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic format: CARD:POSITION[SYMBOLS][/TIME]
    const moveRegex = /^([PFC](?:[1-9]|1[0-3]|[JQK])):([a-f][1-6])([*#@+]*)(\/\d+)?$/;

    if (!moveRegex.test(notation)) {
      errors.push(`Invalid move notation format: ${notation}`);
      return { isValid: false, errors };
    }

    const matches = notation.match(moveRegex);
    if (!matches) {
      errors.push(`Failed to parse move notation: ${notation}`);
      return { isValid: false, errors };
    }

    const [, cardStr, position, symbols, timing] = matches;

    // Validate card
    const cardResult = this.validateCardNotation(cardStr);
    if (!cardResult.isValid) {
      errors.push(...cardResult.errors);
    }

    // Validate position
    const positionResult = this.validatePosition(position);
    if (!positionResult.isValid) {
      errors.push(...positionResult.errors);
    }

    // Validate symbols (no duplicate symbols)
    const symbolSet = new Set(symbols.split(''));
    if (symbolSet.size !== symbols.length) {
      errors.push(`Duplicate symbols in move notation: ${symbols}`);
    }

    // Validate timing
    if (timing) {
      const timeValue = parseInt(timing.substring(1));
      if (isNaN(timeValue) || timeValue < 0) {
        errors.push(`Invalid timing value: ${timing}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates card notation
   */
  private validateCardNotation(cardStr: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (cardStr.length < 2) {
      errors.push(`Card notation too short: ${cardStr}`);
      return { isValid: false, errors };
    }

    const suit = cardStr[0] as 'P' | 'F' | 'C';
    const valueStr = cardStr.substring(1);

    // Validate suit
    if (!['P', 'F', 'C'].includes(suit)) {
      errors.push(`Invalid card suit: ${suit}`);
    }

    // Validate value
    if (['J', 'Q', 'K'].includes(valueStr)) {
      // Face cards are valid
    } else {
      const value = parseInt(valueStr);
      if (isNaN(value) || value < 1 || value > 13) {
        errors.push(`Invalid card value: ${valueStr}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates board position
   */
  private validatePosition(position: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (position.length !== 2) {
      errors.push(`Invalid position length: ${position}`);
      return { isValid: false, errors };
    }

    const file = position[0];
    const rank = position[1];

    if (!'abcdef'.includes(file)) {
      errors.push(`Invalid file: ${file}`);
    }

    if (!'123456'.includes(rank)) {
      errors.push(`Invalid rank: ${rank}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Parses card from PSN notation
   */
  public parseCard(cardStr: string): Card | null {
    const validation = this.validateCardNotation(cardStr);
    if (!validation.isValid) {
      return null;
    }

    const suit = cardStr[0] as 'P' | 'F' | 'C';
    const valueStr = cardStr.substring(1);

    let value: number;
    switch (valueStr) {
      case 'J': value = 11; break;
      case 'Q': value = 12; break;
      case 'K': value = 13; break;
      default: value = parseInt(valueStr); break;
    }

    return { suit, value: value as any };
  }

  /**
   * Extracts special move properties from notation
   */
  public parseSpecialSymbols(notation: string): {
    isCapture: boolean;
    hasVertexControl: boolean;
    createsLoop: boolean;
    isCheck: boolean;
  } {
    return {
      isCapture: notation.includes('*'),
      hasVertexControl: notation.includes('#'),
      createsLoop: notation.includes('@'),
      isCheck: notation.includes('+')
    };
  }

  /**
   * Extracts timing from move notation
   */
  public parseTimeSpent(notation: string): number | undefined {
    const timingMatch = notation.match(/\/(\d+)$/);
    return timingMatch ? parseInt(timingMatch[1]) : undefined;
  }

  /**
   * Generates PSN for export to file
   */
  public exportGameToPSN(gameState: GameState): string {
    const psn = this.generateGamePSN(gameState);
    return psn + '\n'; // Add final newline for file format
  }

  /**
   * Generates abbreviated PSN for storage optimization
   */
  public generateCompactPSN(gameState: GameState): string {
    // Generate moves without headers for compact storage
    const moves = this.generateMoves(gameState.moves);
    const result = this.generateResult(gameState.headers.result);
    return [moves, result].filter(Boolean).join('\n');
  }
}