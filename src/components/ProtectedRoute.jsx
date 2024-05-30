// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('username');

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/403" />;
};

export default ProtectedRoute;