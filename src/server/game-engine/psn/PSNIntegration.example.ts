/**
 * PSNIntegration.example.ts - Integration Examples
 *
 * Demonstrates how to integrate the PSN system with the Skèmino game engine:
 * - Recording moves in PSN format during gameplay
 * - Loading games from PSN archives
 * - Real-time PSN generation for live games
 * - Archive management and statistics
 */

import {
  PSNGenerator,
  PSNParser,
  PSNUtils,
  GameState,
  Move,
  GameHeaders,
  PSNParseResult,
} from "./index";

/**
 * Example: Game Engine with PSN Recording
 */
export class SkeminoGameWithPSN {
  private generator: PSNGenerator;
  private parser: PSNParser;
  private utils: PSNUtils;
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.generator = new PSNGenerator();
    this.parser = new PSNParser();
    this.utils = new PSNUtils();
    this.gameState = gameState;
  }

  /**
   * Make a move and update PSN notation
   */
  public makeMove(
    card: any,
    position: string,
    specialEffects?: {
      isCapture?: boolean;
      hasVertexControl?: boolean;
      createsLoop?: boolean;
      isCheck?: boolean;
    },
  ): { success: boolean; psnMove?: string; error?: string } {
    try {
      // Create move object
      const move: Move = {
        turn: this.gameState.turn,
        player: this.gameState.currentPlayer,
        card,
        position: position as any,
        timestamp: new Date(),
        isCapture: specialEffects?.isCapture || false,
        hasVertexControl: specialEffects?.hasVertexControl || false,
        createsLoop: specialEffects?.createsLoop || false,
        isCheck: specialEffects?.isCheck || false,
      };

      // Validate move notation
      const notation = this.generator.generateMoveNotation(move);
      const validation = this.generator.validateMoveNotation(notation);

      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(", ") };
      }

      // Add move to game state
      this.gameState.moves.push(move);
      this.updateGameState();

      return { success: true, psnMove: notation };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get current game PSN
   */
  public getCurrentPSN(): string {
    return this.generator.generateGamePSN(this.gameState);
  }

  /**
   * Get compact PSN for storage
   */
  public getCompactPSN(): string {
    return this.generator.generateCompactPSN(this.gameState);
  }

  /**
   * Export game to PSN file
   */
  public async exportGame(filePath: string): Promise<boolean> {
    try {
      await this.utils.saveGameToPSN(this.gameState, filePath);
      return true;
    } catch (error) {
      console.error("Export failed:", error);
      return false;
    }
  }

  /**
   * Load game from PSN file
   */
  public static async loadGame(
    filePath: string,
  ): Promise<SkeminoGameWithPSN | null> {
    const utils = new PSNUtils();
    const result = await utils.loadGameFromPSN(filePath);

    if (result.isValid && result.game) {
      return new SkeminoGameWithPSN(result.game);
    }

    console.error("Failed to load game:", result.errors);
    return null;
  }

  private updateGameState(): void {
    // Update current player and turn
    this.gameState.currentPlayer =
      this.gameState.currentPlayer === "white" ? "black" : "white";
    if (this.gameState.currentPlayer === "white") {
      this.gameState.turn++;
    }
  }
}

/**
 * Example: Live Game PSN Streaming
 */
export class LiveGamePSNStreamer {
  private generator: PSNGenerator;
  private moveHistory: Move[] = [];
  private observers: Array<(psnMove: string) => void> = [];

  constructor() {
    this.generator = new PSNGenerator();
  }

  /**
   * Subscribe to PSN move updates
   */
  public onMoveNotation(callback: (psnMove: string) => void): void {
    this.observers.push(callback);
  }

  /**
   * Record a move and notify observers
   */
  public recordMove(move: Move): void {
    this.moveHistory.push(move);
    const notation = this.generator.generateMoveNotation(move);

    // Notify all observers
    this.observers.forEach((callback) => callback(notation));
  }

  /**
   * Get full game PSN up to current move
   */
  public getCurrentGamePSN(headers: GameHeaders): string {
    const gameState: GameState = {
      id: "live-game",
      headers,
      moves: this.moveHistory,
      currentPlayer: this.moveHistory.length % 2 === 0 ? "white" : "black",
      turn: Math.floor(this.moveHistory.length / 2) + 1,
      status: "playing",
      board: new Map(),
      whiteCards: [],
      blackCards: [],
    };

    return this.generator.generateGamePSN(gameState);
  }
}

/**
 * Example: PSN Archive Manager
 */
export class PSNArchiveManager {
  private utils: PSNUtils;

  constructor() {
    this.utils = new PSNUtils();
  }

  /**
   * Process PSN archive directory
   */
  public async processArchive(directoryPath: string): Promise<{
    stats: any;
    validationReport: any;
    totalGames: number;
  }> {
    // Generate archive statistics
    const stats = await this.utils.generateArchiveStats(directoryPath);

    // Validate all files
    const validationReport = await this.utils.validatePSNArchive(directoryPath);

    return {
      stats,
      validationReport,
      totalGames: stats.totalGames,
    };
  }

  /**
   * Find games by player
   */
  public async findGamesByPlayer(
    directoryPath: string,
    playerName: string,
  ): Promise<PSNParseResult[]> {
    const games = await this.utils.loadGamesFromDirectory(directoryPath);

    return games
      .map((g) => g.result)
      .filter(
        (result) =>
          result.isValid &&
          result.game &&
          (result.game.headers.white === playerName ||
            result.game.headers.black === playerName),
      );
  }

  /**
   * Repair broken PSN files in directory
   */
  public async repairArchive(directoryPath: string): Promise<{
    processed: number;
    repaired: number;
    errors: string[];
  }> {
    const files = await require("fs").promises.readdir(directoryPath);
    const psnFiles = files.filter((file: string) => file.endsWith(".psn"));

    let processed = 0;
    let repaired = 0;
    const errors: string[] = [];

    for (const fileName of psnFiles) {
      try {
        const filePath = require("path").join(directoryPath, fileName);
        const content = await require("fs").promises.readFile(
          filePath,
          "utf-8",
        );

        const repair = this.utils.repairPSNString(content);

        if (repair.changes.length > 0) {
          await require("fs").promises.writeFile(
            filePath,
            repair.repaired,
            "utf-8",
          );
          repaired++;
        }

        processed++;
      } catch (error) {
        errors.push(
          `${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return { processed, repaired, errors };
  }
}

/**
 * Example: PSN-based Game Analysis
 */
export class PSNGameAnalyzer {
  private parser: PSNParser;
  private generator: PSNGenerator;

  constructor() {
    this.parser = new PSNParser();
    this.generator = new PSNGenerator();
  }

  /**
   * Analyze opening moves from PSN collection
   */
  public analyzeOpenings(games: GameState[]): Map<
    string,
    {
      count: number;
      whiteWins: number;
      blackWins: number;
      draws: number;
    }
  > {
    const openingStats = new Map();

    for (const game of games) {
      if (game.moves.length < 6) continue; // Need at least 3 moves per side

      // Get first 6 moves (3 for each player)
      const opening = game.moves
        .slice(0, 6)
        .map((move) => this.generator.generateMoveNotation(move))
        .join(" ");

      if (!openingStats.has(opening)) {
        openingStats.set(opening, {
          count: 0,
          whiteWins: 0,
          blackWins: 0,
          draws: 0,
        });
      }

      const stats = openingStats.get(opening);
      stats.count++;

      switch (game.headers.result) {
        case "1-0":
          stats.whiteWins++;
          break;
        case "0-1":
          stats.blackWins++;
          break;
        case "1/2-1/2":
          stats.draws++;
          break;
      }
    }

    return openingStats;
  }

  /**
   * Find tactical patterns in games
   */
  public findTacticalPatterns(games: GameState[]): {
    captures: number;
    vertexControls: number;
    loops: number;
    checks: number;
    combinations: number;
  } {
    const patterns = {
      captures: 0,
      vertexControls: 0,
      loops: 0,
      checks: 0,
      combinations: 0,
    };

    for (const game of games) {
      for (const move of game.moves) {
        if (move.isCapture) patterns.captures++;
        if (move.hasVertexControl) patterns.vertexControls++;
        if (move.createsLoop) patterns.loops++;
        if (move.isCheck) patterns.checks++;

        // Count combinations (moves with multiple special effects)
        const effectCount = [
          move.isCapture,
          move.hasVertexControl,
          move.createsLoop,
          move.isCheck,
        ].filter(Boolean).length;

        if (effectCount > 1) patterns.combinations++;
      }
    }

    return patterns;
  }
}

/**
 * Example usage and integration tests
 */
export async function exampleUsage(): Promise<void> {
  console.log("=== PSN System Integration Examples ===");

  // Example 1: Create a game with PSN recording
  const headers: GameHeaders = {
    event: "Example Tournament",
    site: "Example City, Example Region EXA",
    date: "2025.09.14",
    round: "1",
    white: "Alice",
    black: "Bob",
    result: "*",
  };

  const initialGameState: GameState = {
    id: "example-game",
    headers,
    moves: [],
    currentPlayer: "white",
    turn: 1,
    status: "playing",
    board: new Map(),
    whiteCards: [],
    blackCards: [],
  };

  const game = new SkeminoGameWithPSN(initialGameState);

  // Make some moves
  console.log("\n--- Making Moves ---");

  let result = game.makeMove({ suit: "P", value: 4 }, "d3");
  console.log("Move 1:", result);

  result = game.makeMove({ suit: "F", value: 1 }, "f6", { isCapture: true });
  console.log("Move 2:", result);

  // Get PSN representation
  console.log("\n--- Current PSN ---");
  console.log(game.getCurrentPSN());

  // Example 2: Live streaming
  console.log("\n--- Live PSN Streaming ---");
  const streamer = new LiveGamePSNStreamer();

  streamer.onMoveNotation((notation) => {
    console.log("Live move:", notation);
  });

  // Simulate moves
  streamer.recordMove({
    turn: 1,
    player: "white",
    card: { suit: "C", value: 7 },
    position: "c2",
    timestamp: new Date(),
    isCapture: false,
    hasVertexControl: true,
    createsLoop: false,
    isCheck: false,
  });

  console.log("\nLive game PSN:");
  console.log(streamer.getCurrentGamePSN(headers));
}

// Run example if this file is executed directly
if (require.main === module) {
  exampleUsage().catch(console.error);
}
