import React from 'react';
import styles from '../styles/ClientDashboard.module.css';
import SummaryCard from '../components/dashboard/SummaryCard';
import ActivityItem from '../components/dashboard/ActivityItem';
import { FaWallet, FaRocket, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

// Datos de ejemplo para la actividad del cliente
const recentActivity = [
  { icon: <FaCheckCircle color="#28a745" />, title: 'Proyecto "Zenith" Completado', description: 'Pago Recibido', value: '+$2,500' },
  { icon: <FaRocket color="#007bff" />, title: 'Nuevo Proyecto Iniciado', description: 'Factura #INV-007', value: '-$500' },
  { icon: <FaExclamationTriangle color="#ffc107" />, title: 'Fecha Límite Próxima', description: 'Proyecto "Odyssey"', value: '3 días restantes' },
];

const ClientDashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* Tarjetas de Resumen */}
      <div className={styles.summaryGrid}>
        <SummaryCard
          title="Saldo del Portafolio"
          value="$17,643"
          icon={<FaWallet />}
          color="#1a222e"
        />
        <SummaryCard
          title="Proyectos Activos"
          value="3"
          icon={<FaRocket />}
          color="#007bff"
        />
        <div className={styles.ctaCard}>
          <h4>Iniciar un Nuevo Proyecto</h4>
          <p>Creemos algo increíble juntos.</p>
          <button>
            Comenzar <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className={styles.mainGrid}>
        <div className={styles.mainWidget}>
          <h3>Resumen del Portafolio</h3>
          <div className={styles.chartPlaceholder}>[ Gráfico Placeholder ]</div>
        </div>
        <div className={styles.sideWidget}>
          <h3>Actividad Reciente</h3>
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