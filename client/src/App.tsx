import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameBoard } from './components/gaming/Board/GameBoard';
import { PlayerHand } from './components/gaming/Cards/PlayerHand';
import { GameControls } from './components/gaming/GameUI/GameControls';
import { useSocket } from './hooks/useSocket';
import { useGameStore } from './store/gameStore';
import type { Card } from './types/game';

function App() {
  const { connected, latency, joinGame } = useSocket();
  const { gameState, currentPlayer, opponent: opponentPlayer } = useGameStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [roomId] = useState('test-room-001');

  useEffect(() => {
    // Auto-join a test room
    if (connected) {
      joinGame(roomId);
    }
  }, [connected, joinGame, roomId]);

  // Mock data for testing
  const mockPlayerCards: Card[] = [
    { id: 'c1', suit: 'P', value: '1', isStronger: false },
    { id: 'c2', suit: 'F', value: '7', isStronger: false },
    { id: 'c3', suit: 'C', value: '13', isStronger: false },
    { id: 'c4', suit: 'P', value: '5', isStronger: false },
    { id: 'c5', suit: 'F', value: '11', isStronger: false },
  ];

  const mockOpponentCards: Card[] = Array(5).fill(null).map((_, i) => ({
    id: `op${i}`,
    suit: 'P',
    value: '?',
    isStronger: false
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="py-4 px-6 bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Skèmino
              </h1>
              <p className="text-sm text-gray-300">Strategic Card Board Game</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-white text-sm">
                  {connected ? `Connected (${latency}ms)` : 'Disconnected'}
                </span>
              </div>

              {/* Room Info */}
              <div className="px-3 py-1 bg-white/10 rounded-lg">
                <span className="text-white text-sm">Room: {roomId}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Opponent Hand */}
            <div className="flex justify-center">
              <PlayerHand
                cards={mockOpponentCards}
                player={opponentPlayer}
                isOpponent={true}
                canSelect={false}
              />
            </div>

            {/* Game Board */}
            <div className="flex justify-center">
              <GameBoard />
            </div>

            {/* Player Hand */}
            <div className="flex justify-center">
              <PlayerHand
                cards={mockPlayerCards}
                player={currentPlayer}
                isOpponent={false}
                selectedCard={selectedCard}
                onCardSelect={setSelectedCard}
                canSelect={gameState?.currentTurn === currentPlayer?.color}
              />
            </div>

            {/* Game Controls */}
            <div className="flex justify-center">
              <GameControls />
            </div>
          </div>
        </main>

      </div>
    </DndProvider>
  );
}

export default App;