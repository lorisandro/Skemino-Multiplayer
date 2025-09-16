# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎮 Project Overview: Skèmino - Chess.com-Grade Gaming Platform

Skèmino is an enterprise competitive gaming platform with Chess.com-proven architecture and Svelte performance superiority over Vue.js:

### Core Features
- **39 Chain Cards** (13 Pietra, 13 Forbici, 13 Carta) with server-authoritative validation
- **6×6 Strategic Board** with vertex control and quadrant gameplay
- **Dynamic ELO Rating** (1000-2700+) using Chess.com-grade precision algorithm  
- **PSN Notation** for complete game recording and analysis
- **Real-time Multiplayer** with <20ms WebSocket latency target
- **ML Anti-Cheat** system with <100ms analysis time
- **Tournament System** with intelligent matchmaking

### Technology Stack (Chess.com-Aligned)
- **Frontend**: Svelte 5 + SvelteKit (superior to Chess.com Vue.js performance)
- **Backend**: PHP/Symfony + Python + Node.js (Chess.com multi-language approach)
- **Database**: MySQL Enterprise + ScyllaDB + Redis (Chess.com proven stack)
- **Event Streaming**: Redpanda BYOC (Chess.com choice, -$400K/anno vs Kafka)
- **Infrastructure**: Kubernetes + GCP multi-regional (Chess.com identical)
- **CDN**: Cloudflare Enterprise (Chess.com stack-identical)

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
| ELO Rating System | `skemino-rating-expert` | Real-time calculation |
| Real-time Events | `skemino-realtime-specialist` | <20ms WebSocket |
| Database Performance | `skemino-database-specialist` | <30ms queries |
| ML Anti-Cheat | `skemino-security-specialist` | <100ms analysis |
| Tournament System | `skemino-tournament` | Fair matchmaking |
| Architecture Decisions | `skemino-architecture` | Scalability |
| Performance Optimization | `skemino-performance-expert` | Chess.com targets |
| Analytics & BI | `skemino-analytics-specialist` | Data insights |

### Consultation Examples
```bash
"Consulta skemino-ui per componenti Svelte gaming <16ms render"
"Usa skemino-game-engine per validazione server-authoritative"
"Applica skemino-performance-expert per latency <20ms WebSocket"
"Chiedi skemino-rating-expert per calcoli ELO dinamici"
```

## 🏗️ Architecture & Project Structure

### Directory Structure (Chess.com-Inspired)
```
skemino/
├── src/
│   ├── frontend/              # Svelte 5 + SvelteKit
│   │   ├── src/lib/components/    # Gaming UI (<16ms render)
│   │   ├── src/routes/            # File-based routing
│   │   └── src/stores/            # Svelte stores + events
│   ├── backend/               # Microservices (Chess.com pattern)
│   │   ├── api-gateway/           # Kong/Envoy + rate limiting
│   │   ├── game-engine/           # Core Skèmino logic (PHP/Symfony)
│   │   ├── user-service/          # Auth + profiles (PHP/Symfony)
│   │   ├── ml-services/           # Anti-cheat (Python + ML)
│   │   ├── tournament-service/    # Tournaments (Node.js)
│   │   └── shared/                # Common libraries
│   └── database/              # Multi-tier storage (Chess.com stack)
│       ├── mysql/                 # Primary OLTP (Chess.com choice)
│       ├── scylladb/             # High-performance gaming
│       └── redis/                # Caching + sessions
├── infrastructure/            # Kubernetes + Terraform (GCP)
├── event-streaming/          # Redpanda configuration
├── monitoring/               # Cloud SQL Insights + Grafana
├── docs/development-log/     # MANDATORY chat tracking
└── .claude/agents/           # Specialized sub-agents
```

### Technology Stack Details (Chess.com-Aligned)

**Frontend (Svelte Advantage over Vue.js):**
- Svelte 5 + SvelteKit + TypeScript + TailwindCSS
- <25KB bundle (vs Chess.com Vue.js ~80KB typical)
- <16ms render (compile-time vs Vue.js runtime overhead)
- PWA + Service Workers (Chess.com pattern-enhanced)

**Backend (Chess.com Multi-Language Stack):**
- PHP 8.2 + Symfony (Chess.com primary framework)
- Python 3.11+ (Chess.com ML/data engineering pattern)
- Node.js 20+ (Chess.com service architecture)
- Java 17+ (Chess.com server operations heritage)
- Go (Chess.com specific services pattern)
- C++ integration (Stockfish engine calculations)
- OAuth 2.0 + JWT + Redis sessions

**Database (Chess.com Proven Stack):**
- MySQL 8.0+ Enterprise with read replicas (Chess.com primary)
- ScyllaDB for sub-ms gaming data (Chess.com performance tier)
- Redis Cluster + Sentinel (Chess.com caching pattern)
- Elasticsearch for search (Chess.com search stack)

**Infrastructure (Chess.com Identical):**
- Kubernetes + Helm charts (Chess.com orchestration)
- GCP multi-regional (Chess.com provider since 2019)
- Cloudflare CDN + DDoS protection (Chess.com stack)
- Redpanda BYOC event streaming (Chess.com choice)

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
- **UI Rendering**: 60fps+ (Svelte advantage over Vue.js)
- **Database Queries**: <30ms average (MySQL Enterprise)
- **Bundle Size**: <25KB (vs Chess.com Vue.js ~80KB)
- **Concurrent Users**: 50,000+ capability (Chess.com scale)
- **Memory Usage**: <100MB per 1000 users

### Svelte Performance Advantages over Chess.com Vue.js
- Compile-time optimization = smaller bundles vs Vue.js runtime
- No Virtual DOM = faster rendering vs Vue.js reactivity overhead
- Reactive updates = surgical DOM changes vs Vue.js watchers
- Lower memory footprint vs Vue.js framework overhead

## 🗄️ Database Schema (Chess.com-Compatible)

```sql
-- Users (Multi-regional, MySQL Enterprise)
users (id, username, email, rating_rapid, rating_blitz, peak_rating, created_at);

-- Games (Partitioned by date, Chess.com pattern)
games (id, white_player_id, black_player_id, result, psn_notation, duration_seconds);

-- Moves (High-volume optimized, ScyllaDB)
moves (game_id, move_number, move_notation, time_spent_ms, time_remaining_ms);

-- Rating History (Chess.com-style tracking)
rating_history (id, player_id, old_rating, new_rating, k_factor, created_at);

-- Tournaments (Enterprise system)
tournaments (id, name, type, status, max_players, prize_pool_cents, start_time);
```

## 🔌 WebSocket Events (Real-time Gaming)

```typescript
// Server → Client (Redpanda-powered)
type ServerEvents = {
  'game:started': GameStartedEvent;
  'game:move': MoveEvent;
  'game:ended': GameEndedEvent;
  'rating:updated': RatingUpdateEvent;
};

// Client → Server (Server-authoritative)
type ClientEvents = {
  'game:join': JoinGameRequest;
  'game:move': MakeMoveRequest;
  'game:resign': ResignGameRequest;
};
```

## 🛡️ Security & Anti-Cheat (Chess.com-Level)

### Server-Authoritative Validation
- All moves validated server-side (Chess.com pattern)
- Game state immutability with audit trail
- Rate limiting per-user actions
- Input sanitization comprehensive

### ML Anti-Cheat Pipeline (Chess.com-Enhanced)
- Move timing analysis patterns (Python ML services)
- Skill consistency evaluation (100+ factors like Chess.com)
- Behavioral profiling cross-session
- Real-time suspicious activity detection
- <100ms analysis time target (superior to Chess.com)

## 📊 Monitoring (Chess.com-Grade)

### Key Metrics (Cloud SQL Insights + Custom)
```yaml
# Business Metrics
- skemino_games_started_total
- skemino_concurrent_games  
- skemino_players_online
- skemino_rating_updates_total

# Performance Metrics (Chess.com-superior targets)
- skemino_websocket_latency_seconds (<0.02s)
- skemino_database_query_duration_seconds (<0.03s)
- skemino_api_request_duration_seconds (<0.2s)
- skemino_mysql_connection_pool_usage
```

### Dashboards (Chess.com-Style)
- Real-time Gaming Overview
- Performance Monitoring (Cloud SQL Insights)
- Business Intelligence
- Security & Anti-cheat (ML Pipeline)

## 🚀 Development Commands

### Frontend (Svelte Superior)
```bash
npm create svelte@latest skemino-frontend
npm run dev          # SvelteKit dev server
npm run build        # Production build (<25KB target)
npm run test:unit    # Vitest tests
npm run test:e2e     # Playwright E2E
npm run lighthouse   # Performance audit (>95 target)
```

### Backend (Chess.com Multi-Stack)
```bash
# PHP/Symfony Services (Chess.com primary)
composer install && php bin/console server:run

# Python ML Services (Chess.com pattern)
pip install -r requirements.txt && python app.py

# Node.js Services
npm run dev:services     # All microservices
npm run build:docker     # Docker builds
npm run test:integration # Integration tests
npm run test:load        # Load testing
```

### Database (Chess.com Stack)
```bash
# MySQL Enterprise (Chess.com primary)
npm run mysql:migrate    # Schema migrations
npm run mysql:seed       # Development data

# ScyllaDB (Chess.com performance)
npm run scylla:setup     # Keyspaces setup
npm run scylla:migrate   # Gaming tables

# Redis (Chess.com caching)
npm run redis:flush      # Clear caches
npm run redis:cluster    # Cluster setup
```

### Infrastructure (Chess.com Identical)
```bash
# GCP + Kubernetes (Chess.com stack)
kubectl apply -f infrastructure/k8s/
helm install skemino ./infrastructure/helm/
terraform apply infrastructure/terraform/

# Redpanda (Chess.com choice)
kubectl apply -f infrastructure/redpanda/
```

## 🔧 Troubleshooting (Chess.com-Aligned)

### WebSocket Performance (<20ms target)
1. Check Redpanda throughput vs Chess.com patterns
2. Verify load balancer sticky sessions
3. Monitor GCP multi-regional latency
4. **Consult**: `skemino-realtime-specialist` + `skemino-performance-expert`

### Svelte Component Performance (vs Vue.js baseline)
1. Profile rendering with browser tools
2. Check store subscriptions efficiency vs Vue.js watchers
3. Verify reactive statements optimization
4. **Consult**: `skemino-ui` for Svelte-specific patterns

### MySQL Database Performance (Chess.com-style)
1. Analyze query execution plans (Cloud SQL Insights)
2. Check index usage optimization
3. Monitor connection pool health
4. **Consult**: `skemino-database-specialist` + Chess.com patterns

### ML Anti-Cheat Pipeline (Chess.com-enhanced)
1. Monitor Python service performance
2. Check CNN-LSTM model accuracy
3. Validate 100+ factor analysis
4. **Consult**: `skemino-security-specialist`

## 📋 Performance Benchmarks (Chess.com-Superior)

### Frontend (Svelte vs Chess.com Vue.js)
```yaml
Lighthouse Scores:
  Performance: >95 (vs Chess.com ~90)
  Bundle Size: <25KB (vs Chess.com Vue.js ~80KB)
  Memory Usage: <100MB (vs Vue.js ~150MB)
  Render Time: <16ms (vs Vue.js ~25ms)
```

### Backend (Chess.com-Grade SLA)
```yaml
Response Times:
  Move Validation: <50ms p95 (PHP/Symfony)
  Game State: <30ms p95 (MySQL Enterprise)
  Authentication: <100ms p95 (Redis sessions)
  ML Anti-Cheat: <100ms p95 (Python services)
  
Throughput:
  Concurrent Users: 50,000+ (Chess.com scale)
  Moves/Second: 50,000+ (Redpanda capacity)
  Database TPS: 100,000+ (MySQL Enterprise)
```

### System (Chess.com-Matching)
```yaml
Availability: 99.9% uptime (Chess.com SLA)
Security: <0.01% false positive rate
Cheat Detection: >99.5% accuracy (Chess.com-level)
```

## 📚 Sub-Agent Quick Reference (Chess.com-Integrated)

### Essential Commands
```bash
# UI Development (Svelte superiority)
"Usa skemino-ui per [componente Svelte performance target vs Vue.js]"

# Game Logic (Server-authoritative)
"Consulta skemino-game-engine per [regole server-authoritative Chess.com-style]"

# Performance (Chess.com-superior)
"Applica skemino-performance-expert per [ottimizzazione target Chess.com-beating]"

# Rating System (Chess.com precision)
"Chiedi skemino-rating-expert per [calcoli ELO dinamici Chess.com-grade]"

# Architecture (Chess.com-proven)
"Consulta skemino-architecture per [decisione scalabilità Chess.com-aligned]"

# Database (MySQL Enterprise)
"Utilizza skemino-database-specialist per [ottimizzazione MySQL Chess.com-style]"

# Real-time (Redpanda + WebSocket)
"Consulta skemino-realtime-specialist per [WebSocket + Redpanda Chess.com-choice]"
```

### Mandatory Git Workflow
```bash
# After every implementation:
git add .
git commit -m "feat(scope): description + Chess.com pattern + performance"
git push origin feature-branch

# Update log: docs/development-log/chat-history-2025-01-15.md
# ⚠️ UPDATE DAILY - Track Chess.com alignment
```

## ⚠️ Critical Reminders (Chess.com-Aligned)

- **🤖 Sub-agent consultation MANDATORY** before implementation
- **📝 Git commit after every task** with Chess.com pattern reference
- **📊 Chat history tracking** in current active log file
- **📅 Update log filename daily** in CLAUDE.md
- **⚡ <20ms WebSocket latency** (superior to Chess.com)
- **📦 <25KB bundle size** (Svelte advantage vs Chess.com Vue.js)
- **🛡️ Server-authoritative validation** (Chess.com-identical pattern)
- **📝 PSN notation** required for game recording
- **🚀 Chess.com-superior performance** in all metrics
- **🗄️ MySQL Enterprise** primary database (Chess.com stack-identical)
- **🔄 Redpanda BYOC** event streaming (Chess.com proven choice)

## 🎯 Mission

**Skèmino surpasses Chess.com using Svelte's superior frontend performance over Vue.js, Chess.com-proven backend architecture (PHP/Symfony + Python + MySQL Enterprise), and cutting-edge ML anti-cheat. Every implementation achieves Chess.com-level reliability while delivering superior user experience through modern Svelte advantages over Chess.com's Vue.js stack.**

## 🏗️ Chess.com Stack Alignment Reference

### Verified Chess.com Technologies Used
```yaml
Frontend: Vue.js (primary) + Svelte (components) + TypeScript
Backend: PHP/Symfony (primary) + Python (ML) + Node.js + Java + Go
Database: MySQL Enterprise (Cloud SQL) + ScyllaDB + Redis + Elasticsearch  
Infrastructure: GCP + Cloudflare + Kubernetes
Streaming: Redpanda BYOC (-$400K vs Kafka)
Monitoring: Cloud SQL Insights + Google Analytics
Security: Fair Play (100+ factors) + ML anti-cheat
```

### Skèmino Advantages Over Chess.com
```yaml
Frontend: Svelte 5 > Vue.js (compile-time, smaller bundles, faster render)
ML Anti-Cheat: <100ms analysis (enhanced Python services)
WebSocket: <20ms latency (optimized Redpanda patterns)
Bundle Size: <25KB vs Vue.js ~80KB (60% reduction)
Performance: 60fps+ consistent (Svelte reactive efficiency)
```

---

**🎮 Remember: Skèmino is an enterprise competitive gaming platform requiring Chess.com-level quality with Svelte performance superiority over Vue.js. Every line of code reflects this standard while maintaining stack alignment with Chess.com's proven technologies (MySQL Enterprise, PHP/Symfony, Redpanda, GCP, Cloudflare).**