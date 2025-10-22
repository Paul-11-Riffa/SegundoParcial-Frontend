import React, { useState, useEffect } from 'react';
import { getCombinedPredictionsDashboard, clearPredictionsCache } from '../services/api';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PeriodSelector from '../components/dashboard/PeriodSelector';
import SalesPredictionChart from '../components/dashboard/SalesPredictionChart';
import TopProductsChart from '../components/dashboard/TopProductsChart';
import LoadingState from '../components/dashboard/LoadingState';
import ErrorState from '../components/dashboard/ErrorState';
import styles from '../styles/MLDashboardPage.module.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dashboardData, setDashboardData] = useState(null);
  const [cacheClearing, setCacheClearing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCombinedPredictionsDashboard(10, false);

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.error || 'Error al cargar predicciones');
      }
    } catch (err) {
      console.error('Error loading predictions:', err);
      
      if (err.response?.status === 424) {
        setError('El modelo ML necesita ser entrenado. Contacta al administrador del sistema.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al cargar predicciones: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('¿Estás seguro de que quieres limpiar la caché de predicciones?')) {
      return;
    }

    setCacheClearing(true);
    try {
      await clearPredictionsCache();
      alert('Caché limpiada exitosamente');
      loadDashboardData();
    } catch (err) {
      console.error('Error clearing cache:', err);
      alert('Error al limpiar la caché: ' + err.message);
    } finally {
      setCacheClearing(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadDashboardData} />;
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className={styles.mlDashboard}>
      <DashboardHeader overview={dashboardData.overview} />

      <div className={styles.controls}>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        
        <div className={styles.actions}>
          <button 
            onClick={loadDashboardData}
            className={styles.refreshButton}
            disabled={loading}
          >
            🔄 Actualizar
          </button>
          <button 
            onClick={handleClearCache}
            className={styles.clearCacheButton}
            disabled={cacheClearing}
          >
            🗑️ {cacheClearing ? 'Limpiando...' : 'Limpiar Caché'}
          </button>
        </div>
      </div>

      {dashboardData.cached && (
        <div className={styles.cacheIndicator}>
          ℹ️ Datos en caché
        </div>
      )}

      <SalesPredictionChart
        data={dashboardData.sales_predictions[selectedPeriod]}
        period={selectedPeriod}
      />

      <TopProductsChart
        data={dashboardData.top_products[selectedPeriod]}
        period={selectedPeriod}
      />

      {dashboardData.overview?.model_last_trained && (
        <div className={styles.modelInfo}>
          <p>
            🤖 Modelo entrenado el: {new Date(dashboardData.overview.model_last_trained).toLocaleString('es-ES')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
