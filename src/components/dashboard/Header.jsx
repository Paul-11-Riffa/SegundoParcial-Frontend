import React from 'react';
import styles from '../../styles/Header.module.css';
import { useAuth } from '../../hooks/useAuth';
import { FaSearch, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // 1. Importa Link

const Header = () => {
  const { user, isAdmin } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.welcomeSection}>
        <h3>Welcome Back, {user?.first_name}!</h3>
        <p>Here is the information about your project.</p>
      </div>
      <div className={styles.actionsSection}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search anything..." />
        </div>
        <FaBell className={styles.icon} />
        {/* 2. Envuelve el perfil en un Link */}
        <Link to="/profile">
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {isAdmin ? 'A' : user?.first_name?.charAt(0)}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;