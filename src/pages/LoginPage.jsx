import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import brandingImage from '../assets/background.png'; // Usaremos la imagen que ya tienes

const LoginPage = () => {
  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.formPanel}>
          <div className={styles.formWrapper}>
            <AuthForm
              formType="login"
              onSubmit={loginUser}
              title="Welcome Back Creative!"
              subtitle="We Are Happy To See You Again"
            />
          </div>
        </div>
        <div className={styles.brandingPanel}>
          <img src={brandingImage} alt="Branding" className={styles.brandingImage} />
          <div className={styles.brandingOverlay}></div>
           <div className={styles.brandingContent}>
            <p>© 2025 Gradiator. All rights reserved.</p>
            <p>The platform for creatives to connect and collaborate.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;