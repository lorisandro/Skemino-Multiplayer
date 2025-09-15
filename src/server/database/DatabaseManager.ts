import * as sqlite3 from 'sqlite3';
import { open, Database as SqliteDatabase } from 'sqlite';
import { logger } from '../utils/logger';
import { Move } from '../../shared/types/GameTypes';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  rating: number;
  level: any;
  gamesPlayed: number;
  gamesWon?: number;
  gamesLost?: number;
  gamesDrawn?: number;
  wins: number;
  losses: number;
  draws: number;
  countryCode?: string;
  isVerified?: boolean;
  preferences?: any;
  statistics?: any;
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
  private static db: SqliteDatabase | null = null;
  private static dbPath: string = path.join(process.cwd(), 'skemino.db');

  public static async initialize(): Promise<void> {
    try {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Open SQLite database with sqlite3 driver
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      // Enable WAL mode for better performance
      await this.db.exec('PRAGMA journal_mode = WAL');
      await this.db.exec('PRAGMA synchronous = NORMAL');
      await this.db.exec('PRAGMA cache_size = 1000000');
      await this.db.exec('PRAGMA temp_store = memory');

      logger.info(`🗄️ SQLite database initialized at: ${this.dbPath}`);

      // Run migrations to create tables
      await this.runMigrations();

      logger.info('✅ Database connected - SISTEMA REALE (NO MOCK DATA!)');

    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private static async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Create users table with all necessary fields
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          rating INTEGER DEFAULT 1200,
          level TEXT DEFAULT 'Principiante',
          games_played INTEGER DEFAULT 0,
          games_won INTEGER DEFAULT 0,
          games_lost INTEGER DEFAULT 0,
          games_drawn INTEGER DEFAULT 0,
          wins INTEGER DEFAULT 0,
          losses INTEGER DEFAULT 0,
          draws INTEGER DEFAULT 0,
          country_code TEXT DEFAULT 'IT',
          is_verified INTEGER DEFAULT 0,
          preferences TEXT DEFAULT '{}',
          statistics TEXT DEFAULT '{}',
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create games table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          white_player_id TEXT NOT NULL,
          black_player_id TEXT NOT NULL,
          result TEXT DEFAULT '*',
          status TEXT DEFAULT 'ongoing',
          start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          end_time DATETIME,
          move_count INTEGER DEFAULT 0,
          psn_notation TEXT,
          time_control TEXT DEFAULT 'standard',
          victory_condition TEXT,
          white_time INTEGER,
          black_time INTEGER,
          FOREIGN KEY (white_player_id) REFERENCES users(id),
          FOREIGN KEY (black_player_id) REFERENCES users(id)
        );
      `);

      // Create moves table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS moves (
          id TEXT PRIMARY KEY,
          game_id TEXT NOT NULL,
          turn_number INTEGER NOT NULL,
          player_id TEXT NOT NULL,
          move_notation TEXT NOT NULL,
          card_played TEXT,
          from_position TEXT,
          to_position TEXT,
          captured_card TEXT,
          is_vertex_control INTEGER DEFAULT 0,
          is_loop_trigger INTEGER DEFAULT 0,
          think_time_ms INTEGER DEFAULT 0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (game_id) REFERENCES games(id),
          FOREIGN KEY (player_id) REFERENCES users(id)
        );
      `);

      // Create rating_history table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS rating_history (
          id TEXT PRIMARY KEY,
          player_id TEXT NOT NULL,
          old_rating INTEGER NOT NULL,
          new_rating INTEGER NOT NULL,
          game_id TEXT NOT NULL,
          k_factor REAL NOT NULL,
          rating_change INTEGER NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (player_id) REFERENCES users(id),
          FOREIGN KEY (game_id) REFERENCES games(id)
        );
      `);

      // Create indexes for performance
      await this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating DESC);
        CREATE INDEX IF NOT EXISTS idx_games_players ON games(white_player_id, black_player_id);
        CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
        CREATE INDEX IF NOT EXISTS idx_moves_game ON moves(game_id, turn_number);
        CREATE INDEX IF NOT EXISTS idx_rating_history_player ON rating_history(player_id, timestamp DESC);
      `);

      logger.info('📊 Database migrations completed successfully');

    } catch (error) {
      logger.error('Migration failed:', error);
      throw error;
    }
  }

  // User management methods
  public static async createUser(userData: {
    username: string;
    email: string;
    passwordHash: string;
    rating?: number;
  }): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const userId = uuidv4();
      const now = new Date().toISOString();

      await this.db.run(
        `INSERT INTO users (
          id, username, email, password_hash, rating,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userData.username,
          userData.email,
          userData.passwordHash,
          userData.rating || 1200,
          now,
          now
        ]
      );

      const user = await this.getUserById(userId);
      logger.info(`✅ New user registered: ${userData.username} (${userId})`);
      return user;

    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        logger.warn(`User already exists: ${userData.email}`);
        return null;
      }
      logger.error('Failed to create user:', error);
      throw error;
    }
  }

  public static async getUserById(userId: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const row = await this.db.get(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (!row) return null;

      return this.mapRowToUser(row);
    } catch (error) {
      logger.error('Failed to get user by ID:', error);
      return null;
    }
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const row = await this.db.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!row) return null;

      return this.mapRowToUser(row);
    } catch (error) {
      logger.error('Failed to get user by email:', error);
      return null;
    }
  }

  public static async getUserByUsername(username: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const row = await this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!row) return null;

      return this.mapRowToUser(row);
    } catch (error) {
      logger.error('Failed to get user by username:', error);
      return null;
    }
  }

  public static async getUserByEmailOrUsername(identifier: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const row = await this.db.get(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [identifier, identifier]
      );

      if (!row) return null;

      return this.mapRowToUser(row);
    } catch (error) {
      logger.error('Failed to get user by email or username:', error);
      return null;
    }
  }

  public static async updateUserLastLogin(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
    } catch (error) {
      logger.error('Failed to update last login:', error);
    }
  }

  public static async updateUserRating(userId: string, newRating: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.run(
        'UPDATE users SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newRating, userId]
      );
    } catch (error) {
      logger.error('Failed to update user rating:', error);
      throw error;
    }
  }

  private static mapRowToUser(row: any): User {
    const level = this.calculateLevel(row.rating);

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      rating: row.rating,
      level: level,
      gamesPlayed: row.games_played,
      gamesWon: row.games_won,
      gamesLost: row.games_lost,
      gamesDrawn: row.games_drawn,
      wins: row.wins || row.games_won,
      losses: row.losses || row.games_lost,
      draws: row.draws || row.games_drawn,
      countryCode: row.country_code,
      isVerified: Boolean(row.is_verified),
      preferences: JSON.parse(row.preferences || '{}'),
      statistics: JSON.parse(row.statistics || '{}'),
      lastLogin: row.last_login ? new Date(row.last_login) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private static calculateLevel(rating: number): any {
    const levels = [
      { min: 2700, max: 9999, name: 'Super Gran Maestro', tier: 'Super Gran Maestro', color: '#FF00FF', icon: '💎' },
      { min: 2500, max: 2699, name: 'Gran Maestro Internazionale', tier: 'Gran Maestro Internazionale', color: '#FFD700', icon: '👑' },
      { min: 2300, max: 2499, name: 'Gran Maestro', tier: 'Gran Maestro', color: '#FF6B35', icon: '🏆' },
      { min: 2100, max: 2299, name: 'Maestro Internazionale', tier: 'Maestro Internazionale', color: '#8B4513', icon: '🎯' },
      { min: 1900, max: 2099, name: 'Maestro', tier: 'Maestro', color: '#CD853F', icon: '⚔️' },
      { min: 1700, max: 1899, name: 'Esperto', tier: 'Esperto', color: '#9370DB', icon: '🛡️' },
      { min: 1500, max: 1699, name: 'Avanzato', tier: 'Avanzato', color: '#4169E1', icon: '⚡' },
      { min: 1400, max: 1499, name: 'Intermedio Alto', tier: 'Intermedio Alto', color: '#1E90FF', icon: '🔥' },
      { min: 1300, max: 1399, name: 'Intermedio', tier: 'Intermedio', color: '#00CED1', icon: '💪' },
      { min: 1200, max: 1299, name: 'Apprendista', tier: 'Apprendista', color: '#20B2AA', icon: '📚' },
      { min: 1000, max: 1199, name: 'Principiante', tier: 'Principiante', color: '#10B981', icon: '🌱' }
    ];

    const level = levels.find(l => rating >= l.min && rating <= l.max) || levels[levels.length - 1];
    return {
      name: level.name,
      tier: level.tier,
      ratingRange: { min: level.min, max: level.max },
      color: level.color,
      icon: level.icon
    };
  }

  // NO MOCK USERS - Completamente rimosso
  public static getAllMockUsers(): User[] {
    return []; // Nessun utente mock!
  }

  public static async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      logger.info('Database connection closed');
    }
  }
}