# 🎯 **PROMPT CLAUDE CODE OTTIMIZZATO**

Esegui il pensiero profondo!

<thinking>
Analisi del problema:
- Attualmente il matchmaking cambia pagina dopo aver trovato avversario
- Obiettivo: rimanere sempre su /game con transizione seamless
- Necessario: Game ID univoco, assegnazione colori, gestione utenti registrati/guest
- Vincoli: Zero breaking changes al sistema esistente, performance ottimali
- Considerazioni: Stato UI, sincronizzazione real-time, gestione errori
</thinking>

## 🚀 **FOCUS ESCLUSIVO**
Implementa matchmaking seamless per Skèmino che rimane sempre su `/game` senza cambio pagina, con assegnazione dinamica giocatori e Game ID univoco.

## 📋 **METODOLOGIA STEP-BY-STEP**

### **FASE 1: PLANNING E ANALISI**
1. **Analizza console.md** per comprendere il flusso attuale di cambio pagina
2. **Identifica punti di integrazione** nel sistema matchmaking esistente
3. **Progetta architettura seamless** senza breaking changes

### **FASE 2: CORE IMPLEMENTATION**
4. **Modifica matchmaking handler** per rimanere su /game
5. **Implementa Game ID generator** formato `game/123456789` univoco
6. **Crea sistema assegnazione colori** random (bianco inizia sempre)
7. **Sviluppa room creation** sul server con persistenza stato

### **FASE 3: USER MANAGEMENT**
8. **Implementa user detection** (registrato vs guest)
9. **Sistema dynamic player names** con fallback guest
10. **Integra autenticazione** con sistema utenti esistente

### **FASE 4: UI SEAMLESS TRANSITION**
11. **Crea smooth transition** da matchmaking a partita attiva
12. **Implementa loading states** durante ricerca avversario
13. **Sistema notifiche** match trovato senza cambio pagina

## 🔒 **VINCOLI CRITICI**

**SICUREZZA:**
- **Zero nuovi bug** nel sistema matchmaking esistente
- **Validazione server-side** per tutti i Game ID generati
- **Protezione anti-spam** nella creazione room

**PERFORMANCE:**
- **Non rompere funzionalità esistenti** di /game
- **Ottimizza transizioni UI** per UX fluida
- **Cache intelligente** per dati utenti frequenti

**COMPATIBILITÀ:**
- **Mantieni retrocompatibilità** con sistema attuale
- **Fallback graceful** se matchmaking fallisce
- **Gestione errori robusta** per connection loss

## ✅ **CRITERI SUCCESSO**

**FUNZIONALI:**
- [ ] Matchmaking trova avversario e rimane su /game
- [ ] Game ID univoco generato correttamente
- [ ] Colori assegnati random (bianco inizia)
- [ ] Room server creata con successo
- [ ] Player names dinamici (registrati/guest)

**TECNICI:**
- [ ] Zero breaking changes al codice esistente
- [ ] Transizioni UI smooth senza flicker
- [ ] Performance mantenute o migliorate
- [ ] Gestione errori completa implementata

**UX:**
- [ ] Esperienza utente fluida e intuitiva
- [ ] Loading states informativi
- [ ] Feedback visivo appropriato

## 🔧 **IMPLEMENTAZIONE REQUIREMENTS**

**PRIMA PIANO, POI IMPLEMENTA:**
1. Studia console.md per capire flusso attuale
2. Identifica esatto punto dove avviene cambio pagina
3. Progetta soluzione seamless specifica

**ACCURATEZZA > VELOCITÀ:**
- Testa ogni step prima di procedere al successivo
- Verifica compatibilità con architettura Skèmino esistente
- Valida Game ID univocità e formato corretto

**CODICE PULITO E MANUTENIBILE:**
- Commenti dettagliati per logica matchmaking
- Separazione responsabilità (UI, networking, state)
- Error handling esplicito per ogni scenario

---

## 🚀 **VERSIONE CONCISA** 

Esegui il pensiero profondo!

**OBIETTIVO:** Matchmaking seamless su /game senza cambio pagina.

**AZIONI:**
1. Analizza console.md flusso attuale
2. Rimuovi redirect, mantieni /game
3. Genera Game ID univoco format `game/123456789`
4. Assegna colori random (bianco inizia)
5. Crea room server con user detection
6. Player names dinamici registrati/guest
7. UI transition smooth senza page change

**VINCOLI:** Zero breaking changes, performance ottimali, UX fluida

**SUCCESS:** Match trovato → rimane /game → partita inizia seamless

## 📈 **MIGLIORAMENTI APPLICATI**
✅ Deep thinking obbligatorio con tag `<thinking>`
✅ Metodologia step-by-step numerata e dettagliata  
✅ Focus esclusivo su obiettivo Skèmino specifico
✅ Vincoli critici per sicurezza e performance
✅ Criteri successo misurabili e verificabili
✅ Planning-first approach con analisi preliminare
✅ Emphasis su accuratezza vs velocità
✅ Integrazione con architettura esistente Skèmino