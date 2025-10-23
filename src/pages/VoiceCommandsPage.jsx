/**
 * 🎤 Página de Comandos de Voz Inteligentes
 * Sistema completo de generación de reportes mediante lenguaje natural
 * Basado en GUIA_INTEGRACION_FRONTEND.md y CONFIGURACION_FRONTEND.js
 */

import React, { useState, useEffect } from 'react';
import { FaRobot, FaInfo, FaChartBar } from 'react-icons/fa';
import CommandInput from '../components/voice-commands/CommandInput';
import ResultDisplay from '../components/voice-commands/ResultDisplay';
import SuggestionsPanel from '../components/voice-commands/SuggestionsPanel';
import CommandHistory from '../components/voice-commands/CommandHistory';
import { useCommands } from '../hooks/useCommands';
import { commandsConfig } from '../config/commandsConfig';
import { getGreeting } from '../utils/commandUtils';
import styles from '../styles/VoiceCommandsPage.module.css';

const VoiceCommandsPage = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const {
    loading,
    error,
    result,
    suggestions,
    history,
    processCommand,
    downloadPDF,
    downloadExcel,
    downloadJSON,
    fetchHistory,
    clearResult,
    reuseCommand,
  } = useCommands();

  // Cargar historial al montar
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll al resultado cuando se genere
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        const resultElement = document.getElementById('result-display');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [result]);

  const handleSubmit = async (text) => {
    clearResult();
    await processCommand(text);
    // Recargar historial después de procesar
    fetchHistory();
  };

  const handleSuggestionClick = async (suggestion) => {
    const commandText = `generar ${suggestion.name.toLowerCase()}`;
    await processCommand(commandText);
    fetchHistory();
  };

  const handleReuseCommand = async (commandText) => {
    clearResult();
    await reuseCommand(commandText);
    setShowHistory(false);
  };

  const handleDownloadPDF = async (commandId) => {
    const filename = result ? 
      `${result.result_data?.report_info?.type || 'reporte'}_${commandId}.pdf` : 
      undefined;
    await downloadPDF(commandId, filename);
  };

  const handleDownloadExcel = async (commandId) => {
    const filename = result ? 
      `${result.result_data?.report_info?.type || 'reporte'}_${commandId}.xlsx` : 
      undefined;
    await downloadExcel(commandId, filename);
  };

  const handleDownloadJSON = (data) => {
    const filename = `reporte_${data.id}.json`;
    downloadJSON(data, filename);
  };

  // Obtener todos los ejemplos
  const allExamples = [
    ...commandsConfig.examples.basic,
    ...commandsConfig.examples.products,
    ...commandsConfig.examples.customers,
    ...commandsConfig.examples.advanced,
    ...commandsConfig.examples.ml,
  ];

  return (
    <div className={styles.voiceCommandsPage}>
      {/* Header Principal */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaRobot />
          </div>
          <div className={styles.headerText}>
            <h1>
              🤖 Sistema de Comandos Inteligentes
            </h1>
            <p className={styles.subtitle}>
              {getGreeting()}! Genera reportes usando lenguaje natural en texto o voz
            </p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className={styles.headerActions}>
          <button
            className={`${styles.headerButton} ${showInfo ? styles.active : ''}`}
            onClick={() => setShowInfo(!showInfo)}
          >
            <FaInfo />
            Ayuda
          </button>
          <button
            className={`${styles.headerButton} ${showHistory ? styles.active : ''}`}
            onClick={() => setShowHistory(!showHistory)}
          >
            <FaChartBar />
            Historial ({history.length})
          </button>
        </div>
      </div>

      {/* Panel de información */}
      {showInfo && (
        <div className={styles.infoPanel}>
          <h3>ℹ️ Cómo usar el sistema</h3>
          <div className={styles.infoContent}>
            <div className={styles.infoSection}>
              <h4>📝 Comandos de Texto</h4>
              <ul>
                <li>Escribe tu comando en lenguaje natural</li>
                <li>Ejemplo: "reporte de ventas del último mes en PDF"</li>
                <li>Presiona Enter o clic en "Generar Reporte"</li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h4>🎤 Comandos de Voz</h4>
              <ul>
                <li>Haz clic en el botón del micrófono 🎤</li>
                <li>Habla claramente tu comando</li>
                <li>El sistema procesará automáticamente al terminar</li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h4>📊 Tipos de Reportes</h4>
              <ul>
                <li><strong>Básicos:</strong> ventas, productos, clientes</li>
                <li><strong>Agrupados:</strong> por producto, cliente, categoría</li>
                <li><strong>Avanzados:</strong> RFM, ABC, dashboard</li>
                <li><strong>Predicciones:</strong> forecast, tendencias, ML</li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h4>📅 Períodos de Tiempo</h4>
              <ul>
                <li>Relativos: "hoy", "ayer", "esta semana", "último mes"</li>
                <li>Específicos: "octubre 2024", "del 01/09 al 15/10"</li>
                <li>Rangos: "últimos 7 días", "últimos 30 días"</li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h4>📄 Formatos de Salida</h4>
              <ul>
                <li><strong>PDF:</strong> Documentos imprimibles</li>
                <li><strong>Excel:</strong> Análisis y procesamiento de datos</li>
                <li><strong>JSON:</strong> Integración con otros sistemas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className={styles.mainContent}>
        {/* Input de comandos */}
        <CommandInput
          onSubmit={handleSubmit}
          loading={loading}
          examples={allExamples}
        />

        {/* Mensaje de cargando */}
        {loading && (
          <div className={styles.loadingMessage}>
            <div className={styles.spinner} />
            <p>🤖 Procesando tu comando...</p>
            <p className={styles.loadingHint}>
              Esto puede tomar unos segundos dependiendo de la complejidad del reporte
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && !suggestions.length && (
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}>❌</div>
            <div className={styles.errorContent}>
              <h3>Error al procesar el comando</h3>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={() => clearResult()}
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* Panel de sugerencias */}
        {suggestions.length > 0 && (
          <SuggestionsPanel
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}

        {/* Resultado */}
        {result && !loading && (
          <div id="result-display">
            <ResultDisplay
              result={result}
              onDownloadPDF={handleDownloadPDF}
              onDownloadExcel={handleDownloadExcel}
              onDownloadJSON={handleDownloadJSON}
            />
          </div>
        )}

        {/* Historial */}
        {showHistory && (
          <CommandHistory
            history={history}
            onReuseCommand={handleReuseCommand}
            onDownload={handleDownloadPDF}
            loading={loading}
          />
        )}

        {/* Estadísticas rápidas */}
        {!result && !loading && !error && (
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <h4>14 Tipos de Reportes</h4>
                <p>Desde básicos hasta predicciones ML</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎤</div>
              <div className={styles.statContent}>
                <h4>Comando de Voz</h4>
                <p>Habla naturalmente en español</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statContent}>
                <h4>Procesamiento Rápido</h4>
                <p>Resultados en segundos</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📄</div>
              <div className={styles.statContent}>
                <h4>3 Formatos</h4>
                <p>PDF, Excel y JSON</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con información adicional */}
      <div className={styles.pageFooter}>
        <p>
          💡 <strong>Tip:</strong> Sé específico con fechas y formatos para mejores resultados
        </p>
        <p className={styles.footerHint}>
          Sistema de Comandos Inteligentes v2.0 | Procesamiento en lenguaje natural
        </p>
      </div>
    </div>
  );
};

export default VoiceCommandsPage;
