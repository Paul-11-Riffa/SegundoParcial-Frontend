import { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/ReportViewer.module.css';

const ReportViewer = ({ reportData }) => {
  const [sortedData, setSortedData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // ✅ SOLUCIÓN: Usar useMemo para evitar bucles infinitos
  // Solo cambia cuando reportData cambia realmente (comparación de referencia)
  const initialData = useMemo(() => reportData, [reportData]);

  useEffect(() => {
    if (initialData) {
      setSortedData(initialData);
      // ✅ Resetear configuración de ordenamiento cuando cambien los datos
      setSortConfig({ key: null, direction: 'asc' });
    }
  }, [initialData]);

  if (!reportData || !reportData.data) {
    return (
      <div className={styles.emptyState}>
        <p>📊 No hay datos para mostrar</p>
        <p className={styles.hint}>Aplica filtros y genera un reporte en formato JSON para visualizar los datos aquí</p>
      </div>
    );
  }

  const { data } = reportData;
  const { title, subtitle, headers, rows, totals, summary, metadata } = data;

  const handleSort = (columnIndex) => {
    let direction = 'asc';
    if (sortConfig.key === columnIndex && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...rows].sort((a, b) => {
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedData({ ...reportData, data: { ...data, rows: sorted } });
    setSortConfig({ key: columnIndex, direction });
  };

  return (
    <div className={styles.reportViewer}>
      {/* Header del Reporte */}
      <div className={styles.reportHeader}>
        <h2>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* Totales y Resumen */}
      {totals && (
        <div className={styles.totalsSection}>
          <h3>📈 Resumen General</h3>
          <div className={styles.totalsGrid}>
            <div className={styles.totalCard}>
              <span className={styles.totalLabel}>Total de Registros</span>
              <span className={styles.totalValue}>{totals.total_registros}</span>
            </div>
            <div className={styles.totalCard}>
              <span className={styles.totalLabel}>Éxitos</span>
              <span className={`${styles.totalValue} ${styles.success}`}>{totals.total_exitos}</span>
            </div>
            <div className={styles.totalCard}>
              <span className={styles.totalLabel}>Errores</span>
              <span className={`${styles.totalValue} ${styles.error}`}>{totals.total_errores}</span>
            </div>
            <div className={styles.totalCard}>
              <span className={styles.totalLabel}>Tasa de Error</span>
              <span className={`${styles.totalValue} ${parseFloat(totals.tasa_error) > 10 ? styles.warning : ''}`}>
                {totals.tasa_error}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas Adicionales */}
      {summary && (
        <div className={styles.summarySection}>
          <h3>📊 Estadísticas Detalladas</h3>
          <div className={styles.summaryGrid}>
            {summary.usuarios_unicos !== undefined && (
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Usuarios Únicos</span>
                <span className={styles.summaryValue}>{summary.usuarios_unicos}</span>
              </div>
            )}
            {summary.ips_unicas !== undefined && (
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>IPs Únicas</span>
                <span className={styles.summaryValue}>{summary.ips_unicas}</span>
              </div>
            )}
            {summary.tiempo_promedio_ms !== undefined && (
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Tiempo Promedio</span>
                <span className={styles.summaryValue}>{summary.tiempo_promedio_ms} ms</span>
              </div>
            )}
          </div>

          {/* Distribución por Acción */}
          {summary.por_accion && Object.keys(summary.por_accion).length > 0 && (
            <div className={styles.distributionSection}>
              <h4>Por Tipo de Acción</h4>
              <div className={styles.distributionBars}>
                {Object.entries(summary.por_accion).map(([action, count]) => (
                  <div key={action} className={styles.distributionItem}>
                    <span className={styles.distributionLabel}>{action}</span>
                    <div className={styles.distributionBar}>
                      <div
                        className={styles.distributionFill}
                        style={{
                          width: `${(count / totals.total_registros) * 100}%`
                        }}
                      />
                    </div>
                    <span className={styles.distributionCount}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distribución por Severidad */}
          {summary.por_severidad && Object.keys(summary.por_severidad).length > 0 && (
            <div className={styles.distributionSection}>
              <h4>Por Severidad</h4>
              <div className={styles.distributionBars}>
                {Object.entries(summary.por_severidad).map(([severity, count]) => {
                  const severityColors = {
                    Baja: '#10b981',
                    Media: '#f59e0b',
                    Alta: '#f97316',
                    Crítica: '#ef4444'
                  };
                  return (
                    <div key={severity} className={styles.distributionItem}>
                      <span className={styles.distributionLabel}>{severity}</span>
                      <div className={styles.distributionBar}>
                        <div
                          className={styles.distributionFill}
                          style={{
                            width: `${(count / totals.total_registros) * 100}%`,
                            backgroundColor: severityColors[severity]
                          }}
                        />
                      </div>
                      <span className={styles.distributionCount}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabla de Datos */}
      <div className={styles.tableSection}>
        <h3>📋 Datos Detallados</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(index)}
                    className={styles.sortableHeader}
                  >
                    {header}
                    {sortConfig.key === index && (
                      <span className={styles.sortIcon}>
                        {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(sortedData?.data?.rows || rows).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={styles.dataCell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata */}
      {metadata && (
        <div className={styles.metadataSection}>
          <h4>ℹ️ Información del Reporte</h4>
          <div className={styles.metadataGrid}>
            {metadata.generado_en && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Generado en:</span>
                <span className={styles.metadataValue}>{metadata.generado_en}</span>
              </div>
            )}
            {metadata.filtros_aplicados && Object.keys(metadata.filtros_aplicados).length > 0 && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Filtros aplicados:</span>
                <span className={styles.metadataValue}>
                  {Object.entries(metadata.filtros_aplicados).map(([key, value]) => (
                    <span key={key} className={styles.filterTag}>
                      {key}: {value.toString()}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
