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
  PSNHeader,
  BoardCell,
  PlayerColor,
} from "../../../shared/types/GameTypes";

export class PSNGenerator {
  /**
   * Generates complete PSN notation for a game
   */
  public generateGamePSN(gameState: GameState): string {
    const headers = this.generateHeaders(gameState);
    const setup = this.generateSetup(gameState);
    const moves = this.generateMoves(gameState.moveHistory);
    const result = this.generateResult(gameState);

    return [headers, setup, moves, result].filter(Boolean).join("\n\n");
  }

  /**
   * Generates PSN headers section
   */
  private generateHeaders(gameState: GameState): string {
    const headers: PSNHeader = {
      event: "Skèmino Game",
      site: "Skèmino Platform",
      date: gameState.startTime.toISOString().split("T")[0].replace(/-/g, "."),
      white: gameState.players.white.username,
      black: gameState.players.black.username,
      result: this.getGameResult(gameState),
      whiteRating: gameState.players.white.rating,
      blackRating: gameState.players.black.rating,
      timeControl: `${Math.floor(gameState.players.white.timeRemaining / 60000)}+0`,
    };

    const requiredHeaders = [
      `[Event "${headers.event}"]`,
      `[Site "${headers.site}"]`,
      `[Date "${headers.date}"]`,
      `[Round "1"]`,
      `[White "${headers.white}"]`,
      `[Black "${headers.black}"]`,
      `[Result "${headers.result}"]`,
    ];

    const optionalHeaders = [];
    if (headers.whiteRating !== undefined) {
      optionalHeaders.push(`[WhiteElo "${headers.whiteRating}"]`);
    }
    if (headers.blackRating !== undefined) {
      optionalHeaders.push(`[BlackElo "${headers.blackRating}"]`);
    }
    if (headers.timeControl) {
      optionalHeaders.push(`[TimeControl "${headers.timeControl}"]`);
    }

    return [...requiredHeaders, ...optionalHeaders].join("\n");
  }

  /**
   * Determines game result for PSN header
   */
  private getGameResult(gameState: GameState): "1-0" | "0-1" | "1/2-1/2" | "*" {
    if (gameState.status !== "completed") {
      return "*";
    }

    if (!gameState.winner) {
      return "1/2-1/2"; // Draw
    }

    return gameState.winner === "white" ? "1-0" : "0-1";
  }

  /**
   * Generates setup line (turn 0) for PSN
   */
  private generateSetup(gameState: GameState): string {
    // Extract initial setup from dice configuration
    if (gameState.setupDice) {
      const { numeric, alphabetic, bicolor } = gameState.setupDice;
      const setupCell = `${alphabetic}${numeric}` as BoardCell;
      return `0.SETUP:${setupCell}/${bicolor}`;
    }

    return "";
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

      // White moves start new line, Black moves complete line
      if (move.player === "white") {
        if (currentLine.length > 0) {
          moveLines.push(currentLine.join(" "));
        }
        currentLine = [`${move.turnNumber}.${notation}`];
      } else {
        currentLine.push(notation);
      }

      // Handle end of game or single white move
      if (i === moves.length - 1 && currentLine.length > 0) {
        moveLines.push(currentLine.join(" "));
      }
    }

    return moveLines.join("\n");
  }

  /**
   * Generates PSN notation for a single move
   */
  public generateMoveNotation(move: Move): string {
    const cardNotation = this.formatCard(move.card);
    const positionNotation = move.toPosition;

    // Build special symbols
    let symbols = "";
    if (move.capturedCard) symbols += "*";
    if (move.isVertexControl) symbols += "#";
    if (move.isLoopTrigger) symbols += "@";

    // Add timing if present
    const timing = move.thinkTimeMs
      ? `/${Math.round(move.thinkTimeMs / 1000)}`
      : "";

    return `${cardNotation}:${positionNotation}${symbols}${timing}`;
  }

  /**
   * Formats a card for PSN notation
   */
  private formatCard(card: Card): string {
    const valueStr =
      card.value === "J"
        ? "J"
        : card.value === "Q"
          ? "Q"
          : card.value === "K"
            ? "K"
            : card.value;
    return `${card.suit}${valueStr}`;
  }

  /**
   * Generates result line
   */
  private generateResult(gameState: GameState): string {
    const result = this.getGameResult(gameState);
    return result === "*" ? "" : result;
  }

  /**
   * Validates PSN move notation syntax
   */
  public validateMoveNotation(notation: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Basic format: CARD:POSITION[SYMBOLS][/TIME]
    const moveRegex =
      /^([PFC](?:[1-9]|1[0-3]|[JQK])):([a-f][1-6])([*#@+]*)(\/\d+)?$/;

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
    const symbolSet = new Set(symbols.split(""));
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
  private validateCardNotation(cardStr: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (cardStr.length < 2) {
      errors.push(`Card notation too short: ${cardStr}`);
      return { isValid: false, errors };
    }

    const suit = cardStr[0] as "P" | "F" | "C";
    const valueStr = cardStr.substring(1);

    // Validate suit
    if (!["P", "F", "C"].includes(suit)) {
      errors.push(`Invalid card suit: ${suit}`);
    }

    // Validate value
    if (["J", "Q", "K"].includes(valueStr)) {
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
  private validatePosition(position: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (position.length !== 2) {
      errors.push(`Invalid position length: ${position}`);
      return { isValid: false, errors };
    }

    const file = position[0];
    const rank = position[1];

    if (!"abcdef".includes(file)) {
      errors.push(`Invalid file: ${file}`);
    }

    if (!"123456".includes(rank)) {
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

    const suit = cardStr[0] as "P" | "F" | "C";
    const valueStr = cardStr.substring(1);

    let value: string;
    switch (valueStr) {
      case "J":
        value = "J";
        break;
      case "Q":
        value = "Q";
        break;
      case "K":
        value = "K";
        break;
      default:
        value = valueStr;
        break;
    }

    return {
      id: `${suit}${value}`,
      suit,
      value: value as any,
      displayName: `${suit}${value}`,
    };
  }

  /**
   * Extracts special move properties from notation
   */
  public parseSpecialSymbols(notation: string): {
    isCapture: boolean;
    hasVertexControl: boolean;
    createsLoop: boolean;
  } {
    return {
      isCapture: notation.includes("*"),
      hasVertexControl: notation.includes("#"),
      createsLoop: notation.includes("@"),
    };
  }

  /**
   * Extracts timing from move notation
   */
  public parseTimeSpent(notation: string): number | undefined {
    const timingMatch = notation.match(/\/(\d+)$/);
    return timingMatch ? parseInt(timingMatch[1]) * 1000 : undefined; // Convert to milliseconds
  }

  /**
   * Generates PSN for export to file
   */
  public exportGameToPSN(gameState: GameState): string {
    const psn = this.generateGamePSN(gameState);
    return psn + "\n"; // Add final newline for file format
  }

  /**
   * Generates abbreviated PSN for storage optimization
   */
  public generateCompactPSN(gameState: GameState): string {
    // Generate moves without headers for compact storage
    const moves = this.generateMoves(gameState.moveHistory);
    const result = this.generateResult(gameState);
    return [moves, result].filter(Boolean).join("\n");
  }
}
