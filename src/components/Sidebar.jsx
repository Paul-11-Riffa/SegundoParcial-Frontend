import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import {useAuth} from '../hooks/useAuth';
import {
    FaTachometerAlt,
    FaUsers,
    FaSignOutAlt,
    FaBoxOpen,
    FaStore,
    FaShoppingCart,
    FaHistory,
    FaListAlt
} from 'react-icons/fa';

const Sidebar = () => {
    const {user, isAdmin} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
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
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/shop"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaStore/>
                    <span>Shop</span>
                </NavLink>
                <NavLink to="/cart"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaShoppingCart/>
                    <span>Cart</span>
                </NavLink>
                <NavLink to="/my-orders"
                         className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaListAlt/>
                    <span>My Orders</span>
                </NavLink>
                {isAdmin && (
                    <>
                        <NavLink to="/admin/users"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaUsers/>
                            <span>Manage Users</span>
                        </NavLink>
                        <NavLink to="/admin/products"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaBoxOpen/>
                            <span>Manage Products</span>
                        </NavLink>
                        <NavLink to="/admin/sales-history"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaHistory/>
                            <span>Sales History</span>
                        </NavLink>
                    </>
                )}
                {!isAdmin && (
                    <>
                        <NavLink to="/profile"
                                 className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            <FaUsers/>
                            <span>Profile</span>
                        </NavLink>


                    </>
                )}

            </nav>
            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FaSignOutAlt/>
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;