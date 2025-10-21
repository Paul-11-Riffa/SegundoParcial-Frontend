import { useState } from 'react';
import { generateAuditReport, generateSessionReport } from '../../services/api';
import { descargarPDF, descargarExcel } from '../../utils/downloadHelper';
import { useToast } from '../../context/ToastContext';
import styles from '../../styles/ReportGenerator.module.css';

const ReportGenerator = ({ filters, reportType = 'audit', onReportGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('pdf');
  const { showToast } = useToast();

  const limpiarFiltros = () => {
    const filtrosLimpios = {};
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== undefined && filters[key] !== null) {
        // Convertir success a boolean si existe
        if (key === 'success' && typeof filters[key] === 'string') {
          filtrosLimpios[key] = filters[key] === 'true';
        }
        // Convertir is_active a boolean si existe
        else if (key === 'is_active' && typeof filters[key] === 'string') {
          filtrosLimpios[key] = filters[key] === 'true';
        }
        // Convertir limit a número
        else if (key === 'limit') {
          filtrosLimpios[key] = parseInt(filters[key], 10);
        }
        else {
          filtrosLimpios[key] = filters[key];
        }
      }
    });

    return filtrosLimpios;
  };

  const validarFiltros = () => {
    // Validar fechas
    if (filters.start_date && filters.end_date) {
      const inicio = new Date(filters.start_date);
      const fin = new Date(filters.end_date);

      if (inicio > fin) {
        showToast('La fecha de inicio debe ser menor que la fecha de fin', 'error');
        return false;
      }
    }

    // Validar límite
    if (filters.limit) {
      const limite = parseInt(filters.limit, 10);
      if (limite < 1 || limite > 1000) {
        showToast('El límite debe estar entre 1 y 1000', 'error');
        return false;
      }
    }

    return true;
  };

  const generarReporte = async (formatoSeleccionado) => {
    if (!validarFiltros()) {
      return;
    }

    setLoading(true);

    try {
      const filtrosLimpios = limpiarFiltros();

      let response;
      if (reportType === 'audit') {
        response = await generateAuditReport(filtrosLimpios, formatoSeleccionado);
      } else {
        response = await generateSessionReport(filtrosLimpios, formatoSeleccionado);
      }

      // Manejar respuesta según formato
      if (formatoSeleccionado === 'json') {
        // Pasar los datos al componente padre para visualización
        if (onReportGenerated) {
          onReportGenerated(response.data);
        }
        showToast('Reporte generado exitosamente', 'success');
        console.log('Datos del reporte JSON:', response.data);
      } else if (formatoSeleccionado === 'pdf') {
        descargarPDF(response.data, `reporte_${reportType}`);
        showToast('Reporte PDF descargado exitosamente', 'success');
      } else if (formatoSeleccionado === 'excel') {
        descargarExcel(response.data, `reporte_${reportType}`);
        showToast('Reporte Excel descargado exitosamente', 'success');
      }

    } catch (error) {
      console.error('Error al generar reporte:', error);

      if (error.response?.status === 403) {
        showToast('No tienes permisos para generar reportes. Requiere rol ADMIN.', 'error');
      } else if (error.response?.status === 400) {
        showToast('Datos inválidos. Verifica los filtros aplicados.', 'error');
      } else if (error.response?.status === 500) {
        showToast('Error del servidor. Intenta nuevamente.', 'error');
      } else {
        showToast('Error al generar el reporte', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.reportGenerator}>
      <div className={styles.header}>
        <h3>📄 Generar Reporte de {reportType === 'audit' ? 'Auditoría' : 'Sesiones'}</h3>
        <p className={styles.hint}>Selecciona el formato y genera tu reporte personalizado</p>
      </div>

      <div className={styles.formatSelector}>
        <label>Formato de Salida:</label>
        <div className={styles.formatOptions}>
          <button
            className={`${styles.formatButton} ${format === 'json' ? styles.active : ''}`}
            onClick={() => setFormat('json')}
            disabled={loading}
          >
            📊 JSON (Visualizar)
          </button>
          <button
            className={`${styles.formatButton} ${format === 'pdf' ? styles.active : ''}`}
            onClick={() => setFormat('pdf')}
            disabled={loading}
          >
            📄 PDF (Descargar)
          </button>
          <button
            className={`${styles.formatButton} ${format === 'excel' ? styles.active : ''}`}
            onClick={() => setFormat('excel')}
            disabled={loading}
          >
            📊 Excel (Descargar)
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.generateButton} ${loading ? styles.loading : ''}`}
          onClick={() => generarReporte(format)}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Generando reporte...
            </>
          ) : (
            <>
              ✓ Generar Reporte {format.toUpperCase()}
            </>
          )}
        </button>
      </div>

      <div className={styles.quickActions}>
        <p className={styles.quickActionsTitle}>Acciones Rápidas:</p>
        <div className={styles.quickButtons}>
          <button
            className={styles.quickButton}
            onClick={() => generarReporte('pdf')}
            disabled={loading}
          >
            🚀 PDF Rápido
          </button>
          <button
            className={styles.quickButton}
            onClick={() => generarReporte('excel')}
            disabled={loading}
          >
            🚀 Excel Rápido
          </button>
          <button
            className={styles.quickButton}
            onClick={() => generarReporte('json')}
            disabled={loading}
          >
            🚀 Ver Datos
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
