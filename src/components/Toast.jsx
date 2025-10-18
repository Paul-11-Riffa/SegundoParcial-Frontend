import React, { useEffect } from 'react';
import styles from '../styles/Toast.module.css';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaCheckCircle />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;