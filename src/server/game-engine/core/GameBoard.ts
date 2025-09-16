import {
  GameBoard as IGameBoard,
  BoardCell,
  BoardPosition,
  Card,
  PlayerColor,
  GAME_CONSTANTS,
} from "../../../shared/types/GameTypes";

export class GameBoard {
  private board: Map<BoardCell, BoardPosition>;
  private cardOwners: Map<BoardCell, PlayerColor>;
  private vertexControl: Map<BoardCell, PlayerColor | null>;
  private holes: Set<BoardCell>;

  constructor() {
    this.board = new Map();
    this.cardOwners = new Map();
    this.vertexControl = new Map();
    this.holes = new Set();
    this.initializeBoard();
  }

  private initializeBoard(): void {
    // Initialize all 36 cells
    for (let col = 0; col < 6; col++) {
      for (let row = 1; row <= 6; row++) {
        const cell = `${String.fromCharCode(97 + col)}${row}` as BoardCell;
        const quadrant = this.getQuadrant(cell);

        this.board.set(cell, {
          cell,
          card: null,
          isVertex: GAME_CONSTANTS.VERTICES.includes(cell),
          quadrant,
        });
      }
    }

    // Initialize vertex control
    GAME_CONSTANTS.VERTICES.forEach((vertex) => {
      this.vertexControl.set(vertex as BoardCell, null);
    });
  }

  private getQuadrant(cell: BoardCell): 1 | 2 | 3 | 4 {
    const col = cell.charCodeAt(0) - 97; // 0-5
    const row = parseInt(cell[1]) - 1; // 0-5

    if (col <= 2 && row <= 2) return 1; // a1-c3
    if (col >= 3 && row <= 2) return 2; // d1-f3
    if (col <= 2 && row >= 3) return 3; // a4-c6
    return 4; // d4-f6
  }

  public placeCard(
    cell: BoardCell,
    card: Card,
    player: PlayerColor,
  ): Card | null {
    const position = this.board.get(cell);
    if (!position) {
      throw new Error(`Invalid cell: ${cell}`);
    }

    const existingCard = position.card;
    position.card = card;
    this.cardOwners.set(cell, player);

    // Update vertex control if placing on vertex
    if (position.isVertex) {
      this.updateVertexControl(cell, player);
    }

    return existingCard; // Return captured card if any
  }

  public removeCard(cell: BoardCell): Card | null {
    const position = this.board.get(cell);
    if (!position) return null;

    const card = position.card;
    position.card = null;
    this.cardOwners.delete(cell);

    return card;
  }

  public hasCard(cell: BoardCell): boolean {
    const position = this.board.get(cell);
    return position ? position.card !== null : false;
  }

  public getCard(cell: BoardCell): Card | null {
    const position = this.board.get(cell);
    return position ? position.card : null;
  }

  public getCardOwner(cell: BoardCell): PlayerColor | null {
    return this.cardOwners.get(cell) || null;
  }

  public isAdjacentToCard(cell: BoardCell): boolean {
    const adjacentCells = this.getAdjacentCells(cell);
    return adjacentCells.some((adjCell) => this.hasCard(adjCell));
  }

  public getAdjacentCells(cell: BoardCell): BoardCell[] {
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

    return adjacent.filter((c) => this.board.has(c));
  }

  public getAllCells(): BoardCell[] {
    return Array.from(this.board.keys());
  }

  public getOccupiedCells(): BoardCell[] {
    return Array.from(this.board.entries())
      .filter(([_, position]) => position.card !== null)
      .map(([cell, _]) => cell);
  }

  public getEmptyCells(): BoardCell[] {
    return Array.from(this.board.entries())
      .filter(([_, position]) => position.card === null)
      .map(([cell, _]) => cell);
  }

  private updateVertexControl(vertex: BoardCell, player: PlayerColor): void {
    const quadrant = this.getQuadrant(vertex);
    const centralSquare = this.getCentralSquare(quadrant);

    // Check if player controls the central square for "exclusive" control
    if (
      this.hasCard(centralSquare) &&
      this.getCardOwner(centralSquare) === player
    ) {
      this.vertexControl.set(vertex, player);
    } else {
      this.vertexControl.set(vertex, player); // Basic control
    }
  }

  private getCentralSquare(quadrant: 1 | 2 | 3 | 4): BoardCell {
    const centralSquares: Record<number, BoardCell> = {
      1: "b2",
      2: "e2",
      3: "b5",
      4: "e5",
    };
    return centralSquares[quadrant];
  }

  public getVertexControl(): Map<BoardCell, PlayerColor | null> {
    return new Map(this.vertexControl);
  }

  public addHole(cell: BoardCell): void {
    this.holes.add(cell);
  }

  public isHole(cell: BoardCell): boolean {
    return this.holes.has(cell);
  }

  public getHoles(): BoardCell[] {
    return Array.from(this.holes);
  }

  public getState(): IGameBoard {
    return {
      positions: new Map(this.board),
      vertexControl: {
        a1: this.vertexControl.get("a1") || null,
        f1: this.vertexControl.get("f1") || null,
        a6: this.vertexControl.get("a6") || null,
        f6: this.vertexControl.get("f6") || null,
      },
      holes: Array.from(this.holes),
    };
  }

  public loadState(state: IGameBoard): void {
    // Load positions
    this.board = new Map(state.positions);

    // Load vertex control
    this.vertexControl.set("a1", state.vertexControl.a1);
    this.vertexControl.set("f1", state.vertexControl.f1);
    this.vertexControl.set("a6", state.vertexControl.a6);
    this.vertexControl.set("f6", state.vertexControl.f6);

    // Load holes
    this.holes = new Set(state.holes);

    // Rebuild card owners map
    this.cardOwners.clear();
    state.positions.forEach((position, cell) => {
      if (position.card) {
        // This would need to be tracked properly in the actual implementation
        // For now, we'll need to pass this information separately
      }
    });
  }

  // Check if a move would capture an opponent's card
  public canCapture(cell: BoardCell, card: Card, player: PlayerColor): boolean {
    const existingCard = this.getCard(cell);
    if (!existingCard) return false;

    const owner = this.getCardOwner(cell);
    if (owner === player) return false; // Can't capture own card

    // Apply Morra Cinese rules
    const suitHierarchy = GAME_CONSTANTS.SUIT_HIERARCHY;
    if (card.suit !== existingCard.suit) {
      // Different suits - check Morra Cinese
      return suitHierarchy[card.suit]?.includes(existingCard.suit) || false;
    } else {
      // Same suit - check numeric value
      const attackerValue = GAME_CONSTANTS.CARD_VALUES[card.value];
      const defenderValue = GAME_CONSTANTS.CARD_VALUES[existingCard.value];

      // Special case: Ace beats King
      if (card.value === "1" && existingCard.value === "K") return true;
      // King doesn't beat Ace
      if (card.value === "K" && existingCard.value === "1") return false;

      return attackerValue > defenderValue;
    }
  }

  // Get all cards in a specific quadrant
  public getQuadrantCards(
    quadrant: 1 | 2 | 3 | 4,
  ): Array<{ cell: BoardCell; card: Card }> {
    const cards: Array<{ cell: BoardCell; card: Card }> = [];

    this.board.forEach((position, cell) => {
      if (position.quadrant === quadrant && position.card) {
        cards.push({ cell, card: position.card });
      }
    });

    return cards;
  }

  // Count cards on board for each player
  public getCardCount(): { white: number; black: number } {
    let whiteCount = 0;
    let blackCount = 0;

    this.cardOwners.forEach((owner) => {
      if (owner === "white") whiteCount++;
      else blackCount++;
    });

    return { white: whiteCount, black: blackCount };
  }
}
