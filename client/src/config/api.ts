// API Configuration for Skemino
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    verify: `${API_BASE_URL}/api/auth/verify`,
    guest: `${API_BASE_URL}/api/auth/guest`
  },
  user: {
    profile: `${API_BASE_URL}/api/users/profile`,
    update: `${API_BASE_URL}/api/users/update`
  }
};