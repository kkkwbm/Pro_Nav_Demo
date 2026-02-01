import { DEMO_MODE, simulateDelay } from '../../demo/demoMode';
import { mockUser } from '../../demo/mockData';
import { tokenStorage } from '../storage/tokenStorage';

class AuthService {
  // Login user
  async login(username, password, rememberMe = false) {
    if (DEMO_MODE) {
      await simulateDelay(500);

      // Accept any credentials in demo mode
      const demoToken = 'demo-access-token-' + Date.now();
      const demoRefreshToken = 'demo-refresh-token-' + Date.now();

      tokenStorage.setTokens(demoToken, demoRefreshToken, rememberMe);
      tokenStorage.setUser(mockUser, rememberMe);

      return {
        success: true,
        user: mockUser,
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Register new user
  async register(userData) {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return {
        success: true,
        message: 'Rejestracja zakończona pomyślnie (tryb demo)',
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Logout user
  async logout() {
    if (DEMO_MODE) {
      await simulateDelay(200);
    }
    // Clear local storage
    tokenStorage.clearAll();
  }

  // Get current user
  async getCurrentUser() {
    if (DEMO_MODE) {
      await simulateDelay(200);

      // Check if user is stored
      const storedUser = tokenStorage.getUser();
      if (storedUser) {
        return {
          success: true,
          user: storedUser,
        };
      }

      // Return demo user if authenticated
      if (this.isAuthenticated()) {
        tokenStorage.setUser(mockUser);
        return {
          success: true,
          user: mockUser,
        };
      }

      return {
        success: false,
        error: 'Nie zalogowany',
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Refresh token
  async refreshToken() {
    if (DEMO_MODE) {
      await simulateDelay(200);

      const demoToken = 'demo-access-token-refreshed-' + Date.now();
      const demoRefreshToken = 'demo-refresh-token-refreshed-' + Date.now();

      tokenStorage.setTokens(demoToken, demoRefreshToken);

      return {
        success: true,
        user: mockUser,
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Request password reset
  async forgotPassword(email) {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return {
        success: true,
        message: 'Link do resetowania hasła został wysłany (tryb demo)',
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return {
        success: true,
        message: 'Hasło zostało zresetowane pomyślnie (tryb demo)',
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Change password for authenticated user
  async changePassword(currentPassword, newPassword) {
    if (DEMO_MODE) {
      await simulateDelay(500);
      return {
        success: true,
        message: 'Hasło zostało zmienione pomyślnie (tryb demo)',
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Update user profile
  async updateProfile(profileData) {
    if (DEMO_MODE) {
      await simulateDelay(300);

      const updatedUser = {
        ...mockUser,
        ...profileData,
      };

      tokenStorage.setUser(updatedUser);

      return {
        success: true,
        user: updatedUser,
      };
    }

    return {
      success: false,
      error: 'Demo mode only',
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return tokenStorage.isAuthenticated();
  }

  // Get stored user
  getStoredUser() {
    return tokenStorage.getUser();
  }
}

export const authService = new AuthService();
