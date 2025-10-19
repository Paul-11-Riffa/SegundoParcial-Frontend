import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import backgroundImage from '../assets/background.png';

const SignUpPage = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.formPanel}>
          <div className={styles.formWrapper}>
            <AuthForm
              formType="signup"
              onSubmit={registerUser}
              title="Crea Tu Cuenta"
              subtitle="Únete a nuestra plataforma comercial"
            />
          </div>
        </div>
        <div className={styles.brandingPanel}>
           <img src={backgroundImage} alt="Branding" className={styles.brandingImage} />
           <div className={styles.brandingOverlay}></div>
           <div className={styles.brandingContent}>
            <p>© 2025 SmartSales365. Todos los derechos reservados.</p>
            <p>La plataforma inteligente de gestión comercial y reportes dinámicos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;