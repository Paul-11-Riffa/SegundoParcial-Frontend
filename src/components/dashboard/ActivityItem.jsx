import React from 'react';
import styles from '../../styles/ActivityItem.module.css';

const ActivityItem = ({ icon, title, description, value }) => {
  return (
    <li className={styles.item}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </div>
      <span className={styles.value}>{value}</span>
    </li>
  );
};

export default ActivityItem;