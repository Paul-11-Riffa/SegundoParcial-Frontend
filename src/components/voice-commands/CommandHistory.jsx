/**
 * 📜 Historial de Comandos
 * Muestra el historial de comandos ejecutados
 */

import React from 'react';
import { FaHistory, FaRedo, FaDownload, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { 
  formatDate, 
  formatProcessingTime, 
  getStatusDisplay,
  getStatusColor,
  truncateText,
  formatConfidence
} from '../../utils/commandUtils';
import styles from '../../styles/VoiceCommandsPage.module.css';

const CommandHistory = ({ history, onReuseCommand, onDownload, loading }) => {
  if (!history || history.length === 0) {
    return (
      <div className={styles.commandHistory}>
        <div className={styles.historyHeader}>
          <FaHistory />
          <h3>Historial de Comandos</h3>
        </div>
        <div className={styles.emptyHistory}>
          <p>📭 No hay comandos en el historial</p>
          <p className={styles.emptyHint}>
            Los comandos que ejecutes aparecerán aquí para que puedas reutilizarlos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commandHistory}>
      <div className={styles.historyHeader}>
        <FaHistory />
        <h3>Historial de Comandos</h3>
        <span className={styles.historyCount}>{history.length} comando(s)</span>
      </div>

      <div className={styles.historyList}>
        {history.map((command) => (
          <div 
            key={command.id} 
            className={`${styles.historyCard} ${styles[getStatusColor(command.status)]}`}
          >
            <div className={styles.historyCardHeader}>
              <div className={styles.historyStatus}>
                {command.status === 'EXECUTED' && <FaCheckCircle className={styles.statusIconSuccess} />}
                {command.status === 'FAILED' && <FaTimesCircle className={styles.statusIconError} />}
                {command.status === 'PROCESSING' && <FaClock className={styles.statusIconProcessing} />}
                <span>{getStatusDisplay(command.status)}</span>
              </div>
              <span className={styles.historyDate}>
                {formatDate(command.created_at)}
              </span>
            </div>

            <div className={styles.historyCommandText}>
              <p title={command.command_text}>
                "{truncateText(command.command_text, 100)}"
              </p>
            </div>

            <div className={styles.historyMetadata}>
              <span className={styles.historyMeta}>
                🎯 {formatConfidence(command.confidence_score)}
              </span>
              <span className={styles.historyMeta}>
                ⚡ {formatProcessingTime(command.processing_time_ms)}
              </span>
              {command.command_type && (
                <span className={styles.historyMeta}>
                  📊 {command.command_type}
                </span>
              )}
            </div>

            {command.status === 'EXECUTED' && (
              <div className={styles.historyActions}>
                <button
                  className={styles.historyButton}
                  onClick={() => onReuseCommand(command.command_text)}
                  disabled={loading}
                  title="Reutilizar este comando"
                >
                  <FaRedo />
                  Reutilizar
                </button>
                
                {onDownload && (
                  <button
                    className={styles.historyButton}
                    onClick={() => onDownload(command.id)}
                    disabled={loading}
                    title="Descargar reporte"
                  >
                    <FaDownload />
                    Descargar
                  </button>
                )}
              </div>
            )}

            {command.error_message && (
              <div className={styles.historyError}>
                ⚠️ {command.error_message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandHistory;
