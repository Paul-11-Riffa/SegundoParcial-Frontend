import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Routes>
      {/* Rutas públicas que no necesitan layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Rutas protegidas que usarán el MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        {/* Aquí añadiremos la ruta de gestión de usuarios más adelante */}
        {/* <Route path="admin/users" element={<AdminUsersPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;