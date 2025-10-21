import React from 'react';
import styles from '../../styles/MLDashboardPage.module.css';

function DashboardHeader({ overview }) {
  if (!overview) return null;

  const formatCurrency = (value) => {
    return `$${value?.toLocaleString() || '0'}`;
  };

  const formatGrowthRate = (rate) => {
    if (!rate && rate !== 0) return 'N/A';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  return (
    <div className={styles.dashboardHeader}>
      <h1>📊 Predicciones de Ventas - IA/ML</h1>
      
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard} data-color="blue">
          <div className={styles.cardIcon}>📅</div>
          <div className={styles.cardContent}>
            <p className={styles.cardTitle}>Próxima Semana</p>
            <p className={styles.cardValue}>
              {formatCurrency(overview.next_week?.total_sales)}
            </p>
            <p className={styles.cardSubtitle}>
              Top: {overview.next_week?.top_product?.name || 'N/A'}
            </p>
          </div>
        </div>

        <div className={styles.summaryCard} data-color="green">
          <div className={styles.cardIcon}>📆</div>
          <div className={styles.cardContent}>
            <p className={styles.cardTitle}>Próximo Mes</p>
            <p className={styles.cardValue}>
              {formatCurrency(overview.next_month?.total_sales)}
            </p>
            <p className={styles.cardSubtitle}>
              Top: {overview.next_month?.top_product?.name || 'N/A'}
            </p>
          </div>
        </div>

        <div className={styles.summaryCard} data-color="orange">
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardContent}>
            <p className={styles.cardTitle}>Próximo Trimestre</p>
            <p className={styles.cardValue}>
              {formatCurrency(overview.next_quarter?.total_sales)}
            </p>
            <p className={styles.cardSubtitle}>
              Tendencia: {formatGrowthRate(overview.overall_growth_trend)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
