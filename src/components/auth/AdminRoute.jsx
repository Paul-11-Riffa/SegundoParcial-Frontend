import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  // Obtenemos el nuevo estado isLoading
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // --- CAMBIO CLAVE AQUÍ ---
  // Si está cargando, mostramos un mensaje temporal y no hacemos nada más.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/shop" />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;