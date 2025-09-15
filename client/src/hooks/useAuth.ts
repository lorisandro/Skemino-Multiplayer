import { useState, useEffect, useCallback } from 'react';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AuthContextType,
  GuestUser
} from '../types/auth';

/**
 * useAuth - Hook per la gestione dell'autenticazione Skèmino
 * Supporta login registrato, login guest e social authentication
 */
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing token
        const token = localStorage.getItem('skemino_auth_token');
        const userData = localStorage.getItem('skemino_user_data');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);

          // Validate token with server (in real app)
          const isValid = await validateToken(token);

          if (isValid) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Token expired, clean up
            localStorage.removeItem('skemino_auth_token');
            localStorage.removeItem('skemino_user_data');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Mock function to validate token (replace with real API call)
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return token.length > 0; // Simplified validation
    } catch {
      return false;
    }
  };

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username: credentials.identifier.includes('@')
          ? credentials.identifier.split('@')[0]
          : credentials.identifier,
        email: credentials.identifier.includes('@')
          ? credentials.identifier
          : `${credentials.identifier}@example.com`,
        displayName: credentials.identifier.includes('@')
          ? credentials.identifier.split('@')[0]
          : credentials.identifier,
        rating: 1200 + Math.floor(Math.random() * 800),
        level: {
          name: 'Amatoriale',
          tier: 'Amatoriale',
          ratingRange: { min: 1200, max: 1399 },
          color: '#3B82F6',
          icon: '🔰'
        },
        isEmailVerified: true,
        isOnline: true,
        lastActive: new Date(),
        registrationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
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
          totalGames: Math.floor(Math.random() * 100),
          gamesWon: Math.floor(Math.random() * 60),
          gamesLost: Math.floor(Math.random() * 40),
          gamesDraw: Math.floor(Math.random() * 10),
          averageGameDuration: 300 + Math.floor(Math.random() * 600),
          longestWinStreak: Math.floor(Math.random() * 15),
          currentWinStreak: Math.floor(Math.random() * 5),
          favoriteTimeControl: 'Rapid (10+5)',
          averageAccuracy: 75 + Math.random() * 20,
          totalPlayTime: Math.floor(Math.random() * 10000)
        },
        achievements: []
      };

      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store auth data
      if (credentials.rememberMe) {
        localStorage.setItem('skemino_auth_token', mockToken);
        localStorage.setItem('skemino_user_data', JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem('skemino_auth_token', mockToken);
        sessionStorage.setItem('skemino_user_data', JSON.stringify(mockUser));
      }

      setUser(mockUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: mockUser,
        token: mockToken,
        message: 'Login effettuato con successo'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Errore durante il login',
        errors: { identifier: 'Credenziali non valide' }
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful registration
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username: credentials.username,
        email: credentials.email,
        displayName: credentials.username,
        rating: 1000, // Starting rating
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

      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store auth data
      localStorage.setItem('skemino_auth_token', mockToken);
      localStorage.setItem('skemino_user_data', JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: mockUser,
        token: mockToken,
        message: 'Registrazione completata con successo'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Errore durante la registrazione',
        errors: { email: 'Email già in uso' }
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Clear storage
      localStorage.removeItem('skemino_auth_token');
      localStorage.removeItem('skemino_user_data');
      sessionStorage.removeItem('skemino_auth_token');
      sessionStorage.removeItem('skemino_user_data');

      // Reset state
      setUser(null);
      setIsAuthenticated(false);

      // Simulate API call to invalidate token
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Social login function
  const socialLogin = useCallback(async (provider: string): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful social login
      const mockUser: User = {
        id: `${provider}_${Date.now()}`,
        username: `${provider}User${Math.floor(Math.random() * 1000)}`,
        email: `user@${provider}.com`,
        displayName: `${provider} User`,
        rating: 1100 + Math.floor(Math.random() * 600),
        level: {
          name: 'Principiante',
          tier: 'Principiante',
          ratingRange: { min: 1000, max: 1199 },
          color: '#10B981',
          icon: '🌱'
        },
        isEmailVerified: true,
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
          totalGames: Math.floor(Math.random() * 50),
          gamesWon: Math.floor(Math.random() * 30),
          gamesLost: Math.floor(Math.random() * 20),
          gamesDraw: Math.floor(Math.random() * 5),
          averageGameDuration: 250 + Math.floor(Math.random() * 400),
          longestWinStreak: Math.floor(Math.random() * 10),
          currentWinStreak: Math.floor(Math.random() * 3),
          favoriteTimeControl: 'Rapid (10+5)',
          averageAccuracy: 70 + Math.random() * 25,
          totalPlayTime: Math.floor(Math.random() * 5000)
        },
        achievements: []
      };

      const mockToken = `${provider}_token_${Date.now()}`;

      // Store auth data
      localStorage.setItem('skemino_auth_token', mockToken);
      localStorage.setItem('skemino_user_data', JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: mockUser,
        token: mockToken,
        message: `Login con ${provider} completato`
      };

    } catch (error) {
      console.error('Social login error:', error);
      return {
        success: false,
        message: `Errore durante il login con ${provider}`
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create guest user
  const loginAsGuest = useCallback(async (): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      const guestUser: User = {
        id: `guest_${Date.now()}`,
        username: `Guest${Math.floor(Math.random() * 10000)}`,
        email: '',
        displayName: `Guest Player`,
        rating: 1000 + Math.floor(Math.random() * 200), // Slightly randomized guest rating
        level: {
          name: 'Ospite',
          tier: 'Principiante',
          ratingRange: { min: 1000, max: 1199 },
          color: '#6B7280',
          icon: '👤'
        },
        isEmailVerified: false,
        isOnline: true,
        lastActive: new Date(),
        registrationDate: new Date(),
        preferences: {
          theme: 'dark',
          language: 'it',
          soundEnabled: true,
          notificationsEnabled: false,
          autoAcceptRematch: false,
          showRatingChanges: false,
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
          favoriteTimeControl: 'Casual',
          averageAccuracy: 0,
          totalPlayTime: 0
        },
        achievements: []
      };

      // Store guest session (session storage only)
      sessionStorage.setItem('skemino_guest_session', JSON.stringify(guestUser));

      setUser(guestUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: guestUser,
        message: 'Sessione ospite creata'
      };

    } catch (error) {
      console.error('Guest login error:', error);
      return {
        success: false,
        message: 'Errore durante la creazione della sessione ospite'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stub functions (implement as needed)
  const resetPassword = useCallback(async (request: any): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Email di reset inviata' };
  }, []);

  const changePassword = useCallback(async (credentials: any): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password cambiata con successo' };
  }, []);

  const verifyEmail = useCallback(async (token: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Email verificata con successo' };
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<AuthResponse> => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('skemino_user_data', JSON.stringify(updatedUser));
    }
    return { success: true, message: 'Profilo aggiornato' };
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    changePassword,
    verifyEmail,
    refreshToken,
    socialLogin,
    updateProfile,
    // Extended methods
    loginAsGuest,
  } as AuthContextType & { loginAsGuest: () => Promise<AuthResponse> };
};