// Test script per verificare il matchmaking automatico
const { MatchmakingManager } = require('./src/server/websocket/MatchmakingManager.ts');

console.log('🧪 Avvio test matchmaking automatico...');

// Crea istanza del matchmaking manager
const matchmaker = new MatchmakingManager();

// Verifica che i listener siano configurati
console.log(`📊 Event listeners configurati: ${matchmaker.getEventListenerCount()}`);
console.log(`🎧 Ha listeners: ${matchmaker.hasMatchFoundListeners()}`);

// Aggiungi listener per test
matchmaker.on('match:found', (match) => {
  console.log(`✅ TEST PASSATO! Match trovato automaticamente:`);
  console.log(`   - GameID: ${match.gameId}`);
  console.log(`   - White: ${match.white.username} (${match.white.rating})`);
  console.log(`   - Black: ${match.black.username} (${match.black.rating})`);
  console.log(`   - Time Control: ${match.timeControl}`);
});

// Simula aggiunta di giocatori
async function testMatchmaking() {
  try {
    console.log('\n🎮 Aggiunta giocatori alla coda...');

    // Giocatore 1
    const match1 = await matchmaker.addToQueue({
      userId: 'player1',
      username: 'TestPlayer1',
      rating: 1500,
      timeControl: 'rapid',
      joinedAt: Date.now()
    });

    if (match1) {
      console.log('⚡ Match immediato trovato per Player1');
    } else {
      console.log('⏳ Player1 aggiunto alla coda');
    }

    // Giocatore 2 (dovrebbe creare match)
    const match2 = await matchmaker.addToQueue({
      userId: 'player2',
      username: 'TestPlayer2',
      rating: 1520,
      timeControl: 'rapid',
      joinedAt: Date.now()
    });

    if (match2) {
      console.log('⚡ Match immediato trovato per Player2');
    } else {
      console.log('⏳ Player2 aggiunto alla coda');
    }

    // Stampa stats
    console.log('\n📊 Statistiche code:');
    console.log(matchmaker.getQueueStats());

    // Aspetta per processamento automatico delle code
    console.log('\n⏱️  Attendo processamento automatico code (3 secondi)...');
    setTimeout(() => {
      console.log('\n📊 Statistiche finali:');
      console.log(matchmaker.getQueueStats());
      console.log('\n🏁 Test completato!');
      process.exit(0);
    }, 3000);

  } catch (error) {
    console.error('❌ Errore nel test:', error);
  }
}

// Avvia test
testMatchmaking();