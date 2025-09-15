// Authentication Service
import { API_ENDPOINTS } from '../config/api';

export interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export const authService = {
  async login(identifier: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password, rememberMe }),
        credentials: 'include'
      });

      // Check if response is empty or invalid
      if (!response.ok) {
        let errorMessage = 'Credenziali non valide';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }

        return {
          success: false,
          message: errorMessage
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        return {
          success: false,
          message: 'Risposta del server non valida'
        };
      }

      if (data.success) {
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Login effettuato con successo'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Credenziali non valide'
        };
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      return {
        success: false,
        message: 'Errore di connessione al server. Riprova più tardi.'
      };
    }
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

      // Check if response is empty or invalid
      if (!response.ok) {
        let errorMessage = 'Guest login failed';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }

        return {
          success: false,
          message: errorMessage
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        return {
          success: false,
          message: 'Risposta del server non valida'
        };
      }

      if (data.success) {
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
      console.error('Errore durante il login come ospite:', error);
      return {
        success: false,
        message: 'Errore di connessione al server. Riprova più tardi.'
      };
    }
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });

      // Check if response is empty or invalid
      if (!response.ok) {
        let errorMessage = 'Errore durante la registrazione';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }

        return {
          success: false,
          message: errorMessage
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        return {
          success: false,
          message: 'Risposta del server non valida'
        };
      }

      if (data.success) {
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: data.message || 'Registrazione completata con successo'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Errore durante la registrazione'
        };
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      return {
        success: false,
        message: 'Errore di connessione al server. Riprova più tardi.'
      };
    }
  }
};