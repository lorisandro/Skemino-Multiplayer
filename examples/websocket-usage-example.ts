/**
 * Complete WebSocket Infrastructure Usage Example
 * This file demonstrates how to use the Skèmino real-time gaming infrastructure
 */

import { SocketClient, createSocketClient } from '../src/client/services/SocketClient';
import { GameState, Move } from '../src/shared/types/GameTypes';

// =============================================================================
// CLIENT-SIDE EXAMPLE
// =============================================================================

class SkeminoGameClient {
  private socketClient: SocketClient;
  private currentGameId: string | null = null;

  constructor(authToken: string) {
    this.socketClient = createSocketClient(authToken);
    this.setupEventHandlers();
  }

  async connect(): Promise<void> {
    try {
      await this.socketClient.connect();
      console.log('🎮 Connected to Skèmino server');

      // Enable performance optimizations
      this.socketClient.enableOptimizations();
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    // Connection events
    this.socketClient.on('connect', () => {
      console.log('✅ Connected to server');
      this.displayConnectionStatus(true);
    });

    this.socketClient.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      this.displayConnectionStatus(false);
    });

    this.socketClient.on('reconnect', () => {
      console.log('🔄 Reconnected to server');
      this.displayConnectionStatus(true);
    });

    // Matchmaking events
    this.socketClient.on('matchmaking:queued', (data) => {
      console.log(`⏳ Joined ${data.timeControl} matchmaking queue`);
      this.showMatchmakingStatus('Searching for opponent...');
    });

    this.socketClient.on('match:found', (data) => {
      console.log(`🎯 Match found! Playing as ${data.color} vs ${data.opponent.username}`);
      this.currentGameId = data.gameId;
      this.hideMatchmakingStatus();
      this.socketClient.joinGame(data.gameId);
    });

    // Game events
    this.socketClient.on('game:state', (gameState: GameState) => {
      console.log('🎲 Game state updated');
      this.updateGameUI(gameState);
    });

    this.socketClient.on('move:validated', (move: Move) => {
      console.log(`✅ Move confirmed: ${move.notation}`);
      this.highlightMove(move);
    });

    this.socketClient.on('move:invalid', (reason: string) => {
      console.log(`❌ Invalid move: ${reason}`);
      this.showErrorMessage(reason);
    });

    this.socketClient.on('game:ended', (result) => {
      console.log(`🏁 Game ended: ${result.result}`);
      this.showGameResult(result);
      this.currentGameId = null;
    });

    this.socketClient.on('time:update', (timeData) => {
      this.updateGameTimers(timeData);
    });

    this.socketClient.on('game:draw-offered', (data) => {
      console.log(`🤝 ${data.username} offered a draw`);
      this.showDrawOffer(data);
    });

    // Player presence events
    this.socketClient.on('player:online', (data) => {
      console.log(`👋 ${data.username} came online`);
    });

    this.socketClient.on('player:offline', (data) => {
      console.log(`👋 ${data.username} went offline`);
    });

    // Error handling
    this.socketClient.on('error', (error) => {
      console.error(`🚨 Socket error: ${error.message}`);
      this.showErrorMessage(error.message);
    });

    // Latency monitoring
    this.socketClient.on('pong', () => {
      const latency = this.socketClient.getCurrentLatency();
      this.updateLatencyDisplay(latency);

      if (latency > 200) {
        console.warn(`⚠️ High latency detected: ${latency}ms`);
      }
    });
  }

  // =============================================================================
  // GAME ACTIONS
  // =============================================================================

  async joinMatchmaking(timeControl: string = 'rapid'): Promise<void> {
    if (!this.socketClient.isConnected()) {
      throw new Error('Not connected to server');
    }

    try {
      this.socketClient.joinMatchmaking(timeControl);
      console.log(`🎯 Joining ${timeControl} matchmaking...`);
    } catch (error) {
      console.error('Failed to join matchmaking:', error);
      throw error;
    }
  }

  leaveMatchmaking(): void {
    this.socketClient.leaveMatchmaking();
    this.hideMatchmakingStatus();
    console.log('❌ Left matchmaking queue');
  }

  makeMove(move: Move): void {
    if (!this.currentGameId) {
      throw new Error('Not in a game');
    }

    try {
      // Add client-side timestamp
      move.timestamp = new Date();

      // Send move to server
      this.socketClient.makeMove(move);

      // Show optimistic UI update
      this.showPendingMove(move);

      console.log(`📝 Sent move: ${move.notation}`);
    } catch (error) {
      console.error('Failed to make move:', error);
      this.showErrorMessage('Failed to send move');
    }
  }

  resignGame(): void {
    if (!this.currentGameId) return;

    if (confirm('Are you sure you want to resign?')) {
      this.socketClient.resignGame();
      console.log('🏳️ Resigned from game');
    }
  }

  offerDraw(): void {
    if (!this.currentGameId) return;

    this.socketClient.offerDraw();
    console.log('🤝 Draw offer sent');
    this.showMessage('Draw offer sent to opponent');
  }

  acceptDraw(): void {
    this.socketClient.acceptDraw();
    console.log('🤝 Draw offer accepted');
  }

  declineDraw(): void {
    this.socketClient.declineDraw();
    console.log('🤝 Draw offer declined');
  }

  // =============================================================================
  // UI UPDATE METHODS (Mock implementations for example)
  // =============================================================================

  private displayConnectionStatus(connected: boolean): void {
    const indicator = document.getElementById('connection-status');
    if (indicator) {
      indicator.className = connected ? 'connected' : 'disconnected';
      indicator.textContent = connected ? 'Connected' : 'Disconnected';
    }
  }

  private updateLatencyDisplay(latency: number): void {
    const latencyEl = document.getElementById('latency');
    if (latencyEl) {
      latencyEl.textContent = `${latency}ms`;

      // Color code based on latency
      if (latency < 50) {
        latencyEl.className = 'excellent';
      } else if (latency < 100) {
        latencyEl.className = 'good';
      } else if (latency < 200) {
        latencyEl.className = 'fair';
      } else {
        latencyEl.className = 'poor';
      }
    }
  }

  private showMatchmakingStatus(message: string): void {
    const statusEl = document.getElementById('matchmaking-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = message;
    }
  }

  private hideMatchmakingStatus(): void {
    const statusEl = document.getElementById('matchmaking-status');
    if (statusEl) {
      statusEl.style.display = 'none';
    }
  }

  private updateGameUI(gameState: GameState): void {
    // Update board visualization
    this.updateBoard(gameState.board);

    // Update player information
    this.updatePlayerInfo(gameState.players);

    // Update game status
    this.updateGameStatus(gameState);

    // Update move history
    this.updateMoveHistory(gameState.moveHistory);
  }

  private updateBoard(board: any): void {
    console.log('🎯 Updating game board');
    // Implementation would update the visual board
  }

  private updatePlayerInfo(players: any): void {
    console.log('👥 Updating player information');
    // Implementation would update player cards, ratings, etc.
  }

  private updateGameStatus(gameState: GameState): void {
    const statusEl = document.getElementById('game-status');
    if (statusEl) {
      if (gameState.status === 'active') {
        statusEl.textContent = `${gameState.currentTurn}'s turn`;
      } else {
        statusEl.textContent = gameState.status;
      }
    }
  }

  private updateMoveHistory(moves: Move[]): void {
    console.log(`📚 Move history updated: ${moves.length} moves`);
    // Implementation would update move list UI
  }

  private updateGameTimers(timeData: { white: number; black: number }): void {
    const whiteTimer = document.getElementById('white-timer');
    const blackTimer = document.getElementById('black-timer');

    if (whiteTimer) whiteTimer.textContent = this.formatTime(timeData.white);
    if (blackTimer) blackTimer.textContent = this.formatTime(timeData.black);
  }

  private formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private highlightMove(move: Move): void {
    console.log(`✨ Highlighting move: ${move.notation}`);
    // Implementation would visually highlight the move on the board
  }

  private showPendingMove(move: Move): void {
    console.log(`⏳ Showing pending move: ${move.notation}`);
    // Implementation would show move as pending confirmation
  }

  private showGameResult(result: any): void {
    const modal = document.getElementById('game-result-modal');
    if (modal) {
      modal.style.display = 'block';
      const resultText = document.getElementById('result-text');
      if (resultText) {
        resultText.textContent = `Game ended: ${result.result}`;
        if (result.winner) {
          resultText.textContent += ` - ${result.winner} wins!`;
        }
      }
    }
  }

  private showDrawOffer(data: { fromPlayer: string; username: string }): void {
    const drawModal = document.getElementById('draw-offer-modal');
    if (drawModal) {
      drawModal.style.display = 'block';
      const messageEl = document.getElementById('draw-message');
      if (messageEl) {
        messageEl.textContent = `${data.username} offered a draw`;
      }
    }
  }

  private showErrorMessage(message: string): void {
    console.error(`❌ Error: ${message}`);
    // Implementation would show error in UI
  }

  private showMessage(message: string): void {
    console.log(`💬 Message: ${message}`);
    // Implementation would show message in UI
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getConnectionInfo(): any {
    return this.socketClient.getDebugInfo();
  }

  isConnected(): boolean {
    return this.socketClient.isConnected();
  }

  getCurrentLatency(): number {
    return this.socketClient.getCurrentLatency();
  }

  getAverageLatency(): number {
    return this.socketClient.getAverageLatency();
  }

  disconnect(): void {
    this.socketClient.disconnect();
  }
}

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

async function initializeSkeminoClient() {
  // Get auth token (from login, localStorage, etc.)
  const authToken = localStorage.getItem('authToken') || 'demo-token';

  // Create game client
  const gameClient = new SkeminoGameClient(authToken);

  try {
    // Connect to server
    await gameClient.connect();

    // Example: Join rapid matchmaking
    document.getElementById('join-rapid')?.addEventListener('click', () => {
      gameClient.joinMatchmaking('rapid');
    });

    // Example: Join blitz matchmaking
    document.getElementById('join-blitz')?.addEventListener('click', () => {
      gameClient.joinMatchmaking('blitz');
    });

    // Example: Leave matchmaking
    document.getElementById('leave-queue')?.addEventListener('click', () => {
      gameClient.leaveMatchmaking();
    });

    // Example: Resign game
    document.getElementById('resign')?.addEventListener('click', () => {
      gameClient.resignGame();
    });

    // Example: Offer draw
    document.getElementById('offer-draw')?.addEventListener('click', () => {
      gameClient.offerDraw();
    });

    // Example: Accept draw
    document.getElementById('accept-draw')?.addEventListener('click', () => {
      gameClient.acceptDraw();
    });

    // Example: Decline draw
    document.getElementById('decline-draw')?.addEventListener('click', () => {
      gameClient.declineDraw();
    });

    // Example: Make move (this would be called from board click handler)
    window.makeExampleMove = () => {
      const exampleMove: Move = {
        id: 'move-' + Date.now(),
        turnNumber: 1,
        player: 'white',
        card: { id: 'p7', suit: 'P', value: '7', displayName: 'Pietra 7' },
        toPosition: 'd3',
        isVertexControl: false,
        isLoopTrigger: false,
        notation: 'P7:d3',
        timestamp: new Date(),
        thinkTimeMs: 5000
      };

      gameClient.makeMove(exampleMove);
    };

    // Display connection info
    setInterval(() => {
      const info = gameClient.getConnectionInfo();
      console.log('📊 Connection Info:', info);
    }, 10000);

  } catch (error) {
    console.error('Failed to initialize Skèmino client:', error);
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeSkeminoClient);
}

export { SkeminoGameClient, initializeSkeminoClient };