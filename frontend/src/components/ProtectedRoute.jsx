import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  // Not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    const userRole = user.role || "user";

    // Check if user has required role
    if (userRole !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
