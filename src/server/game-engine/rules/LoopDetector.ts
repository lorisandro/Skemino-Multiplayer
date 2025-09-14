import {
  GameBoard,
  BoardCell,
  Card,
  LoopDetection
} from '../../../shared/types/GameTypes';
import { CardManager } from '../core/CardManager';

export class LoopDetector {
  private cardManager: CardManager;

  constructor() {
    this.cardManager = new CardManager();
  }

  public checkForLoop(
    board: GameBoard,
    targetCell: BoardCell,
    newCard: Card
  ): LoopDetection & { type?: 'symbolic' | 'numeric' | 'invalid' } {
    // Get all adjacent cells
    const adjacentCells = this.getAdjacentCells(targetCell);
    const adjacentCards: Array<{ cell: BoardCell; card: Card }> = [];

    // Collect adjacent cards
    for (const cell of adjacentCells) {
      const position = board.positions.get(cell);
      if (position?.card) {
        adjacentCards.push({ cell, card: position.card });
      }
    }

    // Need at least 2 adjacent cards to form a loop with the new card
    if (adjacentCards.length < 2) {
      return { hasLoop: false };
    }

    // Check for symbolic loop (3+ different symbols)
    const symbolicLoop = this.checkSymbolicLoop(adjacentCards, newCard);
    if (symbolicLoop.hasLoop) {
      return {
        hasLoop: true,
        type: 'symbolic',
        cells: [targetCell, ...symbolicLoop.cells!]
      };
    }

    // Check for numeric loop (Ace + King of same suit + another card)
    const numericLoop = this.checkNumericLoop(adjacentCards, newCard);
    if (numericLoop.hasLoop) {
      return {
        hasLoop: true,
        type: 'numeric',
        cells: [targetCell, ...numericLoop.cells!]
      };
    }

    return { hasLoop: false };
  }

  private checkSymbolicLoop(
    adjacentCards: Array<{ cell: BoardCell; card: Card }>,
    newCard: Card
  ): LoopDetection {
    const allCards = [...adjacentCards.map(ac => ac.card), newCard];
    const suits = new Set(allCards.map(c => c.suit));

    // Symbolic loop requires at least 3 different symbols
    if (suits.size >= 3) {
      // Find connected cells that form the loop
      const loopCells = this.findConnectedLoop(
        adjacentCards.map(ac => ac.cell),
        adjacentCards[0].cell
      );

      return {
        hasLoop: true,
        type: 'symbolic',
        cells: loopCells
      };
    }

    return { hasLoop: false };
  }

  private checkNumericLoop(
    adjacentCards: Array<{ cell: BoardCell; card: Card }>,
    newCard: Card
  ): LoopDetection {
    const allCards = [...adjacentCards.map(ac => ac.card), newCard];

    // Check for Ace and King
    const aceCard = allCards.find(c => c.value === '1');
    const kingCard = allCards.find(c => c.value === 'K');

    if (!aceCard || !kingCard) {
      return { hasLoop: false };
    }

    // Ace and King must be of the same suit
    if (aceCard.suit !== kingCard.suit) {
      return { hasLoop: false };
    }

    // Need at least one more card to complete the loop
    const otherCards = allCards.filter(c =>
      c.value !== '1' && c.value !== 'K'
    );

    if (otherCards.length === 0) {
      return { hasLoop: false };
    }

    // Find the cells involved in the numeric loop
    const loopCells: BoardCell[] = [];
    adjacentCards.forEach(ac => {
      if (ac.card.value === '1' || ac.card.value === 'K' ||
          otherCards.includes(ac.card)) {
        loopCells.push(ac.cell);
      }
    });

    return {
      hasLoop: true,
      type: 'numeric',
      cells: loopCells
    };
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

  private findConnectedLoop(
    cells: BoardCell[],
    startCell: BoardCell
  ): BoardCell[] {
    // Simple BFS to find connected cells that could form a loop
    const visited = new Set<BoardCell>();
    const queue: BoardCell[] = [startCell];
    const loopCells: BoardCell[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;

      visited.add(current);
      loopCells.push(current);

      const adjacent = this.getAdjacentCells(current);
      for (const adj of adjacent) {
        if (cells.includes(adj) && !visited.has(adj)) {
          queue.push(adj);
        }
      }
    }

    return loopCells;
  }

  // Check if a loop would create a "hole" (unplayable position)
  public checkForHole(
    board: GameBoard,
    loopCells: BoardCell[]
  ): BoardCell[] {
    const holes: BoardCell[] = [];

    // Check each cell inside the loop
    for (const [cell, position] of board.positions) {
      if (!position.card && this.isInsideLoop(cell, loopCells, board)) {
        holes.push(cell);
      }
    }

    return holes;
  }

  private isInsideLoop(
    cell: BoardCell,
    loopCells: BoardCell[],
    board: GameBoard
  ): boolean {
    // Simplified check - a cell is "inside" a loop if it's surrounded
    // by loop cells on multiple sides
    const adjacent = this.getAdjacentCells(cell);
    const loopAdjacent = adjacent.filter(adj => loopCells.includes(adj));

    // If surrounded by 3+ loop cells, it's likely inside
    return loopAdjacent.length >= 3;
  }

  // Detect all loops on the current board
  public detectAllLoops(board: GameBoard): Array<{
    type: 'symbolic' | 'numeric';
    cells: BoardCell[];
  }> {
    const loops: Array<{ type: 'symbolic' | 'numeric'; cells: BoardCell[] }> = [];
    const checked = new Set<string>();

    for (const [cell, position] of board.positions) {
      if (!position.card) continue;

      // Create a key for this group of adjacent cards
      const adjacentCells = this.getAdjacentCells(cell);
      const groupKey = [cell, ...adjacentCells].sort().join(',');

      if (checked.has(groupKey)) continue;
      checked.add(groupKey);

      // Check for loops starting from this cell
      const adjacentCards: Array<{ cell: BoardCell; card: Card }> = [];
      for (const adjCell of adjacentCells) {
        const adjPos = board.positions.get(adjCell);
        if (adjPos?.card) {
          adjacentCards.push({ cell: adjCell, card: adjPos.card });
        }
      }

      if (adjacentCards.length >= 2) {
        // Check for symbolic loop
        const cards = [position.card, ...adjacentCards.map(ac => ac.card)];
        if (this.cardManager.isSymbolicLoop(cards)) {
          loops.push({
            type: 'symbolic',
            cells: [cell, ...adjacentCards.map(ac => ac.cell)]
          });
        }

        // Check for numeric loop
        if (this.cardManager.isNumericLoop(cards)) {
          loops.push({
            type: 'numeric',
            cells: [cell, ...adjacentCards.map(ac => ac.cell)]
          });
        }
      }
    }

    return loops;
  }
}