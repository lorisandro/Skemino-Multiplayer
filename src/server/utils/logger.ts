import winston from 'winston';
import path from 'path';

// Define log levels with colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan'
};

// Add colors to winston
winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  defaultMeta: {
    service: 'skemino-server',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    }),

    // File transport for errors
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      format: fileFormat
    })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      format: fileFormat
    })
  ]
});

// Create logs directory if it doesn't exist
import * as fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Game-specific logging helper functions
export const gameLogger = {
  gameStart: (gameId: string, players: { white: string; black: string }) => {
    logger.info(`🎮 Game Started: ${gameId}`, {
      event: 'game_start',
      gameId,
      whitePlayer: players.white,
      blackPlayer: players.black
    });
  },

  gameMove: (gameId: string, player: string, move: string, timeMs: number) => {
    logger.info(`📝 Move: ${move} by ${player} (${timeMs}ms)`, {
      event: 'game_move',
      gameId,
      player,
      move,
      thinkTime: timeMs
    });
  },

  gameEnd: (gameId: string, result: string, duration: number) => {
    logger.info(`🏁 Game Ended: ${gameId} - ${result} (${duration}s)`, {
      event: 'game_end',
      gameId,
      result,
      duration
    });
  },

  playerConnect: (playerId: string, username: string) => {
    logger.info(`🔌 Player Connected: ${username}`, {
      event: 'player_connect',
      playerId,
      username
    });
  },

  playerDisconnect: (playerId: string, username: string, reason: string) => {
    logger.info(`🔌 Player Disconnected: ${username} - ${reason}`, {
      event: 'player_disconnect',
      playerId,
      username,
      reason
    });
  },

  matchmaking: (event: string, data: any) => {
    logger.info(`🎯 Matchmaking: ${event}`, {
      event: 'matchmaking',
      action: event,
      ...data
    });
  },

  performance: (metric: string, value: number, unit: string = 'ms') => {
    logger.debug(`⚡ Performance: ${metric} = ${value}${unit}`, {
      event: 'performance',
      metric,
      value,
      unit
    });
  },

  security: (event: string, details: any) => {
    logger.warn(`🛡️ Security: ${event}`, {
      event: 'security',
      action: event,
      ...details
    });
  }
};

// Performance monitoring
export const createPerformanceLogger = (operation: string) => {
  const start = Date.now();
  return {
    end: (additionalData?: any) => {
      const duration = Date.now() - start;
      gameLogger.performance(operation, duration, 'ms');
      if (additionalData) {
        logger.debug(`${operation} completed`, additionalData);
      }
    }
  };
};

// Request logger for Express
export const requestLogger = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, message }) => {
    return `${timestamp} ${message}`;
  })
);

export default logger;