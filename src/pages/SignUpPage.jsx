import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import backgroundImage from '../assets/background.png';

const SignUpPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img
          src={backgroundImage}
          alt="Abstract background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Crea tu Cuenta</h1>
          <p className={styles.subtitle}>
            Comparte tu arte y consigue proyectos!
          </p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Sign Up</h2>
          <AuthForm formType="signup" onSubmit={registerUser} />
          <p className={styles.redirectText}>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;