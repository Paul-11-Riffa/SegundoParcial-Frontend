import { useState, useRef, useEffect } from 'react';
import { generateDynamicReport, processTextCommand, processAudioCommand } from '../services/api';
import { FaMicrophone, FaStop, FaKeyboard, FaFileDownload, FaChartBar, FaRobot, FaSpinner } from 'react-icons/fa';
import styles from '../styles/AIReportsPage.module.css';

const AIReportsPage = () => {
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  const [textQuery, setTextQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Sugerencias de consultas predefinidas
  const suggestions = [
    "Muéstrame las ventas del último mes",
    "¿Cuáles son los productos más vendidos?",
    "Genera un reporte de clientes activos",
    "Análisis de inventario bajo en stock",
    "Ventas por categoría este año",
    "Top 10 clientes por volumen de compra",
  ];

  useEffect(() => {
    // Cleanup al desmontar
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('No se pudo acceder al micrófono. Por favor, verifique los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) {
      setError('No hay audio grabado para procesar.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      // Convertir blob a File
      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
      const response = await processAudioCommand(audioFile);

      setTranscription(response.data.transcription || '');
      
      if (response.data.result) {
        setReportData(response.data.result);
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setError(err.response?.data?.error || 'Error al procesar el audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    
    if (!textQuery.trim()) {
      setError('Por favor, ingrese una consulta.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setReportData(null);

      const response = await generateDynamicReport(textQuery);
      
      if (response.data) {
        setReportData(response.data);
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.error || 'Error al generar el reporte');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (format) => {
    if (!textQuery.trim() && !transcription.trim()) {
      setError('Necesita una consulta para descargar el reporte.');
      return;
    }

    const query = textQuery || transcription;

    try {
      setIsProcessing(true);
      setError('');

      // La función generateDynamicReport ya maneja la descarga automáticamente
      await generateDynamicReport(`${query} en formato ${format}`);
      
    } catch (err) {
      console.error('Error downloading report:', err);
      setError(err.response?.data?.error || `Error al descargar el reporte en formato ${format}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setTextQuery(suggestion);
    setInputMode('text');
  };

  const renderReportData = () => {
    if (!reportData) return null;

    return (
      <div className={styles.reportResults}>
        <div className={styles.resultHeader}>
          <h3>
            <FaChartBar />
            Resultados del Reporte
          </h3>
          <div className={styles.downloadButtons}>
            <button
              onClick={() => handleDownload('pdf')}
              className={styles.downloadBtn}
              disabled={isProcessing}
            >
              <FaFileDownload />
              PDF
            </button>
            <button
              onClick={() => handleDownload('excel')}
              className={styles.downloadBtn}
              disabled={isProcessing}
            >
              <FaFileDownload />
              Excel
            </button>
          </div>
        </div>

        {/* Respuesta Natural */}
        {reportData.natural_response && (
          <div className={styles.naturalResponse}>
            <div className={styles.aiIcon}>
              <FaRobot />
            </div>
            <div className={styles.responseText}>
              <p>{reportData.natural_response}</p>
            </div>
          </div>
        )}

        {/* Datos del Reporte */}
        {reportData.data && (
          <div className={styles.dataSection}>
            <h4>Datos del Reporte</h4>
            
            {/* Summary */}
            {reportData.data.summary && (
              <div className={styles.summaryCards}>
                {Object.entries(reportData.data.summary).map(([key, value]) => (
                  <div key={key} className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className={styles.summaryValue}>
                      {typeof value === 'number' ? value.toLocaleString('es-ES') : value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table Data */}
            {reportData.data.results && Array.isArray(reportData.data.results) && reportData.data.results.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      {Object.keys(reportData.data.results[0]).map((key) => (
                        <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.results.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>
                            {typeof value === 'number' 
                              ? value.toLocaleString('es-ES')
                              : value?.toString() || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Raw JSON (collapsible) */}
            <details className={styles.rawData}>
              <summary>Ver datos en formato JSON</summary>
              <pre>{JSON.stringify(reportData.data, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <FaRobot className={styles.headerIcon} />
            <div>
              <h1>Generador de Reportes con IA</h1>
              <p>Genera reportes personalizados usando texto o voz</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Input Mode Selector */}
      <div className={styles.modeSelector}>
        <button
          className={inputMode === 'text' ? `${styles.modeBtn} ${styles.active}` : styles.modeBtn}
          onClick={() => setInputMode('text')}
        >
          <FaKeyboard />
          Texto
        </button>
        <button
          className={inputMode === 'voice' ? `${styles.modeBtn} ${styles.active}` : styles.modeBtn}
          onClick={() => setInputMode('voice')}
        >
          <FaMicrophone />
          Voz
        </button>
      </div>

      {/* Input Area */}
      <div className={styles.inputSection}>
        {inputMode === 'text' ? (
          <form onSubmit={handleTextSubmit} className={styles.textInputForm}>
            <div className={styles.textareaWrapper}>
              <textarea
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="Escribe tu consulta aquí... Ejemplo: 'Muéstrame las ventas del último mes' o 'Top 10 productos más vendidos'"
                className={styles.textarea}
                rows={4}
                disabled={isProcessing}
              />
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isProcessing || !textQuery.trim()}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className={styles.spinning} />
                  Generando...
                </>
              ) : (
                <>
                  <FaChartBar />
                  Generar Reporte
                </>
              )}
            </button>
          </form>
        ) : (
          <div className={styles.voiceInputArea}>
            <div className={styles.recordingControls}>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className={styles.recordBtn}
                  disabled={isProcessing}
                >
                  <FaMicrophone />
                  Iniciar Grabación
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className={`${styles.recordBtn} ${styles.recording}`}
                >
                  <FaStop />
                  Detener Grabación
                </button>
              )}

              {audioBlob && !isRecording && (
                <button
                  onClick={handleProcessAudio}
                  className={styles.processBtn}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className={styles.spinning} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaRobot />
                      Procesar Audio
                    </>
                  )}
                </button>
              )}
            </div>

            {isRecording && (
              <div className={styles.recordingIndicator}>
                <div className={styles.pulse}></div>
                <span>Grabando...</span>
              </div>
            )}

            {transcription && (
              <div className={styles.transcription}>
                <h4>Transcripción:</h4>
                <p>{transcription}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className={styles.suggestions}>
        <h3>Consultas Sugeridas:</h3>
        <div className={styles.suggestionGrid}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={styles.suggestionBtn}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isProcessing}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Report Results */}
      {renderReportData()}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingContent}>
            <FaSpinner className={styles.spinnerLarge} />
            <p>Procesando su solicitud...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReportsPage;
