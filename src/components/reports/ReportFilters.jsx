import { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from '../../styles/ReportFilters.module.css';

const ReportFilters = ({ filters, onFilterChange, onApplyFilters, onClearFilters, reportType = 'audit' }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Estados locales para campos con debounce
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localUser, setLocalUser] = useState(filters.user || '');
  const [localIpAddress, setLocalIpAddress] = useState(filters.ip_address || '');
  const [localEndpoint, setLocalEndpoint] = useState(filters.endpoint || '');

  // Aplicar debounce a los valores
  const debouncedSearch = useDebounce(localSearch, 500);
  const debouncedUser = useDebounce(localUser, 500);
  const debouncedIpAddress = useDebounce(localIpAddress, 500);
  const debouncedEndpoint = useDebounce(localEndpoint, 500);

  // Actualizar filtros cuando cambien los valores debounced
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedUser !== filters.user) {
      onFilterChange('user', debouncedUser);
    }
  }, [debouncedUser]);

  useEffect(() => {
    if (debouncedIpAddress !== filters.ip_address) {
      onFilterChange('ip_address', debouncedIpAddress);
    }
  }, [debouncedIpAddress]);

  useEffect(() => {
    if (debouncedEndpoint !== filters.endpoint) {
      onFilterChange('endpoint', debouncedEndpoint);
    }
  }, [debouncedEndpoint]);

  // Sincronizar estados locales cuando cambien los filtros externos (ej: limpiar filtros)
  useEffect(() => {
    setLocalSearch(filters.search || '');
    setLocalUser(filters.user || '');
    setLocalIpAddress(filters.ip_address || '');
    setLocalEndpoint(filters.endpoint || '');
  }, [filters.search, filters.user, filters.ip_address, filters.endpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  // ✅ Manejador para selects múltiples
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    onFilterChange(name, values);
  };

  const handleDateChange = (name, value) => {
    onFilterChange(name, value);
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersHeader}>
        <h3>🔎 Filtros de {reportType === 'audit' ? 'Auditoría' : 'Sesiones'}</h3>
        <button 
          className={styles.advancedToggle}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼ Ocultar Avanzados' : '▶ Mostrar Filtros Avanzados'}
        </button>
      </div>
      
      <div className={styles.filterGrid}>
        {/* Filtro de Usuario */}
        <div className={styles.filterGroup}>
          <label htmlFor="user">Usuario</label>
          <input
            type="text"
            id="user"
            name="user"
            value={localUser}
            onChange={(e) => setLocalUser(e.target.value)}
            placeholder="Ej: admin"
            className={styles.filterInput}
          />
          {localUser !== debouncedUser && (
            <span className={styles.debounceIndicator}>Buscando...</span>
          )}
        </div>

        {reportType === 'audit' && (
          <>
            {/* Búsqueda Global */}
            <div className={styles.filterGroup}>
              <label htmlFor="search">🔍 Búsqueda Global</label>
              <input
                type="text"
                id="search"
                name="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Buscar en endpoint, usuario, IP, descripción..."
                className={styles.filterInput}
              />
              <small>Busca en múltiples campos a la vez</small>
              {localSearch !== debouncedSearch && (
                <span className={styles.debounceIndicator}>Buscando...</span>
              )}
            </div>

            {/* Tipo de Acción - Múltiple */}
            <div className={styles.filterGroup}>
              <label htmlFor="action_type">Tipo de Acción (múltiple)</label>
              <select
                id="action_type"
                name="action_type"
                multiple
                size="5"
                value={Array.isArray(filters.action_type) ? filters.action_type : (filters.action_type ? [filters.action_type] : [])}
                onChange={handleMultiSelectChange}
                className={styles.filterMultiSelect}
              >
                <option value="AUTH">🔐 Autenticación</option>
                <option value="CREATE">✨ Creación</option>
                <option value="READ">📖 Lectura</option>
                <option value="UPDATE">✏️ Actualización</option>
                <option value="DELETE">🗑️ Eliminación</option>
                <option value="REPORT">📄 Reporte</option>
                <option value="PAYMENT">💳 Pago</option>
                <option value="ML">🤖 Machine Learning</option>
              </select>
              <small>Mantén Ctrl/Cmd para seleccionar múltiples</small>
            </div>

            {/* Severidad - Múltiple */}
            <div className={styles.filterGroup}>
              <label htmlFor="severity">Severidad (múltiple)</label>
              <select
                id="severity"
                name="severity"
                multiple
                size="4"
                value={Array.isArray(filters.severity) ? filters.severity : (filters.severity ? [filters.severity] : [])}
                onChange={handleMultiSelectChange}
                className={styles.filterMultiSelect}
              >
                <option value="LOW">🟢 Baja</option>
                <option value="MEDIUM">🟡 Media</option>
                <option value="HIGH">🟠 Alta</option>
                <option value="CRITICAL">🔴 Crítica</option>
              </select>
              <small>Mantén Ctrl/Cmd para seleccionar múltiples</small>
            </div>

            {/* Estado (Éxito/Error) */}
            <div className={styles.filterGroup}>
              <label htmlFor="success">Estado</label>
              <select
                id="success"
                name="success"
                value={filters.success || ''}
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">Todos</option>
                <option value="true">✓ Éxitos</option>
                <option value="false">✗ Errores</option>
              </select>
            </div>
          </>
        )}

        {/* Fecha Inicio */}
        <div className={styles.filterGroup}>
          <label htmlFor="start_date">📅 Fecha Inicio</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={filters.start_date || ''}
            onChange={handleChange}
            className={styles.filterInput}
          />
        </div>

        {/* Fecha Fin */}
        <div className={styles.filterGroup}>
          <label htmlFor="end_date">📅 Fecha Fin</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={filters.end_date || ''}
            onChange={handleChange}
            className={styles.filterInput}
          />
        </div>

        {reportType === 'sessions' && (
          <>
            {/* Sesiones Activas */}
            <div className={styles.filterGroup}>
              <label htmlFor="is_active">Estado de Sesión</label>
              <select
                id="is_active"
                name="is_active"
                value={filters.is_active || ''}
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">Todas</option>
                <option value="true">✓ Activas</option>
                <option value="false">✗ Cerradas</option>
              </select>
            </div>
          </>
        )}

        {/* Límite de Registros */}
        <div className={styles.filterGroup}>
          <label htmlFor="limit">Límite de Registros</label>
          <input
            type="number"
            id="limit"
            name="limit"
            value={filters.limit || 100}
            onChange={handleChange}
            min="1"
            max="1000"
            className={styles.filterInput}
          />
        </div>
      </div>

      {/* Filtros Avanzados (Colapsables) */}
      {showAdvanced && reportType === 'audit' && (
        <div className={styles.advancedFilters}>
          <h4>🎯 Filtros Avanzados</h4>
          <div className={styles.filterGrid}>
            {/* IP Address */}
            <div className={styles.filterGroup}>
              <label htmlFor="ip_address">🌐 Dirección IP</label>
              <input
                type="text"
                id="ip_address"
                name="ip_address"
                value={localIpAddress}
                onChange={(e) => setLocalIpAddress(e.target.value)}
                placeholder="Ej: 192.168.1.100"
                className={styles.filterInput}
              />
              <small>Búsqueda parcial (contains)</small>
              {localIpAddress !== debouncedIpAddress && (
                <span className={styles.debounceIndicator}>Buscando...</span>
              )}
            </div>

            {/* Endpoint */}
            <div className={styles.filterGroup}>
              <label htmlFor="endpoint">🔗 Endpoint</label>
              <input
                type="text"
                id="endpoint"
                name="endpoint"
                value={localEndpoint}
                onChange={(e) => setLocalEndpoint(e.target.value)}
                placeholder="Ej: /api/products/"
                className={styles.filterInput}
              />
              <small>Búsqueda parcial (contains)</small>
              {localEndpoint !== debouncedEndpoint && (
                <span className={styles.debounceIndicator}>Buscando...</span>
              )}
            </div>

            {/* HTTP Method - Múltiple */}
            <div className={styles.filterGroup}>
              <label htmlFor="http_method">⚡ Método HTTP (múltiple)</label>
              <select
                id="http_method"
                name="http_method"
                multiple
                size="5"
                value={Array.isArray(filters.http_method) ? filters.http_method : (filters.http_method ? [filters.http_method] : [])}
                onChange={handleMultiSelectChange}
                className={styles.filterMultiSelect}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <small>Mantén Ctrl/Cmd para múltiples</small>
            </div>

            {/* Response Status */}
            <div className={styles.filterGroup}>
              <label htmlFor="response_status">📊 Código HTTP Exacto</label>
              <input
                type="number"
                id="response_status"
                name="response_status"
                value={filters.response_status || ''}
                onChange={handleChange}
                placeholder="Ej: 404, 500"
                min="100"
                max="599"
                className={styles.filterInput}
              />
            </div>

            {/* Ordenamiento */}
            <div className={styles.filterGroup}>
              <label htmlFor="ordering">📋 Ordenar Por</label>
              <select
                id="ordering"
                name="ordering"
                value={filters.ordering || ''}
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">Sin ordenar</option>
                <option value="-timestamp">⬇️ Más recientes primero</option>
                <option value="timestamp">⬆️ Más antiguos primero</option>
                <option value="-response_status">⬇️ Código HTTP desc</option>
                <option value="response_status">⬆️ Código HTTP asc</option>
                <option value="username">⬆️ Usuario A-Z</option>
                <option value="-username">⬇️ Usuario Z-A</option>
                <option value="-response_time_ms">⬇️ Tiempo respuesta desc</option>
                <option value="response_time_ms">⬆️ Tiempo respuesta asc</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción */}
      <div className={styles.filterActions}>
        <button
          onClick={onApplyFilters}
          className={`${styles.filterButton} ${styles.applyButton}`}
        >
          ✓ Aplicar Filtros
        </button>
        <button
          onClick={onClearFilters}
          className={`${styles.filterButton} ${styles.clearButton}`}
        >
          ✗ Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;

