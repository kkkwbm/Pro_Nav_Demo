import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role if specified
  if (requiredRole) {
    // Convert string to array if needed
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Email verification not required - admin approval system is used instead

  return children;
};

export default ProtectedRoute;