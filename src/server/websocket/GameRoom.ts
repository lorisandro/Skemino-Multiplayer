import { GameEngine } from '../game-engine/core/GameEngine';
import { DatabaseManager } from '../database/DatabaseManager';
import { RedisManager } from '../services/RedisManager';
import { ELOCalculator } from '../game-engine/rules/ELOCalculator';
import { logger } from '../utils/logger';
import {
  GameState,
  Move,
  PlayerColor,
  GameStatus,
  Player
} from '../../shared/types/GameTypes';
import { v4 as uuidv4 } from 'uuid';

export interface GameRoomPlayer {
  userId: string;
  username: string;
  rating: number;
  color?: PlayerColor;
}

export interface GameRoomConfig {
  white: GameRoomPlayer;
  black: GameRoomPlayer;
  timeControl: string;
  rated?: boolean;
}

export interface MoveResult {
  success: boolean;
  error?: string;
  move?: Move;
  gameState: GameState;
}

export interface PlayerTimeData {
  white: number;
  black: number;
  lastMoveTime: number;
}

export class GameRoom {
  private gameId: string;
  private gameEngine: GameEngine;
  private players: Map<PlayerColor, GameRoomPlayer>;
  private config: GameRoomConfig;
  private startTime: Date;
  private lastMoveTime: Date;
  private playerTimes: PlayerTimeData = {
    white: 600000,
    black: 600000,
    lastMoveTime: Date.now()
  };
  private disconnectedPlayers: Set<string> = new Set();
  private drawOffers: Map<PlayerColor, boolean> = new Map();
  private moveTimeouts: Map<PlayerColor, NodeJS.Timeout> = new Map();

  // Time control parsing
  private baseTime: number = 600000; // in milliseconds - initialized with default
  private increment: number = 0; // in milliseconds - initialized with default

  constructor(gameId: string, config: GameRoomConfig) {
    this.gameId = gameId;
    this.config = config;
    this.gameEngine = new GameEngine(gameId);
    this.players = new Map();
    this.players.set('white', config.white);
    this.players.set('black', config.black);

    // Initialize dates with current time
    this.startTime = new Date();
    this.lastMoveTime = new Date();

    // Parse time control (format: "10+5" = 10 minutes + 5 seconds increment)
    this.parseTimeControl(config.timeControl);

    this.initializeGame();
  }

  private parseTimeControl(timeControl: string): void {
    const parts = timeControl.split('+');
    this.baseTime = parseInt(parts[0]) * 60 * 1000; // Convert minutes to milliseconds
    this.increment = parts.length > 1 ? parseInt(parts[1]) * 1000 : 0; // Convert seconds to milliseconds

    // Initialize playerTimes properly
    this.playerTimes = {
      white: this.baseTime,
      black: this.baseTime,
      lastMoveTime: Date.now()
    };
  }

  private initializeGame(): void {
    const gameState = this.gameEngine.getGameState();

    // Set player information
    const whitePlayer = this.players.get('white')!;
    const blackPlayer = this.players.get('black')!;

    gameState.players.white.id = whitePlayer.userId;
    gameState.players.white.username = whitePlayer.username;
    gameState.players.white.rating = whitePlayer.rating;
    gameState.players.white.timeRemaining = this.baseTime;

    gameState.players.black.id = blackPlayer.userId;
    gameState.players.black.username = blackPlayer.username;
    gameState.players.black.rating = blackPlayer.rating;
    gameState.players.black.timeRemaining = this.baseTime;

    // Load the updated state
    this.gameEngine.loadGameState(gameState);

    logger.info(`🎮 Game room initialized: ${this.gameId}`);
  }

  public startGame(): void {
    this.startTime = new Date();
    this.lastMoveTime = new Date();

    // Setup initial position with dice roll
    this.gameEngine.setupInitialPosition();

    // Start move timer for first player
    this.startMoveTimer(this.gameEngine.getGameState().currentTurn);

    // Cache game state in Redis for quick access
    this.cacheGameState();

    logger.info(`🎯 Game ${this.gameId} started`);
  }

  public canPlayerJoin(userId: string): boolean {
    const whitePlayer = this.players.get('white');
    const blackPlayer = this.players.get('black');

    return whitePlayer?.userId === userId || blackPlayer?.userId === userId;
  }

  public canPlayerMove(userId: string): boolean {
    const gameState = this.gameEngine.getGameState();

    if (gameState.status !== 'active') {
      return false;
    }

    const currentPlayer = this.players.get(gameState.currentTurn);
    return currentPlayer?.userId === userId;
  }

  public async applyMove(move: Move, userId: string): Promise<MoveResult> {
    try {
      const gameState = this.gameEngine.getGameState();

      // Verify player can make move
      if (!this.canPlayerMove(userId)) {
        return {
          success: false,
          error: 'Not your turn or game not active',
          gameState
        };
      }

      // Update move timing
      const now = new Date();
      const currentColor = gameState.currentTurn;
      const timeUsed = now.getTime() - this.lastMoveTime.getTime();

      // Update player time
      this.updatePlayerTime(currentColor, timeUsed);
      move.thinkTimeMs = timeUsed;

      // Add move ID and timestamp
      move.id = uuidv4();
      move.timestamp = now;
      move.turnNumber = gameState.moveCount + 1;

      // Validate and apply move through game engine
      const validation = this.gameEngine.validateMove(move);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.reason || 'Invalid move',
          gameState
        };
      }

      // Apply move (server-authoritative)
      const updatedGameState = this.gameEngine.applyMove(move);

      // Clear move timer for current player
      this.clearMoveTimer(currentColor);

      // Add increment time
      if (this.increment > 0) {
        this.addIncrementTime(currentColor);
      }

      // Update last move time
      this.lastMoveTime = now;

      // Start timer for next player if game continues
      if (updatedGameState.status === 'active') {
        this.startMoveTimer(updatedGameState.currentTurn);
      }

      // Clear any draw offers
      this.drawOffers.clear();

      // Cache updated game state
      this.cacheGameState();

      // Log the move
      logger.info(`📝 Move applied in ${this.gameId}: ${move.notation} by ${userId}`);

      return {
        success: true,
        move,
        gameState: updatedGameState
      };

    } catch (error) {
      logger.error(`Error applying move in game ${this.gameId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        gameState: this.gameEngine.getGameState()
      };
    }
  }

  private updatePlayerTime(color: PlayerColor, timeUsedMs: number): void {
    this.playerTimes[color] -= timeUsedMs;

    // Update game state with remaining time
    const gameState = this.gameEngine.getGameState();
    gameState.players[color].timeRemaining = this.playerTimes[color];

    // Check for time loss
    if (this.playerTimes[color] <= 0) {
      this.gameEngine.updatePlayerTime(color, timeUsedMs);
      // Game will be marked as completed by the engine
    } else {
      this.gameEngine.loadGameState(gameState);
    }
  }

  private addIncrementTime(color: PlayerColor): void {
    this.playerTimes[color] += this.increment;
    const gameState = this.gameEngine.getGameState();
    gameState.players[color].timeRemaining = this.playerTimes[color];
    this.gameEngine.loadGameState(gameState);
  }

  private startMoveTimer(color: PlayerColor): void {
    // Clear existing timer
    this.clearMoveTimer(color);

    // Set new timer for maximum move time (typically 30-60 minutes for classical)
    const maxMoveTime = Math.max(this.playerTimes[color], 30000); // Minimum 30 seconds

    const timer = setTimeout(() => {
      logger.info(`⏰ Player ${color} timed out in game ${this.gameId}`);
      this.handleTimeOut(color);
    }, maxMoveTime);

    this.moveTimeouts.set(color, timer);
  }

  private clearMoveTimer(color: PlayerColor): void {
    const timer = this.moveTimeouts.get(color);
    if (timer) {
      clearTimeout(timer);
      this.moveTimeouts.delete(color);
    }
  }

  private handleTimeOut(color: PlayerColor): void {
    // Force time loss
    this.gameEngine.updatePlayerTime(color, this.playerTimes[color] + 1);
    this.cacheGameState();
    logger.info(`🕐 Player ${color} lost on time in game ${this.gameId}`);
  }

  public resignGame(userId: string): void {
    const resigningColor = this.getPlayerColor(userId);
    if (!resigningColor) return;

    this.gameEngine.resign(resigningColor);

    // Clear all timers
    this.clearMoveTimer('white');
    this.clearMoveTimer('black');

    this.cacheGameState();
    logger.info(`🏳️ Player ${userId} resigned in game ${this.gameId}`);
  }

  public acceptDraw(): void {
    const gameState = this.gameEngine.getGameState();
    gameState.status = 'completed';
    gameState.endTime = new Date();
    // No winner indicates draw

    this.gameEngine.loadGameState(gameState);

    // Clear all timers
    this.clearMoveTimer('white');
    this.clearMoveTimer('black');

    this.cacheGameState();
    logger.info(`🤝 Draw accepted in game ${this.gameId}`);
  }

  public handlePlayerDisconnection(userId: string): void {
    this.disconnectedPlayers.add(userId);

    const color = this.getPlayerColor(userId);
    if (color) {
      // Pause game timer temporarily
      const now = Date.now();
      const gameState = this.gameEngine.getGameState();

      if (gameState.currentTurn === color && gameState.status === 'active') {
        const timeUsed = now - this.lastMoveTime.getTime();
        this.updatePlayerTime(color, timeUsed);
        this.clearMoveTimer(color);
      }
    }

    logger.info(`🔌 Player ${userId} disconnected from game ${this.gameId}`);
  }

  public handlePlayerReconnection(userId: string): void {
    this.disconnectedPlayers.delete(userId);

    const color = this.getPlayerColor(userId);
    if (color) {
      const gameState = this.gameEngine.getGameState();

      // Resume timer if it's player's turn
      if (gameState.currentTurn === color && gameState.status === 'active') {
        this.lastMoveTime = new Date();
        this.startMoveTimer(color);
      }
    }

    logger.info(`🔄 Player ${userId} reconnected to game ${this.gameId}`);
  }

  private getPlayerColor(userId: string): PlayerColor | null {
    for (const [color, player] of this.players) {
      if (player.userId === userId) {
        return color;
      }
    }
    return null;
  }

  private async cacheGameState(): Promise<void> {
    try {
      const gameState = this.gameEngine.getGameState();
      await RedisManager.setGame(this.gameId, {
        ...gameState,
        playerTimes: this.playerTimes,
        disconnectedPlayers: Array.from(this.disconnectedPlayers)
      });
    } catch (error) {
      logger.error(`Error caching game state for ${this.gameId}:`, error);
    }
  }

  public async saveGameToDatabase(): Promise<void> {
    try {
      const gameState = this.gameEngine.getGameState();
      const psnNotation = this.gameEngine.generatePSN();

      // Fix: Use proper result type conversion
      const getGameResult = (): '1-0' | '0-1' | '1/2-1/2' => {
        if (gameState.winner === 'white') {
          return '1-0';
        } else if (gameState.winner === 'black') {
          return '0-1';
        } else {
          return '1/2-1/2'; // Draw
        }
      };

      const gameRecord = {
        id: this.gameId,
        whitePlayerId: gameState.players.white.id,
        blackPlayerId: gameState.players.black.id,
        result: getGameResult(),
        status: gameState.status,
        startTime: this.startTime,
        endTime: gameState.endTime || new Date(),
        moveCount: gameState.moveCount,
        psnNotation: psnNotation,
        timeControl: this.config.timeControl,
        victoryCondition: gameState.victoryCondition,
        whiteTime: this.playerTimes.white,
        blackTime: this.playerTimes.black
      };

      await DatabaseManager.saveGame(gameRecord);

      // Save individual moves
      for (const move of gameState.moveHistory) {
        await DatabaseManager.saveMove(this.gameId, move);
      }

      logger.info(`💾 Game ${this.gameId} saved to database`);
    } catch (error) {
      logger.error(`Error saving game ${this.gameId} to database:`, error);
    }
  }

  public async updatePlayerRatings(): Promise<void> {
    try {
      if (!this.config.rated) return;

      const gameState = this.gameEngine.getGameState();
      const whitePlayer = gameState.players.white;
      const blackPlayer = gameState.players.black;

      if (!gameState.winner) {
        // Draw
        const whiteNewRating = ELOCalculator.calculateNewRating(
          whitePlayer.rating,
          blackPlayer.rating,
          0.5
        );
        const blackNewRating = ELOCalculator.calculateNewRating(
          blackPlayer.rating,
          whitePlayer.rating,
          0.5
        );

        await DatabaseManager.updatePlayerRating(whitePlayer.id, whiteNewRating);
        await DatabaseManager.updatePlayerRating(blackPlayer.id, blackNewRating);

        logger.info(`📊 Ratings updated for draw: ${whitePlayer.username} ${whitePlayer.rating}→${whiteNewRating}, ${blackPlayer.username} ${blackPlayer.rating}→${blackNewRating}`);
      } else {
        // Win/Loss
        const whiteScore = gameState.winner === 'white' ? 1 : 0;
        const blackScore = 1 - whiteScore;

        const whiteNewRating = ELOCalculator.calculateNewRating(
          whitePlayer.rating,
          blackPlayer.rating,
          whiteScore
        );
        const blackNewRating = ELOCalculator.calculateNewRating(
          blackPlayer.rating,
          whitePlayer.rating,
          blackScore
        );

        await DatabaseManager.updatePlayerRating(whitePlayer.id, whiteNewRating);
        await DatabaseManager.updatePlayerRating(blackPlayer.id, blackNewRating);

        logger.info(`📊 Ratings updated: Winner ${gameState.winner === 'white' ? whitePlayer.username : blackPlayer.username}, ${whitePlayer.username} ${whitePlayer.rating}→${whiteNewRating}, ${blackPlayer.username} ${blackPlayer.rating}→${blackNewRating}`);
      }
    } catch (error) {
      logger.error(`Error updating ratings for game ${this.gameId}:`, error);
    }
  }

  // Public getters
  public getGameState(): GameState {
    return this.gameEngine.getGameState();
  }

  public getGameId(): string {
    return this.gameId;
  }

  public getPlayers(): string[] {
    return Array.from(this.players.values()).map(p => p.userId);
  }

  public isActive(): boolean {
    const status = this.gameEngine.getGameState().status;
    return status === 'active' || status === 'paused';
  }

  public getPlayerTimes(): PlayerTimeData {
    return { ...this.playerTimes };
  }

  public generatePSN(): string {
    return this.gameEngine.generatePSN();
  }

  public isPlayerDisconnected(userId: string): boolean {
    return this.disconnectedPlayers.has(userId);
  }

  // Cleanup method
  public cleanup(): void {
    // Clear all timers
    this.clearMoveTimer('white');
    this.clearMoveTimer('black');

    // Clear Redis cache
    RedisManager.deleteGame(this.gameId).catch(error => {
      logger.error(`Error clearing game cache for ${this.gameId}:`, error);
    });

    logger.info(`🧹 Game room ${this.gameId} cleaned up`);
  }
}