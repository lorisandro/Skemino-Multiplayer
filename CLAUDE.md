# CLAUDE.md - Guida Sviluppo Skèmino

**🎮 Piattaforma Gaming Competitiva Multiplayer - Livello Chess.com con Svelte**

---

## 🎯 **PANORAMICA PROGETTO**

### **Skèmino - Gaming Platform Strategico con Svelte**
Piattaforma multiplayer competitiva **performance-first** con:
- **39 Chain Cards** (13 × 3 semi: Pietra/Forbici/Carta)
- **Tabellone 6×6** con controllo strategico dei vertici  
- **Sistema ELO** (range 1000-2700+) per ranking giocatori
- **Real-time WebSocket** per multiplayer sincronizzato ultraveloce
- **PSN Notation** (Portable Skèmino Notation) per registrazione partite
- **Sistema Tournament** e matchmaking avanzato
- **🔥 SVELTE-POWERED** per performance gaming superiore (come chess.com)

---

## 🚨 **WORKFLOW SVILUPPO OBBLIGATORIO**

### **⚡ GIT COMMIT REQUIREMENTS (NON-NEGOZIABILE)**

Claude **DEVE** committare dopo **OGNI** implementazione significativa:

```bash
# COMMIT OBBLIGATORIO dopo ogni task
git add .
git commit -m "feat(scope): descrizione significativa"  
git push origin current-branch
```

**🔥 TRIGGER COMMIT AUTOMATICI:**
- ✅ Dopo completamento QUALSIASI richiesta utente
- ✅ Dopo implementazione QUALSIASI feature/component Svelte
- ✅ Dopo fixing QUALSIASI bug
- ✅ Dopo refactoring major
- ✅ Prima di cambiare tipo di task
- ✅ Dopo consultazione e implementazione sub-agent
- ✅ A fine OGNI sessione sviluppo

**📝 Convention Messaggi Commit (RIGOROSA):**
```bash
feat(svelte): nuovi componenti Svelte/SvelteKit
feat(game): features gaming logic
fix(websocket): correzioni real-time  
docs(scope): aggiornamenti documentazione
refactor(scope): refactoring codice Svelte
perf(scope): ottimizzazioni performance gaming
test(scope): aggiunte/modifiche test
chore(scope): build/dipendenze SvelteKit
```

### **📊 TRACKING PROGRESSO OBBLIGATORIO**

**🎯 FILE LOG ATTIVO CORRENTE:**
```
docs/development-log/chat-history-2025-01-15.md
```
*Aggiorna quotidianamente questo path nel CLAUDE.md*

**📋 Template Entry Log (FORMATO OBBLIGATORIO):**
```markdown
## Session [N]: [HH:MM] - [TOPIC_PRINCIPALE]

### 📝 Richiesta Utente:
[Testo esatto richiesta]

### 🤖 Consultazione Sub-Agent:
- Consultato: [nome-sub-agent]  
- Expertise Applicata: [guidance ricevuta]

### 🚀 Implementazione Effettuata:
- [x] Task 1: [dettaglio] - Files: [lista .svelte/.js modificati]
- [x] Task 2: [dettaglio] - Files: [lista componenti Svelte]  
- [ ] Task 3: [passi successivi identificati]

### 🔗 Git Commit: `[hash]` - "[messaggio commit]"

### 📊 Impatto Performance Gaming:
- WebSocket latency: [misurazione se applicabile]
- Bundle size Svelte: [cambio se applicabile]  
- Memory usage: [impatto se applicabile]
- Svelte compilation time: [misurazione se applicabile]

### 🔄 Status: [COMPLETED/IN_PROGRESS/BLOCKED]

### 🎯 Prossime Azioni:
- [Passi implementazione specifici]
- [Blockers da risolvere]
- [Sub-agents da consultare]

---
```

---

## 🤖 **INTEGRAZIONE SUB-AGENT CRITICA**

### **🎯 CONSULTAZIONE PROATTIVA OBBLIGATORIA**

**SEMPRE** consultare sub-agent rilevanti **PRIMA** di implementare QUALSIASI feature:

```bash
1. Identifica task → 2. Consulta sub-agent → 3. Applica expertise → 4. Valida → 5. Commit con reference
```

### **📋 MATRICE CONSULTAZIONE SUB-AGENT (SVELTE-ORIENTED)**

| **Tipo Task** | **Sub-Agent Primario** | **Sub-Agent Secondario** |
|---------------|------------------------|--------------------------|
| **Game Rules Implementation** | `skemino-game-engine` | `skemino-architecture` |
| **UI/UX Gaming & Svelte Components** | `skemino-ui` | `skemino-performance` |
| **Sistema ELO Rating** | `skemino-elo` | `skemino-rating` |
| **WebSocket/Real-time Svelte** | `skemino-realtime-specialist` | `skemino-architecture` |
| **PSN Notation** | `skemino-game-engine` | `skemino-architecture` |
| **Performance Optimization Svelte** | `skemino-performance` | `skemino-architecture` |
| **Sistema Tournament** | `skemino-legue` | `skemino-elo` |
| **Database & Persistence** | `skemino-database-specialist` | `skemino-persistenza` |
| **Decisioni Architetturali SvelteKit** | `skemino-architecture` | `skemino-performance` |
| **Refactoring Major Svelte** | `skemino-refactoring` | `skemino-architecture` |
| **Mobile Gaming Svelte** | `skemino-mobile-specialist` | `skemino-performance` |
| **Frontend Performance Svelte** | `skemino-ui` | `skemino-performance` |
| **Validazione Game Logic** | `skemino-game-engine` | `skemino-testing-specialist` |
| **Testing & QA Svelte** | `skemino-testing-specialist` | `skemino-game-engine` |
| **Features Real-time** | `skemino-realtime-specialist` | `skemino-performance` |
| **Strategia Persistenza** | `skemino-persistenza` | `skemino-database-specialist` |
| **Algoritmi Rating Giocatori** | `skemino-rating` | `skemino-elo` |
| **Analytics & Metrics** | `skemino-analytics-specialist` | `skemino-performance` |
| **Features Social** | `skemino-social-specialist` | `skemino-ui` |

### **💬 Formato Comandi Sub-Agent (SINTASSI ESATTA)**

```bash
"Consulta skemino-game-engine per implementazione regole gioco"
"Usa skemino-ui per componenti Svelte gaming performanti"
"Applica expertise skemino-performance per ottimizzazione Svelte bundle"
"Chiedi a skemino-architecture per decisioni architetturali SvelteKit"
"Utilizza skemino-elo per calcoli rating"
"Consulta skemino-realtime-specialist per WebSocket con Svelte stores"
"Usa skemino-database-specialist per gestione database"
"Applica skemino-testing-specialist per strategia testing Svelte"
"Consulta skemino-analytics-specialist per metriche"
"Utilizza skemino-social-specialist per funzioni social"
```

---

## 🏗️ **ARCHITETTURA & STRUTTURA PROGETTO**

### **📁 Struttura Directory Completa (SVELTE)**
```
skemino/
├── src/
│   ├── lib/                        # Svelte components library
│   │   ├── components/gaming/      # Componenti UI Gaming Svelte
│   │   │   ├── Board/             # Tabellone interattivo 6×6 (.svelte)
│   │   │   ├── Cards/             # Componenti carte Svelte
│   │   │   ├── GameUI/            # Timer, rating, controlli
│   │   │   └── Lobby/             # Matchmaking e stanze gioco
│   │   ├── stores/                # Svelte stores per state management
│   │   ├── services/              # Client API e WebSocket
│   │   └── utils/                 # Utilities condivise
│   ├── routes/                     # SvelteKit routes (file-based routing)
│   │   ├── game/                  # Route gioco (/game)
│   │   ├── lobby/                 # Route lobby (/lobby)  
│   │   ├── tournament/            # Route tornei (/tournament)
│   │   └── +layout.svelte         # Layout principale
│   ├── app.html                   # Template HTML base
│   └── hooks.client.js            # Client-side hooks SvelteKit
├── server/                         # Backend Node.js Server
│   ├── routes/                    # REST API endpoints
│   ├── game-engine/               # Core logica gioco Skèmino
│   │   ├── rules/                # Implementazione regole gioco
│   │   ├── validation/           # Validazione mosse
│   │   ├── elo/                  # Calcoli rating ELO
│   │   └── psn/                  # Sistema notazione PSN
│   ├── websocket/                 # Handler gioco real-time
│   ├── database/                  # Modelli DB e migrations
│   ├── services/                  # Logica business services
│   └── middleware/                # Middleware Express (auth, validation)
├── shared/                         # Tipi e utilities condivise
├── static/                         # Assets statici SvelteKit
├── tests/                          # Suite test complete
│   ├── unit/                      # Test unitari Svelte
│   ├── integration/               # Test integrazione
│   └── e2e/                       # Test end-to-end gaming
├── docs/                           # Documentazione
│   └── development-log/            # OBBLIGATORIO: Tracking chat history
├── deployment/                     # Configurazioni Docker/K8s
├── svelte.config.js               # Configurazione SvelteKit
├── vite.config.js                 # Configurazione Vite
└── .claude/                        # Claude Code sub-agents
    └── agents/                     # Knowledge bases sub-agent
        ├── skemino-analytics-specialist.md
        ├── skemino-architecture.md
        ├── skemino-database-specialist.md
        ├── skemino-elo.md
        ├── skemino-game-engine.md
        ├── skemino-legue.md
        ├── skemino-mobile-specialist.md
        ├── skemino-performance.md
        ├── skemino-persistenza.md
        ├── skemino-rating.md
        ├── skemino-realtime-specialist.md
        ├── skemino-refactoring.md
        ├── skemino-social-specialist.md
        ├── skemino-testing-specialist.md
        └── skemino-ui.md
```

### **⚙️ STACK TECNOLOGICO (SVELTE-POWERED)**
- **🔥 Frontend**: **Svelte 5 + SvelteKit** + TypeScript + Tailwind CSS + Socket.io-client
- **Backend**: Node.js + Express + TypeScript + Socket.io + PostgreSQL
- **Real-time**: WebSocket con Socket.io + **Svelte stores** per reattività istantanea
- **Database**: PostgreSQL per persistenza + Redis per caching/sessioni
- **Build Tool**: **Vite** (ultra-veloce per sviluppo Svelte)
- **Deployment**: Docker + Nginx + CI/CD pipeline
- **Testing**: **Vitest** + **@testing-library/svelte** + Playwright per E2E

---

## 🎲 **REGOLE GIOCO SKÈMINO (IMPLEMENTAZIONE CORE)**

### **🃏 Componenti Gioco**
- **39 Chain Cards**: P1-P13, F1-F13, C1-C13 (semi Pietra/Forbici/Carta)
- **Tabellone 6×6**: 36 caselle con notazione algebrica (a1-f6)
- **4 Quadranti**: Ognuno con vertice (a1, f1, a6, f6) e casella centrale
- **Sistema Setup**: 3 dadi (numerico, alfabetico, bicolore) per piazzamento iniziale
- **11 Loop Cards**: Per segnalare situazioni "hole" durante partita

### **⚔️ Meccaniche Core**
- **Regole Morra Cinese**: Pietra > Forbici, Forbici > Carta, Carta > Pietra
- **Piazzamento Carte**: Solo adiacente/contiguo, mai diagonali
- **Rilevamento Loop**: Loop simbolici (≥3 simboli diversi) e numerici (Asso+Re)
- **Controllo Vertice**: Obiettivo strategico chiave con controllo "esclusivo"
- **Condizioni Vittoria**: ERA1-ERA4 (controllo vertice, saturazione tabellone, esaurimento mazzo, carta ribaltone)

### **📊 Sistema Rating ELO**
- **Formula**: EA = 1/(1 + 10^((RB-RA)/(K²-K)))
- **K-factor Dinamico**: k = 160 * e^(-R̄/721.35)
- **10 Livelli Abilità**: Beginner (1000-1199) → Super Grand Master (≥2700)
- **Aggiornamenti Rating**: Post-partita con precisione matematica

### **📝 Formato Notazione PSN**
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

---

## 🚀 **REQUISITI PERFORMANCE (TARGET CRITICI SVELTE)**

- **🔥 WebSocket Latency**: <50ms (target migliorato con Svelte - consulta `skemino-performance`)
- **🎮 UI Rendering**: 60fps garantiti con Svelte compilation (sempre)  
- **📦 Bundle Size**: <30KB (vantaggio Svelte vs 150KB+ React)
- **🧠 Memory Usage**: <200MB per 1000 utenti (efficienza Svelte)
- **⚡ Component Update**: <16ms per update (no Virtual DOM overhead)
- **🚅 Cold Start**: <1s first paint (Svelte compilation advantage)
- **💾 Database Queries**: <50ms tempo risposta (media)
- **👥 Utenti Concorrenti**: Supporto 2000+ giocatori simultanei (performance boost)
- **⚡ API Response**: <200ms per endpoint non real-time

---

## 🎯 **COMANDI SVILUPPO (SVELTE)**

```bash
# Setup progetto SvelteKit
npm create svelte@latest skemino    # Inizializza progetto SvelteKit
npm install                         # Installa dipendenze
npm run dev                         # Dev server SvelteKit + backend
npm run dev:client                  # Solo frontend SvelteKit  
npm run dev:server                  # Solo backend Node.js + WebSocket
npm run build                       # Build produzione SvelteKit
npm run preview                     # Preview build produzione
npm run test                        # Test suite completa (Vitest)
npm run test:unit                   # Solo test unitari componenti Svelte
npm run test:integration            # Test integrazione
npm run test:e2e                    # Test E2E con Playwright
npm run lint                        # ESLint per Svelte
npm run lint:fix                    # Auto-fix linting Svelte
npm run check                       # Svelte check (type checking)
npm run db:migrate                  # Database migrations
npm run db:seed                     # Seed DB con dati test
npm run docker:dev                  # Sviluppo con Docker
npm run docker:prod                 # Build Docker produzione
```

---

## 🗄️ **SCHEMA DATABASE (TABELLE CORE)**

### **🎮 Tabelle Gaming**
```sql
-- Entità gaming core
players (id, username, email, rating, level, created_at)
games (id, white_player_id, black_player_id, result, psn_notation, duration)
moves (game_id, turn_number, move_notation, timestamp)
ratings_history (player_id, old_rating, new_rating, game_id, k_factor)

-- Sistema tournament
tournaments (id, name, type, status, start_time, max_players)
tournament_players (tournament_id, player_id, seed, current_score)
```

---

## 🔌 **EVENTI WEBSOCKET (GAMING REAL-TIME SVELTE)**

### **⚡ Eventi Core Gioco + Svelte Stores**
```typescript
// Outbound (server → client → Svelte stores)
'game:started' | 'game:state-update' | 'game:ended' | 'move:validated' | 'move:invalid'

// Inbound (client Svelte → server)
'game:join' | 'move:make' | 'game:resign' | 'game:offer-draw'

// Eventi lobby con Svelte reattività
'lobby:join' | 'matchmaking:start' | 'match:found'

// Svelte Stores Pattern per WebSocket
// stores/gameStore.js
import { writable } from 'svelte/store';
export const gameState = writable({});
export const players = writable([]);
export const currentMove = writable(null);
```

---

## 🛡️ **SICUREZZA & ANTI-CHEAT**

### **🔒 Validazione Server-Authoritative**
- **Tutte le mosse validate server-side** - consulta `skemino-architecture`
- **Zero logica gioco client-side** per operazioni critiche
- **Timeout mosse** per prevenire stalli
- **Sanitizzazione input** per tutti i dati utente  
- **Rate limiting** su tutti gli endpoint

### **🔐 Autenticazione & Autorizzazione**
- **Token JWT** con meccanismo refresh sicuro
- **Gestione sessioni** con Redis
- **Permessi role-based** (player, moderator, admin)
- **Svelte stores** per auth state management

---

## 📝 **CONVENZIONI SVILUPPO SVELTE**

### **✨ Stile Codice Svelte**
- **Naming File**: kebab-case per .svelte, PascalCase per componenti
- **File Structure**: `Component.svelte` con script, style, markup
- **TypeScript**: Strict mode attivo, zero tipi `any` permessi
- **Import**: Path mapping SvelteKit (`$lib/components`, `$lib/utils`)
- **Component Structure**: Props export, reactive declarations, proper binding

### **🧩 Pattern Svelte Specifici**
```svelte
<!-- Component.svelte pattern standard -->
<script lang="ts">
  // Props export
  export let gameId: string;
  export let playerName: string;
  
  // Reactive declarations
  $: isActivePlayer = playerName === currentPlayer;
  $: canMakeMove = isActivePlayer && !gameEnded;
  
  // Functions
  function handleMove(move: Move) {
    // Handle move logic
  }
</script>

<div class="game-component">
  {#if isActivePlayer}
    <button on:click={() => handleMove(selectedMove)}>
      Make Move
    </button>
  {/if}
</div>

<style>
  .game-component {
    /* Component-scoped styles */
  }
</style>
```

### **🌳 Git Workflow**
```bash
# Branch naming convention (Svelte-aware)
feature/svelte-game-board-implementation
fix/svelte-store-reactivity-bug
refactor/sveltekit-routing-optimization

# Commit format (conventional commits)
feat(svelte): implement game board component with stores
fix(store): handle WebSocket state synchronization
docs(sveltekit): add routing documentation
perf(svelte): optimize component rendering performance
```

### **🧪 Strategia Testing Svelte**
- **Unit Tests**: Tutti i componenti Svelte (>90% coverage richiesta)
- **Store Tests**: Test per Svelte stores con @testing-library/svelte
- **Integration Tests**: API endpoints ed eventi WebSocket
- **E2E Tests**: Scenari gioco completi con Playwright
- **Performance Tests**: Load testing per utenti concorrenti

---

## 🎯 **FASI SVILUPPO ATTUALI**

### **Phase 1: Foundation Svelte (CURRENT)**
- [x] Setup SvelteKit project structure
- [ ] Core game engine implementation
- [ ] Database schema e migrations
- [ ] WebSocket infrastructure con Svelte stores

### **Phase 2: Core Gaming Svelte**  
- [ ] Componenti Svelte per gioco
- [ ] Svelte stores per state management
- [ ] Real-time multiplayer con stores reattivi
- [ ] Sistema validazione mosse

### **Phase 3: Features Competitive**
- [ ] Sistema rating ELO  
- [ ] Algoritmo matchmaking
- [ ] Registrazione notazione PSN
- [ ] Framework tournament

### **Phase 4: Production Ready**
- [ ] Ottimizzazione performance Svelte
- [ ] Sicurezza hardening
- [ ] Monitoring e analytics
- [ ] Pipeline deployment SvelteKit

---

## 🚨 **REGOLE IMPLEMENTAZIONE CRITICHE**

### **📋 PRIMA DI QUALSIASI IMPLEMENTAZIONE (CHECKLIST OBBLIGATORIA)**
1. **✅ Consulta sub-agent rilevante** per expertise prima
2. **✅ Rivedi codice esistente Svelte** per pattern e coerenza
3. **✅ Controlla impatto performance** vs target critici (<50ms WebSocket)
4. **✅ Valida compliance TypeScript** strict in .svelte
5. **✅ Aggiorna chat history log** con dettagli sessione  
6. **✅ Testa componenti Svelte** accuratamente prima di committare
7. **✅ Commit con messaggio descrittivo** seguendo convention
8. **✅ Aggiorna development log** con tracking progresso

### **🎮 Requisiti Specifici Gaming Svelte**
- **Validazione server** per tutti i cambi stato gioco (consulta `skemino-architecture`)
- **Svelte stores immutabili** nel game engine (consulta `skemino-game-engine`)
- **Error boundaries equivalent** nei componenti Svelte (consulta `skemino-ui`)
- **Degradazione graceful** per problemi rete con stores (consulta `skemino-performance`)
- **Accessibilità** considerazioni per UI gaming Svelte (consulta `skemino-ui`)

---

## 💡 **ESEMPI CONSULTAZIONE SUB-AGENT (SVELTE)**

```bash
# Prima implementazione componenti Svelte:
"Consulta skemino-ui per pattern componenti Svelte gaming performanti"

# Prima implementazione regole gioco:
"Consulta skemino-game-engine per validazione regole morra cinese"

# Prima ottimizzazione performance Svelte:  
"Applica expertise skemino-performance per ottimizzazione bundle Svelte"

# Prima decisioni architetturali SvelteKit:
"Chiedi a skemino-architecture per pattern scalabilità multiplayer SvelteKit"

# Prima implementazione stores:
"Usa skemino-ui per design Svelte stores reattivi gaming"

# Prima implementazione real-time:
"Consulta skemino-realtime-specialist per WebSocket con Svelte stores"
```

---

## 🚀 **RIFERIMENTI RAPIDI COMANDI**

### **🤖 Comandi Sub-Agent Essenziali (SVELTE)**
```bash
# Svelte Components & UI
"Usa skemino-ui per [componente/interfaccia Svelte specifica]"

# Game Rules & Logic
"Consulta skemino-game-engine per [domanda regole gioco specifica]"

# Performance Optimization Svelte
"Applica expertise skemino-performance per [task ottimizzazione Svelte]"

# SvelteKit Architecture 
"Chiedi a skemino-architecture per [domanda architetturale SvelteKit]"

# Database & Persistence
"Utilizza skemino-database-specialist per [task database]"

# ELO Rating System
"Consulta skemino-elo per [calcolo/implementazione rating]"

# Real-time Features con Svelte  
"Consulta skemino-realtime-specialist per [WebSocket + Svelte stores]"

# Testing Svelte Components
"Utilizza skemino-testing-specialist per [strategia testing Svelte]"

# Analytics & Metrics
"Consulta skemino-analytics-specialist per [implementazione analytics]"

# Social Features
"Usa skemino-social-specialist per [funzionalità social]"
```

### **📋 Comandi Git Obbligatori**
```bash
# Dopo ogni implementazione
git add .
git commit -m "feat(svelte): messaggio descrittivo"
git push origin current-branch

# Aggiorna development log (FILE ATTIVO CORRENTE)  
# DEVE EDITARE: docs/development-log/chat-history-2025-01-15.md
# ⚠️ AGGIORNA QUESTO PATH QUOTIDIANAMENTE IN CLAUDE.MD
```

---

## 🔧 **TROUBLESHOOTING PROBLEMI COMUNI (SVELTE)**

### **🔌 Problemi Connessione WebSocket + Svelte Stores**
1. Controlla binding Svelte stores con WebSocket events
2. Verifica reattività stores su state updates
3. Assicura proper cleanup su component destroy
4. **Consulta**: `skemino-performance` per strategie ottimizzazione Svelte

### **🎮 Bug Componenti Svelte Gaming**
1. Riproduci sempre in test unitari @testing-library/svelte
2. **Consulta**: `skemino-ui` per pattern componenti gaming
3. Controlla reactive declarations ($:) per updates
4. **Consulta**: `skemino-architecture` per pattern validazione

### **⚡ Problemi Performance Svelte**
1. Profile con Svelte DevTools
2. Controlla compilation output size
3. **Consulta**: `skemino-performance` per bundle optimization
4. Monitor vs target critici (<50ms WebSocket, <30KB bundle)

### **🎨 Problemi UI/UX Gaming Svelte**
1. **Consulta**: `skemino-ui` per pattern specifici gaming Svelte
2. Testa animazioni e transizioni Svelte built-in
3. Valida compliance accessibilità Svelte
4. Controlla performance rendering 60fps garantiti

---

## 🚀 **CHECKLIST GETTING STARTED (SVELTE)**

- [ ] Crea progetto SvelteKit: `npm create svelte@latest skemino`
- [ ] Setup istanze locali PostgreSQL e Redis
- [ ] Configura svelte.config.js e vite.config.js
- [ ] Installa dipendenze: TypeScript, Tailwind, Socket.io-client
- [ ] Setup directory structure src/lib/components/gaming/
- [ ] Configura variabili ambiente (.env.example → .env)
- [ ] Esegui migrations e seed database
- [ ] Avvia development server SvelteKit + backend
- [ ] Verifica connessione WebSocket + Svelte stores in browser
- [ ] Esegui test suite Vitest per verificare setup corretto
- [ ] **Crea log chat history iniziale**: `docs/development-log/chat-history-[DATE].md`
- [ ] **Consulta `skemino-architecture`** per primo task implementazione Svelte
- [ ] **Commit setup iniziale** con formato messaggio proper

---

## 📋 **GESTIONE FILE LOG QUOTIDIANA**
```bash
# Workflow inizio nuovo giorno:
1. Crea nuovo file log: docs/development-log/chat-history-[NUOVA-DATE].md
2. Aggiorna CLAUDE.md riga con nuovo filename  
3. Continua logging tutte le sessioni nel nuovo file
```

---

## 📚 **DOCUMENTAZIONE & RIFERIMENTI CHIAVE**

- **Regole Gioco**: Specifiche complete nelle immagini caricate
- **Svelte Docs**: https://svelte.dev/docs per reference
- **SvelteKit Docs**: https://kit.svelte.dev/docs per routing e SSR
- **Config Sub-Agent**: Directory `.claude/agents/` per expertise specializzata
- **Development Log**: `docs/development-log/` per tracking progresso
- **Documentazione API**: Auto-generata da specifiche OpenAPI  
- **Docs Database**: Diagrammi ER e guide migration
- **Guide Deployment**: Setup Docker, Kubernetes, e CI/CD per SvelteKit

---

## ⚠️ **REMINDER IMPORTANTI (NON-NEGOZIABILI)**

- **🤖 Consultazione sub-agent è OBBLIGATORIA** prima di qualsiasi implementazione
- **📝 Git commit dopo ogni task** è NON-NEGOZIABILE
- **📊 Tracking chat history** deve essere mantenuto in: `docs/development-log/chat-history-2025-01-15.md`
- **📅 AGGIORNA FILE LOG QUOTIDIANAMENTE**: Cambia data filename e aggiorna reference CLAUDE.md
- **⚡ <50ms latenza WebSocket** è target priorità assoluta (migliorato con Svelte)
- **📦 <30KB bundle size** target Svelte vs 150KB+ React equivalente
- **🔒 Validazione server-authoritative** previene tutti i cheating
- **📝 Notazione PSN** richiesta per tutte le registrazioni gioco
- **🔧 TypeScript strict mode** in .svelte files - zero tolleranza per tipi `any`
- **🛡️ Error handling comprensivo** per edge case multiplayer
- **📊 Performance monitoring** vs tutti i target critici Svelte

---

**🎮 RICORDA: Skèmino è una piattaforma gaming competitiva PERFORMANCE-FIRST che usa Svelte (come chess.com) per massimizzare velocità, reattività e efficienza. Ogni componente deve sfruttare i vantaggi unici di Svelte per gaming real-time di livello professionale.**