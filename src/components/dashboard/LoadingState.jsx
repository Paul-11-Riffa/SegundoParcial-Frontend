import React from 'react';
import styles from '../../styles/MLDashboardPage.module.css';

function LoadingState() {
  return (
    <div className={styles.loadingState}>
      <div className={styles.spinner}></div>
      <p>Cargando predicciones ML...</p>
    </div>
  );
}

export default LoadingState;
