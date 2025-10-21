import { useState } from 'react';
import styles from '../../styles/ReportFilters.module.css';

const ReportFilters = ({ filters, onFilterChange, onApplyFilters, onClearFilters, reportType = 'audit' }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleDateChange = (name, value) => {
    onFilterChange(name, value);
  };

  return (
    <div className={styles.filtersContainer}>
      <h3>🔎 Filtros de {reportType === 'audit' ? 'Auditoría' : 'Sesiones'}</h3>
      
      <div className={styles.filterGrid}>
        {/* Filtro de Usuario */}
        <div className={styles.filterGroup}>
          <label htmlFor="user">Usuario</label>
          <input
            type="text"
            id="user"
            name="user"
            value={filters.user || ''}
            onChange={handleChange}
            placeholder="Ej: admin"
            className={styles.filterInput}
          />
        </div>

        {reportType === 'audit' && (
          <>
            {/* Tipo de Acción */}
            <div className={styles.filterGroup}>
              <label htmlFor="action_type">Tipo de Acción</label>
              <select
                id="action_type"
                name="action_type"
                value={filters.action_type || ''}
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">Todos</option>
                <option value="AUTH">Autenticación</option>
                <option value="CREATE">Creación</option>
                <option value="READ">Lectura</option>
                <option value="UPDATE">Actualización</option>
                <option value="DELETE">Eliminación</option>
                <option value="REPORT">Reporte</option>
                <option value="PAYMENT">Pago</option>
                <option value="ML">Machine Learning</option>
              </select>
            </div>

            {/* Severidad */}
            <div className={styles.filterGroup}>
              <label htmlFor="severity">Severidad</label>
              <select
                id="severity"
                name="severity"
                value={filters.severity || ''}
                onChange={handleChange}
                className={styles.filterSelect}
              >
                <option value="">Todas</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
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
                <option value="true">Éxitos</option>
                <option value="false">Errores</option>
              </select>
            </div>

            {/* IP Address */}
            <div className={styles.filterGroup}>
              <label htmlFor="ip_address">Dirección IP</label>
              <input
                type="text"
                id="ip_address"
                name="ip_address"
                value={filters.ip_address || ''}
                onChange={handleChange}
                placeholder="Ej: 192.168.1.100"
                className={styles.filterInput}
              />
            </div>

            {/* Endpoint */}
            <div className={styles.filterGroup}>
              <label htmlFor="endpoint">Endpoint</label>
              <input
                type="text"
                id="endpoint"
                name="endpoint"
                value={filters.endpoint || ''}
                onChange={handleChange}
                placeholder="Ej: /api/products/"
                className={styles.filterInput}
              />
            </div>
          </>
        )}

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
                <option value="true">Activas</option>
                <option value="false">Cerradas</option>
              </select>
            </div>
          </>
        )}

        {/* Fecha Inicio */}
        <div className={styles.filterGroup}>
          <label htmlFor="start_date">Fecha Inicio</label>
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
          <label htmlFor="end_date">Fecha Fin</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={filters.end_date || ''}
            onChange={handleChange}
            className={styles.filterInput}
          />
        </div>

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
