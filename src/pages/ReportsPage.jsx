// src/pages/ReportsPage.jsx
/**
 * Página para generar reportes dinámicos mediante texto o voz
 */

import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaFilePdf, FaFileExcel, FaSearch, FaSpinner } from 'react-icons/fa';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { generateDynamicReport } from '../services/api';
import ReportViewer from '../components/reports/ReportViewer';
import '../styles/ReportsPage.css';

const ReportsPage = () => {
  const [prompt, setPrompt] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const wasListeningRef = useRef(false);
  
  const {
    isListening,
    transcript,
    isSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  // Actualizar el prompt cuando se recibe el transcript de voz
  useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
    }
  }, [transcript]);

  // Generar reporte automáticamente cuando termina el reconocimiento de voz
  useEffect(() => {
    // Si estaba escuchando y dejó de escuchar, y hay un transcript
    if (wasListeningRef.current && !isListening && transcript && transcript.trim()) {
      console.log('Generando reporte automáticamente con:', transcript);
      handleGenerateReport();
    }
    wasListeningRef.current = isListening;
  }, [isListening, transcript]);

  // Ejemplos de prompts
  const examplePrompts = [
    "Reporte de ventas del mes de octubre en PDF",
    "Ventas del 01/09/2024 al 18/10/2024 en Excel",
    "Ventas por producto del último mes",
    "Clientes con más compras en pantalla",
    "Ventas por categoría en Excel",
    "Reporte general de ventas del año 2024"
  ];

  const handleGenerateReport = async () => {
    if (!prompt.trim()) {
      setError('Por favor, ingresa un prompt o usa el micrófono.');
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await generateDynamicReport(prompt);
      
      // Si se descargó un archivo, mostrar mensaje de éxito
      if (response.downloaded) {
        setReportData({ 
          success: true, 
          message: '✅ El archivo se ha descargado exitosamente' 
        });
      } else if (response.data) {
        // Si es un reporte en pantalla, mostrarlo
        setReportData(response);
      }
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setError(err.response?.data?.detail || 'Error al generar el reporte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateReport();
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-container">
        <div className="reports-header">
          <h1>📊 Reportes Dinámicos</h1>
          <p>Genera reportes personalizados usando comandos de texto o voz</p>
        </div>

        {/* Input de prompt */}
        <div className="prompt-section">
          <div className="prompt-input-wrapper">
            <textarea
              className="prompt-input"
              placeholder="Ejemplo: Reporte de ventas del mes de octubre en PDF"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              disabled={loading || isListening}
            />
            
            {/* Botón de micrófono */}
            <button
              className={`voice-button ${isListening ? 'listening' : ''} ${!isSupported ? 'disabled' : ''}`}
              onClick={handleVoiceInput}
              disabled={!isSupported || loading}
              title={!isSupported ? 'Tu navegador no soporta reconocimiento de voz' : 'Usar micrófono'}
            >
              <FaMicrophone />
              {isListening && <span className="pulse-ring"></span>}
            </button>
          </div>

          {/* Indicadores de estado */}
          {isListening && (
            <div className="listening-indicator">
              <span className="pulse-dot"></span>
              Escuchando... Habla ahora
            </div>
          )}

          {voiceError && (
            <div className="error-message voice-error">
              {voiceError}
            </div>
          )}

          {/* Botón de generar */}
          <button
            className="generate-button"
            onClick={handleGenerateReport}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Generando reporte...
              </>
            ) : (
              <>
                <FaSearch />
                Generar Reporte
              </>
            )}
          </button>
        </div>

        {/* Ejemplos de prompts */}
        <div className="examples-section">
          <h3>💡 Ejemplos de comandos:</h3>
          <div className="examples-grid">
            {examplePrompts.map((example, index) => (
              <div
                key={index}
                className="example-card"
                onClick={() => handleExampleClick(example)}
              >
                {example.includes('PDF') ? (
                  <FaFilePdf className="example-icon pdf" />
                ) : example.includes('Excel') ? (
                  <FaFileExcel className="example-icon excel" />
                ) : (
                  <FaSearch className="example-icon screen" />
                )}
                <span>{example}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Visor de reporte */}
        {reportData && reportData.success && reportData.message && (
          <div className="success-message">
            {reportData.message}
          </div>
        )}
        
        {reportData && !reportData.downloaded && (
          <ReportViewer data={reportData} />
        )}

        {/* Información adicional */}
        <div className="info-section">
          <h4>ℹ️ Instrucciones:</h4>
          <ul>
            <li><strong>Fechas:</strong> Usa formatos como "mes de octubre", "último mes", "del 01/09/2024 al 18/10/2024"</li>
            <li><strong>Agrupación:</strong> Especifica "por producto", "por cliente", "por categoría", "por fecha"</li>
            <li><strong>Formato:</strong> Termina con "en PDF", "en Excel" o "en pantalla"</li>
            <li><strong>Voz:</strong> Haz clic en el micrófono y habla claramente tu comando</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
