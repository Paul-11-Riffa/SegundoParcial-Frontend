import React from 'react';
import styles from '../styles/AdminDashboard.module.css';
import SummaryCard from '../components/dashboard/SummaryCard';
import { FaDollarSign, FaChartLine } from 'react-icons/fa';

// Datos de ejemplo para la lista de ventas recientes
const recentSales = [
  { name: 'Steven Summer', avatar: 'S', amount: '+ $52.00', time: 'Just now' },
  { name: 'Jordan Mabaze', avatar: 'J', amount: '+ $83.00', time: '2 Minutes Ago' },
  { name: 'Jessica Alba', avatar: 'J', amount: '+ $61.60', time: '5 Minutes Ago' },
  { name: 'Anna Armas', avatar: 'A', amount: '+ $2351.00', time: '10 Minutes Ago' },
];

const AdminDashboard = () => {
  return (
    // Este div es el único contenedor de la página del dashboard
    <div className={styles.dashboard}>
      {/* YA NO HAY NINGÚN <header> AQUÍ. Eso es correcto. */}

      <div className={styles.summaryGrid}>
        <SummaryCard
          title="Balance"
          value="$56,874"
          change="+17"
          icon={<FaDollarSign />}
          color="#28a745"
        />
        <SummaryCard
          title="Sales"
          value="$24,575"
          change="+23"
          icon={<FaChartLine />}
          color="#007bff"
        />
        <div className={styles.upgradeCard}>
          <h4>Upgrade Plan</h4>
          <p>Obtén más información y oportunidades.</p>
          <button>Go Pro</button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mainChart}>
          <h3>User In The Last Week</h3>
          <div className={styles.chartPlaceholder}>[ Chart Placeholder ]</div>
        </div>
        <div className={styles.sideWidget}>
          <h3>Recent Sales</h3>
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