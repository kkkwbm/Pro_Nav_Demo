import logger from '../../utils/logger';

const TOKEN_KEY = 'serwispro_access_token';
const REFRESH_TOKEN_KEY = 'serwispro_refresh_token';
const USER_KEY = 'serwispro_user';
const REMEMBER_ME_KEY = 'serwispro_remember_me';

class TokenStorage {
  // Get the appropriate storage (localStorage or sessionStorage)
  getStorage() {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  // Set remember me preference (always in localStorage)
  setRememberMe(remember) {
    if (remember) {
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
      logger.debug('[TokenStorage] Remember Me enabled');
    } else {
      localStorage.setItem(REMEMBER_ME_KEY, 'false');
      logger.debug('[TokenStorage] Remember Me disabled');
    }
  }

  // Get remember me preference
  getRememberMe() {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  }

  // Access Token Methods
  getAccessToken() {
    // Check both storages (for migration compatibility)
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    logger.debug('[TokenStorage] Getting access token:', token ? 'EXISTS' : 'NOT_FOUND');
    return token;
  }

  setAccessToken(token, rememberMe = null) {
    // Use provided rememberMe or fall back to stored preference
    const shouldRemember = rememberMe !== null ? rememberMe : this.getRememberMe();
    const storage = shouldRemember ? localStorage : sessionStorage;

    if (token) {
      storage.setItem(TOKEN_KEY, token);
      logger.debug('[TokenStorage] Access token saved to', shouldRemember ? 'localStorage' : 'sessionStorage');

      // Clear from the other storage
      const otherStorage = shouldRemember ? sessionStorage : localStorage;
      otherStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      logger.debug('[TokenStorage] Access token removed');
    }
  }

  // Refresh Token Methods
  getRefreshToken() {
    // Check both storages (for migration compatibility)
    const token = sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
    logger.debug('[TokenStorage] Getting refresh token:', token ? 'EXISTS' : 'NOT_FOUND');
    return token;
  }

  setRefreshToken(token, rememberMe = null) {
    // Use provided rememberMe or fall back to stored preference
    const shouldRemember = rememberMe !== null ? rememberMe : this.getRememberMe();
    const storage = shouldRemember ? localStorage : sessionStorage;

    if (token) {
      storage.setItem(REFRESH_TOKEN_KEY, token);
      logger.debug('[TokenStorage] Refresh token saved to', shouldRemember ? 'localStorage' : 'sessionStorage');

      // Clear from the other storage
      const otherStorage = shouldRemember ? sessionStorage : localStorage;
      otherStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      logger.debug('[TokenStorage] Refresh token removed');
    }
  }

  // Combined Token Methods
  setTokens(accessToken, refreshToken, rememberMe = null) {
    // Set remember me preference if provided
    if (rememberMe !== null) {
      this.setRememberMe(rememberMe);
    }

    logger.debug('[TokenStorage] Setting tokens with rememberMe:', rememberMe !== null ? rememberMe : this.getRememberMe());
    this.setAccessToken(accessToken, rememberMe);
    this.setRefreshToken(refreshToken, rememberMe);
  }

  clearTokens() {
    logger.debug('[TokenStorage] Clearing tokens...');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  // User Data Methods
  getUser() {
    try {
      // Check both storages (for migration compatibility)
      const userStr = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
      const user = userStr ? JSON.parse(userStr) : null;
      logger.debug('[TokenStorage] Getting user:', user ? 'EXISTS' : 'NOT_FOUND');
      return user;
    } catch (error) {
      logger.error('[TokenStorage] Error parsing user data:', error);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
      return null;
    }
  }

  setUser(user, rememberMe = null) {
    // Use provided rememberMe or fall back to stored preference
    const shouldRemember = rememberMe !== null ? rememberMe : this.getRememberMe();
    const storage = shouldRemember ? localStorage : sessionStorage;

    if (user) {
      storage.setItem(USER_KEY, JSON.stringify(user));
      logger.debug('[TokenStorage] User saved to', shouldRemember ? 'localStorage' : 'sessionStorage', ':', user.username || user.email);

      // Clear from the other storage
      const otherStorage = shouldRemember ? sessionStorage : localStorage;
      otherStorage.removeItem(USER_KEY);
    } else {
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
      logger.debug('[TokenStorage] User data removed');
    }
  }

  // Clear all auth data
  clearAll() {
    logger.debug('[TokenStorage] Clearing all authentication data...');
    this.clearTokens();
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const hasToken = !!this.getAccessToken();
    const hasUser = !!this.getUser();
    const isAuth = hasToken && hasUser;

    logger.debug('[TokenStorage] Authentication check:', {
      hasToken,
      hasUser,
      isAuthenticated: isAuth
    });

    return isAuth;
  }

  // Get user role
  getUserRole() {
    const user = this.getUser();
    const role = user?.roles?.[0] || null;
    logger.debug('[TokenStorage] User role:', role);
    return role;
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    const hasRole = user?.roles?.some(r =>
      r === role ||
      r === `ROLE_${role}` ||
      r.toUpperCase() === role.toUpperCase()
    ) || false;

    logger.debug('[TokenStorage] Role check:', { role, hasRole, userRoles: user?.roles });
    return hasRole;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('ADMIN');
  }

  // Check if user is manager or admin
  isManager() {
    return this.hasRole('MANAGER') || this.hasRole('ADMIN');
  }

  // Validate token (basic JWT structure check)
  isValidJWT(token) {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      // Try to decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;

      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        logger.warn('[TokenStorage] Token is expired');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('[TokenStorage] Invalid JWT format:', error);
      return false;
    }
  }

  // Get token expiration
  getTokenExpiration() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      logger.error('[TokenStorage] Error reading token expiration:', error);
      return null;
    }
  }
}

export const tokenStorage = new TokenStorage();