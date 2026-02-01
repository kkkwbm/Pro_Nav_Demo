import axios from 'axios';
import { tokenStorage } from '../services/storage/tokenStorage';
import logger from '../utils/logger';

// Network status tracking - will be set by the provider
let networkStatusCallbacks = {
  reportNetworkError: null,
  reportNetworkSuccess: null
};

// Function to set callbacks from the NetworkStatusProvider
export const setNetworkStatusCallbacks = (callbacks) => {
  networkStatusCallbacks = callbacks;
};

// Helper function to provide meaningful error messages based on status and URL
const getStatusErrorMessage = (status, url) => {
  switch (status) {
    case 400:
      if (url?.includes('/services')) {
        return 'Błędne dane serwisu. Sprawdź czy data nie jest w przeszłości i wszystkie pola są wypełnione poprawnie.';
      }
      return 'Przesłane dane są nieprawidłowe. Sprawdź formularz i spróbuj ponownie.';
    case 401:
      return 'Sesja wygasła. Zaloguj się ponownie.';
    case 403:
      return 'Nie masz uprawnień do wykonania tej operacji.';
    case 404:
      return 'Żądany zasób nie został znaleziony.';
    case 409:
      return 'Konflikt danych. Może rekord już istnieje lub jest używany.';
    case 422:
      return 'Dane nie przeszły walidacji. Sprawdź poprawność wprowadzonych informacji.';
    case 500:
      return 'Błąd serwera. Spróbuj ponownie później.';
    case 503:
      return 'Serwis tymczasowo niedostępny. Spróbuj ponownie później.';
    default:
      return `Wystąpił błąd (kod: ${status}). Spróbuj ponownie.`;
  }
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 120000, // Increased to 120 seconds (2 minutes) due to slow backend responses when loading many devices
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token and add to headers
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging (only in development)
    logger.debug(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    logger.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug(`[API] Response: ${response.status}`, response.data);
    // Report successful connection
    if (networkStatusCallbacks.reportNetworkSuccess) {
      networkStatusCallbacks.reportNetworkSuccess();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't log 401 errors for settings endpoint - it's expected for public/unauthenticated users
    const isSettingsEndpoint = originalRequest?.url?.includes('/api/settings');
    const is401Error = error.response?.status === 401;

    if (!(isSettingsEndpoint && is401Error)) {
      logger.error(`[API] Error: ${error.response?.status}`, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Report network error if it's a connection issue
    if (error.code === 'ERR_NETWORK' || !error.response) {
      if (networkStatusCallbacks.reportNetworkError) {
        networkStatusCallbacks.reportNetworkError();
      }
    }

    // Enhance error object with more detailed information
    let errorMessage = 'An error occurred';
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Nie można połączyć się z serwerem. Sprawdź czy backend działa na http://localhost:8080';
    } else if (error.response?.data) {
      if (typeof error.response.data === 'string' && error.response.data.trim()) {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.details) {
        errorMessage = error.response.data.details;
      } else {
        errorMessage = getStatusErrorMessage(error.response.status, originalRequest?.url);
      }
    } else {
      errorMessage = getStatusErrorMessage(error.response?.status, originalRequest?.url);
    }
    
    error.message = errorMessage;
    error.userMessage = errorMessage;

    // Check if this is a session expiry from server-side session management
    if (error.response?.status === 401 && error.response?.data?.error === 'Session expired or invalid') {
      logger.error('===== SESSION EXPIRED =====');
      logger.error('URL:', originalRequest?.url);
      logger.error('Response data:', error.response?.data);
      logger.warn('Will redirect to login in 3 seconds...');

      tokenStorage.clearAll();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
      return Promise.reject(error);
    }

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/login') {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (refreshToken) {
          logger.info('[API] Attempting token refresh...');

          // Try to refresh the token
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
            { refreshToken },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000,
              withCredentials: true
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update tokens
          tokenStorage.setTokens(accessToken, newRefreshToken);

          logger.info('[API] Token refreshed successfully');
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        logger.error('===== TOKEN REFRESH FAILED =====');
        logger.error('Original request URL:', originalRequest?.url);
        logger.error('Refresh error:', refreshError.message);
        logger.error('Refresh error response:', refreshError.response?.data);
        logger.warn('Will redirect to login in 3 seconds...');

        // Refresh failed, logout user
        tokenStorage.clearAll();

        // Redirect to login page with delay
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other common errors
    if (error.response?.status === 403) {
      logger.error('[API] Access forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      logger.error('[API] Server error');
    } else if (!error.response) {
      logger.error('[API] Network error - server unreachable');
    }

    return Promise.reject(error);
  }
);

// Create a public axios instance for endpoints that don't require authentication
export const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 120000, // Increased to 120 seconds (2 minutes)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS
});

// Public axios instance response interceptor
publicAxiosInstance.interceptors.response.use(
  (response) => {
    logger.debug(`[PUBLIC API] Response: ${response.status}`, response.data);
    // Report successful connection
    if (networkStatusCallbacks.reportNetworkSuccess) {
      networkStatusCallbacks.reportNetworkSuccess();
    }
    return response;
  },
  (error) => {
    logger.error(`[PUBLIC API] Error: ${error.response?.status}`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // Report network error if it's a connection issue
    if (error.code === 'ERR_NETWORK' || !error.response) {
      if (networkStatusCallbacks.reportNetworkError) {
        networkStatusCallbacks.reportNetworkError();
      }
    }

    // Enhance error object with meaningful error message
    let errorMessage = 'An error occurred';
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Nie można połączyć się z serwerem. Sprawdź czy backend działa na http://localhost:8080';
    } else if (error.response?.data) {
      if (typeof error.response.data === 'string' && error.response.data.trim()) {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = getStatusErrorMessage(error.response.status, error.config?.url);
      }
    } else {
      errorMessage = getStatusErrorMessage(error.response?.status, error.config?.url);
    }
    
    error.message = errorMessage;
    error.userMessage = errorMessage;

    return Promise.reject(error);
  }
);

export default axiosInstance;