// src/components/reports/ReportViewer.jsx
/**
 * Componente para visualizar los resultados de reportes dinámicos
 */
import React from 'react';
import '../../styles/ReportViewer.css';

const ReportViewer = ({ data }) => {
  if (!data || !data.data) {
    return null;
  }

  const reportData = data.data;

  // Si es un archivo descargable (PDF/Excel)
  if (data.headers && data.headers['content-type'] !== 'application/json') {
    return (
      <div className="report-viewer">
        <div className="download-message">
          <p>✅ El archivo se ha descargado exitosamente</p>
        </div>
      </div>
    );
  }

  // Si es un reporte para mostrar en pantalla
  return (
    <div className="report-viewer">
      <div className="report-header">
        <div className="report-title-section">
          <h2>📊 Resultados del Reporte</h2>
          {reportData.title && <h3>{reportData.title}</h3>}
          {reportData.period && <p className="report-period">{reportData.period}</p>}
        </div>
      </div>

      {reportData.error && (
        <div className="report-error">
          <p>❌ {reportData.error}</p>
        </div>
      )}

      {reportData.message && (
        <div className="report-message">
          <p>ℹ️ {reportData.message}</p>
        </div>
      )}

      {reportData.results && reportData.results.length > 0 ? (
        <div className="report-results">
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  {Object.keys(reportData.results[0]).map((key) => (
                    <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.results.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>
                        {value === null || value === undefined
                          ? '-'
                          : typeof value === 'number' && !Number.isInteger(value)
                          ? `$${value.toFixed(2)}`
                          : value.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-footer">
            <p>Total de registros: <strong>{reportData.results.length}</strong></p>
            <p className="timestamp">Generado el {new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      ) : (
        !reportData.error && !reportData.message && (
          <div className="no-data">
            <div className="no-data-icon">📋</div>
            <p>No se encontraron datos para este reporte</p>
          </div>
        )
      )}

      {reportData.summary && Object.keys(reportData.summary).length > 0 && (
        <div className="report-totals">
          <h3>📊 Resumen</h3>
          <div className="totals-grid">
            {Object.entries(reportData.summary).map(([key, value]) => (
              <div key={key} className="total-card">
                <span className="total-label">{key.replace(/_/g, ' ')}</span>
                <span className="total-value">
                  {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
