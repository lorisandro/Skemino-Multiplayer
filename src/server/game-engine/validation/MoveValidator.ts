import {
  Move,
  MoveValidation,
  GameState,
  GameBoard,
  BoardCell,
  Card,
  GAME_CONSTANTS,
} from "../../../shared/types/GameTypes";
import { CardManager } from "../core/CardManager";

export class MoveValidator {
  private cardManager: CardManager;

  constructor() {
    this.cardManager = new CardManager();
  }

  public validate(
    move: Move,
    board: GameBoard,
    gameState: GameState,
  ): MoveValidation {
    // 1. Check if it's the player's turn
    if (move.player !== gameState.currentTurn) {
      return {
        valid: false,
        reason: "Not your turn",
      };
    }

    // 2. Check if game is active
    if (gameState.status !== "active") {
      return {
        valid: false,
        reason: "Game is not active",
      };
    }

    // 3. Check if player has the card
    const player = gameState.players[move.player];
    const hasCard = player.hand.some(
      (c) => c.suit === move.card.suit && c.value === move.card.value,
    );

    if (!hasCard) {
      return {
        valid: false,
        reason: "Card not in your hand",
      };
    }

    // 4. Check if target cell is valid
    if (!this.isValidCell(move.toPosition)) {
      return {
        valid: false,
        reason: "Invalid target cell",
      };
    }

    // 5. Check if cell is a hole
    if (board.holes.includes(move.toPosition)) {
      return {
        valid: false,
        reason: "Cannot place card on a hole",
      };
    }

    // 6. Check adjacency rule (must be adjacent to existing card)
    if (!this.checkAdjacency(move.toPosition, board)) {
      return {
        valid: false,
        reason: "Card must be placed adjacent to an existing card",
      };
    }

    // 7. Check if placement is valid (can capture or place on empty)
    const targetPosition = board.positions.get(move.toPosition);
    if (!targetPosition) {
      return {
        valid: false,
        reason: "Invalid board position",
      };
    }

    if (targetPosition.card) {
      // Cell is occupied - check if we can capture
      const canCapture = this.canCaptureCard(
        move.card,
        targetPosition.card,
        move.player,
        move.toPosition,
        board,
      );

      if (!canCapture) {
        return {
          valid: false,
          reason: "Cannot capture this card",
        };
      }
    }

    // 8. Check for special rules on vertices
    if (GAME_CONSTANTS.VERTICES.includes(move.toPosition)) {
      const vertexValidation = this.validateVertexMove(
        move.toPosition,
        move.card,
        move.player,
        board,
      );

      if (!vertexValidation.valid) {
        return vertexValidation;
      }
    }

    // All validations passed
    return {
      valid: true,
      validMoves: this.getValidMovesForCard(
        move.card,
        move.player,
        board,
        gameState,
      ),
    };
  }

  private isValidCell(cell: BoardCell): boolean {
    const col = cell.charCodeAt(0) - 97; // 0-5
    const row = parseInt(cell[1]) - 1; // 0-5
    return col >= 0 && col <= 5 && row >= 0 && row <= 5;
  }

  private checkAdjacency(cell: BoardCell, board: GameBoard): boolean {
    // First move can be placed anywhere
    const occupiedCells = Array.from(board.positions.values()).filter(
      (pos) => pos.card !== null,
    ).length;

    if (occupiedCells === 0) {
      return true; // First card can go anywhere
    }

    // Check if adjacent to at least one existing card
    const adjacentCells = this.getAdjacentCells(cell);
    return adjacentCells.some((adjCell) => {
      const pos = board.positions.get(adjCell);
      return pos && pos.card !== null;
    });
  }

  private getAdjacentCells(cell: BoardCell): BoardCell[] {
    const col = cell.charCodeAt(0) - 97;
    const row = parseInt(cell[1]);
    const adjacent: BoardCell[] = [];

    // North
    if (row < 6) {
      adjacent.push(`${cell[0]}${row + 1}` as BoardCell);
    }
    // South
    if (row > 1) {
      adjacent.push(`${cell[0]}${row - 1}` as BoardCell);
    }
    // East
    if (col < 5) {
      adjacent.push(`${String.fromCharCode(98 + col)}${row}` as BoardCell);
    }
    // West
    if (col > 0) {
      adjacent.push(`${String.fromCharCode(96 + col)}${row}` as BoardCell);
    }

    return adjacent;
  }

  private canCaptureCard(
    attacker: Card,
    defender: Card,
    attackerPlayer: string,
    targetCell: BoardCell,
    board: GameBoard,
  ): boolean {
    // Cannot capture your own card
    const defenderPosition = board.positions.get(targetCell);
    if (!defenderPosition) return false;

    // Apply Morra Cinese rules
    const result = this.cardManager.compareCards(attacker, defender);
    return result === "win";
  }

  private validateVertexMove(
    vertex: BoardCell,
    card: Card,
    player: string,
    board: GameBoard,
  ): MoveValidation {
    // Check if vertex is already controlled
    const vertexControl =
      board.vertexControl[vertex as "a1" | "f1" | "a6" | "f6"];

    if (vertexControl && vertexControl !== player) {
      // Vertex is controlled by opponent
      // Check if this is a "reverser" card (ERA4 condition)
      const existingCard = board.positions.get(vertex)?.card;

      if (existingCard) {
        const canReverse = this.checkReverserCondition(
          card,
          existingCard,
          vertex,
          board,
        );

        if (!canReverse) {
          return {
            valid: false,
            reason:
              "Cannot capture controlled vertex without reverser condition",
          };
        }
      }
    }

    return { valid: true };
  }

  private checkReverserCondition(
    attacker: Card,
    defender: Card,
    vertex: BoardCell,
    board: GameBoard,
  ): boolean {
    // ERA4: Reverser card can capture vertex + adjacent cards
    // Check if attacker can beat defender
    const result = this.cardManager.compareCards(attacker, defender);
    if (result !== "win") return false;

    // Check if attacker can also beat adjacent cards
    const adjacentCells = this.getAdjacentCells(vertex);
    for (const cell of adjacentCells) {
      const position = board.positions.get(cell);
      if (position?.card) {
        const adjResult = this.cardManager.compareCards(
          attacker,
          position.card,
        );
        if (adjResult !== "win") {
          return false; // Must beat all adjacent cards for reverser
        }
      }
    }

    return true; // This is a valid reverser move
  }

  public getValidMovesForCard(
    card: Card,
    player: string,
    board: GameBoard,
    gameState: GameState,
  ): BoardCell[] {
    const validMoves: BoardCell[] = [];

    // Check all cells on the board
    for (const [cell, position] of board.positions) {
      const testMove: Move = {
        id: "test",
        turnNumber: gameState.moveCount + 1,
        player: player as "white" | "black",
        card,
        toPosition: cell,
        isVertexControl: false,
        isLoopTrigger: false,
        notation: "",
        timestamp: new Date(),
        thinkTimeMs: 0,
      };

      const validation = this.validate(testMove, board, gameState);
      if (validation.valid) {
        validMoves.push(cell);
      }
    }

    return validMoves;
  }

  // Validate if a position would create an invalid loop
  public validateLoopFormation(
    cell: BoardCell,
    card: Card,
    board: GameBoard,
  ): boolean {
    const adjacentCells = this.getAdjacentCells(cell);
    const adjacentCards: Card[] = [];

    for (const adjCell of adjacentCells) {
      const position = board.positions.get(adjCell);
      if (position?.card) {
        adjacentCards.push(position.card);
      }
    }

    // Add the new card to check
    adjacentCards.push(card);

    // Check for symbolic loop (3+ different symbols)
    if (adjacentCards.length >= 3) {
      const isSymbolicLoop = this.cardManager.isSymbolicLoop(adjacentCards);
      const isNumericLoop = this.cardManager.isNumericLoop(adjacentCards);

      // Loops can be valid strategic moves in Skèmino
      // Return true if loop is valid (not blocking the game)
      return !(isSymbolicLoop || isNumericLoop);
    }

    return true; // No loop formed
  }

  // Check if any valid moves exist for a player
  public hasValidMoves(
    player: "white" | "black",
    board: GameBoard,
    gameState: GameState,
  ): boolean {
    const playerData = gameState.players[player];

    for (const card of playerData.hand) {
      const validMoves = this.getValidMovesForCard(
        card,
        player,
        board,
        gameState,
      );
      if (validMoves.length > 0) {
        return true;
      }
    }

    return false;
  }
}
