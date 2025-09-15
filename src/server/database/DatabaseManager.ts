import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';
import { Move } from '../../shared/types/GameTypes';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  rating: number;
  level: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameRecord {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  status: string;
  startTime: Date;
  endTime: Date;
  moveCount: number;
  psnNotation: string;
  timeControl: string;
  victoryCondition?: string;
  whiteTime?: number;
  blackTime?: number;
}

export interface MoveRecord {
  id: string;
  gameId: string;
  turnNumber: number;
  playerId: string;
  moveNotation: string;
  cardPlayed: string;
  fromPosition?: string;
  toPosition: string;
  capturedCard?: string;
  isVertexControl: boolean;
  isLoopTrigger: boolean;
  thinkTimeMs: number;
  timestamp: Date;
}

export interface RatingHistory {
  id: string;
  playerId: string;
  oldRating: number;
  newRating: number;
  gameId: string;
  kFactor: number;
  ratingChange: number;
  timestamp: Date;
}

export class DatabaseManager {
  private static pool: Pool | null = null;
  private static mockMode = process.env.DB_MOCK === 'true' || !process.env.DB_HOST;
  private static mockUsers = new Map<string, User>();

  public static async initialize(): Promise<void> {
    try {
      if (this.mockMode) {
        logger.info('🗄️ Database running in MOCK mode (no real database needed)');
        this.initializeMockData();
        return;
      }

      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'skemino',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        application_name: 'skemino-server',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      };

      this.pool = new Pool(config);

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      logger.info('🗄️ Database connected successfully');

      // Run migrations on startup (simplified)
      await this.runMigrations();

    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info('🗄️ Database connection closed');
    }
  }

  private static ensureConnection(): void {
    if (this.mockMode) {
      return; // Mock mode doesn't need pool connection
    }
    if (!this.pool) {
      throw new Error('Database not initialized. Call DatabaseManager.initialize() first.');
    }
  }

  private static async runMigrations(): Promise<void> {
    try {
      const client = await this.getClient();

      // Create tables if they don't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          rating INTEGER DEFAULT 1200,
          level INTEGER DEFAULT 1,
          games_played INTEGER DEFAULT 0,
          wins INTEGER DEFAULT 0,
          losses INTEGER DEFAULT 0,
          draws INTEGER DEFAULT 0,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS games (
          id UUID PRIMARY KEY,
          white_player_id UUID REFERENCES users(id),
          black_player_id UUID REFERENCES users(id),
          result VARCHAR(10) DEFAULT '*',
          status VARCHAR(20) DEFAULT 'active',
          start_time TIMESTAMP DEFAULT NOW(),
          end_time TIMESTAMP,
          move_count INTEGER DEFAULT 0,
          psn_notation TEXT,
          time_control VARCHAR(20) DEFAULT 'rapid',
          victory_condition VARCHAR(10),
          white_time INTEGER,
          black_time INTEGER,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS moves (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          game_id UUID REFERENCES games(id),
          turn_number INTEGER NOT NULL,
          player_id UUID REFERENCES users(id),
          move_notation VARCHAR(20) NOT NULL,
          card_played VARCHAR(10) NOT NULL,
          from_position VARCHAR(2),
          to_position VARCHAR(2) NOT NULL,
          captured_card VARCHAR(10),
          is_vertex_control BOOLEAN DEFAULT FALSE,
          is_loop_trigger BOOLEAN DEFAULT FALSE,
          think_time_ms INTEGER DEFAULT 0,
          timestamp TIMESTAMP DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS rating_history (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          player_id UUID REFERENCES users(id),
          old_rating INTEGER NOT NULL,
          new_rating INTEGER NOT NULL,
          game_id UUID REFERENCES games(id),
          k_factor INTEGER NOT NULL,
          rating_change INTEGER NOT NULL,
          timestamp TIMESTAMP DEFAULT NOW()
        );
      `);

      // Create indexes for performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_games_players ON games(white_player_id, black_player_id);
        CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
        CREATE INDEX IF NOT EXISTS idx_moves_game ON moves(game_id, turn_number);
        CREATE INDEX IF NOT EXISTS idx_rating_history_player ON rating_history(player_id, timestamp);
        CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating DESC);
      `);

      client.release();
      logger.info('📋 Database migrations completed');

    } catch (error) {
      logger.error('Error running migrations:', error);
      throw error;
    }
  }

  public static async getClient(): Promise<PoolClient> {
    this.ensureConnection();
    return await this.pool!.connect();
  }

  // User management
  public static async getUserById(userId: string): Promise<User | null> {
    try {
      const client = await this.getClient();
      const result = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      client.release();

      return result.rows.length > 0 ? this.mapUserRow(result.rows[0]) : null;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      return null;
    }
  }

  public static async getUserByUsername(username: string): Promise<User | null> {
    try {
      if (this.mockMode) {
        const user = Array.from(this.mockUsers.values()).find(u => u.username === username);
        return user || null;
      }

      const client = await this.getClient();
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      client.release();

      return result.rows.length > 0 ? this.mapUserRow(result.rows[0]) : null;
    } catch (error) {
      logger.error('Error getting user by username:', error);
      return null;
    }
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (this.mockMode) {
        const user = Array.from(this.mockUsers.values()).find(u => u.email === email);
        return user || null;
      }

      const client = await this.getClient();
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      client.release();

      return result.rows.length > 0 ? this.mapUserRow(result.rows[0]) : null;
    } catch (error) {
      logger.error('Error getting user by email:', error);
      return null;
    }
  }

  public static async createUser(userData: {
    username: string;
    email: string;
    passwordHash: string;
    rating?: number;
  }): Promise<User | null> {
    try {
      if (this.mockMode) {
        const user: User = {
          id: `user_${Date.now()}`,
          username: userData.username,
          email: userData.email,
          passwordHash: userData.passwordHash,
          rating: userData.rating || 1200,
          level: 1,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockUsers.set(user.id, user);
        return user;
      }

      const client = await this.getClient();
      const result = await client.query(`
        INSERT INTO users (username, email, password_hash, rating, level, games_played, wins, losses, draws)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        userData.username,
        userData.email,
        userData.passwordHash,
        userData.rating || 1200,
        1, // Initial level
        0, 0, 0, 0 // Initial stats
      ]);
      client.release();

      return result.rows.length > 0 ? this.mapUserRow(result.rows[0]) : null;
    } catch (error) {
      logger.error('Error creating user:', error);
      return null;
    }
  }

  public static async updateUserLastLogin(userId: string): Promise<void> {
    try {
      if (this.mockMode) {
        const user = this.mockUsers.get(userId);
        if (user) {
          user.lastLogin = new Date();
          user.updatedAt = new Date();
        }
        return;
      }

      const client = await this.getClient();
      await client.query(
        'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
        [userId]
      );
      client.release();
    } catch (error) {
      logger.error('Error updating user last login:', error);
      throw error;
    }
  }

  public static async updatePlayerRating(playerId: string, newRating: number): Promise<void> {
    try {
      const client = await this.getClient();
      await client.query(
        'UPDATE users SET rating = $1, updated_at = NOW() WHERE id = $2',
        [newRating, playerId]
      );
      client.release();

      logger.debug(`Player ${playerId} rating updated to ${newRating}`);
    } catch (error) {
      logger.error('Error updating player rating:', error);
      throw error;
    }
  }

  public static async updatePlayerStats(
    playerId: string,
    result: '1-0' | '0-1' | '1/2-1/2'
  ): Promise<void> {
    try {
      const client = await this.getClient();

      let updateField = '';
      switch (result) {
        case '1-0':
          updateField = 'wins = wins + 1';
          break;
        case '0-1':
          updateField = 'losses = losses + 1';
          break;
        case '1/2-1/2':
          updateField = 'draws = draws + 1';
          break;
      }

      await client.query(
        `UPDATE users SET games_played = games_played + 1, ${updateField}, updated_at = NOW() WHERE id = $1`,
        [playerId]
      );
      client.release();
    } catch (error) {
      logger.error('Error updating player stats:', error);
      throw error;
    }
  }

  // Game management
  public static async saveGame(gameRecord: GameRecord): Promise<void> {
    try {
      const client = await this.getClient();

      await client.query(`
        INSERT INTO games (
          id, white_player_id, black_player_id, result, status,
          start_time, end_time, move_count, psn_notation, time_control,
          victory_condition, white_time, black_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          result = EXCLUDED.result,
          status = EXCLUDED.status,
          end_time = EXCLUDED.end_time,
          move_count = EXCLUDED.move_count,
          psn_notation = EXCLUDED.psn_notation,
          victory_condition = EXCLUDED.victory_condition,
          white_time = EXCLUDED.white_time,
          black_time = EXCLUDED.black_time
      `, [
        gameRecord.id,
        gameRecord.whitePlayerId,
        gameRecord.blackPlayerId,
        gameRecord.result,
        gameRecord.status,
        gameRecord.startTime,
        gameRecord.endTime,
        gameRecord.moveCount,
        gameRecord.psnNotation,
        gameRecord.timeControl,
        gameRecord.victoryCondition,
        gameRecord.whiteTime,
        gameRecord.blackTime
      ]);

      client.release();

      // Update player statistics
      if (gameRecord.result !== '*') {
        await this.updatePlayerStats(gameRecord.whitePlayerId, gameRecord.result);
        await this.updatePlayerStats(
          gameRecord.blackPlayerId,
          gameRecord.result === '1-0' ? '0-1' : gameRecord.result === '0-1' ? '1-0' : '1/2-1/2'
        );
      }

      logger.debug(`Game ${gameRecord.id} saved to database`);
    } catch (error) {
      logger.error('Error saving game:', error);
      throw error;
    }
  }

  public static async getGame(gameId: string): Promise<GameRecord | null> {
    try {
      const client = await this.getClient();
      const result = await client.query(
        'SELECT * FROM games WHERE id = $1',
        [gameId]
      );
      client.release();

      return result.rows.length > 0 ? this.mapGameRow(result.rows[0]) : null;
    } catch (error) {
      logger.error('Error getting game:', error);
      return null;
    }
  }

  public static async getPlayerGames(
    playerId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<GameRecord[]> {
    try {
      const client = await this.getClient();
      const result = await client.query(`
        SELECT * FROM games
        WHERE white_player_id = $1 OR black_player_id = $1
        ORDER BY start_time DESC
        LIMIT $2 OFFSET $3
      `, [playerId, limit, offset]);
      client.release();

      return result.rows.map(row => this.mapGameRow(row));
    } catch (error) {
      logger.error('Error getting player games:', error);
      return [];
    }
  }

  // Move management
  public static async saveMove(gameId: string, move: Move): Promise<void> {
    try {
      const client = await this.getClient();

      const moveRecord: MoveRecord = {
        id: move.id,
        gameId: gameId,
        turnNumber: move.turnNumber,
        playerId: '', // This should be set from the game context
        moveNotation: move.notation,
        cardPlayed: `${move.card.suit}${move.card.value}`,
        fromPosition: move.fromPosition,
        toPosition: move.toPosition,
        capturedCard: move.capturedCard ? `${move.capturedCard.suit}${move.capturedCard.value}` : undefined,
        isVertexControl: move.isVertexControl,
        isLoopTrigger: move.isLoopTrigger,
        thinkTimeMs: move.thinkTimeMs,
        timestamp: move.timestamp
      };

      await client.query(`
        INSERT INTO moves (
          id, game_id, turn_number, move_notation, card_played,
          from_position, to_position, captured_card, is_vertex_control,
          is_loop_trigger, think_time_ms, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        moveRecord.id,
        moveRecord.gameId,
        moveRecord.turnNumber,
        moveRecord.moveNotation,
        moveRecord.cardPlayed,
        moveRecord.fromPosition,
        moveRecord.toPosition,
        moveRecord.capturedCard,
        moveRecord.isVertexControl,
        moveRecord.isLoopTrigger,
        moveRecord.thinkTimeMs,
        moveRecord.timestamp
      ]);

      client.release();
    } catch (error) {
      logger.error('Error saving move:', error);
      throw error;
    }
  }

  public static async getGameMoves(gameId: string): Promise<MoveRecord[]> {
    try {
      const client = await this.getClient();
      const result = await client.query(
        'SELECT * FROM moves WHERE game_id = $1 ORDER BY turn_number ASC',
        [gameId]
      );
      client.release();

      return result.rows.map(row => this.mapMoveRow(row));
    } catch (error) {
      logger.error('Error getting game moves:', error);
      return [];
    }
  }

  // Rating history
  public static async saveRatingHistory(ratingHistory: Omit<RatingHistory, 'id' | 'timestamp'>): Promise<void> {
    try {
      const client = await this.getClient();

      await client.query(`
        INSERT INTO rating_history (
          player_id, old_rating, new_rating, game_id, k_factor, rating_change
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        ratingHistory.playerId,
        ratingHistory.oldRating,
        ratingHistory.newRating,
        ratingHistory.gameId,
        ratingHistory.kFactor,
        ratingHistory.ratingChange
      ]);

      client.release();
    } catch (error) {
      logger.error('Error saving rating history:', error);
      throw error;
    }
  }

  public static async getPlayerRatingHistory(
    playerId: string,
    limit: number = 100
  ): Promise<RatingHistory[]> {
    try {
      const client = await this.getClient();
      const result = await client.query(`
        SELECT * FROM rating_history
        WHERE player_id = $1
        ORDER BY timestamp DESC
        LIMIT $2
      `, [playerId, limit]);
      client.release();

      return result.rows.map(row => this.mapRatingHistoryRow(row));
    } catch (error) {
      logger.error('Error getting player rating history:', error);
      return [];
    }
  }

  // Leaderboard and statistics
  public static async getLeaderboard(limit: number = 100): Promise<User[]> {
    try {
      const client = await this.getClient();
      const result = await client.query(`
        SELECT * FROM users
        WHERE games_played >= 10
        ORDER BY rating DESC
        LIMIT $1
      `, [limit]);
      client.release();

      return result.rows.map(row => this.mapUserRow(row));
    } catch (error) {
      logger.error('Error getting leaderboard:', error);
      return [];
    }
  }

  public static async getPlayerRank(playerId: string): Promise<number | null> {
    try {
      const client = await this.getClient();
      const result = await client.query(`
        WITH ranked_players AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY rating DESC) as rank
          FROM users
          WHERE games_played >= 10
        )
        SELECT rank FROM ranked_players WHERE id = $1
      `, [playerId]);
      client.release();

      return result.rows.length > 0 ? result.rows[0].rank : null;
    } catch (error) {
      logger.error('Error getting player rank:', error);
      return null;
    }
  }

  // Mapping functions
  private static mapUserRow(row: any): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      rating: row.rating,
      level: row.level,
      gamesPlayed: row.games_played,
      wins: row.wins,
      losses: row.losses,
      draws: row.draws,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private static mapGameRow(row: any): GameRecord {
    return {
      id: row.id,
      whitePlayerId: row.white_player_id,
      blackPlayerId: row.black_player_id,
      result: row.result,
      status: row.status,
      startTime: row.start_time,
      endTime: row.end_time,
      moveCount: row.move_count,
      psnNotation: row.psn_notation,
      timeControl: row.time_control,
      victoryCondition: row.victory_condition,
      whiteTime: row.white_time,
      blackTime: row.black_time
    };
  }

  private static mapMoveRow(row: any): MoveRecord {
    return {
      id: row.id,
      gameId: row.game_id,
      turnNumber: row.turn_number,
      playerId: row.player_id,
      moveNotation: row.move_notation,
      cardPlayed: row.card_played,
      fromPosition: row.from_position,
      toPosition: row.to_position,
      capturedCard: row.captured_card,
      isVertexControl: row.is_vertex_control,
      isLoopTrigger: row.is_loop_trigger,
      thinkTimeMs: row.think_time_ms,
      timestamp: row.timestamp
    };
  }

  private static mapRatingHistoryRow(row: any): RatingHistory {
    return {
      id: row.id,
      playerId: row.player_id,
      oldRating: row.old_rating,
      newRating: row.new_rating,
      gameId: row.game_id,
      kFactor: row.k_factor,
      ratingChange: row.rating_change,
      timestamp: row.timestamp
    };
  }

  // Health check
  public static async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      const client = await this.getClient();
      const result = await client.query('SELECT NOW(), version()');
      client.release();

      return {
        status: 'healthy',
        details: {
          timestamp: result.rows[0].now,
          version: result.rows[0].version,
          poolSize: this.pool?.totalCount || 0,
          idleConnections: this.pool?.idleCount || 0,
          waitingConnections: this.pool?.waitingCount || 0
        }
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // Utility methods
  public static async executeTransaction<T>(
    operation: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();

    try {
      await client.query('BEGIN');
      const result = await operation(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Mock data initialization
  private static initializeMockData(): void {
    // Create demo users for testing
    const demoUser: User = {
      id: 'demo_user_1',
      username: 'demo',
      email: 'demo@skemino.com',
      passwordHash: 'demo123', // In real app this would be hashed
      rating: 1400,
      level: 3,
      gamesPlayed: 25,
      wins: 15,
      losses: 8,
      draws: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    const testUser: User = {
      id: 'test_user_1',
      username: 'test',
      email: 'test@example.com',
      passwordHash: 'test123',
      rating: 1200,
      level: 1,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockUsers.set(demoUser.id, demoUser);
    this.mockUsers.set(testUser.id, testUser);

    logger.info(`✅ Mock database initialized with ${this.mockUsers.size} demo users`);
  }
}