import styles from '../../styles/SkeletonLoaders.module.css';

// Skeleton para tabla de logs/sesiones
export const TableSkeleton = ({ rows = 10, columns = 7 }) => {
  return (
    <div className={styles.tableSkeleton}>
      {/* Header */}
      <div className={styles.tableHeader}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className={styles.skeletonHeader}></div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.tableRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className={styles.skeletonCell}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Skeleton para tarjetas de estadísticas
export const StatsSkeleton = ({ cards = 4 }) => {
  return (
    <div className={styles.statsGrid}>
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className={styles.statsCard}>
          <div className={styles.skeletonIcon}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonSubtitle}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton para gráficas
export const ChartSkeleton = () => {
  return (
    <div className={styles.chartSkeleton}>
      <div className={styles.chartHeader}>
        <div className={styles.skeletonChartTitle}></div>
        <div className={styles.skeletonChartSubtitle}></div>
      </div>
      <div className={styles.chartBody}>
        <div className={styles.skeletonChart}></div>
      </div>
    </div>
  );
};

// Skeleton para grid de gráficas
export const ChartsGridSkeleton = ({ charts = 4 }) => {
  return (
    <div className={styles.chartsGrid}>
      {Array.from({ length: charts }).map((_, index) => (
        <ChartSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton para lista de alertas
export const AlertsSkeleton = ({ items = 5 }) => {
  return (
    <div className={styles.alertsList}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className={styles.alertCard}>
          <div className={styles.alertHeader}>
            <div className={styles.skeletonAlertType}></div>
            <div className={styles.skeletonAlertBadge}></div>
          </div>
          <div className={styles.skeletonAlertMessage}></div>
          <div className={styles.skeletonAlertDetails}>
            <div className={styles.skeletonAlertDetail}></div>
            <div className={styles.skeletonAlertDetail}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton para secciones de estadísticas
export const StatsListSkeleton = ({ items = 5 }) => {
  return (
    <div className={styles.statsList}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className={styles.statsItem}>
          <div className={styles.skeletonLabel}></div>
          <div className={styles.skeletonValue}></div>
        </div>
      ))}
    </div>
  );
};

// Componente genérico de texto skeleton
export const TextSkeleton = ({ width = '100%', height = '20px' }) => {
  return (
    <div 
      className={styles.skeletonText} 
      style={{ width, height }}
    ></div>
  );
};
