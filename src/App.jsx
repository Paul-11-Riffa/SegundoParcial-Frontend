import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Asegúrate de que esta línea apunta al archivo .jsx
import AdminRoute from './components/auth/AdminRoute.jsx';
import './styles/App.css';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={<ProtectedRoute><MainLayout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Rutas de Admin */}
        <Route path="admin" element={<AdminRoute />}>
          <Route path="users" element={<ManageUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;