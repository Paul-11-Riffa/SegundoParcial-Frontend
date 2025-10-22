/**
 * 🎤 Componente de Input con Voz
 * Input principal para comandos de texto y voz
 */

import React, { useState, useRef } from 'react';
import { FaMicrophone, FaPaperPlane, FaKeyboard } from 'react-icons/fa';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import styles from '../../styles/VoiceCommandsPage.module.css';

const CommandInput = ({ onSubmit, loading, examples = [] }) => {
  const [inputText, setInputText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef(null);
  const wasListeningRef = useRef(false);

  const {
    isListening,
    transcript,
    isSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Actualizar input cuando se recibe transcript
  React.useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Auto-enviar cuando termina de escuchar
  React.useEffect(() => {
    if (wasListeningRef.current && !isListening && transcript) {
      handleSubmit();
    }
    wasListeningRef.current = isListening;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const text = inputText.trim();
    if (!text || loading) return;

    onSubmit(text);
  };

  const handleVoiceClick = () => {
    if (!isSupported) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setInputText('');
      startListening();
    }
  };

  const handleExampleClick = (example) => {
    setInputText(example);
    setShowExamples(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.commandInput}>
      {/* Header con título */}
      <div className={styles.inputHeader}>
        <FaKeyboard />
        <h3>Escribe o dicta tu comando</h3>
      </div>

      {/* Input principal */}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            className={`${styles.textInput} ${isListening ? styles.listening : ''}`}
            placeholder="Ejemplo: reporte de ventas del último mes en PDF"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
            disabled={loading || isListening}
          />

          {/* Botón de micrófono */}
          <button
            type="button"
            className={`${styles.voiceButton} ${isListening ? styles.active : ''} ${!isSupported ? styles.disabled : ''}`}
            onClick={handleVoiceClick}
            disabled={!isSupported || loading}
            title={!isSupported ? 'Reconocimiento de voz no disponible' : isListening ? 'Detener grabación' : 'Grabar comando'}
          >
            <FaMicrophone />
            {isListening && <span className={styles.pulseRing} />}
          </button>
        </div>

        {/* Indicador de escuchando */}
        {isListening && (
          <div className={styles.listeningIndicator}>
            <span className={styles.pulseDot} />
            <span>Escuchando... Habla ahora</span>
          </div>
        )}

        {/* Error de voz */}
        {voiceError && (
          <div className={styles.voiceError}>
            ⚠️ {voiceError}
          </div>
        )}

        {/* Botones de acción */}
        <div className={styles.inputActions}>
          <button
            type="button"
            className={styles.examplesButton}
            onClick={() => setShowExamples(!showExamples)}
            disabled={loading}
          >
            💡 {showExamples ? 'Ocultar ejemplos' : 'Ver ejemplos'}
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !inputText.trim()}
          >
            <FaPaperPlane />
            {loading ? 'Procesando...' : 'Generar Reporte'}
          </button>
        </div>
      </form>

      {/* Panel de ejemplos */}
      {showExamples && examples.length > 0 && (
        <div className={styles.examplesPanel}>
          <p className={styles.examplesTitle}>Haz clic en un ejemplo para usarlo:</p>
          <div className={styles.examplesGrid}>
            {examples.map((example, index) => (
              <button
                key={index}
                className={styles.exampleCard}
                onClick={() => handleExampleClick(example)}
                disabled={loading}
              >
                <span className={styles.exampleIcon}>📝</span>
                <span className={styles.exampleText}>{example}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandInput;
