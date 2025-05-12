// ProtectedRoute.js
// This component provides route protection for authenticated users.
// It checks if the `access_token` exists in local storage, indicating the user is logged in.
// If the token is present, it renders the specified element (protected route).
// If the token is not present (i.e., the user is not authenticated), it redirects the user to the login page.

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('access_token');

  return token ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
