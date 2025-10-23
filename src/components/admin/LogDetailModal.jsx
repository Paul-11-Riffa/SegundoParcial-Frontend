import { useEffect, useState } from 'react';
import { getAuditLogDetail } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import styles from '../../styles/LogDetailModal.module.css';

const LogDetailModal = ({ logId, onClose }) => {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadLogDetail = async () => {
      try {
        setLoading(true);
        const response = await getAuditLogDetail(logId);
        setLog(response.data);
      } catch (error) {
        console.error('Error al cargar detalle del log:', error);
        showToast('Error al cargar el detalle del log', 'error');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (logId) {
      loadLogDetail();
    }
  }, [logId, onClose, showToast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: '#10b981',
      MEDIUM: '#f59e0b',
      HIGH: '#f97316',
      CRITICAL: '#ef4444'
    };
    return colors[severity] || '#6b7280';
  };

  const formatJSON = (jsonString) => {
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString || 'N/A';
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className={styles.modalOverlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Cargando detalle...</h2>
            <button className={styles.closeButton} onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              <p>Cargando información del log...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!log) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <h2>🔍 Detalle de Log #{log.id}</h2>
            <span 
              className={styles.severityBadge}
              style={{ backgroundColor: getSeverityColor(log.severity) }}
            >
              {log.severity_display}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Información General */}
          <section className={styles.section}>
            <h3>📋 Información General</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Usuario:</label>
                <span className={styles.username}>{log.username}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Tipo de Acción:</label>
                <span className={styles.actionType}>{log.action_type_display}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Descripción:</label>
                <span>{log.action_description}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Fecha/Hora:</label>
                <span>{formatDate(log.timestamp)}</span>
              </div>
            </div>
          </section>

          {/* Información de Request */}
          <section className={styles.section}>
            <h3>🌐 Información de Request</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Método HTTP:</label>
                <span className={styles.httpMethod}>{log.http_method}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Endpoint:</label>
                <span className={styles.endpoint}>{log.endpoint}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Parámetros Query:</label>
                <span>{log.query_params || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>IP Address:</label>
                <span className={styles.ipAddress}>{log.ip_address}</span>
              </div>
            </div>

            {/* Request Body */}
            {log.request_body && (
              <div className={styles.codeBlock}>
                <label>Request Body:</label>
                <pre>{formatJSON(log.request_body)}</pre>
              </div>
            )}

            {/* User Agent */}
            {log.user_agent && (
              <div className={styles.infoItem} style={{ marginTop: '1rem' }}>
                <label>User Agent:</label>
                <span className={styles.userAgent}>{log.user_agent}</span>
              </div>
            )}
          </section>

          {/* Información de Response */}
          <section className={styles.section}>
            <h3>📊 Información de Response</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Estado HTTP:</label>
                <span className={`${styles.statusCode} ${log.success ? styles.success : styles.error}`}>
                  {log.response_status}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Éxito:</label>
                <span className={log.success ? styles.successBadge : styles.errorBadge}>
                  {log.success ? '✓ Exitoso' : '✗ Error'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label>Tiempo de Respuesta:</label>
                <span className={styles.responseTime}>{log.response_time_ms} ms</span>
              </div>
              <div className={styles.infoItem}>
                <label>Severidad:</label>
                <span 
                  className={styles.severityInline}
                  style={{ backgroundColor: getSeverityColor(log.severity) }}
                >
                  {log.severity_display}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {log.error_message && (
              <div className={styles.errorBlock}>
                <label>⚠️ Mensaje de Error:</label>
                <pre className={styles.errorMessage}>{log.error_message}</pre>
              </div>
            )}
          </section>

          {/* Datos Adicionales */}
          {log.additional_data && Object.keys(log.additional_data).length > 0 && (
            <section className={styles.section}>
              <h3>🔧 Datos Adicionales</h3>
              <div className={styles.codeBlock}>
                <pre>{formatJSON(log.additional_data)}</pre>
              </div>
            </section>
          )}

          {/* Metadatos del Usuario */}
          <section className={styles.section}>
            <h3>👤 Metadatos del Usuario</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>User ID:</label>
                <span>{log.user || 'N/A'}</span>
              </div>
              {log.additional_data?.is_staff !== undefined && (
                <div className={styles.infoItem}>
                  <label>Es Staff:</label>
                  <span>{log.additional_data.is_staff ? '✓ Sí' : '✗ No'}</span>
                </div>
              )}
              {log.additional_data?.is_superuser !== undefined && (
                <div className={styles.infoItem}>
                  <label>Es Superuser:</label>
                  <span>{log.additional_data.is_superuser ? '✓ Sí' : '✗ No'}</span>
                </div>
              )}
              {log.additional_data?.view_name && (
                <div className={styles.infoItem}>
                  <label>Vista:</label>
                  <span>{log.additional_data.view_name}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.closeButtonBottom} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
