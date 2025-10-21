import React, { useState } from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import {useAuth} from '../hooks/useAuth';
import { logoutUser } from '../services/api';
import {
    FaUsers,
    FaSignOutAlt,
    FaBoxOpen,
    FaShoppingCart,
    FaHistory,
    FaListAlt,
    FaChartBar,
    FaBrain,
    FaChevronDown,
    FaChevronRight,
    FaCog,
    FaUser,
    FaClipboardList
} from 'react-icons/fa';

const Sidebar = () => {
    const {user, isAdmin} = useAuth();
    const navigate = useNavigate();
    const [openModules, setOpenModules] = useState({
        gestion: true,
        analisis: true,
        reportes: true
    });

    const toggleModule = (module) => {
        setOpenModules(prev => ({
            ...prev,
            [module]: !prev[module]
        }));
    };

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
                {isAdmin ? (
                    <>
                        {/* MÓDULO 1: GESTIÓN */}
                        <div className={styles.moduleSection}>
                            <button 
                                className={styles.moduleHeader}
                                onClick={() => toggleModule('gestion')}
                            >
                                <div className={styles.moduleTitle}>
                                    <FaCog className={styles.moduleIcon} />
                                    <span>Módulo 1: Gestión</span>
                                </div>
                                {openModules.gestion ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            {openModules.gestion && (
                                <div className={styles.moduleLinks}>
                                    <NavLink to="/admin/users"
                                             className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                        <FaUsers/>
                                        <span>Clientes</span>
                                    </NavLink>
                                    <NavLink to="/admin/products"
                                             className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                        <FaBoxOpen/>
                                        <span>Inventario</span>
                                    </NavLink>
                                    <NavLink to="/admin/sales-history"
                                             className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                        <FaHistory/>
                                        <span>Ventas</span>
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/* MÓDULO 2: ANÁLISIS Y REPORTES */}
                        <div className={styles.moduleSection}>
                            <button 
                                className={styles.moduleHeader}
                                onClick={() => toggleModule('analisis')}
                            >
                                <div className={styles.moduleTitle}>
                                    <FaBrain className={styles.moduleIcon} />
                                    <span>Módulo 2: Análisis</span>
                                </div>
                                {openModules.analisis ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            {openModules.analisis && (
                                <div className={styles.moduleLinks}>
                                    <NavLink to="/admin/ml-dashboard"
                                             className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                        <FaBrain/>
                                        <span>Dashboard ML</span>
                                    </NavLink>
                                    <NavLink to="/admin/ai-reports"
                                             className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                        <FaChartBar/>
                                        <span>Reportes con IA</span>
                                    </NavLink>
                                    <NavLink to="/admin/audit"
                                             className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                        <FaClipboardList/>
                                        <span>Auditoría</span>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* OPCIONES PARA CLIENTES */}
                        <NavLink to="/shop"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaBoxOpen/>
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
                        <NavLink to="/account/profile"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaUser/>
                            <span>Mi Perfil</span>
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