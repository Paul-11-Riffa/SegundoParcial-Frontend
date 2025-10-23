import {Routes, Route, Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ManageProductsPage from './pages/ManageProductsPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderCancelPage from './pages/OrderCancelPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import MyOrdersPage from './pages/MyOrdersPage';
import VoiceCommandsPage from './pages/VoiceCommandsPage';
import AuditPage from './pages/AuditPage';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import './styles/App.css';

function App() {
    return (
        <ToastProvider>
        <CartProvider>
        <Routes>
            {/* ============================================
                RUTAS PÚBLICAS - LA TIENDA ABIERTA
                Sin login required - Máxima conversión
                ============================================ */}
            
            {/* HomePage - La ventana a la tienda */}
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<HomePage/>}/>
            </Route>
            
            {/* Shop - Navegar productos sin fricción */}
            <Route path="/shop" element={<MainLayout/>}>
                <Route index element={<ShopPage/>}/>
            </Route>
            
            {/* Product Detail - La "Galería de Arte" */}
            <Route path="/product/:id" element={<MainLayout/>}>
                <Route index element={<ProductDetailPage/>}/>
            </Route>
            
            {/* Autenticación */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage/>}/>
            
            {/* Páginas de resultado de compra */}
            <Route path="/order/success" element={<OrderSuccessPage/>}/>
            <Route path="/order/cancel" element={<OrderCancelPage/>}/>
            
            {/* ============================================
                RUTAS PROTEGIDAS - CUENTA DEL CLIENTE
                Solo después de login/compra
                ============================================ */}
            <Route
                path="/account"
                element={<ProtectedRoute><MainLayout/></ProtectedRoute>}
            >
                <Route index element={<Navigate to="/account/profile"/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="cart" element={<CartPage/>}/>
                <Route path="my-orders" element={<MyOrdersPage />} />
            </Route>
            
            {/* ============================================
                RUTAS DE ADMINISTRACIÓN
                Solo para admins
                ============================================ */}
            <Route
                path="/admin"
                element={<ProtectedRoute><AdminRoute><MainLayout/></AdminRoute></ProtectedRoute>}
            >
                <Route index element={<Navigate to="/admin/dashboard"/>}/>
                <Route path="dashboard" element={<AdminDashboard/>}/>
                <Route path="users" element={<ManageUsersPage/>}/>
                <Route path="products" element={<ManageProductsPage/>}/>
                <Route path="sales-history" element={<SalesHistoryPage />} />
                {/* Redirigir reportes antiguos al nuevo sistema de comandos de voz */}
                <Route path="reports" element={<Navigate to="/admin/voice-commands" replace />} />
                <Route path="advanced-reports" element={<Navigate to="/admin/voice-commands" replace />} />
                <Route path="voice-commands" element={<VoiceCommandsPage />} />
                <Route path="audit" element={<AuditPage />} />
            </Route>
        </Routes>
        </CartProvider>
        </ToastProvider>
    );
}

export default App;