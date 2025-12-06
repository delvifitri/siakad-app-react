import apiClient from '../lib/api.config';
import { type LoginRequest, type LoginResponse } from "../schemas/auth.schema";
import { storage } from '../utils/storage';

export const authService = {
  /**
   * Login with NIM and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Make API request
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/mhs/login",
      credentials
    );

    // Store user data in localStorage if successful
    if (response.data.success && response.data.data?.user) {
      storage.setUser(response.data.data.user);
    }

    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout API if available
      // await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Silently handle logout error
    } finally {
      // Clear local storage
      storage.clearAuth();
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const user = storage.getUser();
    return user !== null;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return storage.getUser();
  },
};
