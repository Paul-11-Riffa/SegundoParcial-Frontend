import { useState } from 'react';
import { cleanOldLogs } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import styles from '../../styles/CleanLogsModal.module.css';

const CleanLogsModal = ({ onClose, onSuccess }) => {
  const [days, setDays] = useState(30);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleClean = async () => {
    if (days < 30) {
      showToast('El mínimo permitido es 30 días', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await cleanOldLogs(days);
      const deletedCount = response.data.deleted_count || 0;
      
      showToast(
        `✓ Se eliminaron ${deletedCount} registros exitosamente`,
        'success'
      );
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al limpiar logs:', error);
      if (error.response?.status === 403) {
        showToast('No tienes permisos para realizar esta acción', 'error');
      } else if (error.response?.status === 400) {
        showToast(error.response.data.error || 'Datos inválidos', 'error');
      } else {
        showToast('Error al eliminar registros antiguos', 'error');
      }
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (days < 30) {
      showToast('El mínimo permitido es 30 días', 'error');
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h2>🗑️ Limpieza de Logs Antiguos</h2>
              <button 
                className={styles.closeButton} 
                onClick={onClose}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className={styles.modalContent}>
              <div className={styles.warningBox}>
                <div className={styles.warningIcon}>⚠️</div>
                <div className={styles.warningText}>
                  <h3>Acción Irreversible</h3>
                  <p>
                    Esta operación eliminará permanentemente los registros de 
                    auditoría más antiguos que el período especificado.
                  </p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="days">
                  <strong>Mantener logs de los últimos:</strong>
                </label>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    id="days"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 30)}
                    min="30"
                    className={styles.input}
                    disabled={loading}
                  />
                  <span className={styles.inputLabel}>días</span>
                </div>
                <p className={styles.helpText}>
                  Mínimo: <strong>30 días</strong>. Los logs más recientes que este período 
                  se mantendrán en el sistema.
                </p>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon}>ℹ️</div>
                <div className={styles.infoText}>
                  <strong>Nota importante:</strong> Esta acción eliminará todos los 
                  registros de auditoría anteriores a los últimos <strong>{days} días</strong>.
                  Asegúrate de haber generado y guardado los reportes necesarios antes 
                  de proceder.
                </div>
              </div>

              <div className={styles.securityNote}>
                <p>🔒 Esta operación requiere permisos de administrador y quedará registrada.</p>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className={styles.cleanButton}
                onClick={handleSubmit}
                disabled={loading || days < 30}
              >
                Continuar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation Header */}
            <div className={styles.modalHeader}>
              <h2>⚠️ Confirmar Eliminación</h2>
            </div>

            {/* Confirmation Content */}
            <div className={styles.modalContent}>
              <div className={styles.confirmationBox}>
                <div className={styles.confirmationIcon}>🗑️</div>
                <h3>¿Estás completamente seguro?</h3>
                <p>
                  Estás a punto de eliminar <strong>permanentemente</strong> todos 
                  los registros de auditoría anteriores a los últimos <strong>{days} días</strong>.
                </p>
                <div className={styles.confirmationWarning}>
                  <p>⚠️ Esta acción NO se puede deshacer</p>
                  <p>⚠️ Los registros eliminados no se pueden recuperar</p>
                  <p>⚠️ Se recomienda hacer un backup antes de proceder</p>
                </div>
              </div>
            </div>

            {/* Confirmation Footer */}
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                No, Cancelar
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleClean}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Eliminando...
                  </>
                ) : (
                  'Sí, Eliminar Registros'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CleanLogsModal;
