import {
  GameBoard,
  BoardCell,
  PlayerColor,
  GAME_CONSTANTS
} from '../../../shared/types/GameTypes';

interface VertexControlResult {
  isControlled: boolean;
  isExclusive: boolean;
  controlledVertices: BoardCell[];
}

export class VertexController {
  private readonly vertices: BoardCell[] = ['a1', 'f1', 'a6', 'f6'];
  private readonly quadrantCenters: Record<BoardCell, BoardCell> = {
    'a1': 'b2', // Quadrant 1
    'f1': 'e2', // Quadrant 2
    'a6': 'b5', // Quadrant 3
    'f6': 'e5'  // Quadrant 4
  };

  public checkVertexControl(
    board: GameBoard,
    moveCell: BoardCell,
    player: PlayerColor
  ): VertexControlResult {
    const result: VertexControlResult = {
      isControlled: false,
      isExclusive: false,
      controlledVertices: []
    };

    // Check if the move is on a vertex
    if (!this.vertices.includes(moveCell)) {
      return result;
    }

    // Basic vertex control - player has a card on the vertex
    result.isControlled = true;
    result.controlledVertices.push(moveCell);

    // Check for exclusive control (vertex + central square)
    const centralSquare = this.quadrantCenters[moveCell];
    const centralPosition = board.positions.get(centralSquare);

    if (centralPosition?.card) {
      // Check if player controls the central square
      // Note: We need to track card ownership properly
      // For now, we'll assume we can determine this from game context
      result.isExclusive = true;
    }

    return result;
  }

  public getVertexStatus(board: GameBoard): Map<BoardCell, {
    controller: PlayerColor | null;
    isExclusive: boolean;
  }> {
    const status = new Map<BoardCell, {
      controller: PlayerColor | null;
      isExclusive: boolean;
    }>();

    for (const vertex of this.vertices) {
      const vertexControl = board.vertexControl[vertex as 'a1' | 'f1' | 'a6' | 'f6'];
      const centralSquare = this.quadrantCenters[vertex];
      const centralPosition = board.positions.get(centralSquare);

      status.set(vertex, {
        controller: vertexControl,
        isExclusive: vertexControl !== null && centralPosition?.card !== null
      });
    }

    return status;
  }

  public countControlledVertices(
    board: GameBoard,
    player: PlayerColor
  ): number {
    let count = 0;

    for (const vertex of this.vertices) {
      const control = board.vertexControl[vertex as 'a1' | 'f1' | 'a6' | 'f6'];
      if (control === player) {
        count++;
      }
    }

    return count;
  }

  public getQuadrantControl(
    board: GameBoard,
    quadrant: 1 | 2 | 3 | 4
  ): {
    vertex: BoardCell;
    center: BoardCell;
    vertexController: PlayerColor | null;
    centerController: PlayerColor | null;
    isExclusive: boolean;
  } {
    const vertexMap: Record<number, BoardCell> = {
      1: 'a1',
      2: 'f1',
      3: 'a6',
      4: 'f6'
    };

    const vertex = vertexMap[quadrant];
    const center = this.quadrantCenters[vertex];

    const vertexPosition = board.positions.get(vertex);
    const centerPosition = board.positions.get(center);

    const vertexController = board.vertexControl[vertex as 'a1' | 'f1' | 'a6' | 'f6'];

    return {
      vertex,
      center,
      vertexController,
      centerController: centerPosition?.card ? vertexController : null, // Simplified
      isExclusive: vertexController !== null && centerPosition?.card !== null
    };
  }

  public checkDominance(board: GameBoard): {
    dominant: PlayerColor | null;
    white: number;
    black: number;
  } {
    const whiteVertices = this.countControlledVertices(board, 'white');
    const blackVertices = this.countControlledVertices(board, 'black');

    let dominant: PlayerColor | null = null;
    if (whiteVertices > blackVertices) {
      dominant = 'white';
    } else if (blackVertices > whiteVertices) {
      dominant = 'black';
    }

    return {
      dominant,
      white: whiteVertices,
      black: blackVertices
    };
  }

  // Check if a player has achieved vertex victory (ERA1)
  public checkVertexVictory(
    board: GameBoard,
    lastMove: BoardCell,
    player: PlayerColor
  ): boolean {
    // ERA1: Win by placing last card on a controlled vertex
    if (!this.vertices.includes(lastMove)) {
      return false;
    }

    // Check if this was the player's last card
    // This needs to be determined from game state
    // For now, return false (will be implemented with full game state)
    return false;
  }

  // Get strategic value of a vertex
  public getVertexValue(
    board: GameBoard,
    vertex: BoardCell
  ): number {
    if (!this.vertices.includes(vertex)) {
      return 0;
    }

    let value = 10; // Base value for vertex

    // Add value for central square control
    const center = this.quadrantCenters[vertex];
    const centerPosition = board.positions.get(center);
    if (centerPosition?.card) {
      value += 5; // Exclusive control bonus
    }

    // Add value based on adjacent control
    const adjacent = this.getAdjacentCells(vertex);
    let adjacentControl = 0;
    for (const cell of adjacent) {
      const position = board.positions.get(cell);
      if (position?.card) {
        adjacentControl++;
      }
    }
    value += adjacentControl * 2;

    return value;
  }

  private getAdjacentCells(cell: BoardCell): BoardCell[] {
    const col = cell.charCodeAt(0) - 97;
    const row = parseInt(cell[1]);
    const adjacent: BoardCell[] = [];

    if (row < 6) adjacent.push(`${cell[0]}${row + 1}` as BoardCell);
    if (row > 1) adjacent.push(`${cell[0]}${row - 1}` as BoardCell);
    if (col < 5) adjacent.push(`${String.fromCharCode(98 + col)}${row}` as BoardCell);
    if (col > 0) adjacent.push(`${String.fromCharCode(96 + col)}${row}` as BoardCell);

    return adjacent.filter(c => this.isValidCell(c));
  }

  private isValidCell(cell: string): boolean {
    const col = cell.charCodeAt(0) - 97;
    const row = parseInt(cell[1]) - 1;
    return col >= 0 && col <= 5 && row >= 0 && row <= 5;
  }

  // Analyze vertex control for strategic planning
  public analyzeVertexStrategy(board: GameBoard): {
    criticalVertices: BoardCell[];
    contestedVertices: BoardCell[];
    secureVertices: Map<BoardCell, PlayerColor>;
  } {
    const critical: BoardCell[] = [];
    const contested: BoardCell[] = [];
    const secure = new Map<BoardCell, PlayerColor>();

    for (const vertex of this.vertices) {
      const control = board.vertexControl[vertex as 'a1' | 'f1' | 'a6' | 'f6'];
      const position = board.positions.get(vertex);

      if (!control && !position?.card) {
        // Empty vertex - critical to control
        critical.push(vertex);
      } else if (control && position?.card) {
        // Check if vertex is secure or contested
        const adjacent = this.getAdjacentCells(vertex);
        let threats = 0;

        for (const adj of adjacent) {
          const adjPos = board.positions.get(adj);
          if (adjPos?.card) {
            // Check if adjacent card could threaten the vertex
            threats++;
          }
        }

        if (threats >= 2) {
          contested.push(vertex);
        } else {
          secure.set(vertex, control);
        }
      }
    }

    return {
      criticalVertices: critical,
      contestedVertices: contested,
      secureVertices: secure
    };
  }
}