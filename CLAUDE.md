# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎮 Project Overview: Skèmino - Multiplayer Strategic Board Game

Skèmino is a competitive multiplayer board game platform similar to chess.com, featuring:
- 39 Chain Cards (13 cards × 3 suits: Pietra/Forbici/Carta)
- 6×6 game board with strategic vertex control
- ELO rating system (1000-2700+ range)
- Real-time WebSocket multiplayer
- PSN (Portable Skèmino Notation) for game recording
- Tournament and matchmaking systems

## 🔄 MANDATORY DEVELOPMENT WORKFLOW (CRITICAL)

### GIT COMMIT REQUIREMENTS (NON-NEGOTIABLE)
**Claude MUST commit after EVERY significant implementation:**

```bash
# MANDATORY commit after each task completion
git add .
git commit -m "feat(scope): descriptive message"
git push origin current-branch

# COMMIT TRIGGERS (ALWAYS):
- ✅ After completing ANY user request
- ✅ After implementing ANY feature/component
- ✅ After fixing ANY bug
- ✅ After major refactoring
- ✅ Before switching to different task type
- ✅ At end of each development session
- ✅ After sub-agent consultation implementation
```

**Commit Message Convention (STRICT):**
- `feat(scope): description` - New features/components
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation updates
- `refactor(scope): description` - Code refactoring
- `perf(scope): description` - Performance improvements
- `test(scope): description` - Test additions/modifications
- `chore(scope): description` - Build/dependency updates

### PROGRESS TRACKING MANDATORY
**Claude MUST maintain detailed conversation log in:**
`docs/development-log/chat-history-YYYY-MM-DD.md`

**📌 CURRENT ACTIVE LOG FILE (UPDATE THIS DAILY):**
```
CURRENT LOG: docs/development-log/chat-history-2025-01-14.md
```
*This file MUST be updated after EVERY interaction with user*

**Log Entry Template (REQUIRED FORMAT):**
```markdown
## Session [N]: [HH:MM] - [MAIN_TOPIC]

### 📝 User Request:
[Exact user request text]

### 🎯 Sub-Agent Consultation:
- Consulted: [sub-agent-name]
- Expertise Applied: [key guidance received]

### 🚀 Implementation Summary:
- [x] Task 1: [specific detail] - Files: [list]
- [x] Task 2: [specific detail] - Files: [list]
- [ ] Task 3: [next steps identified]

### 🔗 Git Commit: `[hash]` - "[commit message]"

### 📊 Performance Impact:
- WebSocket latency: [measurement if applicable]
- Bundle size: [change if applicable]
- Memory usage: [impact if applicable]

### 🔄 Status: [COMPLETED/IN_PROGRESS/BLOCKED]

### 🎯 Next Actions:
- [Specific next implementation steps]
- [Blockers to resolve]
- [Sub-agents to consult next]

---
```

**Tracking Rules (MANDATORY):**
- Update after EVERY Claude interaction
- Include ALL modified files with paths
- Note performance impacts on targets
- Link every commit hash
- Identify specific next steps
- Reference sub-agent consultations

## 🤖 SUB-AGENT INTEGRATION (CRITICAL)

### PROACTIVE CONSULTATION REQUIRED
**ALWAYS consult relevant sub-agents before implementing ANY feature:**

```bash
# Consultation workflow for EVERY implementation:
1. Identify task type → 2. Consult relevant sub-agent → 3. Apply expertise → 4. Validate with agent → 5. Commit with reference
```

Ecco la **Sub-Agent Consultation Matrix** aggiornata con i nomi reali dei file:

### Sub-Agent Consultation Matrix (ACTUAL FILE NAMES)
| Task Type | Primary Sub-Agent | Secondary Sub-Agent |
|-----------|------------------|-------------------|
| Game Rules Implementation | `skemino-game-engine` | `skemino-architecture` |
| UI/UX Gaming & React Components | `skemino-ui` | `skemino-performance` |
| ELO Rating System | `skemino-elo` | `skemino-rating` |
| WebSocket/Real-time | `skemino-realtime-specialist` | `skemino-architecture` |
| PSN Notation | `skemino-game-engine` | `skemino-architecture` |
| Performance Optimization | `skemino-performance` | `skemino-architecture` |
| Tournament System | `skemino-league` | `skemino-elo` |
| Database & Persistence | `skemino-database-specialist` | `skemino-persistenza` |
| Architecture Decisions | `skemino-architecture` | `skemino-performance` |
| Large Refactoring | `skemino-refactoring` | `skemino-architecture` |
| Mobile Gaming Optimization | `skemino-ui` | `skemino-performance` |
| Frontend Performance | `skemino-ui` | `skemino-performance` |
| Game Logic Validation | `skemino-game-engine` | `skemino-testing-specialist` |
| Testing & QA | `skemino-testing-specialist` | `skemino-game-engine` |
| Real-time Features | `skemino-realtime-specialist` | `skemino-performance` |
| Data Persistence Strategy | `skemino-persistenza` | `skemino-database-specialist` |
| Player Rating Algorithms | `skemino-rating` | `skemino-elo` |

### Sub-Agent Command Format (EXACT SYNTAX)
```bash
# Use actual file names from .claude/agents/:
"Consulta skemino-expert per implementazione regole gioco"
"Usa skemino-ui per componenti React gaming"
"Applica expertise skemino-performance per ottimizzazione"
"Chiedi a skemino-architecture per decisioni architetturali"
"Utilizza skemino-elo per calcoli rating"
```

## 🎯 Development Commands

```bash
# Project setup
npm install              # Install dependencies
npm run dev              # Start development server (frontend + backend)
npm run dev:client       # Start only frontend (React)
npm run dev:server       # Start only backend (Node.js + WebSocket)
npm run build            # Build for production
npm run test             # Run full test suite
npm run test:game        # Run game logic tests only
npm run test:integration # Run integration tests
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run typecheck        # TypeScript type checking
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data
npm run docker:dev       # Start development with Docker
npm run docker:prod      # Build production Docker image
```

## 🏗️ Architecture & Project Structure

### Current Structure
```
skemino/
├── src/
│   ├── client/                  # Frontend React application
│   │   ├── components/gaming/   # Game UI components (board, cards, timer)
│   │   │   ├── Board/          # Interactive 6x6 game board
│   │   │   ├── Cards/          # Card components and hand management
│   │   │   ├── GameUI/         # Timer, rating, controls
│   │   │   └── Lobby/          # Matchmaking and game rooms
│   │   ├── hooks/               # Custom React hooks
│   │   ├── state/               # State management (Zustand/Redux)
│   │   ├── services/            # API and WebSocket clients
│   │   └── utils/               # Client utilities
│   ├── server/                  # Backend Node.js server
│   │   ├── routes/              # REST API endpoints
│   │   ├── game-engine/         # Core Skèmino game logic
│   │   │   ├── rules/          # Game rules implementation
│   │   │   ├── validation/     # Move validation
│   │   │   ├── elo/            # ELO rating calculations
│   │   │   └── psn/            # PSN notation system
│   │   ├── websocket/           # Real-time game handlers
│   │   ├── database/            # Database models and migrations
│   │   ├── services/            # Business logic services
│   │   └── middleware/          # Express middleware (auth, validation)
│   └── shared/                  # Shared types and utilities
├── tests/                       # Test suites
├── docs/                        # Documentation
│   └── development-log/         # MANDATORY: Chat history tracking
├── deployment/                  # Docker/K8s configurations
└── .claude/                     # Claude Code sub-agents
    └── agents/                  # Sub-agent knowledge bases
        ├── skemino-expert.md           # Game rules expert
        ├── skemino-ui.md               # UI/UX gaming specialist
        ├── skemino-elo.md              # ELO rating system
        ├── skemino-performance.md      # Performance optimization
        ├── skemino-persistenza.md      # Database persistence
        ├── skemino-rating.md           # Rating management
        ├── skemino-refactoring.md      # Code refactoring
        ├── skemino-legue.md            # Tournament system
        └── skemino-architecture.md     # System architecture
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Socket.io-client
- **Backend**: Node.js + Express + TypeScript + Socket.io + PostgreSQL
- **Real-time**: WebSocket with Socket.io for game synchronization
- **Database**: PostgreSQL for persistence + Redis for caching/sessions
- **Deployment**: Docker + Nginx + CI/CD pipeline
- **Testing**: Jest + React Testing Library + Cypress

## 🎲 Skèmino Game Rules (Core Implementation Requirements)

### Game Components
- **39 Chain Cards**: P1-P13, F1-F13, C1-C13 (Pietra/Forbici/Carta suits)
- **6×6 Board**: 36 squares with algebraic notation (a1-f6)
- **4 Quadrants**: Each with vertex (a1, f1, a6, f6) and central square
- **Setup System**: 3 dice (numeric, alphabetic, bicolor) for initial placement
- **11 Loop Cards**: For signaling "hole" situations during gameplay

### Core Mechanics
- **Morra Cinese Rules**: Pietra > Forbici, Forbici > Carta, Carta > Pietra
- **Card Placement**: Adjacent/contiguous only, no diagonals
- **Loop Detection**: Symbolic loops (≥3 different symbols) and numeric loops (Ace+King)
- **Vertex Control**: Key strategic objective with "exclusive" control
- **Victory Conditions**: ERA1-ERA4 (vertex control, board saturation, deck exhaustion, reversal card)

### ELO Rating System
- **Formula**: EA = 1/(1 + 10^((RB-RA)/(K²-K)))
- **Dynamic K-factor**: k = 160 * e^(-R̄/721.35)
- **10 skill levels**: Beginner (1000-1199) to Super Grand Master (≥2700)
- **Rating Updates**: Post-game with mathematical precision

### PSN Notation Format
```
[Event "Tournament Name"]
[Site "Rome, Lazio ITA"]
[Date "2025.09.14"]
[White "Player1"] [Black "Player2"]
[Result "1-0"]

1.C4:d3 F1:f6*
2.P2:a1 F7:e4
3.C7:c2=# 1-0
```

## 🚀 Performance Requirements (CRITICAL TARGETS)

- **WebSocket Latency**: <100ms (absolute target - consult `skemino-performance`)
- **UI Rendering**: 60fps gaming experience (always)
- **Database Queries**: <50ms response time (average)
- **Concurrent Users**: Support 1000+ simultaneous players
- **Memory Usage**: <500MB per 1000 users
- **API Response**: <200ms for non-real-time endpoints

## 🛡️ Security & Anti-Cheat Guidelines

### Server-Authoritative Validation
- **All moves validated server-side** - consult `skemino-architecture`
- **No client-side game logic** for critical operations
- **Move timeouts** to prevent stalling
- **Input sanitization** for all user data
- **Rate limiting** on all endpoints

### Authentication & Authorization
- **JWT tokens** with secure refresh mechanism
- **Session management** with Redis
- **Role-based permissions** (player, moderator, admin)

## 🗄️ Database Schema (Core Tables)

### Gaming Tables
```sql
-- Core gaming entities
players (id, username, email, rating, level, created_at)
games (id, white_player_id, black_player_id, result, psn_notation, duration)
moves (game_id, turn_number, move_notation, timestamp)
ratings_history (player_id, old_rating, new_rating, game_id, k_factor)

-- Tournament system
tournaments (id, name, type, status, start_time, max_players)
tournament_players (tournament_id, player_id, seed, current_score)
```

## 🔌 WebSocket Events (Real-time Gaming)

### Core Game Events
```typescript
// Outbound (server → client)
'game:started' | 'game:state-update' | 'game:ended' | 'move:validated' | 'move:invalid'

// Inbound (client → server)  
'game:join' | 'move:make' | 'game:resign' | 'game:offer-draw'

// Lobby events
'lobby:join' | 'matchmaking:start' | 'match:found'
```

## 📝 Development Conventions

### Code Style
- **File Naming**: kebab-case for files, PascalCase for React components
- **TypeScript**: Strict mode enabled, no `any` types allowed
- **Imports**: Absolute imports with path mapping (`@/components`, `@/utils`)
- **Component Structure**: Props interfaces, default exports, named exports for utilities

### Git Workflow
```bash
# Branch naming convention
feature/game-board-implementation
fix/websocket-reconnection-bug
refactor/elo-calculation-optimization

# Commit format (conventional commits)
feat(game-engine): implement loop detection algorithm
fix(websocket): handle disconnection gracefully  
docs(api): add authentication endpoint documentation
perf(ui): optimize card animation rendering
```

### Testing Strategy
- **Unit Tests**: All game logic functions (>90% coverage required)
- **Integration Tests**: API endpoints and WebSocket events
- **E2E Tests**: Complete game scenarios with Cypress
- **Performance Tests**: Load testing for concurrent users

## 🎯 Current Development Phases

### Phase 1: Foundation (CURRENT)
- [x] Project structure setup
- [ ] Core game engine implementation
- [ ] Database schema and migrations
- [ ] Basic WebSocket infrastructure

### Phase 2: Core Gaming
- [ ] Complete game rules implementation
- [ ] Real-time multiplayer functionality
- [ ] Basic UI components
- [ ] Move validation system

### Phase 3: Competitive Features
- [ ] ELO rating system
- [ ] Matchmaking algorithm
- [ ] PSN notation recording
- [ ] Tournament framework

### Phase 4: Production Ready
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Monitoring and analytics
- [ ] Deployment pipeline

## 🚨 Critical Implementation Rules

### Before ANY Implementation (MANDATORY CHECKLIST)
1. **✅ Consult relevant sub-agent** for expertise first
2. **✅ Review existing code** for patterns and consistency
3. **✅ Check performance impact** against critical targets
4. **✅ Validate TypeScript** strict compliance
5. **✅ Update chat history log** with session details
6. **✅ Test thoroughly** before committing
7. **✅ Commit with descriptive message** following convention
8. **✅ Update development log** with progress tracking

### Gaming-Specific Requirements
- **Server validation** for all game state changes (consult `skemino-architecture`)
- **Immutable state updates** in game engine (consult `skemino-expert`)
- **Error boundaries** in React components (consult `skemino-ui`)
- **Graceful degradation** for network issues (consult `skemino-performance`)
- **Accessibility** considerations for gaming UI (consult `skemino-ui`)

### Sub-Agent Consultation Examples
```bash
# Before implementing game rules:
"Consulta skemino-expert per validazione regole morra cinese"

# Before UI/UX work:
"Usa skemino-ui per design responsive componenti gaming"

# Before performance optimization:
"Applica expertise skemino-performance per ottimizzazione WebSocket"

# Before architecture decisions:
"Chiedi a skemino-architecture per pattern scalabilità multiplayer"
```

## 📚 Key Documentation & References

- **Game Rules**: Complete specifications in uploaded images
- **Sub-Agent Configs**: `.claude/agents/` directory for specialized expertise
- **Development Log**: `docs/development-log/` for progress tracking
- **API Documentation**: Auto-generated from OpenAPI specs
- **Database Docs**: ER diagrams and migration guides
- **Deployment Guides**: Docker, Kubernetes, and CI/CD setup

## ⚠️ Important Reminders (NON-NEGOTIABLE)

- **Sub-agent consultation is MANDATORY** before any implementation
- **Git commit after every task** is NON-NEGOTIABLE
- **Chat history tracking** must be maintained in: `docs/development-log/chat-history-2025-01-14.md`
- **UPDATE LOG FILE DAILY**: Change date in filename and update CLAUDE.md reference
- **<100ms WebSocket latency** is absolute priority target
- **Server-authoritative validation** prevents all cheating
- **PSN notation** required for all game recording
- **TypeScript strict mode** - zero tolerance for `any` types
- **Comprehensive error handling** for multiplayer edge cases
- **Performance monitoring** against all critical targets

## 🔧 Troubleshooting Common Issues

### WebSocket Connection Problems
1. Check Redis connection for session storage
2. Verify CORS settings for client domain
3. Ensure proper error handling in reconnection logic
4. **Consult**: `skemino-performance` for optimization strategies

### Game Logic Bugs
1. Always reproduce in unit tests first
2. **Consult**: `skemino-expert` for rule clarification
3. Validate against reference game scenarios
4. **Consult**: `skemino-architecture` for validation patterns

### Performance Issues
1. Profile with Chrome DevTools
2. Check database query performance
3. **Consult**: `skemino-performance` for optimization strategies
4. Monitor against critical targets (<100ms WebSocket)

### UI/UX Gaming Issues
1. **Consult**: `skemino-ui` for gaming-specific patterns
2. Test across devices and screen sizes
3. Validate accessibility compliance
4. Check 60fps rendering performance

## 🚀 Getting Started Checklist

- [ ] Clone repository and install dependencies
- [ ] Set up local PostgreSQL and Redis instances
- [ ] Configure environment variables (.env.example → .env)
- [ ] Run database migrations and seeds
- [ ] Start development servers (client + server)
- [ ] Verify WebSocket connection in browser
- [ ] Run test suite to ensure setup is correct
- [ ] **Create initial chat history log**: `docs/development-log/chat-history-[DATE].md`
- [ ] **Consult `skemino-architecture`** for first implementation task
- [ ] **Commit initial setup** with proper message format

## 🎯 Quick Command Reference

### Essential Sub-Agent Commands
```bash
# Game Rules & Logic
"Consulta skemino-expert per [specific game rule question]"

# UI/UX Development  
"Usa skemino-ui per [component/interface task]"

# Performance Optimization
"Applica expertise skemino-performance per [optimization task]"

# Architecture Decisions
"Chiedi a skemino-architecture per [architectural question]"

# Database & Persistence
"Utilizza skemino-persistenza per [database task]"

# ELO Rating System
"Consulta skemino-elo per [rating calculation/implementation]"
```

### Mandatory Git Commands
```bash
# After every implementation
git add .
git commit -m "feat(scope): descriptive message"
git push origin current-branch

# Update development log (CURRENT ACTIVE FILE)
# MUST EDIT: docs/development-log/chat-history-2025-01-14.md
# ⚠️ UPDATE THIS PATH DAILY IN CLAUDE.MD
```

### 📋 Daily Log File Management
```bash
# Start of new day workflow:
1. Create new log file: docs/development-log/chat-history-[NEW-DATE].md
2. Update CLAUDE.md line 51 with new filename
3. Update CLAUDE.md line 401 with new filename
4. Continue logging all sessions in the new file
```

---

**🎮 Remember: Skèmino is not just a game - it's a competitive gaming platform that requires chess.com-level quality, performance, and reliability. Every line of code should reflect this standard.**