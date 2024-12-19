// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Ensure this component exists

/**
 * ProtectedRoute component to guard authenticated routes.
 * Renders the children if authenticated; otherwise, redirects to login.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactNode} The children components or a Navigate component.
 */
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

