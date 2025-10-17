import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resetPasswordConfirm } from '../services/api';
import styles from '../styles/AuthPages.module.css';
import formStyles from '../styles/AuthForm.module.css';

const ResetPasswordPage = () => {
  const { uidb64, token } = useParams(); // Obtenemos los parámetros de la URL
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
      setError(err.response?.data?.detail || 'Invalid or expired link.');
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
              <h1 className={formStyles.title}>Set a New Password</h1>
              <p className={formStyles.subtitle}>
                Your new password must be different from previous ones.
              </p>
            </div>

            {message ? (
              <div className={formStyles.successMessage}>
                <p>{message}</p>
                <Link to="/login" className={formStyles.backLink}>Proceed to Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={formStyles.form}>
                <div className={formStyles.inputGroup}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={formStyles.input}
                  />
                </div>
                {error && <p className={formStyles.error}>{error}</p>}
                <button type="submit" className={formStyles.submitButton} disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;