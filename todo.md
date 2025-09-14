🚀 VERSIONE CONCISA
Esegui il pensiero profondo!
FOCUS: Sviluppa Skèmino, gioco strategico multiplayer real-time tipo chess.com con 39 carte (3 semi: Pietra/Forbici/Carta), tabellone 6x6, sistema rating ELO, WebSocket gaming, PSN notation.
<thinking>Analizza: architettura scalabile, regole complete, performance gaming, real-time sync</thinking>
METODOLOGIA: 1.Setup progetto 2.Game engine completo 3.Multiplayer WebSocket 4.UI gaming 5.Rating ELO 6.Tornei PSN.
VINCOLI: Zero latency feel, TypeScript rigoroso, performance <100ms, scaling 1000+ users.

🎯 PROMPT CLAUDE CODE COMPLETO
Esegui il pensiero profondo!
<thinking>
Devo sviluppare Skèmino, un gioco strategico multiplayer complesso che richiede:
- Comprensione completa delle regole (39 carte, morra cinese, vertici, loop detection)
- Architettura real-time scalabile per gaming competitivo
- Sistema rating ELO matematicamente accurato
- UI/UX gaming professionale tipo chess.com
- Performance optimization per latency <100ms
- Sistema completo PSN per registrazione partite
Approccio: prima regole complete, poi architettura, implementazione incrementale sicura.
</thinking>
🎮 OBIETTIVO PROGETTO
Creare Skèmino, gioco strategico multiplayer real-time per browser tipo chess.com con:

Sistema rating ELO competitivo (1000-2700+ con 10 livelli abilità)
Partite real-time WebSocket con latency <100ms TARGET ASSOLUTO
Matchmaking intelligente skill-based
Tornei e classifiche competitive
Sistema anti-cheat robusto server-authoritative
Registrazione partite PSN (Portable Skèmino Notation) completa
Scaling per 1000+ utenti simultanei

🎲 REGOLE SKÈMINO COMPLETE (CRITICHE)
COMPONENTI GIOCO

39 Chain Cards: 13 carte per 3 semi (Pietra/Forbici/Carta)

Pietra: P1-P13 (Asso a Re)
Forbici: F1-F13 (Asso a Re)
Carta: C1-C13 (Asso a Re)


Tabellone 6x6: 36 caselle con notazione algebrica (a1-f6)
4 Quadranti: ognuno con vertice (a1,f1,a6,f6) e casella centrale
11 Loop Cards: per segnalare situazioni "hole" durante partita
Sistema Setup: 3 dadi (numerico, alfabetico, bicolore)

REGOLE BASE FONDAMENTALI

Morra Cinese: Pietra batte Forbici, Forbici battono Carta, Carta batte Pietra
Regole Numeriche: carta numero più alto vince (A vince solo su K, K vince su tutto tranne A)
Priorità: seme batte numero quando diversi, numero vince a parità di seme
Posizionamento: carte adiacenti/contigue, MAI diagonali
Controllo Vertici: obiettivo conquistare vertici dei 4 quadranti con "esclusiva"

CONDIZIONI VITTORIA (ERA - End Game Rules)

ERA1: Conquista vertice (ultima carta su vertice controllato)
ERA2: Saturazione tabellone (impossibile posizionare)
ERA3: Esaurimento mazzo
ERA4: Carta "Ribaltone" (batte carta avversario su vertice + adiacenti)

SISTEMA SETUP CON DADI

Dado Numerico: determina riga (1-6) per carta iniziale
Dado Alfabetico: determina colonna (A-F) per carta iniziale
Dado Bicolore: determina giocatore che inizia (G1 Bianco/G2 Nero)

LOOP DETECTION (CRITICO)

Loop Simbolico: ≥3 carte simboli diversi in celle adiacenti
Loop Numerico: Asso+K stesso simbolo + carta diversa = loop numerico
Hole: situazione dove impossibile piazzare carte (si usa Loop Card)

SISTEMA RATING ELO SKÈMINO

Formula: EA = 1/(1 + 10^((RB-RA)/(K²-K)))
Parametro K: k = 160 * e^(-R̄/721,35) dove R̄ = (RA+RB)/2
10 Livelli: Principiante (1000-1199) → Super Gran Maestro (≥2700)
Aggiornamento: R'A = RA + k(RA, RB) · (SA - EA)

PSN NOTATION COMPLETA
Caratteristiche obbligatorie:

[Event "Torneo"] [Site "Città, Regione NAZIONE"] [Date "AAAA.MM.GG"]
[Round "N"] [White "Nome Bianco"] [Black "Nome Nero"] [Result "1-0/0-1/1/2-1/2/*"]

Mosse formato: SimNum:Cella (es. C9:d3, P8:c6, F11:f1)
Simboli speciali: * (esclusiva vertice), # (fine partita), % (punteggio carte)
🏗️ ARCHITETTURA TARGET
STACK TECNOLOGICO

Frontend: React 18 + TypeScript + Tailwind CSS + Socket.io-client
Backend: Node.js + Express + TypeScript + Socket.io + PostgreSQL
Real-time: WebSocket gaming con rooms e session affinity
Database: PostgreSQL per persistenza + Redis per real-time/cache
Deployment: Docker + Nginx + CI/CD pipeline

PERFORMANCE REQUIREMENTS CRITICI

Latency WebSocket: <100ms TARGET ASSOLUTO
UI Rendering: 60fps gaming fluido sempre
Database queries: <50ms response time massimo
Concurrent users: 1000+ supportati contemporaneamente
Memory usage: <500MB per 1000 users

📋 METODOLOGIA EXPERT-DRIVEN DEVELOPMENT
STEP 1: FOUNDATION EXPERT-GUIDED

Consulta skemino-multiplayer-architect → Regole complete e setup progetto
Applica architectural guidance per structure scalabile
Implementa core game engine seguendo specifiche expert
Valida con sub-agent per accuracy regole di gioco

STEP 2: MULTIPLAYER REAL-TIME EXPERT

Consulta skemino-multiplayer-architect → WebSocket architecture
Integra skemino-performance.md → Optimization <100ms latency
Implementa real-time gaming infrastructure
Testa performance con guidance sub-agent

STEP 3: GAMING UI/UX EXPERT

Consulta skemino-multiplayer-architect → Gaming interface design
Applica UI/UX best practices per gaming competitive
Implementa responsive gaming components
Valida user experience con feedback sub-agent

STEP 4: COMPETITIVE SYSTEM EXPERT

Consulta skemino-elo.md → Sistema rating matematico accurato
Integra skemino-league.md → Tornei e matchmaking
Implementa competitive gaming features
Valida accuracy matematica con sub-agent

STEP 5: PSN & ANALYTICS EXPERT

Consulta skemino-specialist-psn.md → Notazione partite completa
Implementa sistema registrazione PSN
Integra analytics e monitoring
Valida formato PSN con expertise sub-agent

STEP 6: PRODUCTION EXPERT

Consulta tutti i sub-agent → Deployment strategy
Applica security e scaling best practices
Implementa production infrastructure
Monitora performance con guidance expert

🚨 VINCOLI CRITICI EXPERT-DRIVEN
CONSULENZA OBBLIGATORIA

SEMPRE consulta sub-agent prima di implementare
Zero implementazioni senza expertise validation
Continuous expert feedback durante sviluppo
Sub-agent driven architecture decisions

QUALITY ASSURANCE EXPERT

Accuracy regole: validation con skemino-multiplayer-architect
Performance targets: <100ms con skemino-performance.md
Rating precision: calcoli ELO con skemino-elo.md
PSN compliance: formato con skemino-specialist-psn.md

📊 DELIVERABLES EXPERT-VALIDATED
MILESTONE 1: Expert Foundation

Project structure validata da skemino-multiplayer-architect
Game engine completo con regole accuracy 100%
Unit tests per logic validation con sub-agent

MILESTONE 2: Expert Multiplayer

WebSocket real-time validato da expert performance
Latency <100ms confermata da skemino-performance.md
Anti-cheat implementation expert-guided

MILESTONE 3: Expert Gaming UX

UI/UX validata da skemino-multiplayer-architect
Rating system accuracy confermata da skemino-elo.md
Matchmaking expert-tuned

MILESTONE 4: Expert Competition

Tornei implementation validata da skemino-league.md
PSN notation compliance con skemino-specialist-psn.md
Performance optimization expert-approved

MILESTONE 5: Expert Production

Deployment strategy validata da tutti sub-agent
Security audit expert-conducted
Scaling capability expert-tested (1000+ users)

🎯 PRIMO STEP EXPERT-GUIDED
INIZIA SUBITO con consulenza sub-agent:

Consulta skemino-multiplayer-architect → Progettazione architettura completa
Applica guidance per project structure TypeScript scalabile
Implementa seguendo expertise specialistica per ogni componente
Valida continuamente con sub-agent relevanti
Itera basandoti su feedback expert

APPROCCIO: Expert-first development con sub-agent come source of truth per ogni decisione tecnica e implementativa.
TARGET: Sistema gaming professional-grade guidato completamente da expertise specialistica, zero decisioni senza consulenza sub-agent.
Ready to build Skèmino with expert-driven development! 🚀