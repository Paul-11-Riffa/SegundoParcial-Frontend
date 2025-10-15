import React from 'react';
import styles from '../../styles/ConfirmationModal.module.css';

const ConfirmationModal = ({ message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>{cancelText}</button>
          <button onClick={onConfirm} className={styles.confirmButton}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;