import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  // Si es admin, muestra el dashboard de admin, si no, el de cliente.
  return isAdmin ? <AdminDashboard /> : <ClientDashboard />;
};

export default Dashboard;