/**
 * 📊 Componente de Visualización de Resultados
 * Muestra el resultado del comando procesado
 */

import React from 'react';
import { FaCheckCircle, FaDownload, FaFilePdf, FaFileExcel, FaFileCode, FaCopy, FaClock } from 'react-icons/fa';
import { 
  formatConfidence, 
  getConfidenceColor, 
  getConfidenceEmoji,
  formatProcessingTime,
  formatDate,
  copyToClipboard
} from '../../utils/commandUtils';
import { REPORT_NAMES, REPORT_ICONS } from '../../config/commandsConfig';
import styles from '../../styles/VoiceCommandsPage.module.css';

const ResultDisplay = ({ result, onDownloadPDF, onDownloadExcel, onDownloadJSON }) => {
  if (!result) return null;

  const reportInfo = result.result_data?.report_info;
  const params = result.result_data?.parameters;
  const metadata = result.result_data?.metadata;
  
  const reportName = reportInfo?.name || 'Reporte Generado';
  const reportType = reportInfo?.type || '';
  const reportIcon = REPORT_ICONS[reportType] || '📊';

  const handleCopyCommand = async () => {
    const success = await copyToClipboard(result.command_text);
    if (success) {
      alert('✅ Comando copiado al portapapeles');
    }
  };

  const renderParameters = () => {
    if (!params) return null;

    return (
      <div className={styles.parametersSection}>
        <h4>📋 Parámetros del Reporte</h4>
        <div className={styles.parametersGrid}>
          {/* Rango de fechas */}
          {params.date_range && (
            <div className={styles.paramCard}>
              <span className={styles.paramLabel}>📅 Período:</span>
              <span className={styles.paramValue}>
                {params.date_range.description || 
                  `${new Date(params.date_range.start).toLocaleDateString('es-ES')} - ${new Date(params.date_range.end).toLocaleDateString('es-ES')}`
                }
              </span>
            </div>
          )}

          {/* Formato */}
          {params.format && (
            <div className={styles.paramCard}>
              <span className={styles.paramLabel}>📄 Formato:</span>
              <span className={styles.paramValue}>{params.format.toUpperCase()}</span>
            </div>
          )}

          {/* Agrupación */}
          {params.group_by && (
            <div className={styles.paramCard}>
              <span className={styles.paramLabel}>📊 Agrupado por:</span>
              <span className={styles.paramValue}>{params.group_by}</span>
            </div>
          )}

          {/* Límite */}
          {params.limit && (
            <div className={styles.paramCard}>
              <span className={styles.paramLabel}>🔢 Límite:</span>
              <span className={styles.paramValue}>{params.limit} resultados</span>
            </div>
          )}

          {/* Días de predicción */}
          {params.forecast_days && (
            <div className={styles.paramCard}>
              <span className={styles.paramLabel}>🔮 Predicción:</span>
              <span className={styles.paramValue}>{params.forecast_days} días</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.resultDisplay}>
      {/* Header del resultado */}
      <div className={styles.resultHeader}>
        <div className={styles.resultIcon}>
          <FaCheckCircle className={styles.successIcon} />
        </div>
        <div className={styles.resultTitle}>
          <h2>
            <span className={styles.reportEmoji}>{reportIcon}</span>
            {reportName}
          </h2>
          <p className={styles.commandText}>
            <FaCopy 
              className={styles.copyIcon} 
              onClick={handleCopyCommand}
              title="Copiar comando"
            />
            "{result.command_text}"
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className={styles.metadataSection}>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>
            {getConfidenceEmoji(result.confidence_score)} Confianza:
          </span>
          <span className={`${styles.metadataValue} ${styles[getConfidenceColor(result.confidence_score)]}`}>
            {formatConfidence(result.confidence_score)}
          </span>
        </div>

        <div className={styles.metadataItem}>
          <FaClock />
          <span className={styles.metadataLabel}>Tiempo:</span>
          <span className={styles.metadataValue}>
            {formatProcessingTime(result.processing_time_ms)}
          </span>
        </div>

        {metadata?.generated_at && (
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Generado:</span>
            <span className={styles.metadataValue}>
              {formatDate(metadata.generated_at)}
            </span>
          </div>
        )}
      </div>

      {/* Parámetros */}
      {renderParameters()}

      {/* Descripción del reporte */}
      {reportInfo?.description && (
        <div className={styles.descriptionSection}>
          <p>{reportInfo.description}</p>
        </div>
      )}

      {/* Botones de descarga */}
      <div className={styles.downloadSection}>
        <h4>⬇️ Descargar Reporte</h4>
        <div className={styles.downloadButtons}>
          <button
            className={`${styles.downloadButton} ${styles.pdfButton}`}
            onClick={() => onDownloadPDF(result.id)}
          >
            <FaFilePdf />
            Descargar PDF
          </button>

          <button
            className={`${styles.downloadButton} ${styles.excelButton}`}
            onClick={() => onDownloadExcel(result.id)}
          >
            <FaFileExcel />
            Descargar Excel
          </button>

          <button
            className={`${styles.downloadButton} ${styles.jsonButton}`}
            onClick={() => onDownloadJSON(result)}
          >
            <FaFileCode />
            Descargar JSON
          </button>
        </div>
      </div>

      {/* Vista previa de datos (si están disponibles) */}
      {result.result_data?.data && (
        <div className={styles.dataPreview}>
          <h4>👁️ Vista Previa de Datos</h4>
          <div className={styles.dataContent}>
            <pre>{JSON.stringify(result.result_data.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
