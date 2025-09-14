# 🚀 Claude Code Long-Term Optimization Guide - Progetto Skèmino

## 📋 CLAUDE.md - IL FILE MAGICO ESSENZIALE

**Crea SEMPRE un file `CLAUDE.md` nella root del progetto** - Claude Code lo legge **automaticamente** ad ogni avvio!

```markdown
# Skèmino - Gioco Multiplayer Competitive Gaming

## 🎯 PROGETTO OVERVIEW
Gioco strategico multiplayer real-time tipo chess.com con:
- Sistema rating ELO competitivo (1000-2700+)
- WebSocket real-time gaming
- Tornei e matchmaking
- 39 chain cards + regole morra cinese
- PSN (Portable Skèmino Notation)

## 🏗️ ARCHITETTURA PROGETTO

### Directory Structure Critical
```
skemino/
├── CLAUDE.md                    # <- TU SEI QUI - documenta tutto
├── docs/                        # Documentation system
│   ├── ARCHITECTURE.md          # System design
│   ├── GAME_RULES.md            # Complete Skèmino rules
│   └── API.md                   # Backend API docs
├── src/
│   ├── client/                  # Frontend React app
│   │   ├── components/gaming/   # Gaming UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── state/               # Redux/Zustand state
│   │   └── utils/               # Client utilities
│   ├── server/                  # Backend Node.js
│   │   ├── routes/              # API endpoints
│   │   ├── game-engine/         # Core Skèmino logic
│   │   ├── websocket/           # Real-time handlers
│   │   └── database/            # DB models/migrations
│   └── shared/                  # Shared types/utilities
├── tests/                       # Test suites
└── deployment/                  # Docker/K8s configs
```

### 🎮 CORE FILES LOCATIONS
- **Game Logic**: `src/server/game-engine/skemino-rules.ts`
- **WebSocket**: `src/server/websocket/game-events.ts` 
- **Frontend Board**: `src/client/components/gaming/SkeminoBoard.tsx`
- **Database Schema**: `src/server/database/schema.sql`
- **State Management**: `src/client/state/game-store.ts`

### 🔧 TECNOLOGIE STACK
- **Frontend**: React 18 + TypeScript + Tailwind + Socket.io-client
- **Backend**: Node.js + Express + TypeScript + Socket.io + PostgreSQL
- **Gaming**: Real-time WebSocket + ELO rating + Anti-cheat
- **Deployment**: Docker + Nginx + Redis + CI/CD

### 📝 DEVELOPMENT CONVENTIONS
- **File Naming**: kebab-case per files, PascalCase per React components
- **Git Workflow**: feature branches + conventional commits
- **Code Style**: ESLint + Prettier configurati
- **Testing**: Jest + Testing Library + Cypress e2e

### 🎯 CURRENT FOCUS
- Implementare architettura real-time gaming scalabile
- Sistema rating ELO competitivo
- UI/UX gaming responsive performante
- Sicurezza anti-cheat robusta

### 🚨 IMPORTANT NOTES
- Usare sub-agent `skemino-multiplayer-architect` per gaming expertise
- Performance target: <100ms latency WebSocket
- Database: PostgreSQL con Redis per real-time data
- Tutti i prompt relativi a Skèmino devono riferirsi alle regole complete
```

## 🗂️ DOCUMENTAZIONE STRATEGICA A 3 LIVELLI

### Livello 1: Foundation (CLAUDE.md)
**Sempre caricato automaticamente** - overview progetto, stack, convenzioni

### Livello 2: Component Documentation  
**File CONTEXT.md in ogni directory importante:**

```bash
# src/client/components/gaming/CONTEXT.md
# Gaming UI Components Context

Componenti specifici per l'interfaccia gaming Skèmino:
- SkeminoBoard.tsx: Board interattivo 6x6 con drag&drop
- CardHand.tsx: Gestione mano giocatore  
- GameTimer.tsx: Timer partita con countdown
- RatingDisplay.tsx: Visualizzazione rating live

Performance requirements: 60fps, <16ms render time
State management: Zustand gaming store
```

### Livello 3: Feature-Specific
**File README.md granulari per features complesse:**

```bash
# src/server/game-engine/README.md
# Skèmino Game Engine

Core logic implementazione regole complete Skèmino:
- 39 chain cards validation
- Morra cinese rules (Pietra/Forbici/Carta)  
- Vertex control system
- Loop detection algorithm
- PSN notation generation

Entry point: SkeminoGameEngine.ts
```

## 🎯 NAMING CONVENTIONS INTELLIGENTI

### File Naming Strategy Predictable
```bash
# Pattern che Claude Code capisce immediatamente:
skemino-[feature]-[type].ts

Esempi:
- skemino-game-engine.ts          # Core game logic
- skemino-websocket-handler.ts    # Real-time events  
- skemino-rating-calculator.ts    # ELO system
- skemino-board-component.tsx     # Main board UI
- skemino-matchmaking-service.ts  # Player matching
```

### Directory Structure Prevedibile
```bash
# Ogni feature ha la sua directory con pattern fisso:
src/[area]/[feature]/
├── index.ts              # Main export
├── [feature].service.ts  # Business logic  
├── [feature].types.ts    # TypeScript types
├── [feature].test.ts     # Unit tests
└── README.md             # Feature docs
```

## 🔍 CONTEXT LOADING OPTIMIZATION

### Strategia Smart Context Loading
```bash
# File .claudeignore - evita context pollution
node_modules/
.git/
dist/
build/
*.log
*.cache
coverage/
```

### Context Hints nei File
```typescript
// skemino-game-engine.ts
/**
 * CLAUDE CONTEXT: Core Skèmino game logic implementation
 * 
 * Dependencies: @/shared/types/game.ts, @/database/models/
 * Related: skemino-websocket-handler.ts, skemino-rating-calculator.ts
 * Tests: skemino-game-engine.test.ts
 * 
 * This file implements the complete Skèmino rules from the official spec
 */
```

## 🎮 GAMING-SPECIFIC OPTIMIZATION

### Gaming Context Files
```bash
# docs/GAMING_CONTEXT.md - always reference for gaming
Skèmino Gaming Implementation Requirements:

PERFORMANCE TARGETS:
- WebSocket latency: <100ms 
- UI response: <16ms (60fps)
- Database queries: <50ms
- Memory usage: <500MB per 1000 concurrent

GAMING FEATURES:
- Real-time multiplayer: Socket.io rooms
- Rating system: ELO with K-factor 160
- Anti-cheat: Server-side validation
- Tournaments: Swiss + Arena formats
```

### Code Organization Gaming
```typescript
// src/shared/types/game.ts - Central gaming types
export interface SkeminoGameState {
  board: BoardPosition[][];
  currentPlayer: 'white' | 'black';
  gamePhase: 'setup' | 'midgame' | 'endgame';
  vertexControl: VertexControl;
  rating: PlayerRating;
}

// Claude Code trova subito i types!
```

## 🚀 COMMANDS & SHORTCUTS SETUP

### Custom Claude Code Commands
```bash
# .claude/commands/skemino-dev.md
---
name: skemino-dev  
description: Setup completo sviluppo Skèmino con context loading automatico
---

1. Carica CLAUDE.md per project overview
2. Leggi docs/GAME_RULES.md per regole complete  
3. Verifica src/server/game-engine/ per logic corrente
4. Controlla src/client/components/gaming/ per UI status
5. Review tests/ per coverage attuale
6. Usa sub-agent skemino-multiplayer-architect per expertise
```

### Quick Navigation Commands
```bash
# Shortcuts per development veloce:
/reload                    # Ricarica context completo
/skemino-dev              # Setup development session
/test                     # Run test suite
/build                    # Build production
```

## 📁 CONTEXT MANAGEMENT AVANZATO

### Multi-Session Context Persistence
```bash
# .claude/workspace.json - Context state persistence
{
  "project": "skemino-multiplayer",
  "lastSession": {
    "focusAreas": ["game-engine", "websocket", "ui-gaming"],
    "activeBranch": "feature/real-time-gaming", 
    "contextFiles": [
      "src/server/game-engine/skemino-rules.ts",
      "src/client/components/gaming/SkeminoBoard.tsx"
    ]
  }
}
```

### Context Loading Hooks
```bash
# .claude/hooks/pre-session.sh
#!/bin/bash
echo "🎮 Skèmino Development Session Starting..."
echo "📁 Current branch: $(git branch --show-current)"
echo "🎯 Last commit: $(git log -1 --oneline)"
echo "📊 Files changed: $(git diff --name-only | wc -l)"
echo "🚀 Ready for gaming development!"
```

## 🎯 PROMPT OPTIMIZATION STRATEGIES

### Template Prompt Structure
```bash
# Pattern prompt ottimale per Skèmino:

"
CONTEXT: Sviluppo gioco Skèmino multiplayer competitive

FOCUS: [specific-area: game-engine|ui-gaming|websocket|database]

TASK: [specific-task]

REQUIREMENTS:
- Usa sub-agent skemino-multiplayer-architect 
- Riferisciti a docs/GAME_RULES.md per regole
- Performance target: <100ms latency
- Mantieni compatibilità con architettura esistente

FILES TO CHECK:
@CLAUDE.md @docs/ARCHITECTURE.md @src/[relevant-area]/

EXPECTED OUTPUT: [detailed-expectation]
"
```

### Context-Aware Prompting
```bash
# Esempi prompt ottimali per different focus:

GAME LOGIC:
"Implementa regola morra cinese in @src/server/game-engine/ seguendo spec @docs/GAME_RULES.md"

WEBSOCKET:  
"Ottimizza latency WebSocket in @src/server/websocket/ per target <100ms gaming"

UI GAMING:
"Migliora performance board rendering @src/client/components/gaming/ per 60fps"
```

## 🔧 TOOLING & AUTOMATION

### Development Environment Setup
```json
// .vscode/settings.json - IDE optimization
{
  "files.associations": {
    "*.md": "markdown",
    "CLAUDE.md": "markdown",
    "CONTEXT.md": "markdown"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  },
  "claude.contextFiles": [
    "CLAUDE.md",
    "docs/**/*.md",
    "src/**/CONTEXT.md"
  ]
}
```

### Automated Documentation Updates
```bash
# .github/workflows/docs-update.yml
name: Auto-update CLAUDE.md
on: [push]
jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Update project stats in CLAUDE.md
        run: |
          # Auto-update file counts, test coverage, etc.
          echo "📊 Files: $(find src -name '*.ts' | wc -l) TypeScript files" >> CLAUDE.md
```

## 🎮 GAMING-SPECIFIC CONSIDERATIONS

### Performance Monitoring Context
```bash
# docs/PERFORMANCE_CONTEXT.md
Current Performance Metrics:
- WebSocket latency: avg 45ms (target <100ms) ✅
- UI render time: avg 12ms (target <16ms) ✅  
- Database queries: avg 35ms (target <50ms) ✅
- Memory usage: 280MB/1000 users (target <500MB) ✅

OPTIMIZATION PRIORITIES:
1. WebSocket message batching
2. Client-side prediction
3. Database query optimization  
4. Asset preloading strategy
```

### Gaming State Documentation
```typescript
// Always include gaming context in code:
/**
 * GAMING CONTEXT: Real-time game state synchronization
 * 
 * This component handles the critical path for Skèmino gaming:
 * - Sub-100ms WebSocket communication  
 * - Server authoritative validation
 * - Client-side prediction for smooth UX
 * - Anti-cheat move validation
 * 
 * Performance impact: CRITICAL - affects all gaming experience
 */
```

## 🚀 LONG-TERM MAINTENANCE

### Knowledge Base Evolution
```bash
# Monthly updates to CLAUDE.md:
## CHANGELOG
### 2025-09 
- Added real-time WebSocket gaming ✅
- Implemented ELO rating system ✅  
- Enhanced UI gaming components ✅
- Added anti-cheat validation ✅

### 2025-10 (PLANNED)
- Tournament system implementation
- Mobile responsive gaming UI
- Performance optimization phase 2
- Advanced analytics dashboard
```

### Context Validation System
```bash
# .claude/validate-context.js
// Automated context health check
const validateContext = () => {
  checkFileExists('CLAUDE.md');
  checkDocumentationSync();
  validateNamingConventions();
  checkPerformanceMetrics();
  
  console.log('✅ Context health: OPTIMAL for Claude Code');
};
```

---

## 🎯 RISULTATO FINALE

Con questa setup, **Claude Code capirà istantaneamente**:
- ✅ Struttura completa progetto Skèmino
- ✅ Dove trovare ogni tipo di file
- ✅ Convenzioni di naming e coding  
- ✅ Performance requirements gaming
- ✅ Context necessario per ogni task
- ✅ Storia del progetto e decisioni architetturali

**TEMPO DI SETUP**: Claude Code sarà produttivo in **<30 secondi** ad ogni sessione invece di 5-10 minuti di context building! 🚀