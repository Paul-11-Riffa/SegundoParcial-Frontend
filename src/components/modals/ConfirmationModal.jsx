import React from 'react';
import styles from '../../styles/ConfirmationModal.module.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importamos un ícono de advertencia

// Cambiamos el prop 'message' por 'title' y 'children' para más flexibilidad
const ConfirmationModal = ({ title, children, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Contenedor para el nuevo ícono */}
        <div className={styles.iconWrapper}>
          <FaExclamationTriangle />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{children}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>{cancelText}</button>
          <button onClick={onConfirm} className={styles.confirmButton}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;