/**
 * PSN System Test Suite
 *
 * Comprehensive tests for Portable Skèmino Notation:
 * - PSN generation accuracy
 * - PSN parsing robustness
 * - Error handling and validation
 * - Special notation symbols
 * - Round-trip conversion integrity
 */

import { PSNGenerator } from './PSNGenerator';
import { PSNParser } from './PSNParser';
import { PSNUtils } from './PSNUtils';
import { GameState, Move, Card, GameHeaders } from '../../../shared/types/game';

describe('PSN System Tests', () => {
  let generator: PSNGenerator;
  let parser: PSNParser;
  let utils: PSNUtils;

  beforeEach(() => {
    generator = new PSNGenerator();
    parser = new PSNParser();
    utils = new PSNUtils();
  });

  describe('PSN Generator', () => {
    test('should generate basic move notation', () => {
      const move: Move = {
        turn: 1,
        player: 'white',
        card: { suit: 'P', value: 4 },
        position: 'd3',
        timestamp: new Date(),
        isCapture: false,
        hasVertexControl: false,
        createsLoop: false,
        isCheck: false
      };

      const notation = generator.generateMoveNotation(move);
      expect(notation).toBe('P4:d3');
    });

    test('should generate move with capture', () => {
      const move: Move = {
        turn: 2,
        player: 'black',
        card: { suit: 'F', value: 1 },
        position: 'f6',
        timestamp: new Date(),
        isCapture: true,
        hasVertexControl: false,
        createsLoop: false,
        isCheck: false
      };

      const notation = generator.generateMoveNotation(move);
      expect(notation).toBe('F1:f6*');
    });

    test('should generate move with all special symbols', () => {
      const move: Move = {
        turn: 3,
        player: 'white',
        card: { suit: 'C', value: 7 },
        position: 'c2',
        timestamp: new Date(),
        isCapture: true,
        hasVertexControl: true,
        createsLoop: true,
        isCheck: true
      };

      const notation = generator.generateMoveNotation(move);
      expect(notation).toBe('C7:c2*#+');
    });

    test('should generate move with timing', () => {
      const move: Move = {
        turn: 1,
        player: 'white',
        card: { suit: 'P', value: 2 },
        position: 'a1',
        timestamp: new Date(),
        isCapture: false,
        hasVertexControl: true,
        createsLoop: false,
        isCheck: false,
        timeSpent: 45
      };

      const notation = generator.generateMoveNotation(move);
      expect(notation).toBe('P2:a1#/45');
    });

    test('should handle face cards correctly', () => {
      const moves = [
        { card: { suit: 'P', value: 11 }, expected: 'PJ' },
        { card: { suit: 'F', value: 12 }, expected: 'FQ' },
        { card: { suit: 'C', value: 13 }, expected: 'CK' }
      ];

      moves.forEach(({ card, expected }) => {
        const move: Move = {
          turn: 1,
          player: 'white',
          card: card as Card,
          position: 'a1',
          timestamp: new Date(),
          isCapture: false,
          hasVertexControl: false,
          createsLoop: false,
          isCheck: false
        };

        const notation = generator.generateMoveNotation(move);
        expect(notation).toContain(expected);
      });
    });

    test('should generate complete game PSN', () => {
      const gameState = createTestGameState();
      const psn = generator.generateGamePSN(gameState);

      expect(psn).toContain('[Event "Test Tournament"]');
      expect(psn).toContain('[White "Player1"]');
      expect(psn).toContain('[Black "Player2"]');
      expect(psn).toContain('1.P4:d3');
    });
  });

  describe('PSN Parser', () => {
    test('should parse basic move notation', () => {
      const notation = '1.P4:d3';
      const move = parser.parseMove(notation);

      expect(move).toBeTruthy();
      expect(move!.turn).toBe(1);
      expect(move!.player).toBe('white');
      expect(move!.card.suit).toBe('P');
      expect(move!.card.value).toBe(4);
      expect(move!.position).toBe('d3');
      expect(move!.isCapture).toBe(false);
    });

    test('should parse move with special symbols', () => {
      const notation = '2.F1:f6*#@+';
      const move = parser.parseMove(notation);

      expect(move).toBeTruthy();
      expect(move!.turn).toBe(2);
      expect(move!.player).toBe('black');
      expect(move!.isCapture).toBe(true);
      expect(move!.hasVertexControl).toBe(true);
      expect(move!.createsLoop).toBe(true);
      expect(move!.isCheck).toBe(true);
    });

    test('should parse move with timing', () => {
      const notation = '1.C9:b4+/30';
      const move = parser.parseMove(notation);

      expect(move).toBeTruthy();
      expect(move!.timeSpent).toBe(30);
      expect(move!.isCheck).toBe(true);
    });

    test('should parse face cards', () => {
      const faceCardMoves = ['1.PJ:a1', '2.FQ:b2', '3.CK:c3'];

      faceCardMoves.forEach((notation, index) => {
        const move = parser.parseMove(notation);
        expect(move).toBeTruthy();
        expect(move!.card.value).toBe(11 + index);
      });
    });

    test('should parse complete PSN game', () => {
      const psnString = createTestPSNString();
      const result = parser.parseGame(psnString);

      expect(result.isValid).toBe(true);
      expect(result.game).toBeTruthy();
      expect(result.game!.headers.event).toBe('Test Tournament');
      expect(result.game!.moves.length).toBeGreaterThan(0);
    });

    test('should handle invalid move notation', () => {
      const invalidNotations = [
        'invalid',
        '1.X4:d3',  // invalid suit
        '1.P0:d3',  // invalid value
        '1.P4:z9',  // invalid position
        '1.P14:d3', // value too high
      ];

      invalidNotations.forEach(notation => {
        const move = parser.parseMove(notation);
        expect(move).toBeNull();
      });
    });

    test('should validate PSN headers', () => {
      const invalidPSN = `
        [Event "Test"]
        [InvalidHeader "value"]
        1.P4:d3 F1:e4
      `;

      const result = parser.parseGame(invalidPSN);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Move Notation Validation', () => {
    test('should validate correct move notation', () => {
      const validNotations = [
        'P1:a1',
        'F13:f6*',
        'CK:d4#@+',
        'PJ:b2*/15'
      ];

      validNotations.forEach(notation => {
        const result = generator.validateMoveNotation(notation);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    test('should reject invalid move notation', () => {
      const invalidNotations = [
        'P0:a1',    // invalid card value
        'X4:a1',    // invalid suit
        'P4:z1',    // invalid position
        'P4:a9',    // invalid rank
        'P14:a1',   // value too high
      ];

      invalidNotations.forEach(notation => {
        const result = generator.validateMoveNotation(notation);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Round-trip Conversion', () => {
    test('should maintain game integrity in round-trip conversion', () => {
      const originalGame = createTestGameState();
      const psnString = generator.generateGamePSN(originalGame);
      const parseResult = parser.parseGame(psnString);

      expect(parseResult.isValid).toBe(true);
      expect(parseResult.game).toBeTruthy();

      const parsedGame = parseResult.game!;

      // Verify headers
      expect(parsedGame.headers.event).toBe(originalGame.headers.event);
      expect(parsedGame.headers.white).toBe(originalGame.headers.white);
      expect(parsedGame.headers.black).toBe(originalGame.headers.black);

      // Verify moves
      expect(parsedGame.moves.length).toBe(originalGame.moves.length);

      parsedGame.moves.forEach((move, index) => {
        const originalMove = originalGame.moves[index];
        expect(move.turn).toBe(originalMove.turn);
        expect(move.player).toBe(originalMove.player);
        expect(move.card.suit).toBe(originalMove.card.suit);
        expect(move.card.value).toBe(originalMove.card.value);
        expect(move.position).toBe(originalMove.position);
      });
    });
  });

  describe('PSN Utils', () => {
    test('should repair common PSN issues', () => {
      const brokenPSN = `
        [Event "Test"]
        [Date "2025-09-14"]
        1.P4d3 F1:e4
      `;

      const result = utils.repairPSNString(brokenPSN);
      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.repaired).toContain('[Date "2025.09.14"]');
    });

    test('should validate move sequences', () => {
      const validMoves = createTestMoves();
      const result = utils.validateMoveSequence(validMoves);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect invalid move sequences', () => {
      const invalidMoves = createTestMoves();
      // Break the sequence by skipping a turn
      invalidMoves[1].turn = 3;

      const result = utils.validateMoveSequence(invalidMoves);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Special Symbol Parsing', () => {
    test('should correctly identify all special symbols', () => {
      const symbolTests = [
        { notation: 'P4:d3*', expected: { isCapture: true, hasVertexControl: false, createsLoop: false, isCheck: false } },
        { notation: 'F1:a1#', expected: { isCapture: false, hasVertexControl: true, createsLoop: false, isCheck: false } },
        { notation: 'C7:f6@', expected: { isCapture: false, hasVertexControl: false, createsLoop: true, isCheck: false } },
        { notation: 'P2:c3+', expected: { isCapture: false, hasVertexControl: false, createsLoop: false, isCheck: true } },
        { notation: 'F5:e5*#@+', expected: { isCapture: true, hasVertexControl: true, createsLoop: true, isCheck: true } },
      ];

      symbolTests.forEach(({ notation, expected }) => {
        const symbols = generator.parseSpecialSymbols(notation);
        expect(symbols).toEqual(expected);
      });
    });
  });

  // Helper functions for creating test data
  function createTestGameState(): GameState {
    const headers: GameHeaders = {
      event: 'Test Tournament',
      site: 'Test City, Test Region TST',
      date: '2025.09.14',
      round: '1',
      white: 'Player1',
      black: 'Player2',
      result: '1-0'
    };

    const moves = createTestMoves();

    return {
      id: 'test-game-1',
      headers,
      moves,
      currentPlayer: 'black',
      turn: 2,
      status: 'playing',
      board: new Map(),
      whiteCards: [],
      blackCards: []
    };
  }

  function createTestMoves(): Move[] {
    return [
      {
        turn: 1,
        player: 'white',
        card: { suit: 'P', value: 4 },
        position: 'd3',
        timestamp: new Date('2025-09-14T10:00:00Z'),
        isCapture: false,
        hasVertexControl: false,
        createsLoop: false,
        isCheck: false
      },
      {
        turn: 1,
        player: 'black',
        card: { suit: 'F', value: 1 },
        position: 'e4',
        timestamp: new Date('2025-09-14T10:01:00Z'),
        isCapture: false,
        hasVertexControl: false,
        createsLoop: false,
        isCheck: false
      }
    ];
  }

  function createTestPSNString(): string {
    return `[Event "Test Tournament"]
[Site "Test City, Test Region TST"]
[Date "2025.09.14"]
[Round "1"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1.P4:d3 F1:e4
2.C7:c2# F5:f6*
1-0`;
  }
});