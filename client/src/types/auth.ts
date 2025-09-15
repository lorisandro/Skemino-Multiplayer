// Authentication and user management types for Skèmino

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  countryCode?: string;
  rating: number;
  level: UserLevel;
  isEmailVerified: boolean;
  isOnline: boolean;
  lastActive: Date;
  registrationDate: Date;
  preferences: UserPreferences;
  statistics: UserStatistics;
  achievements: Achievement[];
}

export interface UserLevel {
  name: string;
  tier: 'Principiante' | 'Amatoriale' | 'Esperto' | 'Candidato Maestro' | 'Maestro' | 'Maestro Internazionale' | 'Gran Maestro' | 'Super Gran Maestro';
  ratingRange: {
    min: number;
    max: number;
  };
  color: string;
  icon: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'it' | 'en' | 'es' | 'fr' | 'de';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoAcceptRematch: boolean;
  showRatingChanges: boolean;
  boardTheme: string;
  cardTheme: string;
}

export interface UserStatistics {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  gamesDraw: number;
  averageGameDuration: number;
  longestWinStreak: number;
  currentWinStreak: number;
  favoriteTimeControl: string;
  averageAccuracy: number;
  totalPlayTime: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
  rememberMe: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
  errors?: Record<string, string>;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface SocialAuthProvider {
  id: 'google' | 'discord' | 'facebook' | 'apple' | 'github';
  name: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  enabled: boolean;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    ip: string;
    location?: string;
  };
  createdAt: Date;
  lastActivity: Date;
  isCurrentSession: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  enabled: boolean;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  success: boolean;
  ip: string;
  userAgent: string;
  timestamp: Date;
  failureReason?: 'invalid_credentials' | 'account_locked' | 'too_many_attempts' | 'two_factor_required';
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (request: ResetPasswordRequest) => Promise<AuthResponse>;
  changePassword: (credentials: ChangePasswordCredentials) => Promise<AuthResponse>;
  verifyEmail: (token: string) => Promise<AuthResponse>;
  refreshToken: () => Promise<boolean>;
  socialLogin: (provider: string) => Promise<AuthResponse>;
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>;
}

// OAuth types
export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}

export interface OAuthCallbackParams {
  code: string;
  state?: string;
  error?: string;
  error_description?: string;
}

// Guest user support
export interface GuestUser {
  id: string;
  username: string;
  isGuest: true;
  sessionId: string;
  rating: number;
  createdAt: Date;
}

// Account recovery
export interface AccountRecoveryRequest {
  email?: string;
  username?: string;
  recoveryCode?: string;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string; // hashed
}

// Rate limiting
export interface RateLimitInfo {
  attempts: number;
  maxAttempts: number;
  resetTime: Date;
  blocked: boolean;
}

export default {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AuthContextType,
  SocialAuthProvider,
};