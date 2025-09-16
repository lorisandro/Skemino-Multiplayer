import {
  GameState,
  Move,
  MoveValidation,
  Card,
  BoardCell,
  PlayerColor,
  GameStatus,
  VictoryCondition,
  LoopDetection,
  GAME_CONSTANTS
} from '../../../shared/types/GameTypes';
import { GameBoard } from './GameBoard';
import { CardManager } from './CardManager';
import { MoveValidator } from '../validation/MoveValidator';
import { LoopDetector } from '../rules/LoopDetector';
import { VertexController } from '../rules/VertexController';
import { VictoryChecker } from '../rules/VictoryChecker';
import { PSNGenerator } from '../psn/PSNGenerator';
import { v4 as uuidv4 } from 'uuid';

export class GameEngine {
  private gameState: GameState;
  private board: GameBoard;
  private cardManager: CardManager;
  private moveValidator: MoveValidator;
  private loopDetector: LoopDetector;
  private vertexController: VertexController;
  private victoryChecker: VictoryChecker;
  private psnGenerator: PSNGenerator;

  constructor(gameId?: string) {
    this.board = new GameBoard();
    this.cardManager = new CardManager();
    this.moveValidator = new MoveValidator();
    this.loopDetector = new LoopDetector();
    this.vertexController = new VertexController();
    this.victoryChecker = new VictoryChecker();
    this.psnGenerator = new PSNGenerator();

    this.gameState = this.initializeGameState(gameId);
  }

  private initializeGameState(gameId?: string): GameState {
    const whiteCards = this.cardManager.shuffleAndDeal();
    const blackCards = this.cardManager.shuffleAndDeal();

    return {
      id: gameId || uuidv4(),
      board: this.board.getState(),
      players: {
        white: {
          id: '',
          username: '',
          rating: 1200,
          color: 'white',
          hand: whiteCards,
          cardsPlayed: 0,
          timeRemaining: 600000 // 10 minutes in ms
        },
        black: {
          id: '',
          username: '',
          rating: 1200,
          color: 'black',
          hand: blackCards,
          cardsPlayed: 0,
          timeRemaining: 600000
        }
      },
      currentTurn: 'white',
      status: 'waiting',
      moveCount: 0,
      moveHistory: [],
      startTime: new Date()
    };
  }

  // Setup phase with 3 dice
  public setupInitialPosition(): void {
    const numericDice = Math.floor(Math.random() * 6) + 1;
    const alphabeticDice = String.fromCharCode(97 + Math.floor(Math.random() * 6)); // a-f
    const bicolorDice = Math.random() < 0.5 ? 'white' : 'black';

    this.gameState.setupDice = {
      numeric: numericDice,
      alphabetic: alphabeticDice,
      bicolor: bicolorDice as PlayerColor
    };

    // Place initial card based on dice
    const initialCell = `${alphabeticDice}${numericDice}` as BoardCell;
    const player = this.gameState.players[bicolorDice];

    if (player.hand.length > 0) {
      const initialCard = player.hand[0];
      this.board.placeCard(initialCell, initialCard, bicolorDice as PlayerColor);
      player.hand = player.hand.slice(1);
      player.cardsPlayed++;
    }

    this.gameState.currentTurn = bicolorDice as PlayerColor;
    this.gameState.status = 'active';
  }

  // Validate a move
  public validateMove(move: Move): MoveValidation {
    // Basic validation
    if (this.gameState.status !== 'active') {
      return { valid: false, reason: 'Game is not active' };
    }

    if (move.player !== this.gameState.currentTurn) {
      return { valid: false, reason: 'Not your turn' };
    }

    // Check if player has the card
    const player = this.gameState.players[move.player];
    const hasCard = player.hand.some(c =>
      c.suit === move.card.suit && c.value === move.card.value
    );

    if (!hasCard) {
      return { valid: false, reason: 'Card not in hand' };
    }

    // Validate move with rule engine
    const validation = this.moveValidator.validate(
      move,
      this.board.getState(),
      this.gameState
    );

    if (!validation.valid) {
      return validation;
    }

    // Check for loop formation
    const loopCheck = this.loopDetector.checkForLoop(
      this.board.getState(),
      move.toPosition,
      move.card
    );

    // Fix: Check against valid loop types instead of "invalid"
    if (loopCheck.hasLoop && loopCheck.type && (loopCheck.type === 'symbolic' || loopCheck.type === 'numeric')) {
      // For now, we'll allow loops but track them
      // The actual game rules would determine if this creates a valid or invalid state
    }

    return { valid: true };
  }

  // Apply a validated move
  public applyMove(move: Move): GameState {
    const validation = this.validateMove(move);
    if (!validation.valid) {
      throw new Error(`Invalid move: ${validation.reason}`);
    }

    // Remove card from player's hand
    const player = this.gameState.players[move.player];
    player.hand = player.hand.filter(c =>
      !(c.suit === move.card.suit && c.value === move.card.value)
    );
    player.cardsPlayed++;

    // Apply move to board
    const capturedCard = this.board.placeCard(move.toPosition, move.card, move.player);
    if (capturedCard) {
      move.capturedCard = capturedCard;
    }

    // Check for vertex control
    const vertexControl = this.vertexController.checkVertexControl(
      this.board.getState(),
      move.toPosition,
      move.player
    );
    move.isVertexControl = vertexControl.isControlled;

    // Check for loop trigger
    const loopCheck = this.loopDetector.checkForLoop(
      this.board.getState(),
      move.toPosition,
      move.card
    );
    move.isLoopTrigger = loopCheck.hasLoop;

    // Generate PSN notation - Fix: Use correct method name
    move.notation = this.psnGenerator.generateMoveNotation(move);

    // Add to move history
    this.gameState.moveHistory.push(move);
    this.gameState.moveCount++;

    // Check victory conditions
    const victoryCheck = this.victoryChecker.checkVictory(
      this.gameState,
      this.board.getState(),
      move
    );

    if (victoryCheck.isVictory) {
      this.gameState.status = 'completed';
      this.gameState.winner = move.player;
      this.gameState.victoryCondition = victoryCheck.condition;
      this.gameState.endTime = new Date();
    } else {
      // Switch turns
      this.gameState.currentTurn =
        this.gameState.currentTurn === 'white' ? 'black' : 'white';
    }

    return this.gameState;
  }

  // Get valid moves for current player
  public getValidMoves(): BoardCell[] {
    if (this.gameState.status !== 'active') {
      return [];
    }

    const currentPlayer = this.gameState.currentTurn;
    const validMoves: BoardCell[] = [];

    // Check all empty cells
    const allCells = this.board.getAllCells();
    for (const cell of allCells) {
      if (!this.board.hasCard(cell)) {
        // Check if placement is valid (adjacent to existing card)
        if (this.board.isAdjacentToCard(cell)) {
          validMoves.push(cell);
        }
      }
    }

    return validMoves;
  }

  // Get current game state
  public getGameState(): GameState {
    return { ...this.gameState };
  }

  // Load a game state
  public loadGameState(state: GameState): void {
    this.gameState = state;
    this.board.loadState(state.board);
  }

  // Generate PSN for the game - Fix: Use correct method name
  public generatePSN(): string {
    return this.psnGenerator.generateGamePSN(this.gameState);
  }

  // Calculate scores for ERA2/ERA3 endings
  public calculateScores(): { white: number; black: number } {
    let whiteScore = 0;
    let blackScore = 0;

    const boardState = this.board.getState();
    boardState.positions.forEach((position) => {
      if (position.card) {
        const cardValue = GAME_CONSTANTS.CARD_VALUES[position.card.value];
        if (this.board.getCardOwner(position.cell) === 'white') {
          whiteScore += cardValue;
        } else {
          blackScore += cardValue;
        }
      }
    });

    return { white: whiteScore, black: blackScore };
  }

  // Handle time control
  public updatePlayerTime(player: PlayerColor, timeUsedMs: number): void {
    this.gameState.players[player].timeRemaining -= timeUsedMs;

    if (this.gameState.players[player].timeRemaining <= 0) {
      // Player loses on time
      this.gameState.status = 'completed';
      this.gameState.winner = player === 'white' ? 'black' : 'white';
      this.gameState.victoryCondition = 'ERA3'; // Time loss counts as ERA3
      this.gameState.endTime = new Date();
    }
  }

  // Offer draw
  public offerDraw(player: PlayerColor): void {
    // Implementation for draw offers
    // This would typically involve state management for draw offers
  }

  // Resign game
  public resign(player: PlayerColor): void {
    this.gameState.status = 'completed';
    this.gameState.winner = player === 'white' ? 'black' : 'white';
    this.gameState.endTime = new Date();
  }
}