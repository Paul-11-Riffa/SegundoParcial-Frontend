import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminDashboard.module.css';
import SummaryCard from '../components/dashboard/SummaryCard';
import { FaDollarSign, FaChartLine, FaFileAlt } from 'react-icons/fa';

// Datos de ejemplo para la lista de ventas recientes
const recentSales = [
  { name: 'Steven Summer', avatar: 'S', amount: '+ $52.00', time: 'Justo ahora' },
  { name: 'Jordan Mabaze', avatar: 'J', amount: '+ $83.00', time: 'Hace 2 minutos' },
  { name: 'Jessica Alba', avatar: 'J', amount: '+ $61.60', time: 'Hace 5 minutos' },
  { name: 'Anna Armas', avatar: 'A', amount: '+ $2351.00', time: 'Hace 10 minutos' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigateToReports = () => {
    navigate('/reports');
  };

  return (
    // Este div es el único contenedor de la página del dashboard
    <div className={styles.dashboard}>
      {/* YA NO HAY NINGÚN <header> AQUÍ. Eso es correcto. */}

      <div className={styles.summaryGrid}>
        <SummaryCard
          title="Saldo"
          value="$56,874"
          change="+17"
          icon={<FaDollarSign />}
          color="#28a745"
        />
        <SummaryCard
          title="Ventas"
          value="$24,575"
          change="+23"
          icon={<FaChartLine />}
          color="#007bff"
        />
        <div className={styles.upgradeCard}>
          <h4>Reportes Dinámicos</h4>
          <p>Genera reportes de ventas con texto o voz.</p>
          <button onClick={handleNavigateToReports}>
            <FaFileAlt style={{ marginRight: '8px' }} />
            Ir a Reportes
          </button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mainChart}>
          <h3>Usuarios en la Última Semana</h3>
          <div className={styles.chartPlaceholder}>[ Gráfico Placeholder ]</div>
        </div>
        <div className={styles.sideWidget}>
          <h3>Ventas Recientes</h3>
          <ul className={styles.salesList}>
            {recentSales.map((sale, index) => (
              <li key={index} className={styles.saleItem}>
                <div className={styles.saleAvatar}>{sale.avatar}</div>
                <div className={styles.saleInfo}>
                  <span className={styles.saleName}>{sale.name}</span>
                  <span className={styles.saleTime}>{sale.time}</span>
                </div>
                <span className={styles.saleAmount}>{sale.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;