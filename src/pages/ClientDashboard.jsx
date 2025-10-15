import React from 'react';
import styles from '../styles/ClientDashboard.module.css';
import SummaryCard from '../components/dashboard/SummaryCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import { FaWallet, FaRocket, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

// Datos de ejemplo para la actividad del cliente
const recentActivity = [
  { icon: <FaCheckCircle color="#28a745" />, title: 'Project "Zenith" Completed', description: 'Payment Received', value: '+$2,500' },
  { icon: <FaRocket color="#007bff" />, title: 'New Project Started', description: 'Invoice #INV-007', value: '-$500' },
  { icon: <FaExclamationTriangle color="#ffc107" />, title: 'Upcoming Deadline', description: 'Project "Odyssey"', value: '3 days left' },
];

const ClientDashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* Tarjetas de Resumen */}
      <div className={styles.summaryGrid}>
        <SummaryCard
          title="Portfolio Balance"
          value="$17,643"
          icon={<FaWallet />}
          color="#1a222e"
        />
        <SummaryCard
          title="Active Projects"
          value="3"
          icon={<FaRocket />}
          color="#007bff"
        />
        <div className={styles.ctaCard}>
          <h4>Start a New Project</h4>
          <p>Let's create something amazing together.</p>
          <button>
            Get Started <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className={styles.mainGrid}>
        <div className={styles.mainWidget}>
          <h3>Portfolio Overview</h3>
          <div className={styles.chartPlaceholder}>[ Chart Placeholder ]</div>
        </div>
        <div className={styles.sideWidget}>
          <h3>Recent Activity</h3>
          <ul className={styles.activityList}>
            {recentActivity.map((item, index) => (
              <ActivityItem
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                value={item.value}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;