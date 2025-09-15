import type { User } from '../types/auth';
import bcrypt from 'bcryptjs';

// Per simulare hash delle password in modo realistico
// In produzione questi sarebbero nel database con hash reali
export interface StoredUser extends User {
  passwordHash: string;
}

// Password: Demo1234! per tutti gli utenti demo
const DEFAULT_PASSWORD_HASH = '$2a$10$X4kv7j5ZcQr6Bh6Ld80FMuKGKdR.a6BhfR4kKr2ZvLrQWQ4kKr2Zv';

// Database simulato di utenti registrati
export const MOCK_USERS: Record<string, StoredUser> = {
  'mario.rossi@example.com': {
    id: 'user_001',
    username: 'mariorossi',
    email: 'mario.rossi@example.com',
    displayName: 'Mario Rossi',
    passwordHash: DEFAULT_PASSWORD_HASH,
    rating: 1650,
    level: {
      name: 'Esperto',
      tier: 'Esperto',
      ratingRange: { min: 1600, max: 1799 },
      color: '#8B5CF6',
      icon: '⚔️'
    },
    isEmailVerified: true,
    isOnline: false,
    lastActive: new Date('2025-01-14T10:30:00'),
    registrationDate: new Date('2024-03-15'),
    preferences: {
      theme: 'dark',
      language: 'it',
      soundEnabled: true,
      notificationsEnabled: true,
      autoAcceptRematch: false,
      showRatingChanges: true,
      boardTheme: 'dark',
      cardTheme: 'classic'
    },
    statistics: {
      totalGames: 342,
      gamesWon: 198,
      gamesLost: 130,
      gamesDraw: 14,
      averageGameDuration: 420,
      longestWinStreak: 12,
      currentWinStreak: 3,
      favoriteTimeControl: 'Rapid (10+5)',
      averageAccuracy: 82.5,
      totalPlayTime: 143640
    },
    achievements: [
      { id: 'first_win', name: 'Prima Vittoria', icon: '🏆', unlockedAt: new Date('2024-03-16') },
      { id: 'streak_10', name: 'Serie di 10', icon: '🔥', unlockedAt: new Date('2024-07-22') },
      { id: 'expert_level', name: 'Livello Esperto', icon: '⚔️', unlockedAt: new Date('2024-11-01') }
    ]
  },
  'giulia.bianchi@example.com': {
    id: 'user_002',
    username: 'giuliab',
    email: 'giulia.bianchi@example.com',
    displayName: 'Giulia Bianchi',
    passwordHash: DEFAULT_PASSWORD_HASH,
    rating: 2150,
    level: {
      name: 'Maestro',
      tier: 'Maestro',
      ratingRange: { min: 2000, max: 2199 },
      color: '#DC2626',
      icon: '👑'
    },
    isEmailVerified: true,
    isOnline: false,
    lastActive: new Date('2025-01-14T09:15:00'),
    registrationDate: new Date('2023-11-20'),
    preferences: {
      theme: 'dark',
      language: 'it',
      soundEnabled: true,
      notificationsEnabled: true,
      autoAcceptRematch: true,
      showRatingChanges: true,
      boardTheme: 'dark',
      cardTheme: 'modern'
    },
    statistics: {
      totalGames: 856,
      gamesWon: 512,
      gamesLost: 298,
      gamesDraw: 46,
      averageGameDuration: 360,
      longestWinStreak: 23,
      currentWinStreak: 7,
      favoriteTimeControl: 'Blitz (5+3)',
      averageAccuracy: 88.2,
      totalPlayTime: 308160
    },
    achievements: [
      { id: 'first_win', name: 'Prima Vittoria', icon: '🏆', unlockedAt: new Date('2023-11-21') },
      { id: 'streak_10', name: 'Serie di 10', icon: '🔥', unlockedAt: new Date('2023-12-05') },
      { id: 'streak_20', name: 'Serie di 20', icon: '🔥🔥', unlockedAt: new Date('2024-02-18') },
      { id: 'expert_level', name: 'Livello Esperto', icon: '⚔️', unlockedAt: new Date('2024-01-10') },
      { id: 'master_level', name: 'Livello Maestro', icon: '👑', unlockedAt: new Date('2024-09-30') },
      { id: 'tournament_winner', name: 'Vincitore Torneo', icon: '🥇', unlockedAt: new Date('2024-10-15') }
    ]
  },
  'luca.verdi@example.com': {
    id: 'user_003',
    username: 'lucaverdi',
    email: 'luca.verdi@example.com',
    displayName: 'Luca Verdi',
    passwordHash: DEFAULT_PASSWORD_HASH,
    rating: 1250,
    level: {
      name: 'Amatoriale',
      tier: 'Amatoriale',
      ratingRange: { min: 1200, max: 1399 },
      color: '#3B82F6',
      icon: '🔰'
    },
    isEmailVerified: true,
    isOnline: false,
    lastActive: new Date('2025-01-13T22:45:00'),
    registrationDate: new Date('2024-08-10'),
    preferences: {
      theme: 'dark',
      language: 'it',
      soundEnabled: true,
      notificationsEnabled: false,
      autoAcceptRematch: false,
      showRatingChanges: true,
      boardTheme: 'light',
      cardTheme: 'classic'
    },
    statistics: {
      totalGames: 87,
      gamesWon: 42,
      gamesLost: 40,
      gamesDraw: 5,
      averageGameDuration: 480,
      longestWinStreak: 5,
      currentWinStreak: 0,
      favoriteTimeControl: 'Casual',
      averageAccuracy: 71.3,
      totalPlayTime: 41760
    },
    achievements: [
      { id: 'first_win', name: 'Prima Vittoria', icon: '🏆', unlockedAt: new Date('2024-08-11') },
      { id: 'amateur_level', name: 'Livello Amatoriale', icon: '🔰', unlockedAt: new Date('2024-09-15') }
    ]
  },
  'demo@skemino.com': {
    id: 'user_demo',
    username: 'demo_player',
    email: 'demo@skemino.com',
    displayName: 'Demo Player',
    passwordHash: DEFAULT_PASSWORD_HASH,
    rating: 1400,
    level: {
      name: 'Intermedio',
      tier: 'Intermedio',
      ratingRange: { min: 1400, max: 1599 },
      color: '#F59E0B',
      icon: '🎯'
    },
    isEmailVerified: true,
    isOnline: false,
    lastActive: new Date(),
    registrationDate: new Date('2024-01-01'),
    preferences: {
      theme: 'dark',
      language: 'it',
      soundEnabled: true,
      notificationsEnabled: true,
      autoAcceptRematch: false,
      showRatingChanges: true,
      boardTheme: 'dark',
      cardTheme: 'classic'
    },
    statistics: {
      totalGames: 150,
      gamesWon: 78,
      gamesLost: 65,
      gamesDraw: 7,
      averageGameDuration: 400,
      longestWinStreak: 8,
      currentWinStreak: 2,
      favoriteTimeControl: 'Rapid (10+5)',
      averageAccuracy: 76.8,
      totalPlayTime: 60000
    },
    achievements: [
      { id: 'first_win', name: 'Prima Vittoria', icon: '🏆', unlockedAt: new Date('2024-01-02') },
      { id: 'intermediate_level', name: 'Livello Intermedio', icon: '🎯', unlockedAt: new Date('2024-06-10') }
    ]
  },
  'admin@skemino.com': {
    id: 'user_admin',
    username: 'admin',
    email: 'admin@skemino.com',
    displayName: 'Administrator',
    passwordHash: DEFAULT_PASSWORD_HASH,
    rating: 2700,
    level: {
      name: 'Super Gran Maestro',
      tier: 'Super Gran Maestro',
      ratingRange: { min: 2700, max: 9999 },
      color: '#FFD700',
      icon: '🏆🏆🏆'
    },
    isEmailVerified: true,
    isOnline: false,
    lastActive: new Date(),
    registrationDate: new Date('2023-01-01'),
    preferences: {
      theme: 'dark',
      language: 'it',
      soundEnabled: true,
      notificationsEnabled: true,
      autoAcceptRematch: false,
      showRatingChanges: true,
      boardTheme: 'dark',
      cardTheme: 'classic'
    },
    statistics: {
      totalGames: 1500,
      gamesWon: 1200,
      gamesLost: 250,
      gamesDraw: 50,
      averageGameDuration: 300,
      longestWinStreak: 50,
      currentWinStreak: 15,
      favoriteTimeControl: 'Blitz (3+0)',
      averageAccuracy: 95.5,
      totalPlayTime: 450000
    },
    achievements: [
      { id: 'first_win', name: 'Prima Vittoria', icon: '🏆', unlockedAt: new Date('2023-01-01') },
      { id: 'streak_50', name: 'Serie di 50', icon: '🔥🔥🔥', unlockedAt: new Date('2023-03-15') },
      { id: 'grandmaster', name: 'Super Gran Maestro', icon: '🏆🏆🏆', unlockedAt: new Date('2023-06-01') },
      { id: 'legend', name: 'Leggenda', icon: '⭐⭐⭐', unlockedAt: new Date('2023-12-01') }
    ]
  }
};

// Funzione per validare le credenziali
export const validateCredentials = (identifier: string, password: string): StoredUser | null => {
  // Cerca per email o username
  const user = Object.values(MOCK_USERS).find(
    u => u.email === identifier || u.username === identifier
  );

  if (!user) {
    return null;
  }

  // In un'app reale useresti bcrypt.compare per verificare l'hash
  // Per questa demo, accettiamo solo la password "Demo1234!"
  if (password !== 'Demo1234!') {
    return null;
  }

  return user;
};

// Funzione per verificare se un'email è già registrata
export const isEmailRegistered = (email: string): boolean => {
  return email in MOCK_USERS;
};

// Funzione per verificare se un username è già in uso
export const isUsernameInUse = (username: string): boolean => {
  return Object.values(MOCK_USERS).some(u => u.username === username);
};

// Funzione per registrare un nuovo utente
export const registerNewUser = (
  email: string,
  username: string,
  password: string,
  displayName?: string
): StoredUser => {
  if (isEmailRegistered(email)) {
    throw new Error('Email già registrata');
  }

  if (isUsernameInUse(username)) {
    throw new Error('Username già in uso');
  }

  const newUser: StoredUser = {
    id: `user_${Date.now()}`,
    username,
    email,
    displayName: displayName || username,
    passwordHash: DEFAULT_PASSWORD_HASH, // In produzione useresti bcrypt.hash
    rating: 1000,
    level: {
      name: 'Principiante',
      tier: 'Principiante',
      ratingRange: { min: 1000, max: 1199 },
      color: '#10B981',
      icon: '🌱'
    },
    isEmailVerified: false,
    isOnline: true,
    lastActive: new Date(),
    registrationDate: new Date(),
    preferences: {
      theme: 'dark',
      language: 'it',
      soundEnabled: true,
      notificationsEnabled: true,
      autoAcceptRematch: false,
      showRatingChanges: true,
      boardTheme: 'dark',
      cardTheme: 'classic'
    },
    statistics: {
      totalGames: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDraw: 0,
      averageGameDuration: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      favoriteTimeControl: 'Rapid (10+5)',
      averageAccuracy: 0,
      totalPlayTime: 0
    },
    achievements: []
  };

  // Aggiungi al "database"
  MOCK_USERS[email] = newUser;

  return newUser;
};