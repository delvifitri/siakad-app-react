import type { User } from '../schemas/auth.schema';

const USER_KEY = 'user';

export const storage = {
  // Get user data from localStorage
  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        return null;
      }
      const parsed = JSON.parse(userStr) as User;
      return parsed;
    } catch (error) {
      return null;
    }
  },

  // Set user data in localStorage
  setUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      // Silently handle storage errors
    }
  },

  // Remove user data from localStorage
  removeUser(): void {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      // Silently handle storage errors
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getUser() !== null;
  },

  // Clear all auth data
  clearAuth(): void {
    this.removeUser();
  },
};
