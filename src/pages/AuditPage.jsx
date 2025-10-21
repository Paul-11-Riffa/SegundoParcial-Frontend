import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getAuditLogs,
  getAuditStatistics,
  getActiveSessions,
  getSecurityAlerts
} from '../services/api';
import { useToast } from '../context/ToastContext';
import ReportFilters from '../components/reports/ReportFilters';
import ReportViewer from '../components/reports/ReportViewer';
import ReportGenerator from '../components/reports/ReportGenerator';
import styles from '../styles/AuditPage.module.css';

const AuditPage = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const { showToast } = useToast();

  // ✅ SOLUCIÓN 1: Usar ref para prevenir llamadas duplicadas
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef({});

  // Filtros para logs y reportes de auditoría
  const [filters, setFilters] = useState({
    user: '',
    action_type: '',
    start_date: '',
    end_date: '',
    severity: '',
    success: '',
    ip_address: '',
    endpoint: '',
    limit: 100
  });

  // Filtros para reportes de sesiones
  const [sessionFilters, setSessionFilters] = useState({
    user: '',
    is_active: '',
    start_date: '',
    end_date: '',
    limit: 100
  });

  // ✅ SOLUCIÓN 2: Memoizar las funciones de carga con useCallback
  const loadLogs = useCallback(async () => {
    try {
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') {
          cleanFilters[key] = filters[key];
        }
      });

      const response = await getAuditLogs(cleanFilters);
      setLogs(response.data);
    } catch (error) {
      console.error('❌ Error al cargar logs:', error);
      // Si es 403, el usuario no tiene permisos
      if (error.response?.status === 403) {
        showToast('No tienes permisos para acceder a los logs de auditoría. Requiere rol ADMIN.', 'error');
        setLogs([]);
      } else {
        showToast('Error al cargar los logs de auditoría', 'error');
        setLogs([]);
      }
      // ⚠️ IMPORTANTE: Lanzar error para que loadData lo capture
      throw error;
    }
  }, [filters, showToast]);

  const loadStatistics = useCallback(async () => {
    try {
      const response = await getAuditStatistics(7);
      setStatistics(response.data);
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      if (error.response?.status === 403) {
        showToast('No tienes permisos para acceder a las estadísticas. Requiere rol ADMIN.', 'error');
        setStatistics(null);
      } else {
        showToast('Error al cargar las estadísticas', 'error');
        setStatistics(null);
      }
      throw error;
    }
  }, [showToast]);

  const loadSessions = useCallback(async () => {
    try {
      const response = await getActiveSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('❌ Error al cargar sesiones:', error);
      if (error.response?.status === 403) {
        showToast('No tienes permisos para acceder a las sesiones. Requiere rol ADMIN.', 'error');
        setSessions([]);
      } else {
        showToast('Error al cargar las sesiones', 'error');
        setSessions([]);
      }
      throw error;
    }
  }, [showToast]);

  const loadAlerts = useCallback(async () => {
    try {
      const response = await getSecurityAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('❌ Error al cargar alertas:', error);
      if (error.response?.status === 403) {
        showToast('No tienes permisos para acceder a las alertas. Requiere rol ADMIN.', 'error');
        setAlerts(null);
      } else {
        showToast('Error al cargar las alertas', 'error');
        setAlerts(null);
      }
      throw error;
    }
  }, [showToast]);

  // ✅ SOLUCIÓN 3: Memoizar loadData con useCallback y prevención de bucles
  const loadData = useCallback(async () => {
    // ✅ CRÍTICO: Prevenir múltiples llamadas simultáneas
    if (isLoadingRef.current) {
      console.log('⚠️ loadData ya está en ejecución, saltando...');
      return;
    }

    // ✅ CRÍTICO: Verificar si ya se cargó este tab
    if (hasLoadedRef.current[activeTab]) {
      console.log(`✓ Datos del tab "${activeTab}" ya cargados, usando caché`);
      return;
    }

    console.log(`🔄 Cargando datos del tab "${activeTab}"...`);
    isLoadingRef.current = true;
    setLoading(true);

    try {
      switch (activeTab) {
        case 'logs':
          await loadLogs();
          break;
        case 'statistics':
          await loadStatistics();
          break;
        case 'sessions':
          await loadSessions();
          break;
        case 'alerts':
          await loadAlerts();
          break;
        default:
          break;
      }

      // ✅ Marcar tab como cargado SOLO si no hubo errores
      hasLoadedRef.current[activeTab] = true;
      console.log(`✅ Datos del tab "${activeTab}" cargados exitosamente`);
    } catch (error) {
      console.error(`❌ Error loading data for tab "${activeTab}":`, error);

      // ✅ CRÍTICO: NO marcar como cargado si hubo error
      // ✅ CRÍTICO: Pero TAMPOCO reintentar automáticamente
      hasLoadedRef.current[activeTab] = 'error'; // Marcar como error para prevenir reintentos

      // Mostrar mensaje de error solo una vez
      if (error.response?.status === 403) {
        showToast(`Acceso denegado: Requieres rol ADMIN para ver ${activeTab}`, 'error');
      } else {
        showToast(`Error al cargar ${activeTab}. No se reintentará automáticamente.`, 'error');
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [activeTab, loadLogs, loadStatistics, loadSessions, loadAlerts, showToast]);

  // ✅ SOLUCIÓN 4: useEffect correctamente configurado con cleanup
  useEffect(() => {
    let isMounted = true;

    const executeLoad = async () => {
      if (isMounted) {
        await loadData();
      }
    };

    executeLoad();

    // Cleanup function para prevenir actualizaciones de estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleFilterChange = (key, value) => {
    if (activeTab === 'audit-reports') {
      setFilters(prev => ({ ...prev, [key]: value }));
    } else if (activeTab === 'session-reports') {
      setSessionFilters(prev => ({ ...prev, [key]: value }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleApplyFilters = useCallback(() => {
    if (activeTab === 'logs') {
      // ✅ Invalidar caché para forzar recarga con nuevos filtros (incluso si hubo error)
      delete hasLoadedRef.current['logs'];
      loadData();
    }
  }, [activeTab, loadData]);

  const handleClearFilters = useCallback(() => {
    if (activeTab === 'audit-reports') {
      setFilters({
        user: '',
        action_type: '',
        start_date: '',
        end_date: '',
        severity: '',
        success: '',
        ip_address: '',
        endpoint: '',
        limit: 100
      });
      setReportData(null);
    } else if (activeTab === 'session-reports') {
      setSessionFilters({
        user: '',
        is_active: '',
        start_date: '',
        end_date: '',
        limit: 100
      });
      setReportData(null);
    } else {
      setFilters({
        user: '',
        action_type: '',
        start_date: '',
        end_date: '',
        severity: '',
        success: '',
        ip_address: '',
        endpoint: '',
        limit: 100
      });
      // ✅ Invalidar caché para forzar recarga (incluso si hubo error)
      delete hasLoadedRef.current['logs'];
      // ✅ IMPORTANTE: No usar setTimeout, llamar directamente
      loadData();
    }
  }, [activeTab, loadData]);

  const handleReportGenerated = (data) => {
    setReportData(data);
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

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: '#10b981',
      MEDIUM: '#f59e0b',
      HIGH: '#f97316',
      CRITICAL: '#ef4444'
    };
    return colors[severity] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={styles.auditPage}>
      <div className={styles.header}>
        <h1>🔍 Sistema de Auditoría y Bitácora</h1>
        <p>Monitoreo completo de todas las acciones del sistema con generación de reportes avanzados</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'logs' ? styles.active : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Logs
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'statistics' ? styles.active : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          📊 Estadísticas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'sessions' ? styles.active : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          👥 Sesiones
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'alerts' ? styles.active : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          ⚠️ Alertas
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'audit-reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('audit-reports')}
        >
          📄 Reportes de Auditoría
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'session-reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('session-reports')}
        >
          📊 Reportes de Sesiones
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading && <div className={styles.loader}>Cargando...</div>}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className={styles.logsTab}>
            {/* Filters */}
            <div className={styles.filters}>
              <h3>🔎 Filtros</h3>
              <div className={styles.filterGrid}>
                <input
                  type="text"
                  placeholder="Usuario"
                  value={filters.user}
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                />
                <select
                  value={filters.action_type}
                  onChange={(e) => handleFilterChange('action_type', e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="AUTH">Autenticación</option>
                  <option value="CREATE">Creación</option>
                  <option value="READ">Lectura</option>
                  <option value="UPDATE">Actualización</option>
                  <option value="DELETE">Eliminación</option>
                  <option value="REPORT">Reporte</option>
                  <option value="PAYMENT">Pago</option>
                  <option value="ML">Machine Learning</option>
                </select>
                <input
                  type="date"
                  placeholder="Fecha inicio"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Fecha fin"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                />
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                >
                  <option value="">Todas las severidades</option>
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
                <select
                  value={filters.success}
                  onChange={(e) => handleFilterChange('success', e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="true">Exitoso</option>
                  <option value="false">Error</option>
                </select>
                <input
                  type="text"
                  placeholder="Dirección IP"
                  value={filters.ip_address}
                  onChange={(e) => handleFilterChange('ip_address', e.target.value)}
                />
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                >
                  <option value="50">50 registros</option>
                  <option value="100">100 registros</option>
                  <option value="200">200 registros</option>
                  <option value="500">500 registros</option>
                </select>
              </div>
              <div className={styles.filterActions}>
                <button className={styles.btnPrimary} onClick={handleApplyFilters}>
                  Aplicar Filtros
                </button>
                <button className={styles.btnSecondary} onClick={handleClearFilters}>
                  Limpiar Filtros
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className={styles.tableContainer}>
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>Fecha/Hora</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Endpoint</th>
                    <th>IP</th>
                    <th>Estado</th>
                    <th>Tiempo (ms)</th>
                    <th>Severidad</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="8" className={styles.noData}>
                        No se encontraron registros
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td>{formatDate(log.timestamp)}</td>
                        <td className={styles.username}>{log.username}</td>
                        <td>
                          <span className={styles.actionType}>
                            {getActionTypeLabel(log.action_type)}
                          </span>
                          <div className={styles.actionDesc}>{log.action_description}</div>
                        </td>
                        <td className={styles.endpoint}>{log.endpoint}</td>
                        <td className={styles.ip}>{log.ip_address}</td>
                        <td>
                          <span className={`${styles.status} ${log.success ? styles.success : styles.error}`}>
                            {log.success ? '✓ Éxito' : '✗ Error'}
                          </span>
                        </td>
                        <td className={styles.responseTime}>{log.response_time_ms}</td>
                        <td>
                          <span
                            className={styles.severity}
                            style={{ backgroundColor: getSeverityColor(log.severity) }}
                          >
                            {log.severity_display}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === 'statistics' && statistics && (
          <div className={styles.statisticsTab}>
            <div className={styles.statsGrid}>
              {/* Summary Cards */}
              <div className={styles.statsCard}>
                <div className={styles.statsIcon}>📊</div>
                <div className={styles.statsContent}>
                  <h3>{statistics.summary.total_actions.toLocaleString()}</h3>
                  <p>Total de Acciones</p>
                </div>
              </div>
              <div className={styles.statsCard}>
                <div className={styles.statsIcon}>✓</div>
                <div className={styles.statsContent}>
                  <h3>{(statistics.summary.total_actions - statistics.summary.total_errors).toLocaleString()}</h3>
                  <p>Acciones Exitosas</p>
                </div>
              </div>
              <div className={styles.statsCard}>
                <div className={styles.statsIcon}>✗</div>
                <div className={styles.statsContent}>
                  <h3>{statistics.summary.total_errors.toLocaleString()}</h3>
                  <p>Errores</p>
                </div>
              </div>
              <div className={styles.statsCard}>
                <div className={styles.statsIcon}>👥</div>
                <div className={styles.statsContent}>
                  <h3>{statistics.summary.total_users}</h3>
                  <p>Usuarios Activos</p>
                </div>
              </div>
            </div>

            {/* By Action Type */}
            <div className={styles.statsSection}>
              <h3>📋 Por Tipo de Acción</h3>
              <div className={styles.statsList}>
                {statistics.by_action_type.map((item) => (
                  <div key={item.action_type} className={styles.statsItem}>
                    <span className={styles.statsLabel}>
                      {getActionTypeLabel(item.action_type)}
                    </span>
                    <span className={styles.statsValue}>{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Severity */}
            <div className={styles.statsSection}>
              <h3>⚠️ Por Severidad</h3>
              <div className={styles.statsList}>
                {statistics.by_severity.map((item) => (
                  <div key={item.severity} className={styles.statsItem}>
                    <span
                      className={styles.severityBadge}
                      style={{ backgroundColor: getSeverityColor(item.severity) }}
                    >
                      {item.severity}
                    </span>
                    <span className={styles.statsValue}>{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Users */}
            <div className={styles.statsSection}>
              <h3>👤 Usuarios Más Activos</h3>
              <div className={styles.statsList}>
                {statistics.top_users.map((item, index) => (
                  <div key={item.username} className={styles.statsItem}>
                    <span className={styles.statsLabel}>
                      {index + 1}. {item.username}
                    </span>
                    <span className={styles.statsValue}>{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <div className={styles.sessionsTab}>
            <h3>👥 Sesiones Activas ({sessions.length})</h3>
            <div className={styles.tableContainer}>
              <table className={styles.sessionsTable}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>IP</th>
                    <th>Inicio de Sesión</th>
                    <th>Última Actividad</th>
                    <th>Duración</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={styles.noData}>
                        No hay sesiones activas
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr key={session.id}>
                        <td className={styles.username}>{session.username}</td>
                        <td className={styles.ip}>{session.ip_address}</td>
                        <td>{formatDate(session.login_time)}</td>
                        <td>{formatDate(session.last_activity)}</td>
                        <td>{session.duration_minutes} min</td>
                        <td>
                          <span className={`${styles.status} ${styles.success}`}>
                            ● Activa
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && alerts && (
          <div className={styles.alertsTab}>
            <h3>⚠️ Alertas de Seguridad ({alerts.total_alerts})</h3>
            <p className={styles.alertsPeriod}>Últimas {alerts.period}</p>
            
            <div className={styles.alertsList}>
              {alerts.alerts.length === 0 ? (
                <div className={styles.noAlerts}>
                  ✓ No hay alertas de seguridad
                </div>
              ) : (
                alerts.alerts.map((alert, index) => (
                  <div key={index} className={`${styles.alertCard} ${styles[alert.severity.toLowerCase()]}`}>
                    <div className={styles.alertHeader}>
                      <span className={styles.alertType}>
                        {alert.type === 'failed_login_attempts' && '🔒 Intentos de Login Fallidos'}
                        {alert.type === 'multiple_ips' && '🌐 Múltiples IPs'}
                        {alert.type === 'critical_actions' && '🚨 Acciones Críticas'}
                      </span>
                      <span className={styles.alertSeverity}>{alert.severity}</span>
                    </div>
                    <p className={styles.alertMessage}>{alert.message}</p>
                    {alert.ip && <p className={styles.alertDetail}>IP: {alert.ip}</p>}
                    {alert.username && <p className={styles.alertDetail}>Usuario: {alert.username}</p>}
                    {alert.count && <p className={styles.alertDetail}>Cantidad: {alert.count}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AUDIT REPORTS TAB */}
        {activeTab === 'audit-reports' && (
          <div className={styles.reportsTab}>
            <div className={styles.reportHeader}>
              <h2>📄 Generación de Reportes de Auditoría</h2>
              <p>Genera reportes personalizados de la bitácora de auditoría en diferentes formatos (PDF, Excel, JSON)</p>
            </div>

            <ReportFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={() => {}}
              onClearFilters={handleClearFilters}
              reportType="audit"
            />

            <ReportGenerator
              filters={filters}
              reportType="audit"
              onReportGenerated={handleReportGenerated}
            />

            {reportData && <ReportViewer reportData={reportData} />}
          </div>
        )}

        {/* SESSION REPORTS TAB */}
        {activeTab === 'session-reports' && (
          <div className={styles.reportsTab}>
            <div className={styles.reportHeader}>
              <h2>📊 Generación de Reportes de Sesiones</h2>
              <p>Genera reportes de sesiones de usuarios del sistema en diferentes formatos</p>
            </div>

            <ReportFilters
              filters={sessionFilters}
              onFilterChange={handleFilterChange}
              onApplyFilters={() => {}}
              onClearFilters={handleClearFilters}
              reportType="sessions"
            />

            <ReportGenerator
              filters={sessionFilters}
              reportType="sessions"
              onReportGenerated={handleReportGenerated}
            />

            {reportData && <ReportViewer reportData={reportData} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;
