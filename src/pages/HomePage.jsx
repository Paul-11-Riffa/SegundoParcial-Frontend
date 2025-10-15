import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Borramos el token y redirigimos al login
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>¡Inicio de Sesión Exitoso!</h1>
      <p className={styles.message}>Bienvenido a tu dashboard.</p>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default HomePage;