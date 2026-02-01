import React, { createContext, useState, useContext, useEffect } from 'react';
import { DEMO_MODE } from '../demo/demoMode';
import { mockUser } from '../demo/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // In demo mode, start with mock user already logged in
  const [user, setUser] = useState(DEMO_MODE ? mockUser : null);
  const [loading, setLoading] = useState(DEMO_MODE ? false : true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    if (!DEMO_MODE) {
      initializeAuth();
    }
  }, []);

  const initializeAuth = async () => {
    // Demo mode - user is already set
    if (DEMO_MODE) {
      setLoading(false);
      return;
    }

    // This code won't run in demo mode
    setLoading(false);
  };

  const login = async (username, password, rememberMe = false) => {
    // Demo mode - always succeed with mock user
    if (DEMO_MODE) {
      setUser(mockUser);
      return { success: true };
    }

    setError(null);
    setLoading(true);

    // Non-demo mode code (won't run in demo)
    setLoading(false);
    return { success: false, error: 'Demo mode only' };
  };

  const register = async (userData) => {
    // Demo mode - registration not available
    if (DEMO_MODE) {
      return { success: false, error: 'Rejestracja niedostępna w trybie demo' };
    }

    return { success: false, error: 'Demo mode only' };
  };

  const logout = async () => {
    // Demo mode - just reload page to reset
    if (DEMO_MODE) {
      window.location.href = '/';
      return;
    }

    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    // Demo mode - simulate success
    if (DEMO_MODE) {
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true };
    }

    return { success: false, error: 'Demo mode only' };
  };

  const changePassword = async (currentPassword, newPassword) => {
    // Demo mode - simulate success
    if (DEMO_MODE) {
      return { success: true, message: 'Hasło zmienione (tryb demo)' };
    }

    return { success: false, error: 'Demo mode only' };
  };

  const forgotPassword = async (email) => {
    // Demo mode - not available
    if (DEMO_MODE) {
      return { success: false, error: 'Funkcja niedostępna w trybie demo' };
    }

    return { success: false, error: 'Demo mode only' };
  };

  const resetPassword = async (token, newPassword) => {
    // Demo mode - not available
    if (DEMO_MODE) {
      return { success: false, error: 'Funkcja niedostępna w trybie demo' };
    }

    return { success: false, error: 'Demo mode only' };
  };

  // Helper functions for roles in demo mode
  const isAdmin = () => {
    if (DEMO_MODE) return true;
    return user?.roles?.includes('ADMIN') || false;
  };

  const isManager = () => {
    if (DEMO_MODE) return true;
    return user?.roles?.includes('MANAGER') || user?.roles?.includes('ADMIN') || false;
  };

  const hasRole = (role) => {
    if (DEMO_MODE) return true;
    return user?.roles?.includes(role) || false;
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    isManager,
    hasRole,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};