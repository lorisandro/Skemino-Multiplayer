# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎮 Project Overview: Skèmino - Chess.com-Grade Competitive Gaming Platform

Skèmino is an enterprise-level competitive multiplayer board game platform engineered with Chess.com-proven technologies and superior Svelte performance:

### 🏆 Core Game Features
- **39 Chain Cards** (13 Pietra, 13 Forbici, 13 Carta) with server-authoritative validation
- **6×6 Strategic Board** with vertex control and quadrant-based gameplay  
- **Dynamic ELO Rating System** (1000-2700+ range) using Chess.com-grade algorithm
- **PSN (Portable Skèmino Notation)** for complete game recording and analysis
- **Real-time Multiplayer** with <20ms WebSocket latency target
- **Tournament & Matchmaking** system with intelligent queue management
- **ML-Powered Anti-Cheat** detection with <100ms analysis time

### 🚀 Technology Stack (Chess.com-Inspired Excellence)
- **Frontend**: Svelte 5 + SvelteKit (superior performance vs Chess.com React)
- **Backend**: Node.js + PHP/Symfony hybrid microservices
- **Database**: PostgreSQL + ScyllaDB + Redis cluster
- **Event Streaming**: Redpanda (Chess.com choice, -$400K/anno vs Kafka)
- **Infrastructure**: Kubernetes + Google Cloud Platform multi-regional
- **CDN & Security**: Cloudflare enterprise (same as Chess.com)
- **Performance**: 200M+ users ready, 50K+ moves/second capability

## 🚨 MANDATORY DEVELOPMENT WORKFLOW (CHESS.COM STANDARDS)

### Git Commit Requirements (NON-NEGOTIABLE)
**Claude MUST commit after EVERY significant implementation:**

```bash
# MANDATORY commit triggers:
git add .
git commit -m "feat(scope): descriptive message with performance metrics"
git push origin current-branch

# COMMIT REQUIRED AFTER:
✅ Any user request completion
✅ Any feature/component implementation
✅ Any bug fix with regression test
✅ Any refactoring with performance comparison
✅ Before switching task types
✅ After sub-agent consultation implementation
✅ End of each development session with metrics
✅ Major performance optimization with benchmarks
```

**Commit Message Convention (Chess.com Standards):**
- `feat(svelte): board component with <16ms render + bundle analysis`
- `feat(backend): game engine with <50ms validation + concurrent test`
- `feat(realtime): websocket with <20ms latency + stress test results`
- `fix(performance): memory optimization + before/after metrics`
- `perf(frontend): bundle reduction 40% + lighthouse score`
- `security(auth): OAuth 2.0 + penetration test results`
- `docs(api): openapi spec + integration examples`
- `test(e2e): tournament flow + performance benchmarks`

### Progress Tracking (Enterprise-Grade)
**📌 CURRENT ACTIVE LOG FILE (UPDATE DAILY):**
```
CURRENT LOG: docs/development-log/chat-history-2025-01-15.md
```

**Log Entry Template (REQUIRED FORMAT):**
```markdown
## Session [N]: [HH:MM] - [MAIN_TOPIC]

### 📝 User Request:
[Exact user request text]

### 🎯 Chess.com Pattern Applied:
[Specific Chess.com technology/pattern referenced]

### 🤖 Sub-Agent Consultation:
- Consulted: [sub-agent-name]
- Expertise Applied: [key guidance received]

### 🚀 Implementation Summary:
- [x] Task 1: [specific detail] - Files: [list] - Performance: [metrics]
- [x] Task 2: [specific detail] - Files: [list] - Performance: [metrics]
- [ ] Task 3: [next steps identified]

### 📊 Performance Impact (Chess.com Targets):
- WebSocket latency: [measurement vs <20ms target]
- Bundle size: [change vs <25KB target]  
- Memory usage: [impact vs <100MB target]
- Database queries: [performance vs <30ms target]
- Concurrent users: [capability vs 10K+ target]

### 🔗 Git Commit: `[hash]` - "[commit message with metrics]"

### 🏗️ Architecture Decisions:
- Microservices affected: [list]
- Scalability considerations: [Chess.com patterns]
- Event streaming impact: [Redpanda integration]

### 🔄 Status: [COMPLETED/IN_PROGRESS/BLOCKED]

### 🎯 Next Actions:
- [Specific implementation steps with sub-agent consultation]
- [Performance targets and validation methods]
- [Chess.com pattern applications needed]

---
```

## 🤖 SUB-AGENT INTEGRATION (CHESS.COM-LEVEL EXPERTISE)

### Proactive Consultation Required (MANDATORY)
**ALWAYS consult relevant sub-agents BEFORE implementing:**

```bash
# Workflow: Task Identification → Sub-Agent Consultation → Chess.com Pattern Application → Implementation → Performance Validation → Commit
```

### Sub-Agent Consultation Matrix (Chess.com Expertise)
| Task Type | Primary Sub-Agent | Chess.com Pattern | Performance Target |
|-----------|------------------|-------------------|-------------------|
| Svelte UI Components | `skemino-ui` | Component optimization | <16ms render, <25KB bundle |
| Game Rules Engine | `skemino-game-engine` | Server-authoritative validation | <50ms move validation |
| ELO Rating System | `skemino-elo` | Dynamic K-factor algorithm | Real-time calculation |
| Event Streaming Real-time | `skemino-realtime-specialist` | Event-driven architecture | <20ms WebSocket latency |
| Database Performance | `skemino-database-specialist` | Multi-regional sharding | <30ms query response |
| ML Anti-Cheat | `skemino-security-specialist` | Pattern recognition ML | <100ms analysis |
| Tournament System | `skemino-tournament` | Queue-based matchmaking | Fair play algorithms |
| Microservices Architecture | `skemino-architecture` | Domain-driven design | Horizontal scalability |
| Performance Optimization | `skemino-performance` | Multi-tier caching | 200M+ users ready |
| Analytics & BI | `skemino-analytics-specialist` | Real-time metrics | Business intelligence |
| Mobile Gaming | `skemino-mobile-specialist` | Cross-platform optimization | Native performance |
| API Gateway & Security | `skemino-api-specialist` | OAuth 2.0 + JWT enterprise | Rate limiting |
| DevOps & Infrastructure | `skemino-devops-specialist` | Kubernetes + Docker | CI/CD automation |
| Load Testing & QA | `skemino-testing-specialist` | Chaos engineering | 99.9% uptime |

## 🏗️ Architecture & Project Structure (Chess.com-Inspired)

### Current Structure (Enterprise-Grade)
```
skemino/
├── src/
│   ├── frontend/                    # Svelte 5 + SvelteKit Application  
│   │   ├── src/
│   │   │   ├── lib/                # Svelte component library
│   │   │   │   ├── components/     # Gaming UI components
│   │   │   │   │   ├── Board/      # Interactive 6x6 game board (<16ms render)
│   │   │   │   │   ├── Cards/      # 39 Chain Cards with animations
│   │   │   │   │   ├── GameUI/     # Timer, ELO display, controls
│   │   │   │   │   ├── Tournament/ # Tournament brackets & matchmaking
│   │   │   │   │   └── Analytics/  # Real-time stats & insights
│   │   │   │   ├── stores/         # Svelte stores + event streaming
│   │   │   │   ├── utils/          # Gaming utilities & algorithms
│   │   │   │   └── types/          # TypeScript interfaces
│   │   │   ├── routes/             # SvelteKit file-based routing
│   │   │   ├── hooks/              # SvelteKit hooks & middleware
│   │   │   ├── app.html            # App shell with PWA manifest
│   │   │   └── service-worker.ts   # PWA service worker
│   │   ├── static/                 # Static assets
│   │   ├── tests/                  # Vitest + Playwright tests
│   │   ├── vite.config.ts          # Vite configuration
│   │   ├── playwright.config.ts    # E2E test configuration
│   │   └── package.json            # Dependencies & scripts
│   ├── backend/                     # Microservices Architecture
│   │   ├── api-gateway/            # Kong/Envoy API Gateway
│   │   │   ├── src/                # Gateway routing & middleware
│   │   │   ├── config/             # Rate limiting & security
│   │   │   └── monitoring/         # Gateway metrics
│   │   ├── game-engine/            # Core Skèmino Game Logic Service
│   │   │   ├── src/
│   │   │   │   ├── rules/          # Server-authoritative game rules
│   │   │   │   ├── validation/     # Move validation pipeline
│   │   │   │   ├── elo/            # ELO rating calculations
│   │   │   │   ├── psn/            # PSN notation parser/generator
│   │   │   │   ├── anti-cheat/     # ML cheat detection
│   │   │   │   └── engine.ts       # Main game engine
│   │   │   ├── tests/              # Comprehensive test suite
│   │   │   └── Dockerfile          # Container configuration
│   │   ├── user-service/           # User management & authentication
│   │   │   ├── src/
│   │   │   │   ├── auth/           # OAuth 2.0 + JWT implementation
│   │   │   │   ├── profiles/       # User profiles & preferences
│   │   │   │   ├── ratings/        # ELO rating management
│   │   │   │   └── sessions/       # Session management
│   │   │   └── migrations/         # Database migrations
│   │   ├── tournament-service/     # Tournament & matchmaking
│   │   │   ├── src/
│   │   │   │   ├── matchmaking/    # Intelligent player matching
│   │   │   │   ├── tournaments/    # Tournament management
│   │   │   │   ├── queues/         # Gaming queues
│   │   │   │   └── brackets/       # Tournament brackets
│   │   ├── notification-service/   # Real-time notifications
│   │   │   ├── src/
│   │   │   │   ├── websocket/      # WebSocket management
│   │   │   │   ├── events/         # Event handling
│   │   │   │   └── push/           # Push notifications
│   │   ├── analytics-service/      # Business intelligence
│   │   │   ├── src/
│   │   │   │   ├── metrics/        # Real-time metrics collection
│   │   │   │   ├── dashboards/     # BI dashboard APIs
│   │   │   │   └── reports/        # Automated reporting
│   │   └── shared/                 # Shared libraries
│   │       ├── types/              # TypeScript shared types
│   │       ├── utils/              # Common utilities
│   │       ├── config/             # Configuration management
│   │       └── middleware/         # Shared middleware
│   └── database/                    # Database Layer
│       ├── postgresql/             # Primary OLTP database
│       │   ├── migrations/         # Database migrations
│       │   ├── seeds/              # Test data seeds
│       │   └── queries/            # Optimized queries
│       ├── scylladb/              # High-performance gaming data
│       │   ├── keyspaces/         # Keyspace definitions
│       │   └── tables/            # Table schemas
│       └── redis/                 # Caching & sessions
│           ├── config/            # Redis configuration
│           └── scripts/           # Lua scripts
├── infrastructure/                 # Infrastructure as Code
│   ├── kubernetes/                # K8s deployments
│   │   ├── namespaces/           # Environment separation
│   │   ├── deployments/          # Service deployments
│   │   ├── services/             # Service definitions
│   │   ├── ingress/              # Load balancing
│   │   └── monitoring/           # Prometheus/Grafana
│   ├── terraform/                # Infrastructure provisioning
│   │   ├── modules/              # Reusable modules
│   │   ├── environments/         # Environment configurations
│   │   └── providers/            # Cloud provider configs
│   ├── helm/                     # Helm charts
│   │   ├── charts/               # Application charts
│   │   └── values/               # Environment values
│   └── docker/                   # Docker configurations
│       ├── dockerfiles/          # Service Dockerfiles
│       └── compose/              # Local development
├── event-streaming/               # Event Architecture
│   ├── redpanda/                 # Redpanda configuration
│   │   ├── config/               # Cluster configuration
│   │   └── schemas/              # Avro schemas
│   ├── producers/                # Event producers
│   ├── consumers/                # Event consumers
│   └── processors/               # Stream processing
├── monitoring/                   # Observability Stack
│   ├── prometheus/               # Metrics collection
│   │   ├── config/               # Prometheus configuration
│   │   └── rules/                # Alerting rules
│   ├── grafana/                  # Dashboards & visualization
│   │   ├── dashboards/           # Gaming metrics dashboards
│   │   └── alerts/               # Alert configurations
│   ├── jaeger/                   # Distributed tracing
│   └── elasticsearch/            # Log aggregation
│       ├── indices/              # Index templates
│       └── mappings/             # Field mappings
├── security/                     # Security Configuration
│   ├── vault/                    # Secrets management
│   ├── certificates/             # TLS certificate management
│   ├── policies/                 # Security policies
│   └── scanning/                 # Security scanning configs
├── tests/                        # Test Suites
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   ├── performance/              # Load & stress tests
│   └── chaos/                    # Chaos engineering tests
├── docs/                         # Documentation
│   ├── api/                      # OpenAPI specifications
│   ├── architecture/             # System design docs
│   ├── runbooks/                 # Operational procedures
│   ├── development-log/          # MANDATORY: Chat history tracking
│   │   └── chat-history-2025-01-15.md  # Current active log
│   └── guides/                   # Development guides
├── scripts/                      # Automation Scripts
│   ├── deployment/               # Deployment automation
│   ├── database/                 # Database management
│   ├── monitoring/               # Monitoring setup
│   └── development/              # Development utilities
└── .claude/                      # Claude Code Configuration
    └── agents/                   # Sub-agent knowledge bases
        ├── skemino-ui.md                      # Svelte UI expertise
        ├── skemino-game-engine.md             # Game logic specialist
        ├── skemino-elo.md                     # ELO rating expert
        ├── skemino-realtime-specialist.md     # Real-time systems
        ├── skemino-database-specialist.md     # Database optimization
        ├── skemino-security-specialist.md     # ML anti-cheat & security
        ├── skemino-tournament.md              # Tournament systems
        ├── skemino-architecture.md            # System architecture
        ├── skemino-performance.md             # Performance optimization
        ├── skemino-analytics-specialist.md    # Business intelligence
        ├── skemino-mobile-specialist.md       # Mobile optimization
        ├── skemino-api-specialist.md          # API design & security
        ├── skemino-devops-specialist.md       # DevOps & infrastructure
        └── skemino-testing-specialist.md      # QA & testing strategies
```

### Technology Stack (Chess.com-Grade)

#### Frontend Stack (Svelte Advantage)
- **Framework**: Svelte 5 + SvelteKit + TypeScript + TailwindCSS
- **State Management**: Svelte stores + Redpanda event streaming integration
- **Real-time**: Socket.io-client + Server-Sent Events + WebRTC
- **Build System**: Vite + Rollup with advanced optimization
- **PWA**: Service workers + offline gaming capability
- **Testing**: Vitest + @testing-library/svelte + Playwright E2E
- **Performance**: <25KB bundle size + <16ms component render

#### Backend Stack (Chess.com-Inspired Microservices)
- **Runtime**: Node.js 20+ LTS + PHP 8.2+ (Symfony framework)
- **API Gateway**: Kong/Envoy Proxy with enterprise rate limiting
- **Authentication**: OAuth 2.0 + JWT + refresh tokens + Redis sessions
- **Validation**: Zod schema validation + server-authoritative game rules
- **Documentation**: OpenAPI 3.0 + Swagger UI + automated testing

#### Database Stack (Multi-Regional Performance)
- **Primary OLTP**: PostgreSQL 15+ with multi-master replication
  - Read replicas per geographic region
  - Connection pooling (PgBouncer)
  - Automated failover & backup
- **High-Performance Gaming**: ScyllaDB cluster for real-time data
  - Sub-millisecond latency
  - Horizontal scaling
  - Gaming-specific data models
- **Caching Layer**: Redis Cluster + Redis Sentinel
  - Session storage
  - Game state caching
  - Real-time leaderboards
- **Search & Analytics**: Elasticsearch for complex queries
  - User search
  - Game history search
  - Advanced analytics

#### Event Streaming (Chess.com Architecture)
- **Platform**: Redpanda (Chess.com proven, -$400K/anno vs Kafka)
- **Schema Management**: Confluent Schema Registry
- **Event Formats**: Avro + Protocol Buffers for efficiency
- **Stream Processing**: Apache Flink + custom processors

#### Infrastructure (Global Scale)
- **Containerization**: Docker with multi-stage builds + security hardening
- **Orchestration**: Kubernetes + Helm charts + GitOps deployment
- **Service Mesh**: Istio for microservice communication & security
- **Load Balancing**: Nginx + HAProxy with intelligent routing
- **CDN**: Cloudflare Enterprise (same as Chess.com)
  - Global edge caching
  - DDoS protection
  - Web Application Firewall
- **Cloud**: Google Cloud Platform multi-regional (Chess.com choice)
  - Cloud SQL for PostgreSQL
  - GKE for Kubernetes
  - Cloud CDN + Load Balancing

#### Security Stack (Enterprise-Grade)
- **Transport Security**: TLS 1.3 with perfect forward secrecy
- **Web Security**: Cloudflare WAF + custom security rules
- **Authentication**: Multi-factor authentication + SSO integration
- **Anti-Cheat**: Custom ML models + behavioral analysis (Chess.com pattern)
- **Secrets Management**: HashiCorp Vault + Kubernetes secrets
- **Compliance**: SOC 2 + GDPR + PCI DSS ready

#### Monitoring & Observability (Chess.com-Level)
- **Metrics**: Prometheus + Grafana with custom gaming dashboards
- **Logging**: ELK Stack (Elasticsearch + Logstash + Kibana)
- **Tracing**: Jaeger distributed tracing across microservices
- **APM**: Custom application performance monitoring
- **Alerting**: PagerDuty integration + custom webhooks
- **Business Intelligence**: Custom analytics pipeline

## 🎲 Skèmino Game Rules (Server-Authoritative Implementation)

### Core Game Components
- **39 Chain Cards**: P1-P13, F1-F13, C1-C13 with cryptographic validation
- **6×6 Strategic Board**: 36 squares with algebraic notation (a1-f6)
- **4 Quadrants**: Vertex control system (a1, f1, a6, f6) with central squares
- **Setup System**: 3 dice system (numeric, alphabetic, bicolor) for fairness
- **11 Loop Cards**: "Hole" situation signaling during gameplay

### Core Game Mechanics (Performance-Optimized)
- **Morra Cinese Rules**: Pietra > Forbici, Forbici > Carta, Carta > Pietra
- **Card Placement**: Adjacent/contiguous validation with O(1) lookup
- **Loop Detection**: Efficient algorithms for symbolic and numeric loops
- **Vertex Control**: Strategic objective with "exclusive" control validation
- **Victory Conditions**: ERA1-ERA4 automated detection

### ELO Rating System (Chess.com-Grade Precision)
- **Formula**: EA = 1/(1 + 10^((RB-RA)/(K²-K))) - exact Chess.com implementation
- **Dynamic K-factor**: k = 160 * e^(-R̄/721.35) - mathematically precise
- **Rating Levels**: 10 skill tiers from Beginner (1000-1199) to Super Grand Master (≥2700)
- **Real-time Updates**: Post-game rating recalculation with ML validation
- **Rating Protection**: Anti-sandbagging measures + provisional ratings

### PSN Notation (Portable Skèmino Notation)
```
[Event "Tournament Name"]
[Site "Rome, Lazio ITA"]
[Date "2025.09.16"]
[White "Player1"] [Black "Player2"]
[Result "1-0"]

1.C4:d3 F1:f6*
2.P2:a1 F7:e4
3.C7:c2=# 1-0
```

## 🚀 Performance Requirements (Chess.com-Superior Targets)

### Critical Performance Targets
- **WebSocket Latency**: <20ms (superior to Chess.com <100ms)
- **UI Rendering**: 60fps+ gaming experience (Svelte advantage)
- **Database Queries**: <30ms average response time
- **Concurrent Users**: 50,000+ simultaneous players capability
- **Memory Usage**: <100MB per 1000 concurrent users
- **API Response**: <200ms for complex operations
- **Bundle Size**: <25KB (Svelte advantage vs React 150KB+)

### Svelte Performance Advantages
- **No Virtual DOM**: Direct DOM manipulation = faster rendering
- **Compile-time Optimization**: Smaller bundle size
- **Reactive Updates**: Surgical DOM updates only when needed
- **Memory Efficiency**: Lower memory footprint vs React
- **Startup Performance**: Faster initial page load

## 🗄️ Database Schema (Chess.com-Inspired Design)

### Core Gaming Tables (Optimized for Scale)
```sql
-- Users & Authentication (Multi-regional)
users (
    id UUID PRIMARY KEY,
    username VARCHAR(32) UNIQUE,
    email VARCHAR(255) UNIQUE,
    rating_rapid INTEGER DEFAULT 1000,
    rating_blitz INTEGER DEFAULT 1000,
    rating_bullet INTEGER DEFAULT 1000,
    peak_rating INTEGER,
    country_code CHAR(2),
    premium_tier VARCHAR(20),
    created_at TIMESTAMPTZ,
    last_active TIMESTAMPTZ
);

-- Games (Partitioned by date for scale)
games (
    id UUID PRIMARY KEY,
    white_player_id UUID REFERENCES users(id),
    black_player_id UUID REFERENCES users(id),
    time_control VARCHAR(20),
    result VARCHAR(10),
    termination VARCHAR(20),
    psn_notation TEXT,
    duration_seconds INTEGER,
    tournament_id UUID,
    white_rating_before INTEGER,
    black_rating_before INTEGER,
    white_rating_after INTEGER,
    black_rating_after INTEGER,
    created_at TIMESTAMPTZ
) PARTITION BY RANGE (created_at);

-- Moves (High-volume table, heavily optimized)
moves (
    game_id UUID REFERENCES games(id),
    move_number INTEGER,
    move_notation VARCHAR(10),
    time_spent_ms INTEGER,
    time_remaining_ms INTEGER,
    created_at TIMESTAMPTZ,
    PRIMARY KEY (game_id, move_number)
);

-- Rating History (Chess.com-style tracking)
rating_history (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES users(id),
    game_id UUID REFERENCES games(id),
    old_rating INTEGER,
    new_rating INTEGER,
    k_factor DECIMAL(5,2),
    opponent_rating INTEGER,
    time_control VARCHAR(20),
    created_at TIMESTAMPTZ
);

-- Tournaments (Enterprise tournament system)
tournaments (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50), -- swiss, knockout, round_robin, arena
    time_control VARCHAR(20),
    status VARCHAR(20),
    max_players INTEGER,
    entry_fee_cents INTEGER,
    prize_pool_cents INTEGER,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ
);

-- Tournament Participants
tournament_participants (
    tournament_id UUID REFERENCES tournaments(id),
    player_id UUID REFERENCES users(id),
    seed INTEGER,
    score DECIMAL(3,1),
    current_rank INTEGER,
    registered_at TIMESTAMPTZ,
    PRIMARY KEY (tournament_id, player_id)
);

-- Anti-cheat Analysis (Chess.com-inspired)
cheat_analysis (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES users(id),
    game_id UUID REFERENCES games(id),
    analysis_type VARCHAR(50),
    confidence_score DECIMAL(5,4),
    flags JSONB,
    reviewer_id UUID,
    status VARCHAR(20),
    created_at TIMESTAMPTZ
);

-- Sessions & Security
user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    token_hash VARCHAR(128),
    refresh_token_hash VARCHAR(128),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
);
```

## 🔌 WebSocket Events (Real-time Gaming)

### Core Game Events
```typescript
// Outbound (server → client)
type ServerEvents = {
  'game:started': GameStartedEvent;
  'game:state-update': GameStateUpdate;
  'game:move': MoveEvent;
  'game:ended': GameEndedEvent;
  'game:time-update': TimeUpdateEvent;
  'player:joined': PlayerJoinedEvent;
  'player:disconnected': PlayerDisconnectedEvent;
  'rating:updated': RatingUpdateEvent;
  'tournament:update': TournamentUpdateEvent;
  'anti-cheat:flag': AntiCheatFlagEvent;
};

// Inbound (client → server)
type ClientEvents = {
  'game:join': JoinGameRequest;
  'game:move': MakeMoveRequest;
  'game:resign': ResignGameRequest;
  'game:offer-draw': OfferDrawRequest;
  'game:accept-draw': AcceptDrawRequest;
  'game:claim-time': ClaimTimeRequest;
  'matchmaking:join': JoinMatchmakingRequest;
  'matchmaking:cancel': CancelMatchmakingRequest;
  'tournament:join': JoinTournamentRequest;
};
```

### Event Streaming Architecture
```typescript
// Redpanda Topics (Chess.com-inspired)
const TOPICS = {
  GAME_EVENTS: 'skemino.games.events',
  MOVE_EVENTS: 'skemino.moves.events',
  RATING_EVENTS: 'skemino.ratings.events',
  TOURNAMENT_EVENTS: 'skemino.tournaments.events',
  ANALYTICS_EVENTS: 'skemino.analytics.events',
  ANTI_CHEAT_EVENTS: 'skemino.anticheat.events'
};

// Event Schema (Avro)
interface GameMoveEvent {
  gameId: string;
  playerId: string;
  moveNotation: string;
  timeSpent: number;
  timeRemaining: number;
  gameState: GameState;
  timestamp: number;
}
```

## 🛡️ Security & Anti-Cheat (Chess.com-Level)

### Server-Authoritative Validation
- **All moves validated server-side** - no client trust
- **Game state immutability** - complete audit trail
- **Move timeouts** - prevent stalling tactics
- **Input sanitization** - comprehensive validation
- **Rate limiting** - per-user action limits

### ML Anti-Cheat Pipeline (Chess.com-Inspired)
```typescript
interface AntiCheatAnalysis {
  moveTimeAnalysis: {
    averageThinkTime: number;
    consistency: number;
    suspiciousPatterns: string[];
  };
  strengthAnalysis: {
    eloConsistency: number;
    playStrength: number;
    accuracyScore: number;
  };
  behaviorAnalysis: {
    clickPatterns: MouseEvent[];
    focusEvents: FocusEvent[];
    browserFingerprint: string;
  };
  suspicionScore: number; // 0-1, >0.8 flagged
}
```

### Authentication & Authorization
- **OAuth 2.0 + JWT** enterprise implementation
- **Refresh token rotation** - security best practices
- **Session management** - Redis-backed with expiration
- **Multi-factor authentication** - optional security layer
- **Role-based access control** - granular permissions

## 📊 Monitoring & Analytics (Chess.com-Level Intelligence)

### Real-time Metrics (Prometheus + Grafana)
```yaml
# Gaming Business Metrics
- skemino_games_started_total: Counter
- skemino_games_completed_total: Counter  
- skemino_concurrent_games: Gauge
- skemino_players_online: Gauge
- skemino_moves_per_second: Gauge
- skemino_rating_updates_total: Counter
- skemino_tournament_participants: Gauge
- skemino_cheat_flags_total: Counter

# Technical Performance Metrics
- skemino_websocket_latency_seconds: Histogram
- skemino_database_query_duration_seconds: Histogram
- skemino_api_request_duration_seconds: Histogram
- skemino_memory_usage_bytes: Gauge
- skemino_cpu_usage_percent: Gauge
- skemino_error_rate: Counter
- skemino_cache_hit_ratio: Gauge
```

### Custom Gaming Dashboards
- **Real-time Gaming Overview**: Active games, players online, moves/sec
- **Performance Monitoring**: WebSocket latency, API response times, error rates
- **Business Intelligence**: User engagement, tournament participation, revenue
- **Security Dashboard**: Anti-cheat alerts, authentication failures, security events
- **Infrastructure Health**: Service status, resource utilization, scaling events

## 🚀 Development Commands (Enterprise-Grade)

### Svelte Frontend Development
```bash
# Project setup
npm create svelte@latest skemino-frontend
cd skemino-frontend && npm install

# Development
npm run dev              # SvelteKit dev server with HMR
npm run dev:debug        # Debug mode with detailed logging
npm run build            # Production build with optimization
npm run preview          # Production preview
npm run package          # Create package for distribution

# Testing
npm run test:unit        # Vitest unit tests
npm run test:e2e         # Playwright end-to-end tests
npm run test:coverage    # Test coverage report
npm run test:visual      # Visual regression testing

# Performance
npm run analyze          # Bundle analyzer
npm run lighthouse       # Performance audit
npm run perf:profile     # Performance profiling
```

### Backend Microservices Development
```bash
# Services development
npm run dev:services     # All microservices in development mode
npm run dev:game-engine  # Game engine service only
npm run dev:user-service # User service only
npm run dev:tournament   # Tournament service only
npm run dev:gateway      # API gateway only

# Building & containerization
npm run build:all        # Build all microservices
npm run docker:build     # Build Docker images
npm run docker:push      # Push to registry
npm run compose:dev      # Docker Compose for development

# Testing microservices
npm run test:unit        # All unit tests
npm run test:integration # Integration tests
npm run test:contract    # Contract testing
npm run test:load        # Load testing with k6
```

### Database Operations
```bash
# PostgreSQL operations
npm run db:create        # Create databases
npm run db:migrate       # Run migrations
npm run db:migrate:down  # Rollback migrations
npm run db:seed          # Seed development data
npm run db:backup        # Create backup
npm run db:restore       # Restore from backup

# ScyllaDB operations  
npm run scylla:setup     # Initialize keyspaces
npm run scylla:migrate   # Schema migrations
npm run scylla:seed      # Sample gaming data

# Redis operations
npm run redis:flush      # Clear all caches
npm run redis:monitor    # Monitor Redis commands
npm run redis:backup     # Backup Redis data
```

### Infrastructure & Deployment
```bash
# Kubernetes operations
kubectl apply -f infrastructure/k8s/
helm install skemino ./infrastructure/helm/
helm upgrade skemino ./infrastructure/helm/

# Terraform infrastructure
cd infrastructure/terraform
terraform plan
terraform apply
terraform destroy

# Monitoring setup
docker-compose -f monitoring/docker-compose.yml up
kubectl apply -f infrastructure/monitoring/

# Event streaming
./scripts/redpanda-setup.sh
npm run events:test      # Test event publishing/consuming
```

## 📋 Performance Benchmarks (Chess.com-Superior Targets)

### Frontend Performance (Svelte Advantage)
```yaml
Lighthouse Performance Targets:
  Performance Score: >95
  First Contentful Paint: <1.0s
  Largest Contentful Paint: <2.0s  
  Time to Interactive: <2.5s
  Cumulative Layout Shift: <0.1
  Bundle Size: <25KB (vs Chess.com React ~150KB)
  Memory Usage: <100MB (vs Chess.com React ~200MB)
  Component Render: <16ms (no Virtual DOM overhead)
```

### Backend Performance (Enterprise SLA)
```yaml
API Response Time Targets:
  Move Validation: <50ms p95
  Game State Retrieval: <30ms p95
  User Authentication: <100ms p95
  Rating Calculation: <200ms p95
  Tournament Operations: <500ms p95
  Database Queries: <30ms average
  Cache Operations: <5ms p95

Throughput Targets:
  Concurrent Users: 50,000+
  Moves per Second: 50,000+
  Games Started per Hour: 100,000+
  Database Transactions: 100,000 TPS
  WebSocket Connections: 50,000 concurrent
```

### Infrastructure Performance
```yaml
System Availability:
  Uptime SLA: 99.9% (8.77 hours downtime/year)
  Database Availability: 99.95%
  Real-time Messaging: 99.8%
  CDN Availability: 99.99%

Security & Anti-cheat:
  Failed Login Rate: <0.1%
  Cheat Detection Accuracy: >99.5%
  False Positive Rate: <0.01%
  Security Response: <1 hour MTTR
```

## 🎯 Development Phases (Strategic Roadmap)

### Phase 1: Foundation (Months 1-3)
- [x] Project structure setup (Chess.com-inspired)
- [x] Svelte 5 + SvelteKit configuration with TypeScript
- [x] PostgreSQL + ScyllaDB + Redis database layer
- [x] Basic WebSocket infrastructure
- [ ] OAuth 2.0 + JWT authentication system
- [ ] API Gateway with Kong/Envoy
- [ ] Docker containerization + Kubernetes setup
- [ ] Basic monitoring (Prometheus + Grafana)

### Phase 2: Core Gaming Engine (Months 4-6)
- [ ] Server-authoritative game rules implementation
- [ ] 39 Chain Cards logic with validation
- [ ] 6x6 board mechanics with vertex control
- [ ] PSN notation parser/generator
- [ ] Basic ELO rating system
- [ ] Move validation pipeline (<50ms target)
- [ ] Real-time game state synchronization
- [ ] Basic Svelte gaming components

### Phase 3: Advanced Features (Months 7-9)
- [ ] ML-powered anti-cheat system (Chess.com-inspired)
- [ ] Tournament system with matchmaking
- [ ] Advanced Svelte UI components with animations
- [ ] Redpanda event streaming integration
- [ ] Performance optimization (<20ms WebSocket latency)
- [ ] Advanced ELO calculations with K-factor dynamics
- [ ] Multi-regional database deployment
- [ ] Comprehensive testing suite

### Phase 4: Production Ready (Months 10-12)
- [ ] Security hardening and penetration testing
- [ ] Advanced monitoring and alerting
- [ ] Chaos engineering and reliability testing
- [ ] Performance optimization for 50K+ concurrent users
- [ ] Advanced business intelligence and analytics
- [ ] Mobile app development and optimization
- [ ] Beta testing program
- [ ] Production deployment with CI/CD

## 🚨 Critical Implementation Rules (NON-NEGOTIABLE)

### Before ANY Implementation (MANDATORY CHECKLIST)
1. **✅ Consult relevant sub-agent** for domain expertise
2. **✅ Apply Chess.com patterns** for proven scalability
3. **✅ Review performance impact** against critical targets
4. **✅ Validate TypeScript** strict compliance
5. **✅ Update chat history log** with detailed session info
6. **✅ Test comprehensively** including performance benchmarks
7. **✅ Commit with descriptive message** including metrics
8. **✅ Update development log** with architecture decisions

### Gaming-Specific Requirements (Chess.com Standards)
- **Server-authoritative validation** for all game state changes
- **Immutable state management** with complete audit trail
- **Error boundaries and graceful degradation** for network issues
- **Performance monitoring** with real-time alerting
- **Security-first approach** with comprehensive input validation
- **Accessibility compliance** for inclusive gaming experience

## 🔧 Troubleshooting Common Issues

### WebSocket Performance Issues
1. **Check Redpanda event streaming** throughput and latency
2. **Verify load balancer configuration** for sticky sessions
3. **Monitor connection pool** utilization and limits
4. **Analyze network latency** between services and regions
5. **Consult**: `skemino-realtime-specialist` for optimization strategies

### Svelte Component Performance
1. **Profile component rendering** with browser dev tools
2. **Check store subscriptions** for unnecessary updates
3. **Verify reactive statements** efficiency
4. **Monitor bundle size** impact of new components
5. **Consult**: `skemino-ui` for Svelte-specific optimizations

### Database Performance Issues
1. **Analyze query execution plans** with EXPLAIN
2. **Check index usage** and optimization opportunities
3. **Monitor connection pool** health and utilization
4. **Verify sharding strategy** effectiveness
5. **Consult**: `skemino-database-specialist` for scaling strategies

### Anti-Cheat System Issues
1. **Review ML model accuracy** and false positive rates
2. **Analyze behavioral patterns** for new cheat vectors
3. **Check real-time analysis performance** vs <100ms target
4. **Monitor flagging rates** and review workflows
5. **Consult**: `skemino-security-specialist` for ML model tuning

## 📚 Sub-Agent Consultation Examples (Chess.com-Level)

### Before implementing Svelte components:
```bash
"Consulta skemino-ui per ottimizzazione componenti Svelte gaming con performance target <16ms render e bundle size <25KB"
```

### Before implementing game rules:
```bash  
"Consulta skemino-game-engine per validazione regole server-authoritative Skèmino con pattern Chess.com"
```

### Before performance optimization:
```bash
"Applica expertise skemino-performance per ottimizzazione WebSocket latency target <20ms con monitoring real-time"
```

### Before architectural decisions:
```bash
"Chiedi a skemino-architecture per pattern scalabilità microservices Chess.com-inspired con event streaming Redpanda"
```

### Before database optimization:
```bash
"Utilizza skemino-database-specialist per sharding strategy PostgreSQL+ScyllaDB con target <30ms query response"
```

### Before anti-cheat implementation:
```bash
"Consulta skemino-security-specialist per ML pipeline anti-cheat Chess.com-grade con <100ms analysis time"
```

## 📋 Quick Reference Commands

### Essential Sub-Agent Commands
```bash
# UI/UX Development
"Usa skemino-ui per [componente Svelte gaming specifico con performance target]"

# Game Engine Logic
"Consulta skemino-game-engine per [implementazione regole server-authoritative]"

# Performance Optimization
"Applica expertise skemino-performance per [ottimizzazione specifica con target misurabili]"

# System Architecture
"Chiedi a skemino-architecture per [decisione architetturale microservices]"

# Database Performance
"Utilizza skemino-database-specialist per [ottimizzazione database con metrics]"

# Real-time Systems
"Consulta skemino-realtime-specialist per [WebSocket + event streaming optimization]"

# Security & Anti-cheat
"Utilizza skemino-security-specialist per [ML anti-cheat + security hardening]"

# Testing & QA
"Utilizza skemino-testing-specialist per [strategia testing enterprise-level]"

# Business Intelligence
"Consulta skemino-analytics-specialist per [metrics + dashboards business]"

# DevOps & Infrastructure
"Consulta skemino-devops-specialist per [Kubernetes + CI/CD + monitoring]"
```

### Mandatory Git Commands
```bash
# After every significant implementation
git add .
git commit -m "feat(scope): description with performance metrics + Chess.com pattern applied"
git push origin feature-branch

# Update development log (CURRENT FILE)
# ⚠️ UPDATE THIS PATH DAILY IN CLAUDE.MD
docs/development-log/chat-history-2025-01-15.md
```

### Daily Log Management
```bash
# Daily workflow:
1. Create new log: docs/development-log/chat-history-[NEW-DATE].md
2. Update CLAUDE.md with new active filename
3. Log all sessions with detailed performance metrics
4. Include Chess.com pattern references and sub-agent consultations
```

## 📚 Key Documentation & References

- **Svelte 5 Documentation**: Latest features and performance optimizations
- **Chess.com Architecture Patterns**: Proven scalability and performance patterns
- **Game Rules Implementation**: Complete server-authoritative validation
- **Event Streaming Best Practices**: Redpanda configuration and optimization
- **Anti-cheat ML Models**: Behavioral analysis and pattern recognition
- **ELO Rating Algorithm**: Mathematical precision and real-time calculation
- **Performance Monitoring**: Comprehensive observability and alerting
- **Security Best Practices**: Enterprise-grade security implementation
- **Microservices Patterns**: Domain-driven design and service communication
- **Database Optimization**: Multi-regional scaling and performance tuning

## ⚠️ Important Reminders (NON-NEGOTIABLE)

- **🤖 Sub-agent consultation is MANDATORY** before any significant implementation
- **📝 Git commit after every task** with performance metrics and Chess.com patterns
- **📊 Chat history tracking** must be maintained in current active log file
- **📅 UPDATE LOG FILE DAILY**: Change filename and update CLAUDE.md reference
- **⚡ <20ms WebSocket latency** absolute priority for competitive gaming
- **📦 <25KB bundle size** Svelte advantage over Chess.com React implementation
- **🛡️ Server-authoritative validation** prevents all cheating and ensures fair play
- **📝 PSN notation required** for all game recording and replay functionality
- **🔒 Enterprise-grade security** with comprehensive threat protection
- **📈 Real-time monitoring** against all performance targets and SLAs
- **🎯 Chess.com-superior performance** in all measurable metrics
- **🚀 200M+ users ready infrastructure** for global scale

## 🎯 Mission Statement

**Skèmino is an enterprise-level competitive gaming platform that surpasses Chess.com performance using Svelte's superior frontend capabilities, Chess.com-proven backend architecture, and cutting-edge ML anti-cheat technology. Every implementation must achieve Chess.com-level reliability, security, and performance while delivering superior user experience through modern technology advantages.**

---

**🎮 Remember: Skèmino is not just a game - it's a competitive gaming platform that requires Chess.com-level quality, performance, and reliability with the additional advantage of Svelte's superior frontend performance. Every line of code should reflect this enterprise-grade standard while pushing the boundaries of competitive gaming technology.**