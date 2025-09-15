// Authentication Service
import { API_ENDPOINTS } from '../config/api';
import { validateCredentials, registerNewUser, isEmailRegistered, isUsernameInUse } from '../data/mockUsers';
import type { User } from '../types/auth';

export interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export const authService = {
  async login(identifier: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      // Prima prova a fare login col server reale
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: identifier, password, rememberMe }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            success: true,
            user: data.user,
            token: data.token
          };
        }
      }
    } catch (error) {
      console.log('Server non disponibile, usando sistema locale');
    }

    // Fallback: usa il sistema di autenticazione locale con utenti predefiniti
    const validatedUser = validateCredentials(identifier, password);

    if (!validatedUser) {
      return {
        success: false,
        message: 'Credenziali non valide. Prova con:\n- Email: demo@skemino.com\n- Password: Demo1234!'
      };
    }

    // Rimuovi il passwordHash prima di restituire l'utente
    const { passwordHash, ...userWithoutPassword } = validatedUser;

    return {
      success: true,
      user: userWithoutPassword as User,
      token: `local_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Login effettuato con successo'
    };
  },

  async loginAsGuest(): Promise<LoginResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.guest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      }

      return {
        success: false,
        message: data.message || 'Guest login failed'
      };
    } catch (error) {
      // Fallback to demo mode if server is unavailable
      console.warn('Server unavailable, using demo mode');
      return {
        success: true,
        user: {
          id: `guest_${Date.now()}`,
          username: `Guest_${Math.floor(Math.random() * 10000)}`,
          email: '',
          rating: 1200,
          isGuest: true
        },
        token: 'demo_token'
      };
    }
  }
};