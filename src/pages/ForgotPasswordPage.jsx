import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';
import styles from '../styles/AuthPages.module.css'; // Reutilizamos estilos
import formStyles from '../styles/AuthForm.module.css'; // Reutilizamos estilos

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
      <div className={`${styles.container} ${styles.singlePanel}`}>
        <div className={styles.formPanel}>
          <div className={styles.formWrapper}>
            <div className={formStyles.header}>
              <h1 className={formStyles.title}>¿Olvidaste tu Contraseña?</h1>
              <p className={formStyles.subtitle}>
                ¡No te preocupes! Ingresa tu correo y te enviaremos un enlace de recuperación.
              </p>
            </div>

            {message ? (
              <div className={formStyles.successMessage}>
                <p>{message}</p>
                <Link to="/login" className={formStyles.backLink}>Volver al Inicio de Sesión</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={formStyles.form}>
                <div className={formStyles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={formStyles.input}
                  />
                </div>
                <button type="submit" className={formStyles.submitButton} disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;