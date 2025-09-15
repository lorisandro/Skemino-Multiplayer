// API Configuration for Skemino
// In development, use relative paths to leverage Vite proxy
// In production, use the full API URL
const isDevelopment = import.meta.env.DEV;
export const API_BASE_URL = isDevelopment ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3008');

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