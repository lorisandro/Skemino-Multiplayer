import Redis from "ioredis";
import { logger } from "../utils/logger";
import { GameState } from "../../shared/types/GameTypes";

export interface GameCacheData extends GameState {
  playerTimes: {
    white: number;
    black: number;
    lastMoveTime: number;
  };
  disconnectedPlayers: string[];
}

export interface MatchmakingQueueData {
  timeControl: string;
  players: any[];
  lastMatch: number;
  updatedAt: number;
}

export interface PlayerSessionData {
  userId: string;
  username: string;
  rating: number;
  status: "offline" | "online" | "ingame" | "disconnected";
  gameRoomId?: string;
  lastActivity: number;
}

export class RedisManager {
  private static client: Redis | null = null;
  private static readonly DEFAULT_TTL = 3600; // 1 hour
  private static readonly GAME_TTL = 86400; // 24 hours
  private static readonly SESSION_TTL = 7200; // 2 hours

  // Redis key prefixes
  private static readonly KEYS = {
    GAME: "game:",
    MATCHMAKING: "matchmaking:",
    SESSION: "session:",
    PLAYER_STATS: "stats:",
    LEADERBOARD: "leaderboard:",
    ACTIVE_GAMES: "active_games",
    ONLINE_PLAYERS: "online_players",
  };

  public static async initialize(): Promise<void> {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || "0"),
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectionName: "skemino-server",
      };

      this.client = new Redis(redisConfig);

      // Event handlers
      this.client.on("connect", () => {
        logger.info("🔴 Redis connected successfully");
      });

      this.client.on("error", (error) => {
        logger.error("❌ Redis connection error:", error);
      });

      this.client.on("close", () => {
        logger.warn("🔴 Redis connection closed");
      });

      this.client.on("reconnecting", () => {
        logger.info("🔄 Redis reconnecting...");
      });

      // Test connection
      await this.client.ping();
      logger.info("🔴 Redis initialized and ready");
    } catch (error) {
      logger.error("Failed to initialize Redis:", error);
      throw error;
    }
  }

  public static async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      logger.info("🔴 Redis connection closed");
    }
  }

  private static ensureConnection(): void {
    if (!this.client) {
      throw new Error(
        "Redis client not initialized. Call RedisManager.initialize() first.",
      );
    }
  }

  // Game state management
  public static async setGame(
    gameId: string,
    gameData: GameCacheData,
  ): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.GAME + gameId;
      const serialized = JSON.stringify({
        ...gameData,
        // Convert Date objects to ISO strings for JSON serialization
        startTime: gameData.startTime.toISOString(),
        endTime: gameData.endTime?.toISOString(),
        moveHistory: gameData.moveHistory.map((move) => ({
          ...move,
          timestamp: move.timestamp.toISOString(),
        })),
      });

      await this.client!.setex(key, this.GAME_TTL, serialized);

      // Add to active games set
      await this.client!.sadd(this.KEYS.ACTIVE_GAMES, gameId);

      logger.debug(`Game ${gameId} cached in Redis`);
    } catch (error) {
      logger.error(`Error caching game ${gameId}:`, error);
      throw error;
    }
  }

  public static async getGame(gameId: string): Promise<GameCacheData | null> {
    this.ensureConnection();
    try {
      const key = this.KEYS.GAME + gameId;
      const data = await this.client!.get(key);

      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);

      // Convert ISO strings back to Date objects
      return {
        ...parsed,
        startTime: new Date(parsed.startTime),
        endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
        moveHistory: parsed.moveHistory.map((move: any) => ({
          ...move,
          timestamp: new Date(move.timestamp),
        })),
      };
    } catch (error) {
      logger.error(`Error retrieving game ${gameId} from Redis:`, error);
      return null;
    }
  }

  public static async deleteGame(gameId: string): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.GAME + gameId;
      await this.client!.del(key);
      await this.client!.srem(this.KEYS.ACTIVE_GAMES, gameId);

      logger.debug(`Game ${gameId} removed from Redis cache`);
    } catch (error) {
      logger.error(`Error deleting game ${gameId} from Redis:`, error);
    }
  }

  public static async getActiveGames(): Promise<string[]> {
    this.ensureConnection();
    try {
      return await this.client!.smembers(this.KEYS.ACTIVE_GAMES);
    } catch (error) {
      logger.error("Error retrieving active games:", error);
      return [];
    }
  }

  // Matchmaking queue management
  public static async setMatchmakingQueue(
    timeControl: string,
    queueData: MatchmakingQueueData,
  ): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.MATCHMAKING + timeControl;
      const serialized = JSON.stringify(queueData);
      await this.client!.setex(key, this.DEFAULT_TTL, serialized);

      logger.debug(`Matchmaking queue ${timeControl} updated in Redis`);
    } catch (error) {
      logger.error(`Error updating matchmaking queue ${timeControl}:`, error);
      throw error;
    }
  }

  public static async getMatchmakingQueue(
    timeControl: string,
  ): Promise<MatchmakingQueueData | null> {
    this.ensureConnection();
    try {
      const key = this.KEYS.MATCHMAKING + timeControl;
      const data = await this.client!.get(key);

      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Error retrieving matchmaking queue ${timeControl}:`, error);
      return null;
    }
  }

  public static async deleteMatchmakingQueue(
    timeControl: string,
  ): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.MATCHMAKING + timeControl;
      await this.client!.del(key);
    } catch (error) {
      logger.error(`Error deleting matchmaking queue ${timeControl}:`, error);
    }
  }

  // Player session management
  public static async setPlayerSession(
    userId: string,
    sessionData: PlayerSessionData,
  ): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.SESSION + userId;
      const serialized = JSON.stringify(sessionData);
      await this.client!.setex(key, this.SESSION_TTL, serialized);

      // Add to online players set
      if (sessionData.status === "online" || sessionData.status === "ingame") {
        await this.client!.sadd(this.KEYS.ONLINE_PLAYERS, userId);
      } else {
        await this.client!.srem(this.KEYS.ONLINE_PLAYERS, userId);
      }
    } catch (error) {
      logger.error(`Error setting player session ${userId}:`, error);
      throw error;
    }
  }

  public static async getPlayerSession(
    userId: string,
  ): Promise<PlayerSessionData | null> {
    this.ensureConnection();
    try {
      const key = this.KEYS.SESSION + userId;
      const data = await this.client!.get(key);

      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Error retrieving player session ${userId}:`, error);
      return null;
    }
  }

  public static async deletePlayerSession(userId: string): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.SESSION + userId;
      await this.client!.del(key);
      await this.client!.srem(this.KEYS.ONLINE_PLAYERS, userId);
    } catch (error) {
      logger.error(`Error deleting player session ${userId}:`, error);
    }
  }

  public static async getOnlinePlayers(): Promise<string[]> {
    this.ensureConnection();
    try {
      return await this.client!.smembers(this.KEYS.ONLINE_PLAYERS);
    } catch (error) {
      logger.error("Error retrieving online players:", error);
      return [];
    }
  }

  public static async getOnlinePlayerCount(): Promise<number> {
    this.ensureConnection();
    try {
      return await this.client!.scard(this.KEYS.ONLINE_PLAYERS);
    } catch (error) {
      logger.error("Error retrieving online player count:", error);
      return 0;
    }
  }

  // Leaderboard management
  public static async updateLeaderboard(
    userId: string,
    rating: number,
    timeControl: string = "overall",
  ): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.LEADERBOARD + timeControl;
      await this.client!.zadd(key, rating, userId);

      // Set TTL for leaderboard refresh
      await this.client!.expire(key, 3600); // 1 hour
    } catch (error) {
      logger.error(`Error updating leaderboard for ${userId}:`, error);
    }
  }

  public static async getLeaderboard(
    timeControl: string = "overall",
    limit: number = 100,
  ): Promise<Array<{ userId: string; rating: number }>> {
    this.ensureConnection();
    try {
      const key = this.KEYS.LEADERBOARD + timeControl;
      const results = await this.client!.zrevrange(
        key,
        0,
        limit - 1,
        "WITHSCORES",
      );

      const leaderboard: Array<{ userId: string; rating: number }> = [];
      for (let i = 0; i < results.length; i += 2) {
        leaderboard.push({
          userId: results[i],
          rating: parseInt(results[i + 1]),
        });
      }

      return leaderboard;
    } catch (error) {
      logger.error(`Error retrieving leaderboard ${timeControl}:`, error);
      return [];
    }
  }

  public static async getPlayerRank(
    userId: string,
    timeControl: string = "overall",
  ): Promise<number | null> {
    this.ensureConnection();
    try {
      const key = this.KEYS.LEADERBOARD + timeControl;
      const rank = await this.client!.zrevrank(key, userId);

      return rank !== null ? rank + 1 : null; // Convert to 1-based ranking
    } catch (error) {
      logger.error(`Error retrieving player rank for ${userId}:`, error);
      return null;
    }
  }

  // Player statistics caching
  public static async setPlayerStats(
    userId: string,
    stats: any,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<void> {
    this.ensureConnection();
    try {
      const key = this.KEYS.PLAYER_STATS + userId;
      const serialized = JSON.stringify({
        ...stats,
        updatedAt: Date.now(),
      });
      await this.client!.setex(key, ttl, serialized);
    } catch (error) {
      logger.error(`Error caching player stats ${userId}:`, error);
    }
  }

  public static async getPlayerStats(userId: string): Promise<any | null> {
    this.ensureConnection();
    try {
      const key = this.KEYS.PLAYER_STATS + userId;
      const data = await this.client!.get(key);

      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Error retrieving player stats ${userId}:`, error);
      return null;
    }
  }

  // Atomic operations and locks
  public static async acquireLock(
    lockKey: string,
    ttl: number = 30,
  ): Promise<boolean> {
    this.ensureConnection();
    try {
      const result = await this.client!.set(
        `lock:${lockKey}`,
        "1",
        "EX",
        ttl,
        "NX",
      );
      return result === "OK";
    } catch (error) {
      logger.error(`Error acquiring lock ${lockKey}:`, error);
      return false;
    }
  }

  public static async releaseLock(lockKey: string): Promise<void> {
    this.ensureConnection();
    try {
      await this.client!.del(`lock:${lockKey}`);
    } catch (error) {
      logger.error(`Error releasing lock ${lockKey}:`, error);
    }
  }

  // Batch operations for performance
  public static async pipeline(): Promise<any> {
    this.ensureConnection();
    return this.client!.pipeline();
  }

  public static async executePipeline(pipeline: any): Promise<any> {
    try {
      return await pipeline.exec();
    } catch (error) {
      logger.error("Error executing Redis pipeline:", error);
      throw error;
    }
  }

  // Health check and monitoring
  public static async healthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    latency: number;
    memory: any;
    connections: number;
  }> {
    this.ensureConnection();
    try {
      const start = Date.now();
      await this.client!.ping();
      const latency = Date.now() - start;

      const info = await this.client!.info("memory");
      const memoryInfo = this.parseRedisInfo(info);

      const connections = await this.client!.client("LIST");

      return {
        status: "healthy",
        latency,
        memory: memoryInfo,
        connections:
          typeof connections === "string"
            ? connections.split("\n").length - 1
            : 0,
      };
    } catch (error) {
      logger.error("Redis health check failed:", error);
      return {
        status: "unhealthy",
        latency: -1,
        memory: {},
        connections: 0,
      };
    }
  }

  private static parseRedisInfo(info: string): any {
    const parsed: any = {};
    info.split("\n").forEach((line) => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        parsed[key] = value.replace("\r", "");
      }
    });
    return parsed;
  }

  // Cleanup and maintenance
  public static async cleanup(): Promise<void> {
    this.ensureConnection();
    try {
      // Clean up expired sessions
      const onlinePlayers = await this.getOnlinePlayers();
      for (const userId of onlinePlayers) {
        const session = await this.getPlayerSession(userId);
        if (
          !session ||
          Date.now() - session.lastActivity > this.SESSION_TTL * 1000
        ) {
          await this.deletePlayerSession(userId);
        }
      }

      // Clean up finished games
      const activeGames = await this.getActiveGames();
      for (const gameId of activeGames) {
        const game = await this.getGame(gameId);
        if (!game || game.status === "completed" || game.status === "aborted") {
          await this.deleteGame(gameId);
        }
      }

      logger.info("🧹 Redis cleanup completed");
    } catch (error) {
      logger.error("Error during Redis cleanup:", error);
    }
  }

  // Pub/Sub for real-time notifications
  public static async publish(channel: string, message: any): Promise<void> {
    this.ensureConnection();
    try {
      const serialized =
        typeof message === "string" ? message : JSON.stringify(message);
      await this.client!.publish(channel, serialized);
    } catch (error) {
      logger.error(`Error publishing to channel ${channel}:`, error);
    }
  }

  public static async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    this.ensureConnection();
    try {
      const subscriber = this.client!.duplicate();
      await subscriber.subscribe(channel);
      subscriber.on("message", (receivedChannel, message) => {
        if (receivedChannel === channel) {
          callback(message);
        }
      });
    } catch (error) {
      logger.error(`Error subscribing to channel ${channel}:`, error);
    }
  }
}
