// Authentication Service - Browser Extension Interference Resistant
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

// Browser extension interference detection and mitigation
const createRobustFetch = (url: string, options: RequestInit, timeoutMs: number = 10000) => {
  return new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error('BROWSER_EXTENSION_TIMEOUT'));
    }, timeoutMs);

    // Attempt to bypass extension interference with multiple strategies
    const strategies = [
      // Strategy 1: Standard fetch with signal
      () => fetch(url, { ...options, signal: controller.signal }),

      // Strategy 2: XMLHttpRequest fallback (extensions rarely intercept this)
      () => new Promise<Response>((resolveXHR, rejectXHR) => {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url);

        // Set headers
        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value as string);
          });
        }

        xhr.withCredentials = options.credentials === 'include';

        xhr.onload = () => {
          const response = new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers()
          });
          resolveXHR(response);
        };

        xhr.onerror = () => rejectXHR(new Error('XHR_NETWORK_ERROR'));
        xhr.ontimeout = () => rejectXHR(new Error('XHR_TIMEOUT'));

        xhr.send(options.body as string);
      })
    ];

    // Try each strategy with exponential backoff
    const tryStrategy = async (strategyIndex: number = 0): Promise<void> => {
      if (strategyIndex >= strategies.length) {
        clearTimeout(timeoutId);
        reject(new Error('ALL_STRATEGIES_FAILED'));
        return;
      }

      try {
        const response = await strategies[strategyIndex]();
        clearTimeout(timeoutId);
        resolve(response);
      } catch (error) {
        console.warn(`Strategy ${strategyIndex + 1} failed:`, error);

        // Check if error is extension-related
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isExtensionError = errorMessage.includes('listener') ||
                                errorMessage.includes('message channel') ||
                                errorMessage.includes('Failed to fetch');

        if (isExtensionError && strategyIndex < strategies.length - 1) {
          // Wait before trying next strategy
          setTimeout(() => tryStrategy(strategyIndex + 1), 500 * (strategyIndex + 1));
        } else {
          clearTimeout(timeoutId);
          reject(error);
        }
      }
    };

    tryStrategy();
  });
};

export const authService = {
  async login(identifier: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await createRobustFetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password, rememberMe }),
        credentials: 'include'
      }, 15000); // Extended timeout for extension interference

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

      // Specific error handling for browser extension interference
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('BROWSER_EXTENSION_TIMEOUT') ||
          errorMessage.includes('ALL_STRATEGIES_FAILED')) {
        return {
          success: false,
          message: 'Rilevata interferenza di estensioni browser. Prova a disabilitare temporaneamente le estensioni e riprova.'
        };
      }

      if (errorMessage.includes('listener') || errorMessage.includes('message channel')) {
        return {
          success: false,
          message: 'Estensione browser in conflitto. Ricarica la pagina e riprova.'
        };
      }

      return {
        success: false,
        message: 'Errore di connessione al server. Riprova più tardi.'
      };
    }
  },

  async loginAsGuest(): Promise<LoginResponse> {
    try {
      const response = await createRobustFetch(API_ENDPOINTS.auth.guest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      }, 15000);

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
      const response = await createRobustFetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      }, 15000);

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