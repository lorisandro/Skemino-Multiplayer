import { useState, useEffect, useCallback } from 'react';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AuthContextType,
  GuestUser
} from '../types/auth';
import { authService } from '../services/authService';

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
        // Check for existing token in localStorage first (persistent login)
        let token = localStorage.getItem('skemino_auth_token');
        let userData = localStorage.getItem('skemino_user_data');

        // If not found in localStorage, check sessionStorage (guest or temporary sessions)
        if (!token || !userData) {
          token = sessionStorage.getItem('skemino_auth_token');
          userData = sessionStorage.getItem('skemino_user_data');
        }

        if (token && userData) {
          const parsedUser = JSON.parse(userData);

          // Validate token with server (in real app)
          const isValid = await validateToken(token);

          if (isValid) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Token expired, clean up both storages
            localStorage.removeItem('skemino_auth_token');
            localStorage.removeItem('skemino_user_data');
            sessionStorage.removeItem('skemino_auth_token');
            sessionStorage.removeItem('skemino_user_data');
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

  // Robust token validation with extension interference handling
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // For now, return true for any non-empty token
      // In production, this should make an API call to validate the token
      // using the same robust fetch mechanism as authService
      if (!token || token.length === 0) return false;

      // Simulate API validation with timeout handling
      return await Promise.race([
        new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100)),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error('TOKEN_VALIDATION_TIMEOUT')), 5000)
        )
      ]);
    } catch (error) {
      console.warn('Token validation failed:', error);
      return false;
    }
  };

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // Use real auth service with validation
      const response = await authService.login(
        credentials.identifier,
        credentials.password,
        credentials.rememberMe
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message || 'Credenziali non valide',
          errors: { identifier: response.message || 'Email o password errati' }
        };
      }

      // Use the real user data from the service
      const authenticatedUser = response.user as User;

      // CRITICAL: Only use real server tokens, never generate fake ones
      if (!response.token) {
        console.error('❌ Server login success but no token provided:', response);
        return {
          success: false,
          message: 'Server authentication error: no token received',
          errors: { identifier: 'Authentication failed - please try again' }
        };
      }

      // Validate JWT format before storing
      const authToken = response.token;
      if (!authToken.includes('.') || authToken.split('.').length !== 3) {
        console.error('❌ Invalid JWT format received from server:', authToken.substring(0, 20) + '...');
        return {
          success: false,
          message: 'Server authentication error: invalid token format',
          errors: { identifier: 'Authentication failed - invalid token' }
        };
      }

      console.log('✅ Received valid JWT token:', authToken.substring(0, 20) + '... (length: ' + authToken.length + ')');

      // Store auth data
      if (credentials.rememberMe) {
        localStorage.setItem('skemino_auth_token', authToken);
        localStorage.setItem('skemino_user_data', JSON.stringify(authenticatedUser));
      } else {
        sessionStorage.setItem('skemino_auth_token', authToken);
        sessionStorage.setItem('skemino_user_data', JSON.stringify(authenticatedUser));
      }

      // Important: Update any active WebSocket connections with new token
      if ((window as any).websocketUpdateAuth) {
        (window as any).websocketUpdateAuth(authToken);
        console.log('🔄 Updated WebSocket connection with new auth token');
      }

      setUser(authenticatedUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: authenticatedUser,
        token: authToken,
        message: response.message || 'Login effettuato con successo'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Errore durante il login',
        errors: { identifier: 'Errore di connessione. Riprova.' }
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // Use real auth service for registration
      const response = await authService.register(
        credentials.username,
        credentials.email,
        credentials.password
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message || 'Errore durante la registrazione',
          errors: {
            email: response.message?.includes('Email') ? response.message : undefined,
            username: response.message?.includes('Username') ? response.message : undefined,
            password: !response.message?.includes('Email') && !response.message?.includes('Username') ? response.message : undefined
          }
        };
      }

      // Use the real user data from the service
      const registeredUser = response.user as User;

      // CRITICAL: Only use real server tokens, never generate fake ones
      if (!response.token) {
        console.error('❌ Server registration success but no token provided:', response);
        return {
          success: false,
          message: 'Server authentication error: no token received',
          errors: { email: 'Registration failed - please try again' }
        };
      }

      // Validate JWT format before storing
      const authToken = response.token;
      if (!authToken.includes('.') || authToken.split('.').length !== 3) {
        console.error('❌ Invalid JWT format received from server during registration:', authToken.substring(0, 20) + '...');
        return {
          success: false,
          message: 'Server authentication error: invalid token format',
          errors: { email: 'Registration failed - invalid token' }
        };
      }

      console.log('✅ Received valid JWT token during registration:', authToken.substring(0, 20) + '... (length: ' + authToken.length + ')');

      // Store auth data in localStorage for registration (always persistent)
      localStorage.setItem('skemino_auth_token', authToken);
      localStorage.setItem('skemino_user_data', JSON.stringify(registeredUser));

      setUser(registeredUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: registeredUser,
        token: authToken,
        message: response.message || 'Registrazione completata con successo'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Errore durante la registrazione',
        errors: { email: 'Errore di connessione. Riprova.' }
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Clear all auth storage
      localStorage.removeItem('skemino_auth_token');
      localStorage.removeItem('skemino_user_data');
      sessionStorage.removeItem('skemino_auth_token');
      sessionStorage.removeItem('skemino_user_data');
      sessionStorage.removeItem('skemino_guest_session'); // Legacy guest session cleanup

      // Reset state
      setUser(null);
      setIsAuthenticated(false);

      // Optionally call backend logout endpoint to invalidate token server-side
      // This would be particularly important for guest sessions
      try {
        // In a real implementation, call authService.logout() here
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (logoutError) {
        console.warn('Server logout failed:', logoutError);
        // Don't fail the entire logout process if server logout fails
      }

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
        countryCode: 'IT', // Default to Italy for social login
        rating: 1000,
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

      // NOTE: This is mock implementation - in production, use real OAuth tokens
      const mockToken = `${provider}_token_${Date.now()}`;
      console.warn('⚠️ Social login using MOCK token - replace with real OAuth implementation');

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

  // Create guest user using backend service
  const loginAsGuest = useCallback(async (): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      // Use real auth service for guest login
      const response = await authService.loginAsGuest();

      if (!response.success) {
        return {
          success: false,
          message: response.message || 'Errore durante la creazione della sessione ospite',
          errors: { guest: response.message || 'Sessione ospite non disponibile' }
        };
      }

      // Use the real guest user data from the service
      const guestUser = response.user as User;

      // CRITICAL: Only use real server tokens, even for guests
      if (!response.token) {
        console.error('❌ Server guest login success but no token provided:', response);
        return {
          success: false,
          message: 'Server authentication error: no guest token received',
          errors: { guest: 'Guest session failed - please try again' }
        };
      }

      // Validate JWT format before storing
      const authToken = response.token;
      if (!authToken.includes('.') || authToken.split('.').length !== 3) {
        console.error('❌ Invalid JWT format received from server for guest:', authToken.substring(0, 20) + '...');
        return {
          success: false,
          message: 'Server authentication error: invalid guest token format',
          errors: { guest: 'Guest session failed - invalid token' }
        };
      }

      console.log('✅ Received valid guest JWT token:', authToken.substring(0, 20) + '... (length: ' + authToken.length + ')');

      // Store guest session (session storage only for temporary session)
      sessionStorage.setItem('skemino_auth_token', authToken);
      sessionStorage.setItem('skemino_user_data', JSON.stringify(guestUser));

      setUser(guestUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: guestUser,
        token: authToken,
        message: response.message || 'Sessione ospite creata con successo'
      };

    } catch (error) {
      console.error('Guest login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Errore durante la creazione della sessione ospite',
        errors: { guest: 'Errore di connessione. Riprova.' }
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