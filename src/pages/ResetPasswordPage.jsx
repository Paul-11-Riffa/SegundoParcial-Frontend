import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resetPasswordConfirm } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import formStyles from '../styles/AuthForm.module.css';
import domusLogo from '../assets/domus-logo.jpg';
import resetPasswordImage from '../assets/cocina-marmol.jpg';

const ResetPasswordPage = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resetPasswordConfirm({ uidb64, token, password });
      setMessage(response.data.detail);
    } catch (err) {
      setError(err.response?.data?.detail || 'Enlace inválido o expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.splitScreen}>
        {/* LADO B - LA IMAGEN */}
        <div className={styles.imageSide}>
          <img src={resetPasswordImage} alt="" className={styles.aspirationalImage} />
        </div>

        {/* LADO A - EL FORMULARIO */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            {/* Logo DOMUS */}
            <div className={formStyles.logoContainer}>
              <img src={domusLogo} alt="DOMUS" className={formStyles.logo} />
            </div>

            {/* Título */}
            <div className={formStyles.header}>
              <h1 className={formStyles.title}>Nueva contraseña</h1>
              <p className={formStyles.subtitle}>
                Ingresa una contraseña segura y diferente a la anterior
              </p>
            </div>

            {message ? (
              <div className={formStyles.successMessage}>
                <p>{message}</p>
                <Link to="/login" className={formStyles.backLink}>
                  Ir al inicio de sesión
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={formStyles.form}>
                <div className={formStyles.inputGroup}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={formStyles.input}
                    minLength="8"
                  />
                </div>
                {error && <p className={formStyles.error}>{error}</p>}
                <button 
                  type="submit" 
                  className={formStyles.submitButton} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Cambiar contraseña'}
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;