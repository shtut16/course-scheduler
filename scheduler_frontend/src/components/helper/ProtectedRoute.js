// Allow protection from non-users

// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('access_token');

  return token ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
