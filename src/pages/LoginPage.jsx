import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import loginImage from '../assets/toallas.jpg';

const LoginPage = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.splitScreen}>
        {/* LADO A - EL FORMULARIO (La Acción) */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            <AuthForm
              formType="login"
              onSubmit={loginUser}
              title="Bienvenido de nuevo"
              subtitle="Ingresa a tu cuenta"
            />
            
            <div className={styles.footerLinks}>
              <p>¿No tienes cuenta? <Link to="/signup" className={styles.linkText}>Regístrate aquí</Link></p>
            </div>
          </div>
        </div>

        {/* LADO B - LA IMAGEN (La Emoción) */}
        <div className={styles.imageSide}>
          <img src={loginImage} alt="" className={styles.aspirationalImage} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;