import React from 'react';
import styles from '../../styles/MLDashboardPage.module.css';

function ErrorState({ error, onRetry }) {
  return (
    <div className={styles.errorState}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3>Error al Cargar Predicciones</h3>
      <p className={styles.errorMessage}>{error}</p>
      <button onClick={onRetry} className={styles.retryButton}>
        Reintentar
      </button>
    </div>
  );
}

export default ErrorState;
