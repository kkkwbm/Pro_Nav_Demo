import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_MODE } from '../../demo/demoMode';

const PublicRoute = ({ children, redirectTo = '/app' }) => {
  const { isAuthenticated, loading } = useAuth();

  // In demo mode, always redirect to app (user is pre-authenticated)
  if (DEMO_MODE && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to app if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;