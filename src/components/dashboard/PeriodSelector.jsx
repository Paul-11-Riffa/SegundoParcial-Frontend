import React from 'react';
import styles from '../../styles/AdminDashboard.module.css';

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Próxima Semana', days: 7 },
  { value: '14d', label: 'Próximas 2 Semanas', days: 14 },
  { value: '30d', label: 'Próximo Mes', days: 30 },
  { value: '90d', label: 'Próximos 3 Meses', days: 90 }
];

function PeriodSelector({ selectedPeriod, onPeriodChange }) {
  return (
    <div className={styles.periodSelector}>
      {PERIOD_OPTIONS.map(period => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`${styles.periodButton} ${
            selectedPeriod === period.value ? styles.active : ''
          }`}
          data-period={period.value}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

export default PeriodSelector;
