import { useState } from 'react';
import styles from '../../styles/EnhancedAlerts.module.css';

const EnhancedAlerts = ({ alerts }) => {
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  if (!alerts || !alerts.alerts) {
    return <div className={styles.noAlerts}>No hay alertas disponibles</div>;
  }

  // Obtener tipo de alerta con icono
  const getAlertIcon = (type) => {
    const icons = {
      'critical_actions_summary': '⚠️',
      'critical_action_detail': '🔴',
      'failed_login_attempts_summary': '🔒',
      'failed_login_detail': '🔴',
      'multiple_ips_summary': '🌐',
      'server_errors_summary': '🔥',
      'server_error_detail': '🔥',
      'delete_actions_summary': '🗑️',
      'delete_action_detail': '🗑️',
      'high_activity_user': '📊'
    };
    return icons[type] || '⚠️';
  };

  // Obtener label amigable del tipo
  const getTypeLabel = (type) => {
    const labels = {
      'critical_actions_summary': 'Resumen de Acciones Críticas',
      'critical_action_detail': 'Detalle de Acción Crítica',
      'failed_login_attempts_summary': 'Resumen de Intentos Fallidos',
      'failed_login_detail': 'Intento de Login Fallido',
      'multiple_ips_summary': 'Múltiples IPs',
      'server_errors_summary': 'Errores de Servidor',
      'server_error_detail': 'Error de Servidor',
      'delete_actions_summary': 'Eliminaciones Masivas',
      'delete_action_detail': 'Eliminación',
      'high_activity_user': 'Actividad Alta'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleAlert = (index) => {
    setExpandedAlert(expandedAlert === index ? null : index);
  };

  // Filtrar alertas por severidad
  const filteredAlerts = filterSeverity === 'ALL' 
    ? alerts.alerts 
    : alerts.alerts.filter(a => a.severity === filterSeverity);

  // Agrupar alertas: resúmenes primero, detalles después
  const summaries = filteredAlerts.filter(a => a.type.includes('_summary') || a.type === 'high_activity_user');
  const details = filteredAlerts.filter(a => a.type.includes('_detail'));

  return (
    <div className={styles.enhancedAlerts}>
      {/* Header con estadísticas */}
      <div className={styles.alertsHeader}>
        <div className={styles.alertsTitle}>
          <h3>🚨 Alertas de Seguridad</h3>
          <span className={styles.totalBadge}>{alerts.total_alerts} alertas</span>
        </div>
        <p className={styles.period}>Período: {alerts.period}</p>
      </div>

      {/* Resumen por severidad */}
      <div className={styles.severitySummary}>
        <button
          className={`${styles.severityBtn} ${filterSeverity === 'ALL' ? styles.active : ''}`}
          onClick={() => setFilterSeverity('ALL')}
        >
          <span className={styles.severityLabel}>Todas</span>
          <span className={styles.severityCount}>{alerts.total_alerts}</span>
        </button>
        {alerts.alert_types && Object.entries(alerts.alert_types).map(([severity, count]) => (
          <button
            key={severity}
            className={`${styles.severityBtn} ${styles[severity.toLowerCase()]} ${filterSeverity === severity ? styles.active : ''}`}
            onClick={() => setFilterSeverity(severity)}
          >
            <span className={styles.severityLabel}>{severity}</span>
            <span className={styles.severityCount}>{count}</span>
          </button>
        ))}
      </div>

      {/* Lista de alertas agrupadas */}
      <div className={styles.alertsContainer}>
        {/* Resúmenes */}
        {summaries.length > 0 && (
          <div className={styles.alertGroup}>
            <h4 className={styles.groupTitle}>📋 Resumen de Alertas</h4>
            {summaries.map((alert, index) => (
              <div
                key={`summary-${index}`}
                className={`${styles.alertCard} ${styles[alert.severity.toLowerCase()]}`}
              >
                <div className={styles.alertCardHeader}>
                  <div className={styles.alertMeta}>
                    <span className={styles.alertIcon}>{getAlertIcon(alert.type)}</span>
                    <span className={styles.alertTypeLabel}>{getTypeLabel(alert.type)}</span>
                  </div>
                  <span className={`${styles.severityBadge} ${styles[alert.severity.toLowerCase()]}`}>
                    {alert.severity}
                  </span>
                </div>

                <div className={styles.alertMessage}>{alert.message}</div>

                {/* Información adicional del resumen */}
                <div className={styles.alertInfo}>
                  {alert.count && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>📊 Cantidad:</span>
                      <span className={styles.infoValue}>{alert.count}</span>
                    </div>
                  )}
                  {alert.username && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>👤 Usuario:</span>
                      <span className={styles.infoValue}>{alert.username}</span>
                    </div>
                  )}
                  {alert.ip && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>🌐 IP:</span>
                      <span className={styles.infoValue}>{alert.ip}</span>
                    </div>
                  )}
                  {alert.ip_count && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>🌐 IPs Únicas:</span>
                      <span className={styles.infoValue}>{alert.ip_count}</span>
                    </div>
                  )}
                  {alert.action_count && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>⚡ Acciones:</span>
                      <span className={styles.infoValue}>{alert.action_count}</span>
                    </div>
                  )}
                </div>

                {/* IPs usadas (para múltiples IPs) */}
                {alert.ips_used && alert.ips_used.length > 0 && (
                  <div className={styles.ipsUsed}>
                    <h5>🌐 IPs Detectadas:</h5>
                    <div className={styles.ipsList}>
                      {alert.ips_used.map((ipInfo, idx) => (
                        <div key={idx} className={styles.ipCard}>
                          <span className={styles.ipAddress}>{ipInfo.ip}</span>
                          <span className={styles.ipAccesses}>{ipInfo.accesses} accesos</span>
                          <div className={styles.ipTimes}>
                            <small>Primera: {formatDate(ipInfo.first_seen)}</small>
                            <small>Última: {formatDate(ipInfo.last_seen)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recomendación */}
                {alert.recommendation && (
                  <div className={styles.recommendation}>
                    💡 <strong>Recomendación:</strong> {alert.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Detalles */}
        {details.length > 0 && (
          <div className={styles.alertGroup}>
            <h4 className={styles.groupTitle}>🔍 Detalles de Alertas ({details.length})</h4>
            {details.map((alert, index) => (
              <div
                key={`detail-${index}`}
                className={`${styles.alertCard} ${styles.detailCard} ${styles[alert.severity.toLowerCase()]} ${expandedAlert === index ? styles.expanded : ''}`}
              >
                <div 
                  className={styles.alertCardHeader}
                  onClick={() => toggleAlert(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.alertMeta}>
                    <span className={styles.alertIcon}>{getAlertIcon(alert.type)}</span>
                    <span className={styles.alertTypeLabel}>{getTypeLabel(alert.type)}</span>
                  </div>
                  <div className={styles.headerRight}>
                    <span className={`${styles.severityBadge} ${styles[alert.severity.toLowerCase()]}`}>
                      {alert.severity}
                    </span>
                    <span className={styles.expandIcon}>
                      {expandedAlert === index ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                <div className={styles.alertMessage}>{alert.message}</div>

                {/* Información básica siempre visible */}
                <div className={styles.alertInfo}>
                  {alert.username && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>👤 Usuario:</span>
                      <span className={styles.infoValue}>{alert.username}</span>
                    </div>
                  )}
                  {alert.timestamp && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>🕒 Fecha:</span>
                      <span className={styles.infoValue}>{formatDate(alert.timestamp)}</span>
                    </div>
                  )}
                </div>

                {/* Detalles expandibles */}
                {expandedAlert === index && (
                  <div className={styles.expandedContent}>
                    <div className={styles.detailsGrid}>
                      {alert.log_id && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>🆔 Log ID:</span>
                          <span className={styles.detailValue}>#{alert.log_id}</span>
                        </div>
                      )}
                      {alert.action_type && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>⚡ Tipo:</span>
                          <span className={styles.detailValue}>
                            {alert.action_type_display || alert.action_type}
                          </span>
                        </div>
                      )}
                      {alert.endpoint && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>🔗 Endpoint:</span>
                          <span className={styles.detailValue}>
                            {alert.http_method && <span className={styles.httpMethod}>{alert.http_method}</span>}
                            {alert.endpoint}
                          </span>
                        </div>
                      )}
                      {alert.ip_address && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>🌐 IP:</span>
                          <span className={styles.detailValue}>{alert.ip_address}</span>
                        </div>
                      )}
                      {alert.response_status && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>📊 Estado HTTP:</span>
                          <span className={`${styles.detailValue} ${styles.statusCode} ${
                            alert.response_status < 400 ? styles.success : styles.error
                          }`}>
                            {alert.response_status}
                          </span>
                        </div>
                      )}
                      {alert.success !== undefined && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>✓ Éxito:</span>
                          <span className={styles.detailValue}>
                            {alert.success ? '✅ Sí' : '❌ No'}
                          </span>
                        </div>
                      )}
                      {alert.username_attempted && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>👤 Usuario Intentado:</span>
                          <span className={styles.detailValue}>{alert.username_attempted}</span>
                        </div>
                      )}
                    </div>

                    {/* Error message */}
                    {alert.error_message && (
                      <div className={styles.errorMessage}>
                        <strong>❌ Error:</strong> {alert.error_message}
                      </div>
                    )}

                    {/* User Agent */}
                    {alert.user_agent && (
                      <div className={styles.userAgent}>
                        <strong>🖥️ User Agent:</strong>
                        <code>{alert.user_agent}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {filteredAlerts.length === 0 && (
          <div className={styles.noResults}>
            <p>✓ No hay alertas de severidad {filterSeverity}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAlerts;
