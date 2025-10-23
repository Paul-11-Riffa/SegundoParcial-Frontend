import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import formStyles from '../styles/AuthForm.module.css';
import domusLogo from '../assets/domus-logo.jpg';
import forgotPasswordImage from '../assets/cocina-atardecer.jpg';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.data.detail);
    } catch (error) {
      setMessage('Ocurrió un error. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.splitScreen}>
        {/* LADO A - EL FORMULARIO */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            {/* Logo DOMUS */}
            <div className={formStyles.logoContainer}>
              <img src={domusLogo} alt="DOMUS" className={formStyles.logo} />
            </div>

            {/* Título */}
            <div className={formStyles.header}>
              <h1 className={formStyles.title}>¿Olvidaste tu contraseña?</h1>
              <p className={formStyles.subtitle}>
                No te preocupes, te enviaremos instrucciones de recuperación
              </p>
            </div>

            {message ? (
              <div className={formStyles.successMessage}>
                <p>{message}</p>
                <Link to="/login" className={formStyles.backLink}>
                  Volver al inicio de sesión
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={formStyles.form}>
                <div className={formStyles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={formStyles.input}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={formStyles.submitButton} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            )}

            <div className={styles.footerLinks}>
              <p>
                <Link to="/login" className={styles.linkText}>
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* LADO B - LA IMAGEN */}
        <div className={styles.imageSide}>
          <img src={forgotPasswordImage} alt="" className={styles.aspirationalImage} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;