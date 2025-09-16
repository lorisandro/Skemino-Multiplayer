# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎮 Project Overview: Skèmino - Chess.com-Grade Gaming Platform

Skèmino is an enterprise competitive gaming platform with Chess.com-proven architecture and Svelte performance superiority:

### Core Features
- **39 Chain Cards** (13 Pietra, 13 Forbici, 13 Carta) with server-authoritative validation
- **6×6 Strategic Board** with vertex control and quadrant gameplay
- **Dynamic ELO Rating** (1000-2700+) using Chess.com-grade precision algorithm  
- **PSN Notation** for complete game recording and analysis
- **Real-time Multiplayer** with <20ms WebSocket latency target
- **ML Anti-Cheat** system with <100ms analysis time
- **Tournament System** with intelligent matchmaking

### Technology Stack (Chess.com-Inspired)
- **Frontend**: Svelte 5 + SvelteKit (superior to Chess.com React performance)
- **Backend**: Node.js + PHP/Symfony microservices (Chess.com hybrid approach)
- **Database**: PostgreSQL + ScyllaDB + Redis (Chess.com multi-tier)
- **Event Streaming**: Redpanda (Chess.com choice, -$400K/anno vs Kafka)
- **Infrastructure**: Kubernetes + GCP multi-regional (Chess.com proven)
- **CDN**: Cloudflare Enterprise (identical to Chess.com)

## 🚨 MANDATORY DEVELOPMENT WORKFLOW

### Git Commit Requirements (NON-NEGOTIABLE)
Claude MUST commit after EVERY implementation:

```bash
# Commit triggers:
✅ Any user request completion
✅ Any feature/component implementation  
✅ Any bug fix with regression test
✅ Any refactoring with performance metrics
✅ After sub-agent consultation implementation
✅ End of development session

# Commit format:
git commit -m "feat(scope): description with metrics + Chess.com pattern"
```

### Progress Tracking (Enterprise-Grade)
**CURRENT ACTIVE LOG:** `docs/development-log/chat-history-2025-01-15.md`

**Required Log Entry:**
- User Request + Chess.com Pattern Applied
- Sub-Agent Consultation + Expertise Used
- Implementation + Performance Metrics
- Git Commit + Architecture Decisions
- Next Actions + Performance Targets

## 🤖 SUB-AGENT INTEGRATION (MANDATORY)

### Consultation Matrix (Chess.com Expertise)
| Task Type | Sub-Agent | Performance Target |
|-----------|-----------|-------------------|
| Svelte UI Components | `skemino-ui` | <16ms render, <25KB bundle |
| Game Rules Engine | `skemino-game-engine` | <50ms validation |
| ELO Rating System | `skemino-elo` | Real-time calculation |
| Real-time Events | `skemino-realtime-specialist` | <20ms WebSocket |
| Database Performance | `skemino-database-specialist` | <30ms queries |
| ML Anti-Cheat | `skemino-security-specialist` | <100ms analysis |
| Tournament System | `skemino-tournament` | Fair matchmaking |
| Architecture Decisions | `skemino-architecture` | Scalability |
| Performance Optimization | `skemino-performance` | Chess.com targets |
| Analytics & BI | `skemino-analytics-specialist` | Data insights |

### Consultation Examples
```bash
"Consulta skemino-ui per componenti Svelte gaming <16ms render"
"Usa skemino-game-engine per validazione server-authoritative"
"Applica skemino-performance per latency <20ms WebSocket"
```

## 🏗️ Architecture & Project Structure

### Directory Structure (Concise)
```
skemino/
├── src/
│   ├── frontend/              # Svelte 5 + SvelteKit
│   │   ├── src/lib/components/    # Gaming UI (<16ms render)
│   │   ├── src/routes/            # File-based routing
│   │   └── src/stores/            # Svelte stores + events
│   ├── backend/               # Microservices
│   │   ├── api-gateway/           # Kong/Envoy + rate limiting
│   │   ├── game-engine/           # Core Skèmino logic
│   │   ├── user-service/          # Auth + profiles
│   │   ├── tournament-service/    # Tournaments + matchmaking
│   │   └── shared/                # Common libraries
│   └── database/              # Multi-tier storage
│       ├── postgresql/            # Primary OLTP
│       ├── scylladb/             # High-performance gaming
│       └── redis/                # Caching + sessions
├── infrastructure/            # Kubernetes + Terraform
├── event-streaming/          # Redpanda configuration
├── monitoring/               # Prometheus + Grafana
├── docs/development-log/     # MANDATORY chat tracking
└── .claude/agents/           # 14 specialized sub-agents
```

### Technology Stack Details

**Frontend (Svelte Advantage):**
- Svelte 5 + SvelteKit + TypeScript + TailwindCSS
- <25KB bundle (vs Chess.com React ~150KB)
- <16ms render (no Virtual DOM overhead)
- PWA + Service Workers

**Backend (Chess.com-Inspired):**
- Node.js 20+ + PHP 8.2 Symfony microservices
- OAuth 2.0 + JWT + Redis sessions
- API Gateway with rate limiting
- OpenAPI 3.0 documentation

**Database (Multi-Regional):**
- PostgreSQL 15+ with read replicas
- ScyllaDB for sub-ms gaming data
- Redis Cluster + Sentinel
- Elasticsearch for search

**Infrastructure (Global Scale):**
- Kubernetes + Helm charts
- GCP multi-regional (Chess.com choice)
- Cloudflare CDN + DDoS protection
- Redpanda event streaming

## 🎲 Skèmino Game Rules (Server-Authoritative)

### Core Components
- **39 Chain Cards**: P1-P13, F1-F13, C1-C13 with validation
- **6×6 Board**: Algebraic notation (a1-f6), 4 quadrants
- **Morra Cinese**: Pietra > Forbici, Forbici > Carta, Carta > Pietra
- **Victory Conditions**: ERA1-ERA4 automated detection
- **PSN Notation**: Complete game recording format

### ELO System (Chess.com Precision)
- **Formula**: EA = 1/(1 + 10^((RB-RA)/(K²-K)))
- **Dynamic K-factor**: k = 160 * e^(-R̄/721.35)
- **Rating Levels**: 1000-2700+ (10 skill tiers)
- **Real-time Updates**: Post-game recalculation

## 🚀 Performance Requirements (Chess.com-Superior)

### Critical Targets
- **WebSocket Latency**: <20ms (superior to Chess.com)
- **UI Rendering**: 60fps+ (Svelte advantage)
- **Database Queries**: <30ms average
- **Bundle Size**: <25KB (vs Chess.com ~150KB)
- **Concurrent Users**: 50,000+ capability
- **Memory Usage**: <100MB per 1000 users

### Svelte Performance Advantages
- No Virtual DOM = faster rendering
- Compile-time optimization = smaller bundles
- Reactive updates = surgical DOM changes
- Lower memory footprint vs React

## 🗄️ Database Schema (Key Tables)

```sql
-- Users (Multi-regional)
users (id, username, email, rating_rapid, rating_blitz, peak_rating, created_at)

-- Games (Partitioned by date)
games (id, white_player_id, black_player_id, result, psn_notation, duration_seconds)

-- Moves (High-volume, optimized)
moves (game_id, move_number, move_notation, time_spent_ms, time_remaining_ms)

-- Rating History (Chess.com-style)
rating_history (id, player_id, old_rating, new_rating, k_factor, created_at)

-- Tournaments (Enterprise system)
tournaments (id, name, type, status, max_players, prize_pool_cents, start_time)
```

## 🔌 WebSocket Events (Real-time Gaming)

```typescript
// Server → Client
type ServerEvents = {
  'game:started': GameStartedEvent;
  'game:move': MoveEvent;
  'game:ended': GameEndedEvent;
  'rating:updated': RatingUpdateEvent;
};

// Client → Server
type ClientEvents = {
  'game:join': JoinGameRequest;
  'game:move': MakeMoveRequest;
  'game:resign': ResignGameRequest;
};
```

## 🛡️ Security & Anti-Cheat (Chess.com-Level)

### Server-Authoritative Validation
- All moves validated server-side (no client trust)
- Game state immutability with audit trail
- Rate limiting per-user actions
- Input sanitization comprehensive

### ML Anti-Cheat Pipeline
- Move timing analysis patterns
- Skill consistency evaluation  
- Behavioral profiling cross-session
- Real-time suspicious activity detection
- <100ms analysis time target

## 📊 Monitoring (Enterprise-Grade)

### Key Metrics
```yaml
# Business Metrics
- skemino_games_started_total
- skemino_concurrent_games  
- skemino_players_online
- skemino_rating_updates_total

# Performance Metrics  
- skemino_websocket_latency_seconds (<0.02s)
- skemino_database_query_duration_seconds (<0.03s)
- skemino_api_request_duration_seconds (<0.2s)
```

### Dashboards
- Real-time Gaming Overview
- Performance Monitoring
- Business Intelligence
- Security & Anti-cheat

## 🚀 Development Commands

### Frontend (Svelte)
```bash
npm create svelte@latest skemino-frontend
npm run dev          # SvelteKit dev server
npm run build        # Production build
npm run test:unit    # Vitest tests
npm run test:e2e     # Playwright E2E
npm run lighthouse   # Performance audit
```

### Backend (Microservices)
```bash
npm run dev:services     # All microservices
npm run build:docker     # Docker builds
npm run test:integration # Integration tests
npm run test:load        # Load testing
```

### Database
```bash
npm run db:migrate   # PostgreSQL migrations
npm run db:seed      # Development data
npm run scylla:setup # ScyllaDB keyspaces
npm run redis:flush  # Clear caches
```

### Infrastructure
```bash
kubectl apply -f infrastructure/k8s/
helm install skemino ./infrastructure/helm/
terraform apply infrastructure/terraform/
```

## 🔧 Troubleshooting

### WebSocket Performance
1. Check Redpanda throughput vs <20ms target
2. Verify load balancer sticky sessions
3. Monitor connection pool utilization
4. **Consult**: `skemino-realtime-specialist`

### Svelte Component Performance  
1. Profile rendering with browser tools
2. Check store subscriptions efficiency
3. Verify reactive statements optimization
4. **Consult**: `skemino-ui`

### Database Performance
1. Analyze query execution plans
2. Check index usage optimization
3. Monitor connection pool health
4. **Consult**: `skemino-database-specialist`

## 📋 Performance Benchmarks

### Frontend (Svelte Targets)
```yaml
Lighthouse Scores:
  Performance: >95
  Bundle Size: <25KB (vs Chess.com ~150KB)
  Memory Usage: <100MB
  Render Time: <16ms
```

### Backend (Enterprise SLA)
```yaml
Response Times:
  Move Validation: <50ms p95
  Game State: <30ms p95
  Authentication: <100ms p95
  
Throughput:
  Concurrent Users: 50,000+
  Moves/Second: 50,000+
  Database TPS: 100,000+
```

### System (Chess.com-Superior)
```yaml
Availability: 99.9% uptime
Security: <0.01% false positive rate
Cheat Detection: >99.5% accuracy
```

## 📚 Sub-Agent Quick Reference

### Essential Commands
```bash
# UI Development
"Usa skemino-ui per [componente Svelte performance target]"

# Game Logic  
"Consulta skemino-game-engine per [regole server-authoritative]"

# Performance
"Applica skemino-performance per [ottimizzazione target Chess.com]"

# Architecture
"Chiedi skemino-architecture per [decisione scalabilità]"

# Database
"Utilizza skemino-database-specialist per [ottimizzazione query]"

# Real-time
"Consulta skemino-realtime-specialist per [WebSocket + Redpanda]"
```

### Mandatory Git Workflow
```bash
# After every implementation:
git add .
git commit -m "feat(scope): description + performance metrics"
git push origin feature-branch

# Update log: docs/development-log/chat-history-2025-01-15.md
# ⚠️ UPDATE DAILY
```

## ⚠️ Critical Reminders (NON-NEGOTIABLE)

- **🤖 Sub-agent consultation MANDATORY** before implementation
- **📝 Git commit after every task** with performance metrics  
- **📊 Chat history tracking** in current active log file
- **📅 Update log filename daily** in CLAUDE.md
- **⚡ <20ms WebSocket latency** absolute priority
- **📦 <25KB bundle size** Svelte advantage
- **🛡️ Server-authoritative validation** all game changes
- **📝 PSN notation** required for game recording
- **🚀 Chess.com-superior performance** in all metrics

## 🎯 Mission

**Skèmino surpasses Chess.com using Svelte's superior frontend performance, Chess.com-proven backend architecture, and cutting-edge ML anti-cheat. Every implementation achieves Chess.com-level reliability while delivering superior user experience through modern technology advantages.**

---

**🎮 Remember: Skèmino is an enterprise competitive gaming platform requiring Chess.com-level quality with Svelte performance superiority. Every line of code reflects this standard.**