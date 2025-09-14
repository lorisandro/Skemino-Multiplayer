import {
  GameState,
  GameBoard,
  Move,
  PlayerColor,
  VictoryCondition,
  BoardCell,
  GAME_CONSTANTS
} from '../../../shared/types/GameTypes';
import { CardManager } from '../core/CardManager';
import { VertexController } from './VertexController';
import { MoveValidator } from '../validation/MoveValidator';

interface VictoryCheckResult {
  isVictory: boolean;
  condition?: VictoryCondition;
  winner?: PlayerColor;
  details?: string;
}

export class VictoryChecker {
  private cardManager: CardManager;
  private vertexController: VertexController;
  private moveValidator: MoveValidator;

  constructor() {
    this.cardManager = new CardManager();
    this.vertexController = new VertexController();
    this.moveValidator = new MoveValidator();
  }

  public checkVictory(
    gameState: GameState,
    board: GameBoard,
    lastMove: Move
  ): VictoryCheckResult {
    // Check ERA1: Vertex victory
    const era1 = this.checkERA1(gameState, board, lastMove);
    if (era1.isVictory) {
      return era1;
    }

    // Check ERA4: Reverser card victory
    const era4 = this.checkERA4(gameState, board, lastMove);
    if (era4.isVictory) {
      return era4;
    }

    // Check ERA2: Board saturation
    const era2 = this.checkERA2(gameState, board);
    if (era2.isVictory) {
      return era2;
    }

    // Check ERA3: Deck exhaustion
    const era3 = this.checkERA3(gameState, board);
    if (era3.isVictory) {
      return era3;
    }

    return { isVictory: false };
  }

  // ERA1: Win by placing last card on controlled vertex
  private checkERA1(
    gameState: GameState,
    board: GameBoard,
    lastMove: Move
  ): VictoryCheckResult {
    // Check if move was on a vertex
    if (!GAME_CONSTANTS.VERTICES.includes(lastMove.toPosition)) {
      return { isVictory: false };
    }

    // Check if player has no more cards
    const player = gameState.players[lastMove.player];
    if (player.hand.length > 0) {
      return { isVictory: false };
    }

    // Check if player controls the vertex
    const vertexControl = board.vertexControl[
      lastMove.toPosition as 'a1' | 'f1' | 'a6' | 'f6'
    ];

    if (vertexControl === lastMove.player) {
      return {
        isVictory: true,
        condition: 'ERA1',
        winner: lastMove.player,
        details: `Victory by placing last card on controlled vertex ${lastMove.toPosition}`
      };
    }

    return { isVictory: false };
  }

  // ERA2: Win when opponent cannot place cards (board saturation)
  private checkERA2(
    gameState: GameState,
    board: GameBoard
  ): VictoryCheckResult {
    // Check if current player has valid moves
    const currentPlayer = gameState.currentTurn;
    const hasValidMoves = this.moveValidator.hasValidMoves(
      currentPlayer,
      board,
      gameState
    );

    if (!hasValidMoves) {
      // Current player cannot move - calculate scores
      const scores = this.calculateScores(board);
      const winner = scores.white > scores.black ? 'white' : 'black';

      return {
        isVictory: true,
        condition: 'ERA2',
        winner,
        details: `Board saturation - Winner by score: White ${scores.white}, Black ${scores.black}`
      };
    }

    return { isVictory: false };
  }

  // ERA3: Win when decks are exhausted
  private checkERA3(
    gameState: GameState,
    board: GameBoard
  ): VictoryCheckResult {
    // Check if both players have no cards left
    const whiteCards = gameState.players.white.hand.length;
    const blackCards = gameState.players.black.hand.length;

    if (whiteCards === 0 && blackCards === 0) {
      // Calculate scores
      const scores = this.calculateScores(board);
      const winner = scores.white > scores.black ? 'white' : 'black';

      return {
        isVictory: true,
        condition: 'ERA3',
        winner,
        details: `Deck exhaustion - Winner by score: White ${scores.white}, Black ${scores.black}`
      };
    }

    // Check if one player is out of time
    if (gameState.players.white.timeRemaining <= 0) {
      return {
        isVictory: true,
        condition: 'ERA3',
        winner: 'black',
        details: 'White player ran out of time'
      };
    }

    if (gameState.players.black.timeRemaining <= 0) {
      return {
        isVictory: true,
        condition: 'ERA3',
        winner: 'white',
        details: 'Black player ran out of time'
      };
    }

    return { isVictory: false };
  }

  // ERA4: Win with reverser card (capture vertex + adjacent)
  private checkERA4(
    gameState: GameState,
    board: GameBoard,
    lastMove: Move
  ): VictoryCheckResult {
    // Check if move was on a vertex
    if (!GAME_CONSTANTS.VERTICES.includes(lastMove.toPosition)) {
      return { isVictory: false };
    }

    // Check if this was a reverser move
    if (!this.isReverserMove(board, lastMove)) {
      return { isVictory: false };
    }

    // Reverser move captures vertex and all adjacent cards
    const capturedCount = this.countReverserCaptures(board, lastMove.toPosition);

    if (capturedCount >= 2) { // Vertex + at least 1 adjacent
      return {
        isVictory: true,
        condition: 'ERA4',
        winner: lastMove.player,
        details: `Reverser victory on ${lastMove.toPosition} capturing ${capturedCount} cards`
      };
    }

    return { isVictory: false };
  }

  private isReverserMove(board: GameBoard, move: Move): boolean {
    // A reverser move must:
    // 1. Capture the vertex card
    if (!move.capturedCard) return false;

    // 2. Be able to capture all adjacent cards
    const adjacentCells = this.getAdjacentCells(move.toPosition);
    for (const cell of adjacentCells) {
      const position = board.positions.get(cell);
      if (position?.card) {
        const canCapture = this.cardManager.compareCards(
          move.card,
          position.card
        ) === 'win';
        if (!canCapture) {
          return false;
        }
      }
    }

    return true;
  }

  private countReverserCaptures(
    board: GameBoard,
    vertexCell: BoardCell
  ): number {
    let count = 1; // The vertex itself

    const adjacentCells = this.getAdjacentCells(vertexCell);
    for (const cell of adjacentCells) {
      const position = board.positions.get(cell);
      if (position?.card) {
        count++;
      }
    }

    return count;
  }

  private calculateScores(board: GameBoard): { white: number; black: number } {
    let whiteScore = 0;
    let blackScore = 0;

    // Note: We need to track card ownership properly
    // For now, this is a simplified version
    board.positions.forEach((position) => {
      if (position.card) {
        const cardValue = GAME_CONSTANTS.CARD_VALUES[position.card.value];
        // We would need to determine the owner from game state
        // This is a placeholder implementation
      }
    });

    // Add vertex control bonuses
    const vertexStatus = this.vertexController.getVertexStatus(board);
    vertexStatus.forEach((status, vertex) => {
      if (status.controller === 'white') {
        whiteScore += status.isExclusive ? 20 : 10;
      } else if (status.controller === 'black') {
        blackScore += status.isExclusive ? 20 : 10;
      }
    });

    return { white: whiteScore, black: blackScore };
  }

  private getAdjacentCells(cell: BoardCell): BoardCell[] {
    const col = cell.charCodeAt(0) - 97;
    const row = parseInt(cell[1]);
    const adjacent: BoardCell[] = [];

    if (row < 6) adjacent.push(`${cell[0]}${row + 1}` as BoardCell);
    if (row > 1) adjacent.push(`${cell[0]}${row - 1}` as BoardCell);
    if (col < 5) adjacent.push(`${String.fromCharCode(98 + col)}${row}` as BoardCell);
    if (col > 0) adjacent.push(`${String.fromCharCode(96 + col)}${row}` as BoardCell);

    return adjacent;
  }

  // Check for draw conditions
  public checkDraw(gameState: GameState): boolean {
    // Draw can occur if:
    // 1. Both players agree to draw
    // 2. Repetition of position (3-fold)
    // 3. 50 moves without capture

    // Check for 50-move rule
    const lastCapture = gameState.moveHistory
      .reverse()
      .findIndex(m => m.capturedCard !== undefined);

    if (lastCapture === -1 && gameState.moveHistory.length >= 50) {
      return true;
    }

    if (lastCapture >= 50) {
      return true;
    }

    return false;
  }

  // Evaluate position for AI/analysis
  public evaluatePosition(
    board: GameBoard,
    currentPlayer: PlayerColor
  ): number {
    let evaluation = 0;

    // Material count
    const cardCount = this.countCards(board);
    const materialDiff = currentPlayer === 'white' ?
      cardCount.white - cardCount.black :
      cardCount.black - cardCount.white;
    evaluation += materialDiff * 10;

    // Vertex control
    const vertexDominance = this.vertexController.checkDominance(board);
    const vertexDiff = currentPlayer === 'white' ?
      vertexDominance.white - vertexDominance.black :
      vertexDominance.black - vertexDominance.white;
    evaluation += vertexDiff * 25;

    // Central control
    const centralControl = this.evaluateCentralControl(board, currentPlayer);
    evaluation += centralControl * 15;

    return evaluation;
  }

  private countCards(board: GameBoard): { white: number; black: number } {
    // This would need proper implementation with card ownership tracking
    return { white: 0, black: 0 };
  }

  private evaluateCentralControl(
    board: GameBoard,
    player: PlayerColor
  ): number {
    const centralSquares: BoardCell[] = ['c3', 'c4', 'd3', 'd4'];
    let control = 0;

    for (const square of centralSquares) {
      const position = board.positions.get(square);
      if (position?.card) {
        // Would need to check ownership
        control++;
      }
    }

    return control;
  }
}