import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import backgroundImage from '../assets/background.png';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img
          src={backgroundImage}
          alt="Abstract background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Bienvenido de Vuelta</h1>
          <p className={styles.subtitle}>Inicia sesión para continuar</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Login</h2>
          <AuthForm formType="login" onSubmit={loginUser} />
          <p className={styles.redirectText}>
            ¿No tienes una cuenta? <Link to="/signup">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;