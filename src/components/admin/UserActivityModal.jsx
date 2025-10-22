import { useState, useEffect } from 'react';
import { getUserActivity } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import styles from '../../styles/UserActivityModal.module.css';

const UserActivityModal = ({ onClose, initialUsername = '' }) => {
  const [username, setUsername] = useState(initialUsername);
  const [days, setDays] = useState(7);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialUsername) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!username.trim()) {
      showToast('Por favor ingresa un nombre de usuario', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await getUserActivity(username, days);
      setActivityData(response.data);
    } catch (error) {
      console.error('Error al cargar actividad:', error);
      if (error.response?.status === 404) {
        showToast('Usuario no encontrado', 'error');
      } else if (error.response?.status === 403) {
        showToast('No tienes permisos para ver esta información', 'error');
      } else {
        showToast('Error al cargar la actividad del usuario', 'error');
      }
      setActivityData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTypeLabel = (type) => {
    const labels = {
      AUTH: 'Autenticación',
      CREATE: 'Creación',
      READ: 'Lectura',
      UPDATE: 'Actualización',
      DELETE: 'Eliminación',
      REPORT: 'Reporte',
      PAYMENT: 'Pago',
      ML: 'Machine Learning'
    };
    return labels[type] || type;
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>👤 Actividad de Usuario</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {/* Search Form */}
        <div className={styles.searchForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: admin"
              className={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="days">Período:</label>
            <select
              id="days"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className={styles.select}
            >
              <option value="1">Último día</option>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
          </div>

          <button 
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando actividad del usuario...</p>
          </div>
        )}

        {/* Activity Data */}
        {!loading && activityData && (
          <div className={styles.activityContent}>
            {/* Summary Section */}
            <section className={styles.summarySection}>
              <h3>📊 Resumen de Actividad</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.cardIcon}>🎯</div>
                  <div className={styles.cardContent}>
                    <h4>{activityData.summary.total_actions}</h4>
                    <p>Total de Acciones</p>
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.cardIcon}>✓</div>
                  <div className={styles.cardContent}>
                    <h4>{activityData.summary.total_actions - activityData.summary.total_errors}</h4>
                    <p>Acciones Exitosas</p>
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.cardIcon}>✗</div>
                  <div className={styles.cardContent}>
                    <h4>{activityData.summary.total_errors}</h4>
                    <p>Errores</p>
                  </div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.cardIcon}>📈</div>
                  <div className={styles.cardContent}>
                    <h4>{activityData.summary.error_rate}</h4>
                    <p>Tasa de Error</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Actions */}
            {activityData.recent_actions && activityData.recent_actions.length > 0 && (
              <section className={styles.recentSection}>
                <h3>🕐 Acciones Recientes</h3>
                <div className={styles.actionsList}>
                  {activityData.recent_actions.map((action, index) => (
                    <div key={index} className={styles.actionItem}>
                      <div className={styles.actionIcon}>
                        {action.response_status < 400 ? '✓' : '✗'}
                      </div>
                      <div className={styles.actionDetails}>
                        <span className={styles.actionType}>
                          {action.action_type_display}
                        </span>
                        <span className={styles.actionEndpoint}>
                          {action.endpoint}
                        </span>
                        <span className={styles.actionTime}>
                          {formatDate(action.timestamp)}
                        </span>
                      </div>
                      <span className={`${styles.statusBadge} ${action.response_status < 400 ? styles.success : styles.error}`}>
                        {action.response_status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* By Action Type */}
            {activityData.by_action_type && activityData.by_action_type.length > 0 && (
              <section className={styles.statsSection}>
                <h3>📋 Por Tipo de Acción</h3>
                <div className={styles.statsList}>
                  {activityData.by_action_type.map((item, index) => (
                    <div key={index} className={styles.statItem}>
                      <div className={styles.statBar}>
                        <div 
                          className={styles.statFill}
                          style={{ 
                            width: `${(item.count / activityData.summary.total_actions) * 100}%` 
                          }}
                        />
                      </div>
                      <div className={styles.statLabel}>
                        <span>{getActionTypeLabel(item.action_type)}</span>
                        <span className={styles.statCount}>{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* IPs Used */}
            {activityData.ips_used && activityData.ips_used.length > 0 && (
              <section className={styles.ipsSection}>
                <h3>🌐 IPs Utilizadas</h3>
                <div className={styles.ipsList}>
                  {activityData.ips_used.map((item, index) => (
                    <div key={index} className={styles.ipItem}>
                      <span className={styles.ipAddress}>{item.ip_address}</span>
                      <span className={styles.ipCount}>{item.count} accesos</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Active Sessions */}
            {activityData.active_sessions && activityData.active_sessions.length > 0 && (
              <section className={styles.sessionsSection}>
                <h3>🔓 Sesiones Activas ({activityData.active_sessions.length})</h3>
                <div className={styles.sessionsList}>
                  {activityData.active_sessions.map((session, index) => (
                    <div key={index} className={styles.sessionItem}>
                      <div className={styles.sessionIcon}>🟢</div>
                      <div className={styles.sessionDetails}>
                        <p><strong>IP:</strong> {session.ip_address}</p>
                        <p><strong>Login:</strong> {formatDate(session.login_time)}</p>
                        <p><strong>Última actividad:</strong> {formatDate(session.last_activity)}</p>
                        <p><strong>Duración:</strong> {session.duration_minutes} minutos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !activityData && (
          <div className={styles.emptyState}>
            <p>🔍 Ingresa un nombre de usuario para ver su actividad</p>
          </div>
        )}

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

export default UserActivityModal;
