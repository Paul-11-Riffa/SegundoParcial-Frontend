import {Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ManageProductsPage from './pages/ManageProductsPage';
import ShopPage from './pages/ShopPage';
import './styles/App.css';

function App() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage/>}/>
            {/* Rutas protegidas */}
            <Route
                path="/"
                element={<ProtectedRoute><MainLayout/></ProtectedRoute>}
            >
                <Route index element={<Navigate to="/dashboard"/>}/>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="shop" element={<ShopPage />} />

                {/* Rutas de Admin */}
                <Route path="admin" element={<AdminRoute/>}>
                    <Route path="users" element={<ManageUsersPage/>}/>
                    <Route path="products" element={<ManageProductsPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;