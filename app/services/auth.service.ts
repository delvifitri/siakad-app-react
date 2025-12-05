import apiClient from '../lib/api.config';
import { loginRequestSchema, loginResponseSchema, type LoginRequest, type LoginResponse } from '../schemas/auth.schema';
import { storage } from '../utils/storage';

export const authService = {
  /**
   * Login with NIM and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Validate request data
    const validatedData = loginRequestSchema.parse(credentials);
    
    // Make API request
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/mhs/login',
      validatedData
    );

    // Validate response data
    const validatedResponse = loginResponseSchema.parse(response.data);

    // Store user data in localStorage
    if (validatedResponse.success && validatedResponse.data.user) {
      storage.setUser(validatedResponse.data.user);
    }

    return validatedResponse;
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
