import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Si no hay token, redirige al usuario a la página de login
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;