import { logger } from '../utils/logger';
import { RedisManager } from '../services/RedisManager';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

export interface MatchmakingPlayer {
  userId: string;
  username: string;
  rating: number;
  timeControl: string;
  joinedAt: number;
  preferences?: {
    maxRatingDifference?: number;
    preferredColor?: 'white' | 'black' | 'random';
    avoidOpponents?: string[]; // User IDs to avoid
  };
}

export interface Match {
  gameId: string;
  white: MatchmakingPlayer;
  black: MatchmakingPlayer;
  timeControl: string;
  ratingDifference: number;
  estimatedBalance: number; // 0.5 = perfectly balanced
}

interface MatchmakingQueue {
  timeControl: string;
  players: Map<string, MatchmakingPlayer>;
  lastMatch: number;
}

export class MatchmakingManager extends EventEmitter {
  private queues: Map<string, MatchmakingQueue> = new Map();
  private readonly MATCH_INTERVAL = 2000; // Check for matches every 2 seconds
  private readonly MAX_WAIT_TIME = 300000; // Maximum wait time: 5 minutes
  private readonly INITIAL_RATING_RANGE = 200; // Initial rating difference allowed
  private readonly RATING_RANGE_EXPANSION = 50; // Expand range by 50 every 30 seconds
  private readonly EXPANSION_INTERVAL = 30000; // 30 seconds

  constructor() {
    super();
    this.initializeStandardQueues();
    this.startMatchmaking();
  }

  private initializeStandardQueues(): void {
    const standardTimeControls = [
      'bullet', // 1+0, 2+1
      'blitz',  // 3+0, 3+2, 5+0, 5+3
      'rapid',  // 10+0, 10+5, 15+10
      'classical' // 30+0, 30+30, 60+30
    ];

    standardTimeControls.forEach(timeControl => {
      this.queues.set(timeControl, {
        timeControl,
        players: new Map(),
        lastMatch: Date.now()
      });
    });

    logger.info('🎯 Matchmaking queues initialized');
  }

  public async addToQueue(player: MatchmakingPlayer): Promise<Match | null> {
    try {
      const { timeControl } = player;
      logger.info(`🔍 MatchmakingManager.addToQueue: Player ${player.username} requesting ${timeControl} queue`);

      // Get or create queue for time control
      let queue = this.queues.get(timeControl);
      if (!queue) {
        logger.info(`📝 Creating new queue for timeControl: ${timeControl}`);
        queue = {
          timeControl,
          players: new Map(),
          lastMatch: Date.now()
        };
        this.queues.set(timeControl, queue);
      }

      // Log current queue state before adding player
      logger.info(`📊 Queue ${timeControl} current state: ${queue.players.size} players waiting`);
      if (queue.players.size > 0) {
        const waitingPlayers = Array.from(queue.players.values()).map(p => `${p.username}(${p.rating})`).join(', ');
        logger.info(`👥 Waiting players: ${waitingPlayers}`);
      }

      // Set join timestamp
      player.joinedAt = Date.now();

      // Add player to queue
      queue.players.set(player.userId, player);

      // Update Redis for persistence
      await this.updateQueueInRedis(timeControl, queue);

      logger.info(`⏳ Player ${player.username} (${player.rating}) joined ${timeControl} queue - Total: ${queue.players.size} players`);

      // Try immediate match
      const match = this.tryCreateMatch(queue, player);
      if (match) {
        logger.info(`✨ Immediate match created: ${match.white.username} vs ${match.black.username}`);
        await this.removePlayersFromQueue(timeControl, [match.white.userId, match.black.userId]);
        return match;
      } else {
        logger.info(`❌ No immediate match found for ${player.username} in ${timeControl} queue`);
      }

      return null;
    } catch (error) {
      logger.error('Error adding player to matchmaking queue:', error);
      throw error;
    }
  }

  public async removeFromQueue(userId: string): Promise<boolean> {
    try {
      let removed = false;

      for (const [timeControl, queue] of this.queues) {
        if (queue.players.has(userId)) {
          queue.players.delete(userId);
          await this.updateQueueInRedis(timeControl, queue);
          removed = true;
          logger.info(`❌ Player ${userId} removed from ${timeControl} queue`);
          break;
        }
      }

      return removed;
    } catch (error) {
      logger.error('Error removing player from queue:', error);
      return false;
    }
  }

  private tryCreateMatch(queue: MatchmakingQueue, newPlayer: MatchmakingPlayer): Match | null {
    logger.info(`🔍 tryCreateMatch: Looking for match for ${newPlayer.username} in ${queue.timeControl} queue`);

    const candidates: MatchmakingPlayer[] = [];

    // Find potential opponents
    for (const player of queue.players.values()) {
      if (player.userId !== newPlayer.userId) {
        candidates.push(player);
        logger.info(`👤 Found potential opponent: ${player.username} (${player.rating})`);
      }
    }

    if (candidates.length === 0) {
      logger.info(`❌ No candidates found for ${newPlayer.username}`);
      return null;
    }

    logger.info(`🎯 Found ${candidates.length} potential opponents for ${newPlayer.username}`);

    // Sort candidates by rating compatibility and wait time
    const rankedCandidates = this.rankCandidates(newPlayer, candidates);
    logger.info(`📊 Ranked candidates: ${rankedCandidates.map(c => `${c.username}(${c.rating})`).join(', ')}`);

    for (const candidate of rankedCandidates) {
      logger.info(`🤝 Checking match compatibility: ${newPlayer.username}(${newPlayer.rating}) vs ${candidate.username}(${candidate.rating})`);

      if (this.canPlayersMatch(newPlayer, candidate)) {
        logger.info(`✅ Players can match! Creating game...`);
        return this.createMatch(newPlayer, candidate);
      } else {
        logger.info(`❌ Players cannot match - rating difference or other constraints`);
      }
    }

    logger.info(`❌ No compatible match found for ${newPlayer.username} after checking all candidates`);
    return null;
  }

  private rankCandidates(player: MatchmakingPlayer, candidates: MatchmakingPlayer[]): MatchmakingPlayer[] {
    const now = Date.now();

    return candidates
      .map(candidate => ({
        candidate,
        score: this.calculateMatchScore(player, candidate, now)
      }))
      .sort((a, b) => b.score - a.score) // Higher score = better match
      .map(item => item.candidate);
  }

  private calculateMatchScore(player1: MatchmakingPlayer, player2: MatchmakingPlayer, now: number): number {
    // Rating difference factor (closer ratings = higher score)
    const ratingDiff = Math.abs(player1.rating - player2.rating);
    const ratingScore = Math.max(0, 1000 - ratingDiff) / 1000;

    // Wait time factor (longer waits = more flexible matching)
    const avgWaitTime = (now - player1.joinedAt + now - player2.joinedAt) / 2;
    const waitScore = Math.min(1, avgWaitTime / this.MAX_WAIT_TIME);

    // Preference compatibility
    const preferenceScore = this.calculatePreferenceScore(player1, player2);

    // Combined score with weights
    return (ratingScore * 0.6) + (waitScore * 0.2) + (preferenceScore * 0.2);
  }

  private calculatePreferenceScore(player1: MatchmakingPlayer, player2: MatchmakingPlayer): number {
    let score = 1.0;

    // Check avoid lists
    if (player1.preferences?.avoidOpponents?.includes(player2.userId) ||
        player2.preferences?.avoidOpponents?.includes(player1.userId)) {
      return 0; // Cannot match
    }

    // Color preferences
    const p1ColorPref = player1.preferences?.preferredColor;
    const p2ColorPref = player2.preferences?.preferredColor;

    if (p1ColorPref && p2ColorPref && p1ColorPref !== 'random' && p2ColorPref !== 'random') {
      if (p1ColorPref === p2ColorPref) {
        score *= 0.7; // Conflicting preferences
      } else {
        score *= 1.2; // Complementary preferences
      }
    }

    return score;
  }

  private canPlayersMatch(player1: MatchmakingPlayer, player2: MatchmakingPlayer): boolean {
    const now = Date.now();

    // Calculate allowed rating range based on wait time
    const waitTime = Math.max(now - player1.joinedAt, now - player2.joinedAt);
    const expansions = Math.floor(waitTime / this.EXPANSION_INTERVAL);
    const maxRatingDiff = this.INITIAL_RATING_RANGE + (expansions * this.RATING_RANGE_EXPANSION);

    // Check rating difference
    const ratingDiff = Math.abs(player1.rating - player2.rating);

    logger.info(`🔢 Rating compatibility check: ${player1.username}(${player1.rating}) vs ${player2.username}(${player2.rating})`);
    logger.info(`📊 Rating difference: ${ratingDiff}, Max allowed: ${maxRatingDiff} (wait time: ${waitTime}ms, expansions: ${expansions})`);

    if (ratingDiff > maxRatingDiff) {
      logger.info(`❌ Rating difference too large: ${ratingDiff} > ${maxRatingDiff}`);
      return false;
    }

    // Check custom preferences
    const p1MaxDiff = player1.preferences?.maxRatingDifference || maxRatingDiff;
    const p2MaxDiff = player2.preferences?.maxRatingDifference || maxRatingDiff;

    logger.info(`⚙️ Custom rating preferences: P1 max: ${p1MaxDiff}, P2 max: ${p2MaxDiff}`);

    if (ratingDiff > p1MaxDiff || ratingDiff > p2MaxDiff) {
      logger.info(`❌ Rating difference exceeds player preferences: ${ratingDiff} > ${Math.min(p1MaxDiff, p2MaxDiff)}`);
      return false;
    }

    // Check avoid lists
    if (player1.preferences?.avoidOpponents?.includes(player2.userId) ||
        player2.preferences?.avoidOpponents?.includes(player1.userId)) {
      logger.info(`❌ Players have each other on avoid list`);
      return false;
    }

    logger.info(`✅ Players can match! All compatibility checks passed`);
    return true;
  }

  private createMatch(player1: MatchmakingPlayer, player2: MatchmakingPlayer): Match {
    // Determine colors
    const { white, black } = this.assignColors(player1, player2);

    const match: Match = {
      gameId: uuidv4(),
      white,
      black,
      timeControl: player1.timeControl,
      ratingDifference: Math.abs(player1.rating - player2.rating),
      estimatedBalance: this.calculateGameBalance(white, black)
    };

    logger.info(`🎮 Match created: ${white.username} (${white.rating}) vs ${black.username} (${black.rating}) - ${match.timeControl}`);

    return match;
  }

  private assignColors(player1: MatchmakingPlayer, player2: MatchmakingPlayer): { white: MatchmakingPlayer; black: MatchmakingPlayer } {
    const p1ColorPref = player1.preferences?.preferredColor;
    const p2ColorPref = player2.preferences?.preferredColor;

    // Handle explicit preferences
    if (p1ColorPref === 'white' && p2ColorPref !== 'white') {
      return { white: player1, black: player2 };
    }
    if (p1ColorPref === 'black' && p2ColorPref !== 'black') {
      return { white: player2, black: player1 };
    }
    if (p2ColorPref === 'white' && p1ColorPref !== 'white') {
      return { white: player2, black: player1 };
    }
    if (p2ColorPref === 'black' && p1ColorPref !== 'black') {
      return { white: player1, black: player2 };
    }

    // Random assignment with slight preference for higher-rated player to play white
    // (traditionally in chess, higher-rated players often play white in tournaments)
    if (Math.abs(player1.rating - player2.rating) > 100) {
      const higherRated = player1.rating > player2.rating ? player1 : player2;
      const lowerRated = player1.rating > player2.rating ? player2 : player1;

      if (Math.random() < 0.6) { // 60% chance higher-rated plays white
        return { white: higherRated, black: lowerRated };
      } else {
        return { white: lowerRated, black: higherRated };
      }
    }

    // Truly random assignment
    return Math.random() < 0.5
      ? { white: player1, black: player2 }
      : { white: player2, black: player1 };
  }

  private calculateGameBalance(white: MatchmakingPlayer, black: MatchmakingPlayer): number {
    // Calculate expected outcome using ELO formula
    // EA = 1 / (1 + 10^((RB-RA)/400))
    const ratingDiff = black.rating - white.rating;
    const expectedWhiteScore = 1 / (1 + Math.pow(10, ratingDiff / 400));

    return expectedWhiteScore; // 0.5 = perfectly balanced, >0.5 = white favored, <0.5 = black favored
  }

  private async removePlayersFromQueue(timeControl: string, userIds: string[]): Promise<void> {
    const queue = this.queues.get(timeControl);
    if (!queue) return;

    userIds.forEach(userId => {
      queue.players.delete(userId);
    });

    await this.updateQueueInRedis(timeControl, queue);
  }

  private async updateQueueInRedis(timeControl: string, queue: MatchmakingQueue): Promise<void> {
    try {
      const queueData = {
        timeControl: queue.timeControl,
        players: Array.from(queue.players.values()),
        lastMatch: queue.lastMatch,
        updatedAt: Date.now()
      };

      await RedisManager.setMatchmakingQueue(timeControl, queueData);
    } catch (error) {
      logger.error(`Error updating queue ${timeControl} in Redis:`, error);
    }
  }

  private startMatchmaking(): void {
    setInterval(() => {
      this.processAllQueues();
    }, this.MATCH_INTERVAL);

    logger.info('🔄 Matchmaking processor started');
  }

  private async processAllQueues(): Promise<void> {
    const totalPlayers = this.getTotalPlayersInQueues();
    if (totalPlayers > 0) {
      logger.info(`🔍 Processing queues: ${totalPlayers} total players waiting`);

      // Log detailed queue status
      for (const [timeControl, queue] of this.queues) {
        if (queue.players.size > 0) {
          const players = Array.from(queue.players.values()).map(p => `${p.username}(${p.rating})`).join(', ');
          logger.info(`📊 Queue ${timeControl}: ${queue.players.size} players - ${players}`);
        }
      }
    }

    for (const [timeControl, queue] of this.queues) {
      if (queue.players.size >= 2) {
        logger.info(`⚡ Processing ${timeControl} queue: ${queue.players.size} players ready for matching`);
        await this.processQueue(timeControl, queue);
      }

      // Clean up expired players
      await this.cleanupExpiredPlayers(queue);
    }
  }

  private async processQueue(timeControl: string, queue: MatchmakingQueue): Promise<void> {
    const players = Array.from(queue.players.values());
    const matches: Match[] = [];

    // Try to create matches between waiting players
    for (let i = 0; i < players.length - 1; i++) {
      const player1 = players[i];

      if (queue.players.has(player1.userId)) { // Player still in queue
        for (let j = i + 1; j < players.length; j++) {
          const player2 = players[j];

          if (queue.players.has(player2.userId) && this.canPlayersMatch(player1, player2)) {
            const match = this.createMatch(player1, player2);
            matches.push(match);

            // Remove matched players from queue
            queue.players.delete(player1.userId);
            queue.players.delete(player2.userId);
            break;
          }
        }
      }
    }

    // Update queue in Redis
    if (matches.length > 0) {
      queue.lastMatch = Date.now();
      await this.updateQueueInRedis(timeControl, queue);

      // Emit match events (handled by calling code)
      matches.forEach(match => {
        this.emitMatch(match);
        logger.info(`🔄 Processed queue match: ${match.white.username} vs ${match.black.username} (${timeControl})`);
      });
    }
  }

  private async cleanupExpiredPlayers(queue: MatchmakingQueue): Promise<void> {
    const now = Date.now();
    const expiredPlayers: string[] = [];

    for (const [userId, player] of queue.players) {
      if (now - player.joinedAt > this.MAX_WAIT_TIME) {
        expiredPlayers.push(userId);
      }
    }

    if (expiredPlayers.length > 0) {
      expiredPlayers.forEach(userId => {
        queue.players.delete(userId);
        logger.info(`⏰ Player ${userId} removed from queue due to timeout`);
      });

      await this.updateQueueInRedis(queue.timeControl, queue);
    }
  }

  private emitMatch(match: Match): void {
    // Emit match event that SocketManager can listen to
    this.emit('match:found', match);
    logger.info(`✨ Match ready: ${match.gameId} - Event emitted`);
  }

  // Public methods for monitoring and administration
  public getQueueStats(): { [timeControl: string]: { players: number; avgWaitTime: number; avgRating: number } } {
    const stats: any = {};

    for (const [timeControl, queue] of this.queues) {
      const players = Array.from(queue.players.values());
      const now = Date.now();

      stats[timeControl] = {
        players: players.length,
        avgWaitTime: players.length > 0
          ? players.reduce((sum, p) => sum + (now - p.joinedAt), 0) / players.length
          : 0,
        avgRating: players.length > 0
          ? players.reduce((sum, p) => sum + p.rating, 0) / players.length
          : 0
      };
    }

    return stats;
  }

  public getPlayerPosition(userId: string): { timeControl: string; position: number; estimatedWait: number } | null {
    for (const [timeControl, queue] of this.queues) {
      const player = queue.players.get(userId);
      if (player) {
        const players = Array.from(queue.players.values())
          .sort((a, b) => a.joinedAt - b.joinedAt);

        const position = players.findIndex(p => p.userId === userId) + 1;
        const avgMatchTime = this.calculateAverageMatchTime(timeControl);
        const estimatedWait = (position / 2) * avgMatchTime;

        return { timeControl, position, estimatedWait };
      }
    }

    return null;
  }

  private calculateAverageMatchTime(timeControl: string): number {
    // This would typically be calculated from historical data
    // For now, return reasonable estimates based on time control
    const estimates: { [key: string]: number } = {
      'bullet': 5000,    // 5 seconds
      'blitz': 15000,    // 15 seconds
      'rapid': 45000,    // 45 seconds
      'classical': 120000 // 2 minutes
    };

    return estimates[timeControl] || 30000; // Default 30 seconds
  }

  public async forceMatch(userId1: string, userId2: string, timeControl: string): Promise<Match | null> {
    // Administrative function to force a match between specific players
    try {
      const queue = this.queues.get(timeControl);
      if (!queue) return null;

      const player1 = queue.players.get(userId1);
      const player2 = queue.players.get(userId2);

      if (!player1 || !player2) return null;

      const match = this.createMatch(player1, player2);
      await this.removePlayersFromQueue(timeControl, [userId1, userId2]);

      logger.info(`⚡ Forced match created: ${match.gameId}`);
      return match;
    } catch (error) {
      logger.error('Error creating forced match:', error);
      return null;
    }
  }

  public getTotalPlayersInQueues(): number {
    return Array.from(this.queues.values()).reduce((total, queue) => total + queue.players.size, 0);
  }

  public getEventListenerCount(): number {
    return this.listenerCount('match:found');
  }

  public hasMatchFoundListeners(): boolean {
    return this.listenerCount('match:found') > 0;
  }

  // Debug methods for troubleshooting
  public getDetailedQueueStatus(): { [timeControl: string]: any } {
    const status: any = {};

    for (const [timeControl, queue] of this.queues) {
      const players = Array.from(queue.players.values());
      status[timeControl] = {
        playerCount: players.length,
        players: players.map(p => ({
          userId: p.userId,
          username: p.username,
          rating: p.rating,
          joinedAt: p.joinedAt,
          waitTime: Date.now() - p.joinedAt,
          preferences: p.preferences
        })),
        lastMatch: queue.lastMatch,
        queueAge: Date.now() - queue.lastMatch
      };
    }

    return status;
  }

  public logFullQueueStatus(): void {
    logger.info('📋 === FULL MATCHMAKING QUEUE STATUS ===');
    const status = this.getDetailedQueueStatus();

    for (const [timeControl, queueData] of Object.entries(status)) {
      logger.info(`🎯 Queue: ${timeControl}`);
      logger.info(`   Players: ${queueData.playerCount}`);

      if (queueData.playerCount > 0) {
        queueData.players.forEach((player: any, index: number) => {
          logger.info(`   ${index + 1}. ${player.username} (${player.rating}) - waiting ${Math.round(player.waitTime / 1000)}s`);
        });
      }

      logger.info(`   Last match: ${Math.round(queueData.queueAge / 1000)}s ago`);
      logger.info('');
    }

    logger.info(`👥 Total players across all queues: ${this.getTotalPlayersInQueues()}`);
    logger.info(`🔗 Event listeners: ${this.getEventListenerCount()}`);
    logger.info('📋 === END QUEUE STATUS ===');
  }
}