// Authentication Service
import { API_ENDPOINTS } from '../config/api';

export interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export const authService = {
  async login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
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
        message: data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login service error:', error);
      return {
        success: false,
        message: 'Unable to connect to server. Using demo mode.'
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