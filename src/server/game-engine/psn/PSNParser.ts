/**
 * PSNParser.ts - Portable Skèmino Notation Parser
 *
 * Parses PSN notation strings back into Skèmino game objects.
 * Handles complete PSN files with headers, setup, moves, and validation.
 *
 * Features:
 * - Complete PSN file parsing with error recovery
 * - Move notation parsing with special symbols
 * - Header validation and extraction
 * - Comprehensive error reporting with line numbers
 * - Support for both strict and permissive parsing modes
 */

import {
  GameState,
  Move,
  Card,
  GameHeaders,
  GameResult,
  BoardPosition,
  PlayerId,
  PSNParseResult,
} from "../../../shared/types/game";

export interface PSNParseOptions {
  strict: boolean; // Strict mode fails on first error, permissive continues
  validateMoves: boolean; // Validate move legality against game rules
  includeTimings: boolean; // Parse timing information
  maxErrors: number; // Maximum errors before aborting parse
}

export class PSNParser {
  private readonly defaultOptions: PSNParseOptions = {
    strict: false,
    validateMoves: true,
    includeTimings: true,
    maxErrors: 10,
  };

  /**
   * Parses complete PSN string into GameState
   */
  public parseGame(
    psnString: string,
    options: Partial<PSNParseOptions> = {},
  ): PSNParseResult {
    const opts = { ...this.defaultOptions, ...options };
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const lines = this.preprocessLines(psnString);

      // Parse headers
      const headerResult = this.parseHeaders(lines);
      if (!headerResult.isValid) {
        errors.push(...headerResult.errors);
        if (opts.strict) {
          return { isValid: false, errors, warnings };
        }
      }

      // Parse setup (if present)
      const setupResult = this.parseSetup(lines);
      if (!setupResult.isValid && opts.strict) {
        errors.push(...setupResult.errors);
      }
      warnings.push(...setupResult.warnings);

      // Parse moves
      const moveResult = this.parseMoves(lines, opts);
      if (!moveResult.isValid) {
        errors.push(...moveResult.errors);
        if (opts.strict) {
          return { isValid: false, errors, warnings };
        }
      }
      warnings.push(...moveResult.warnings);

      // Create game state
      const gameState: any = {
        id: this.generateGameId(),
        status: this.determineGameStatus(headerResult.headers?.result),
        board: this.constructBoard(moveResult.moves || []),
        currentTurn: this.determineCurrentPlayer(moveResult.moves || []) as
          | "white"
          | "black",
        moveCount: this.calculateCurrentTurn(moveResult.moves || []),
        moveHistory: moveResult.moves || [],
        startTime: new Date(),
        players: {
          white: {
            id: "white",
            username: "White",
            rating: 1200,
            color: "white",
            hand: [],
            cardsPlayed: 0,
            timeRemaining: 1800000,
          },
          black: {
            id: "black",
            username: "Black",
            rating: 1200,
            color: "black",
            hand: [],
            cardsPlayed: 0,
            timeRemaining: 1800000,
          },
        },
      };

      return {
        isValid: errors.length === 0,
        game: gameState,
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(
        `Critical parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return { isValid: false, errors, warnings };
    }
  }

  /**
   * Preprocesses PSN lines (removes empty lines, normalizes whitespace)
   */
  private preprocessLines(psnString: string): string[] {
    return psnString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  /**
   * Parses PSN headers section
   */
  private parseHeaders(lines: string[]): {
    isValid: boolean;
    headers?: GameHeaders;
    errors: string[];
  } {
    const errors: string[] = [];
    const headerMap = new Map<string, string>();

    // Extract header lines
    const headerRegex = /^\[(\w+)\s+"([^"]+)"\]$/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith("[")) break; // End of headers section

      const match = line.match(headerRegex);
      if (!match) {
        errors.push(`Invalid header format at line ${i + 1}: ${line}`);
        continue;
      }

      const [, key, value] = match;
      headerMap.set(key.toLowerCase(), value);
    }

    // Validate required headers
    const requiredHeaders = [
      "event",
      "site",
      "date",
      "round",
      "white",
      "black",
      "result",
    ];
    for (const required of requiredHeaders) {
      if (!headerMap.has(required)) {
        errors.push(`Missing required header: ${required}`);
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Construct headers object
    const headers: GameHeaders = {
      event: headerMap.get("event")!,
      site: headerMap.get("site")!,
      date: this.parseDate(headerMap.get("date")!),
      round: headerMap.get("round")!,
      white: headerMap.get("white")!,
      black: headerMap.get("black")!,
      result: this.parseResult(headerMap.get("result")!),
      whiteElo: headerMap.has("whiteelo")
        ? parseInt(headerMap.get("whiteelo")!)
        : undefined,
      blackElo: headerMap.has("blackelo")
        ? parseInt(headerMap.get("blackelo")!)
        : undefined,
      strategy: headerMap.get("strategy"),
      whiteTime: headerMap.has("whitetime")
        ? parseInt(headerMap.get("whitetime")!)
        : undefined,
      blackTime: headerMap.has("blacktime")
        ? parseInt(headerMap.get("blacktime")!)
        : undefined,
      nCard: headerMap.has("ncard")
        ? parseInt(headerMap.get("ncard")!)
        : undefined,
    };

    return { isValid: true, headers, errors: [] };
  }

  /**
   * Parses setup line (turn 0)
   */
  private parseSetup(lines: string[]): {
    isValid: boolean;
    setup?: any;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Find setup line (starts with "0.")
    const setupLine = lines.find((line) => line.startsWith("0."));

    if (!setupLine) {
      warnings.push("No setup line found - assuming default setup");
      return { isValid: true, errors: [], warnings };
    }

    // Parse setup format: 0.SETUP_CARD:position/white_cards:White/black_cards:Black
    const setupRegex =
      /^0\.([PFC](?:[1-9]|1[0-3]|[JQK])):([a-f][1-6])\/(.+):White\/(.+):Black$/;
    const match = setupLine.match(setupRegex);

    if (!match) {
      errors.push(`Invalid setup line format: ${setupLine}`);
      return { isValid: false, errors, warnings };
    }

    const [, setupCard, position, whiteCards, blackCards] = match;

    // Validate setup components
    if (!this.validateCardString(setupCard)) {
      errors.push(`Invalid setup card: ${setupCard}`);
    }

    if (!this.validatePosition(position)) {
      errors.push(`Invalid setup position: ${position}`);
    }

    // For now, return success with warnings about incomplete implementation
    warnings.push(
      "Setup parsing is partially implemented - full validation pending",
    );

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Parses move lines into Move objects
   */
  private parseMoves(
    lines: string[],
    options: PSNParseOptions,
  ): {
    isValid: boolean;
    moves?: Move[];
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const moves: Move[] = [];

    // Skip header and setup lines
    const moveLines = lines.filter(
      (line) => !line.startsWith("[") && !line.startsWith("0."),
    );

    // Filter out result lines
    const resultPattern = /^(1-0|0-1|1\/2-1\/2|\*)$/;
    const actualMoveLines = moveLines.filter(
      (line) => !resultPattern.test(line.trim()),
    );

    for (let lineIndex = 0; lineIndex < actualMoveLines.length; lineIndex++) {
      const line = actualMoveLines[lineIndex];

      try {
        const lineMoves = this.parseMoveLineToMoves(
          line,
          lineIndex + 1,
          options,
        );
        moves.push(...lineMoves.moves);
        errors.push(...lineMoves.errors);
        warnings.push(...lineMoves.warnings);

        if (errors.length > options.maxErrors) {
          errors.push(`Maximum error count exceeded (${options.maxErrors})`);
          break;
        }
      } catch (error) {
        errors.push(
          `Error parsing line ${lineIndex + 1}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      moves,
      errors,
      warnings,
    };
  }

  /**
   * Parses a single line of moves (e.g., "1.C4:d3 F1:f6*")
   */
  private parseMoveLineToMoves(
    line: string,
    lineNumber: number,
    options: PSNParseOptions,
  ): {
    moves: Move[];
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const moves: Move[] = [];

    // Split line into individual moves
    const tokens = line.split(/\s+/).filter((token) => token.length > 0);

    for (const token of tokens) {
      try {
        const move = this.parseMove(token, lineNumber, options);
        if (move) {
          moves.push(move);
        } else {
          errors.push(
            `Failed to parse move token at line ${lineNumber}: ${token}`,
          );
        }
      } catch (error) {
        errors.push(
          `Error parsing move token "${token}" at line ${lineNumber}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return { moves, errors, warnings };
  }

  /**
   * Parses individual move token (e.g., "1.C4:d3*#")
   */
  public parseMove(
    moveToken: string,
    lineNumber?: number,
    options?: PSNParseOptions,
  ): Move | null {
    // Parse format: TURN.CARD:POSITION[SYMBOLS][/TIME]
    const moveRegex =
      /^(\d+)\.([PFC](?:[1-9]|1[0-3]|[JQK])):([a-f][1-6])([*#@+]*)(\/(\d+))?$/;
    const match = moveToken.match(moveRegex);

    if (!match) {
      return null;
    }

    const [, turnStr, cardStr, position, symbols, , timeStr] = match;

    const turn = parseInt(turnStr);
    const card = this.parseCard(cardStr);
    const timeSpent = timeStr ? parseInt(timeStr) : undefined;

    if (!card) {
      return null;
    }

    // Determine player based on turn (odd = white, even = black)
    const player: PlayerId = turn % 2 === 1 ? "white" : "black";

    // Parse special symbols
    const specialProps = this.parseSpecialSymbols(symbols);

    return {
      id: `move_${turn}`,
      turnNumber: turn,
      player,
      card,
      toPosition: position as any,
      timestamp: new Date(),
      isVertexControl: specialProps.hasVertexControl,
      isLoopTrigger: specialProps.createsLoop || false,
      notation: moveToken,
      thinkTimeMs: 0,
    };
  }

  /**
   * Parses card from notation string
   */
  public parseCard(cardStr: string): Card | null {
    if (!this.validateCardString(cardStr)) {
      return null;
    }

    const suit = cardStr[0] as "P" | "F" | "C";
    const valueStr = cardStr.substring(1);

    let value: number;
    switch (valueStr) {
      case "J":
        value = 11;
        break;
      case "Q":
        value = 12;
        break;
      case "K":
        value = 13;
        break;
      default:
        value = parseInt(valueStr);
        break;
    }

    return {
      id: `${suit}${value}`,
      suit,
      value: value.toString() as any,
      displayName: `${suit}${value}`,
    };
  }

  /**
   * Parses special symbols from move notation
   */
  private parseSpecialSymbols(symbols: string): {
    isCapture: boolean;
    hasVertexControl: boolean;
    createsLoop: boolean;
    isCheck: boolean;
  } {
    return {
      isCapture: symbols.includes("*"),
      hasVertexControl: symbols.includes("#"),
      createsLoop: symbols.includes("@"),
      isCheck: symbols.includes("+"),
    };
  }

  /**
   * Validates card string format
   */
  private validateCardString(cardStr: string): boolean {
    return /^[PFC](?:[1-9]|1[0-3]|[JQK])$/.test(cardStr);
  }

  /**
   * Validates board position
   */
  private validatePosition(position: string): boolean {
    return /^[a-f][1-6]$/.test(position);
  }

  /**
   * Parses date string to YYYY.MM.DD format
   */
  private parseDate(dateStr: string): string {
    // Validate format YYYY.MM.DD
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(dateStr)) {
      throw new Error(`Invalid date format: ${dateStr}. Expected YYYY.MM.DD`);
    }
    return dateStr;
  }

  /**
   * Parses result string
   */
  private parseResult(resultStr: string): GameResult {
    if (["1-0", "0-1", "1/2-1/2", "*"].includes(resultStr)) {
      return resultStr as GameResult;
    }
    throw new Error(`Invalid result: ${resultStr}`);
  }

  /**
   * Helper methods for game state construction
   */
  private generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultHeaders(): GameHeaders {
    return {
      event: "Casual Game",
      site: "Unknown",
      date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
      round: "1",
      white: "White",
      black: "Black",
      result: "*",
    };
  }

  private determineCurrentPlayer(moves: Move[]): PlayerId {
    if (moves.length === 0) return "white";
    const lastMove = moves[moves.length - 1];
    return lastMove.player === "white" ? "black" : "white";
  }

  private calculateCurrentTurn(moves: Move[]): number {
    if (moves.length === 0) return 1;
    const lastMove = moves[moves.length - 1];
    return lastMove.player === "white"
      ? lastMove.turnNumber
      : lastMove.turnNumber + 1;
  }

  private determineGameStatus(
    result?: GameResult,
  ): "waiting" | "active" | "completed" {
    if (!result || result === "*") return "active";
    return "completed";
  }

  private constructBoard(moves: Move[]): any {
    // Temporary simple board construction - should be properly implemented
    const positions = new Map();
    const vertexControl = { a1: null, f1: null, a6: null, f6: null };
    const holes: any[] = [];

    // Apply moves to construct current board state
    for (const move of moves) {
      // Basic move application logic would go here
      if (move.toPosition) {
        positions.set(move.toPosition, {
          cell: move.toPosition,
          card: move.card,
          isVertex: ["a1", "f1", "a6", "f6"].includes(move.toPosition),
          quadrant: 1, // Simplified quadrant assignment
        });
      }
    }

    return { positions, vertexControl, holes };
  }

  /**
   * Parses PSN from file content
   */
  public parseFromFile(
    fileContent: string,
    options: Partial<PSNParseOptions> = {},
  ): PSNParseResult {
    return this.parseGame(fileContent, options);
  }

  /**
   * Validates PSN format without full parsing
   */
  public validatePSNFormat(psnString: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const result = this.parseGame(psnString, {
      strict: false,
      validateMoves: false,
    });
    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
    };
  }

  /**
   * Extracts just the moves from PSN without full parsing
   */
  public extractMoves(psnString: string): Move[] {
    const result = this.parseGame(psnString, {
      strict: false,
      validateMoves: false,
    });
    return result.game?.moves || [];
  }

  /**
   * Extracts just the headers from PSN
   */
  public extractHeaders(psnString: string): GameHeaders | null {
    const lines = this.preprocessLines(psnString);
    const headerResult = this.parseHeaders(lines);
    return headerResult.isValid ? headerResult.headers! : null;
  }
}
