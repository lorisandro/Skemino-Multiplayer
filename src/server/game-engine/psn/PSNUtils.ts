/**
 * PSNUtils.ts - Portable Skèmino Notation Utilities
 *
 * Comprehensive utility functions for PSN operations including:
 * - File I/O operations for PSN archives
 * - Format conversion utilities
 * - PSN validation and repair functions
 * - Performance-optimized batch operations
 * - Statistical analysis of PSN collections
 */

import { promises as fs } from 'fs';
import { join, extname } from 'path';
import {
  GameState,
  Move,
  Card,
  GameHeaders,
  PSNParseResult,
  GameResult,
  PlayerId
} from '../../../shared/types/game';
import { PSNGenerator } from './PSNGenerator';
import { PSNParser, PSNParseOptions } from './PSNParser';

export interface PSNArchiveStats {
  totalGames: number;
  totalMoves: number;
  averageGameLength: number;
  playerNames: string[];
  events: string[];
  dateRange: { earliest: string; latest: string };
  resultDistribution: Record<GameResult, number>;
  popularOpenings: Array<{ opening: string; count: number }>;
}

export interface PSNValidationReport {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  warnings: number;
  errors: Array<{ file: string; errors: string[]; warnings: string[] }>;
}

export class PSNUtils {
  private generator: PSNGenerator;
  private parser: PSNParser;

  constructor() {
    this.generator = new PSNGenerator();
    this.parser = new PSNParser();
  }

  /**
   * Saves game to PSN file
   */
  public async saveGameToPSN(gameState: GameState, filePath: string): Promise<void> {
    const psnContent = this.generator.exportGameToPSN(gameState);
    await fs.writeFile(filePath, psnContent, 'utf-8');
  }

  /**
   * Loads game from PSN file
   */
  public async loadGameFromPSN(filePath: string, options?: Partial<PSNParseOptions>): Promise<PSNParseResult> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parser.parseFromFile(content, options);
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to read file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      };
    }
  }

  /**
   * Batch loads multiple PSN files from directory
   */
  public async loadGamesFromDirectory(
    directoryPath: string,
    options?: Partial<PSNParseOptions>
  ): Promise<Array<{ fileName: string; result: PSNParseResult }>> {
    const files = await fs.readdir(directoryPath);
    const psnFiles = files.filter(file => extname(file).toLowerCase() === '.psn');

    const results = await Promise.all(
      psnFiles.map(async (fileName) => {
        const filePath = join(directoryPath, fileName);
        const result = await this.loadGameFromPSN(filePath, options);
        return { fileName, result };
      })
    );

    return results;
  }

  /**
   * Validates PSN file format
   */
  public async validatePSNFile(filePath: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parser.validatePSNFormat(content);
    } catch (error) {
      return {
        isValid: false,
        errors: [`Cannot read file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      };
    }
  }

  /**
   * Validates multiple PSN files and generates report
   */
  public async validatePSNArchive(directoryPath: string): Promise<PSNValidationReport> {
    const files = await fs.readdir(directoryPath);
    const psnFiles = files.filter(file => extname(file).toLowerCase() === '.psn');

    const report: PSNValidationReport = {
      totalFiles: psnFiles.length,
      validFiles: 0,
      invalidFiles: 0,
      warnings: 0,
      errors: []
    };

    for (const fileName of psnFiles) {
      const filePath = join(directoryPath, fileName);
      const validation = await this.validatePSNFile(filePath);

      if (validation.isValid) {
        report.validFiles++;
      } else {
        report.invalidFiles++;
      }

      report.warnings += validation.warnings.length;

      if (!validation.isValid || validation.warnings.length > 0) {
        report.errors.push({
          file: fileName,
          errors: validation.errors,
          warnings: validation.warnings
        });
      }
    }

    return report;
  }

  /**
   * Converts PSN to JSON format
   */
  public async convertPSNToJSON(psnFilePath: string, jsonFilePath: string): Promise<boolean> {
    try {
      const parseResult = await this.loadGameFromPSN(psnFilePath);
      if (!parseResult.isValid || !parseResult.game) {
        return false;
      }

      const jsonContent = JSON.stringify(parseResult.game, null, 2);
      await fs.writeFile(jsonFilePath, jsonContent, 'utf-8');
      return true;
    } catch (error) {
      console.error(`Conversion error: ${error}`);
      return false;
    }
  }

  /**
   * Converts JSON back to PSN format
   */
  public async convertJSONToPSN(jsonFilePath: string, psnFilePath: string): Promise<boolean> {
    try {
      const jsonContent = await fs.readFile(jsonFilePath, 'utf-8');
      const gameState: GameState = JSON.parse(jsonContent);

      await this.saveGameToPSN(gameState, psnFilePath);
      return true;
    } catch (error) {
      console.error(`Conversion error: ${error}`);
      return false;
    }
  }

  /**
   * Generates statistics for PSN archive
   */
  public async generateArchiveStats(directoryPath: string): Promise<PSNArchiveStats> {
    const games = await this.loadGamesFromDirectory(directoryPath);
    const validGames = games
      .filter(g => g.result.isValid && g.result.game)
      .map(g => g.result.game!);

    const stats: PSNArchiveStats = {
      totalGames: validGames.length,
      totalMoves: 0,
      averageGameLength: 0,
      playerNames: [],
      events: [],
      dateRange: { earliest: '', latest: '' },
      resultDistribution: { '1-0': 0, '0-1': 0, '1/2-1/2': 0, '*': 0 },
      popularOpenings: []
    };

    if (validGames.length === 0) {
      return stats;
    }

    // Collect data
    const playerSet = new Set<string>();
    const eventSet = new Set<string>();
    const dates: string[] = [];
    const openingMap = new Map<string, number>();

    for (const game of validGames) {
      stats.totalMoves += game.moves.length;

      // Players
      playerSet.add(game.headers.white);
      playerSet.add(game.headers.black);

      // Events
      eventSet.add(game.headers.event);

      // Dates
      dates.push(game.headers.date);

      // Results
      if (game.headers.result) {
        const result = game.headers.result as string;
        if (result && (stats.resultDistribution as any)[result] !== undefined) {
          (stats.resultDistribution as any)[result]++;
        }
      }

      // Opening (first 3 moves)
      if (game.moves.length >= 6) {
        const opening = game.moves
          .slice(0, 6)
          .map((m: any) => m.notation || 'unknown')
          .join(' ');
        openingMap.set(opening, (openingMap.get(opening) || 0) + 1);
      }
    }

    // Finalize stats
    stats.averageGameLength = stats.totalMoves / validGames.length;
    stats.playerNames = Array.from(playerSet).sort();
    stats.events = Array.from(eventSet).sort();

    // Date range
    dates.sort();
    stats.dateRange.earliest = dates[0] || '';
    stats.dateRange.latest = dates[dates.length - 1] || '';

    // Popular openings
    stats.popularOpenings = Array.from(openingMap.entries())
      .map(([opening, count]) => ({ opening, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  /**
   * Repairs common PSN format issues
   */
  public repairPSNString(psnString: string): { repaired: string; changes: string[] } {
    const changes: string[] = [];
    let repaired = psnString;

    // Fix missing required headers
    const requiredHeaders = ['Event', 'Site', 'Date', 'Round', 'White', 'Black', 'Result'];
    for (const header of requiredHeaders) {
      const regex = new RegExp(`^\\[${header}\\s+`, 'mi');
      if (!regex.test(repaired)) {
        const defaultValue = this.getDefaultHeaderValue(header);
        repaired = `[${header} "${defaultValue}"]\n` + repaired;
        changes.push(`Added missing ${header} header`);
      }
    }

    // Fix date format (YYYY-MM-DD to YYYY.MM.DD)
    repaired = repaired.replace(
      /\[Date\s+"(\d{4})-(\d{2})-(\d{2})"\]/g,
      (match, year, month, day) => {
        changes.push('Fixed date format from YYYY-MM-DD to YYYY.MM.DD');
        return `[Date "${year}.${month}.${day}"]`;
      }
    );

    // Fix malformed move notation
    repaired = repaired.replace(
      /(\d+)\.([PFC])(\d+|[JQK])([a-f][1-6])/g,
      (match, turn, suit, value, position) => {
        changes.push(`Fixed move notation format: ${match} -> ${turn}.${suit}${value}:${position}`);
        return `${turn}.${suit}${value}:${position}`;
      }
    );

    // Fix missing colons in move notation
    repaired = repaired.replace(
      /(\d+\.[PFC](?:\d+|[JQK]))([a-f][1-6])/g,
      (match, cardPart, position) => {
        changes.push(`Added missing colon: ${match} -> ${cardPart}:${position}`);
        return `${cardPart}:${position}`;
      }
    );

    return { repaired, changes };
  }

  /**
   * Compacts PSN by removing optional elements
   */
  public compactPSN(psnString: string): string {
    const lines = psnString.split('\n');
    const compactedLines: string[] = [];

    // Keep only required headers and moves
    const requiredHeaders = ['Event', 'Site', 'Date', 'Round', 'White', 'Black', 'Result'];

    for (const line of lines) {
      if (line.startsWith('[')) {
        // Check if it's a required header
        const headerMatch = line.match(/^\[(\w+)/);
        if (headerMatch && requiredHeaders.includes(headerMatch[1])) {
          compactedLines.push(line);
        }
      } else if (line.trim().length > 0) {
        // Keep move lines and results
        compactedLines.push(line);
      }
    }

    return compactedLines.join('\n');
  }

  /**
   * Extracts moves only from PSN (for minimal storage)
   */
  public extractMovesOnly(psnString: string): string {
    const moves = this.parser.extractMoves(psnString);
    return moves
      .map(move => this.generator.generateMoveNotation(move))
      .join(' ');
  }

  /**
   * Merges multiple PSN files into archive
   */
  public async mergePSNFiles(inputFiles: string[], outputFile: string): Promise<void> {
    const allGames: string[] = [];

    for (const filePath of inputFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        allGames.push(content.trim());
      } catch (error) {
        console.warn(`Skipping file ${filePath}: ${error}`);
      }
    }

    const mergedContent = allGames.join('\n\n');
    await fs.writeFile(outputFile, mergedContent, 'utf-8');
  }

  /**
   * Default header values for repair function
   */
  private getDefaultHeaderValue(header: string): string {
    const defaults: Record<string, string> = {
      'Event': 'Unknown Event',
      'Site': 'Unknown',
      'Date': new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      'Round': '?',
      'White': 'Unknown',
      'Black': 'Unknown',
      'Result': '*'
    };

    return defaults[header] || 'Unknown';
  }

  /**
   * Validates move sequence for logical consistency
   */
  public validateMoveSequence(moves: Move[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check turn sequence
    for (let i = 0; i < moves.length; i++) {
      const expectedTurn = Math.floor(i / 2) + 1;
      const expectedPlayer = i % 2 === 0 ? 'white' : 'black';

      if (moves[i].turnNumber !== expectedTurn) {
        errors.push(`Move ${i + 1}: Expected turn ${expectedTurn}, got ${moves[i].turnNumber}`);
      }

      if (moves[i].player !== expectedPlayer) {
        errors.push(`Move ${i + 1}: Expected player ${expectedPlayer}, got ${moves[i].player}`);
      }
    }

    // Check for duplicate positions (basic validation)
    const positionHistory = new Map<string, number>();
    for (let i = 0; i < moves.length; i++) {
      const position = moves[i].toPosition;
      if (positionHistory.has(position)) {
        const previousMove = positionHistory.get(position)!;
        errors.push(`Move ${i + 1}: Position ${position} was already occupied by move ${previousMove}`);
      }
      positionHistory.set(position, i + 1);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Gets move at specific turn
   */
  public getMoveAtTurn(moves: Move[], turn: number, player: PlayerId): Move | null {
    return moves.find(move => move.turnNumber === turn && move.player === player) || null;
  }

  /**
   * Gets all moves by player
   */
  public getMovesByPlayer(moves: Move[], player: PlayerId): Move[] {
    return moves.filter(move => move.player === player);
  }

  /**
   * Calculates game duration from moves
   */
  public calculateGameDuration(moves: Move[]): number {
    if (moves.length < 2) return 0;

    const firstMove = moves[0];
    const lastMove = moves[moves.length - 1];

    return lastMove.timestamp.getTime() - firstMove.timestamp.getTime();
  }
}