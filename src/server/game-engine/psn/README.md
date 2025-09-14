# PSN (Portable Skèmino Notation) System

## Overview

The PSN system provides a complete implementation of Portable Skèmino Notation for recording, parsing, and managing Skèmino games. It follows the official PSN specification and supports all standard notation features including special symbols for captures, vertex control, loops, and check conditions.

## Features

- **Complete PSN Generation**: Convert game states to standard PSN format
- **Robust PSN Parsing**: Parse PSN strings back into game objects with error recovery
- **Format Validation**: Comprehensive validation of PSN syntax and semantics
- **Special Notation**: Full support for captures (*), vertex control (#), loops (@), and check (+)
- **File Operations**: Save/load games to/from PSN files
- **Archive Management**: Batch operations for PSN collections
- **Statistics Generation**: Extract insights from PSN archives
- **Error Handling**: Graceful handling of malformed PSN with repair capabilities

## Quick Start

```typescript
import { generatePSN, parsePSN, PSNGenerator, PSNParser } from './psn';

// Generate PSN from game state
const psnString = generatePSN(gameState);

// Parse PSN string
const parseResult = parsePSN(psnString);
if (parseResult.isValid) {
  const game = parseResult.game;
  // Use parsed game...
}

// Advanced usage
const generator = new PSNGenerator();
const parser = new PSNParser();

const moveNotation = generator.generateMoveNotation(move);
const parsedMove = parser.parseMove(moveNotation);
```

## PSN Format Specification

### Headers (Required)
```
[Event "Tournament Name"]
[Site "City, Region COUNTRY"]
[Date "YYYY.MM.DD"]
[Round "1"]
[White "Player Name"]
[Black "Player Name"]
[Result "1-0 | 0-1 | 1/2-1/2 | *"]
```

### Optional Headers
```
[WhiteElo "1500"]
[BlackElo "1600"]
[Strategy "Aggressive"]
[WhiteTime "300"]
[BlackTime "300"]
[NCard "39"]
```

### Setup Line (Turn 0)
```
0.SETUP_CARD:position/white_cards:White/black_cards:Black
```

### Move Notation
```
TURN.CARD:POSITION[SYMBOLS][/TIME]
```

**Examples:**
- Basic move: `1.P4:d3`
- Capture: `2.F1:f6*`
- Vertex control: `3.P2:a1#`
- Loop creation: `4.C7:c2@`
- Check: `5.F9:b4+`
- Combination: `6.F5:e5*#@+`
- With timing: `7.C10:f1*/45`

### Cards
- **Suits**: P (Pietra), F (Forbici), C (Carta)
- **Values**: 1-13, where 11=J, 12=Q, 13=K
- **Format**: `P1`, `F13`, `CK`, `PJ`, etc.

### Board Positions
- **6x6 board**: Files a-f, Ranks 1-6
- **Format**: `a1`, `d3`, `f6`, etc.
- **Vertices**: `a1`, `f1`, `a6`, `f6`

### Special Symbols
- `*` - Capture
- `#` - Vertex control
- `@` - Loop creation
- `+` - Check/threat
- `/` - Timing (seconds)

## API Reference

### PSNGenerator

```typescript
class PSNGenerator {
  // Generate complete PSN for game
  generateGamePSN(gameState: GameState): string

  // Generate single move notation
  generateMoveNotation(move: Move): string

  // Validate move notation syntax
  validateMoveNotation(notation: string): ValidationResult

  // Export game to PSN file format
  exportGameToPSN(gameState: GameState): string

  // Generate compact PSN for storage
  generateCompactPSN(gameState: GameState): string
}
```

### PSNParser

```typescript
class PSNParser {
  // Parse complete PSN string
  parseGame(psnString: string, options?: PSNParseOptions): PSNParseResult

  // Parse single move notation
  parseMove(moveToken: string): Move | null

  // Validate PSN format
  validatePSNFormat(psnString: string): ValidationResult

  // Extract moves from PSN
  extractMoves(psnString: string): Move[]

  // Extract headers from PSN
  extractHeaders(psnString: string): GameHeaders | null
}
```

### PSNUtils

```typescript
class PSNUtils {
  // File operations
  saveGameToPSN(gameState: GameState, filePath: string): Promise<void>
  loadGameFromPSN(filePath: string): Promise<PSNParseResult>
  loadGamesFromDirectory(directoryPath: string): Promise<ParseResult[]>

  // Validation and repair
  validatePSNFile(filePath: string): Promise<ValidationResult>
  validatePSNArchive(directoryPath: string): Promise<ValidationReport>
  repairPSNString(psnString: string): RepairResult

  // Format conversion
  convertPSNToJSON(psnFile: string, jsonFile: string): Promise<boolean>
  convertJSONToPSN(jsonFile: string, psnFile: string): Promise<boolean>

  // Analysis
  generateArchiveStats(directoryPath: string): Promise<ArchiveStats>
  validateMoveSequence(moves: Move[]): ValidationResult
}
```

## Parse Options

```typescript
interface PSNParseOptions {
  strict: boolean;        // Fail on first error vs. continue with warnings
  validateMoves: boolean; // Validate move legality against game rules
  includeTimings: boolean;// Parse timing information
  maxErrors: number;      // Maximum errors before aborting parse
}
```

## Error Handling

The PSN system provides comprehensive error handling:

```typescript
interface PSNParseResult {
  isValid: boolean;
  game?: GameState;
  errors: string[];     // Fatal errors
  warnings: string[];   // Non-fatal issues
}
```

Common error types:
- **Syntax Errors**: Malformed headers, invalid notation format
- **Data Errors**: Invalid dates, missing required headers
- **Logic Errors**: Impossible moves, invalid card values
- **Sequence Errors**: Missing turns, wrong player order

## Integration Examples

### Basic Game Recording

```typescript
import { SkeminoGameWithPSN } from './PSNIntegration.example';

const game = new SkeminoGameWithPSN(initialGameState);

// Make moves and get PSN automatically
const result = game.makeMove(
  { suit: 'P', value: 4 },
  'd3',
  { hasVertexControl: true }
);

console.log(result.psnMove); // "P4:d3#"

// Export complete game
await game.exportGame('./games/game1.psn');
```

### Live Game Streaming

```typescript
import { LiveGamePSNStreamer } from './PSNIntegration.example';

const streamer = new LiveGamePSNStreamer();

streamer.onMoveNotation((notation) => {
  // Broadcast move to spectators
  websocket.broadcast('move', notation);
});

// Record moves as they happen
streamer.recordMove(move);
```

### Archive Management

```typescript
import { PSNArchiveManager } from './PSNIntegration.example';

const manager = new PSNArchiveManager();

// Process entire archive
const report = await manager.processArchive('./archive/');
console.log(`Processed ${report.totalGames} games`);

// Find specific player's games
const playerGames = await manager.findGamesByPlayer('./archive/', 'AliceChess');

// Repair broken files
const repairs = await manager.repairArchive('./archive/');
console.log(`Repaired ${repairs.repaired} files`);
```

## Performance Considerations

### Parsing Performance
- **Stream Processing**: Large files parsed incrementally
- **Lazy Loading**: Headers parsed separately from moves
- **Batch Operations**: Multiple files processed in parallel
- **Caching**: Parsed results cached for repeated access

### Memory Usage
- **Move Objects**: ~200 bytes per move
- **Game State**: ~5KB for average game
- **PSN String**: ~2KB for average game
- **Archive Stats**: Computed incrementally

### Storage Optimization
- **Compact PSN**: Headers omitted for storage
- **Compressed Archives**: Standard compression works well
- **Indexed Access**: Support for partial file loading

## Validation Levels

### Syntax Validation
- Header format correctness
- Move notation structure
- Required fields presence

### Semantic Validation
- Card values in valid range
- Board positions exist
- Date format compliance

### Logic Validation
- Move sequence consistency
- Player alternation
- Turn numbering

### Game Rule Validation
- Move legality (optional)
- Card availability
- Position conflicts

## Testing

Comprehensive test suite covers:

```bash
npm test                    # Run all PSN tests
npm run test:psn-generator  # Test notation generation
npm run test:psn-parser     # Test parsing functionality
npm run test:psn-utils      # Test utility functions
npm run test:psn-integration# Test integration examples
```

Test categories:
- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction
- **Round-trip Tests**: Generation ↔ Parsing consistency
- **Error Tests**: Invalid input handling
- **Performance Tests**: Large archive processing

## Contributing

When contributing to the PSN system:

1. **Follow PSN Standards**: Adhere to official notation specification
2. **Add Tests**: Include tests for new features
3. **Error Handling**: Provide clear error messages
4. **Documentation**: Update README for API changes
5. **Performance**: Consider impact on large archives

## File Structure

```
psn/
├── PSNGenerator.ts         # PSN generation from game state
├── PSNParser.ts           # PSN parsing to game objects
├── PSNUtils.ts            # File operations and utilities
├── PSNIntegration.example.ts # Integration examples
├── PSN.test.ts            # Comprehensive test suite
├── index.ts               # Public API exports
└── README.md              # This documentation
```

## Future Enhancements

Planned features:
- **Comments Support**: `{comment}` notation in moves
- **Variations Support**: Alternative move sequences
- **Compressed PSN**: Binary format for large archives
- **Real-time Sync**: WebSocket-based PSN streaming
- **AI Analysis**: Engine evaluation annotations
- **Tournament Support**: Cross-table generation

## License

Part of the Skèmino multiplayer game platform. See main project license.