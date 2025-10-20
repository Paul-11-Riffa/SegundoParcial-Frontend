import React from 'react';
import styles from '../../styles/TrustBadges.module.css';
import { FaShippingFast, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';

/**
 * TrustBadges Component - Premium Style
 * Sin logos genéricos feos. Texto + íconos elegantes.
 */
const TrustBadges = ({ variant = 'horizontal', showIcons = true }) => {
  const badges = [
    {
      icon: <FaShippingFast />,
      text: 'Envío gratis en todas las órdenes',
      color: 'primary'
    },
    {
      icon: <FaShieldAlt />,
      text: 'Garantía premium de 2 años incluida',
      color: 'success'
    },
    {
      icon: <FaUndo />,
      text: 'Devoluciones fáciles en 30 días',
      color: 'info'
    },
    {
      icon: <FaHeadset />,
      text: 'Soporte especializado 24/7',
      color: 'secondary'
    }
  ];

  const layoutClass = variant === 'vertical' ? styles.vertical : styles.horizontal;

  return (
    <div className={`${styles.trustBadges} ${layoutClass}`}>
      {badges.map((badge, index) => (
        <div key={index} className={`${styles.badge} ${styles[badge.color]}`}>
          {showIcons && <span className={styles.icon}>{badge.icon}</span>}
          <span className={styles.text}>{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
