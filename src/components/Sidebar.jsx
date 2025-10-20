import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import {useAuth} from '../hooks/useAuth';
import { logoutUser } from '../services/api';
import {
    FaTachometerAlt,
    FaUsers,
    FaSignOutAlt,
    FaBoxOpen,
    FaStore,
    FaShoppingCart,
    FaHistory,
    FaListAlt,
    FaChartBar,
    FaChartLine
} from 'react-icons/fa';

const Sidebar = () => {
    const {user, isAdmin} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            // Limpiar localStorage siempre, incluso si falla la petición al backend
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h1 className={styles.logo}>Zarss</h1>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {/* --- CAMBIO AQUÍ --- */}
                        {isAdmin ? 'A' : user?.first_name?.charAt(0)}
                    </div>
                    <div className={styles.profileInfo}>
                        <span className={styles.name}>{user?.first_name} {user?.last_name}</span>
                        <span className={styles.role}>{user?.profile?.role}</span>
                    </div>
                </div>
            </div>
            <nav className={styles.nav}>
                <NavLink to="/dashboard"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaTachometerAlt/>
                    <span>Panel</span>
                </NavLink>
                <NavLink to="/shop"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaStore/>
                    <span>Tienda</span>
                </NavLink>
                <NavLink to="/cart"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaShoppingCart/>
                    <span>Carrito</span>
                </NavLink>
                <NavLink to="/my-orders"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaListAlt/>
                    <span>Mis Órdenes</span>
                </NavLink>
                {isAdmin && (
                    <>
                        <NavLink to="/admin/users"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaUsers/>
                            <span>Gestionar Usuarios</span>
                        </NavLink>
                        <NavLink to="/admin/products"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaBoxOpen/>
                            <span>Gestionar Productos</span>
                        </NavLink>
                        <NavLink to="/admin/sales-history"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaHistory/>
                            <span>Historial de Ventas</span>
                        </NavLink>
                        <NavLink to="/reports"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaChartBar/>
                            <span>Reportes Dinámicos</span>
                        </NavLink>
                        <NavLink to="/advanced-reports"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaChartLine/>
                            <span>Reportes Avanzados</span>
                        </NavLink>
                    </>
                )}
                {!isAdmin && (
                    <>
                        <NavLink to="/profile"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaUsers/>
                            <span>Perfil</span>
                        </NavLink>


                    </>
                )}

            </nav>
            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FaSignOutAlt/>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;