import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styles from '../../styles/SummaryCard.module.css';

const SummaryCard = ({ title, value, change, icon, color }) => {
  const isPositive = change && parseFloat(change) >= 0;

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
        {change && (
          <p className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(change)}%
          </p>
        )}
      </div>
      <div className={styles.iconWrapper} style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  );
};

export default SummaryCard;