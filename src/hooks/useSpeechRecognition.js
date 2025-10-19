// src/hooks/useSpeechRecognition.js
/**
 * Hook personalizado para reconocimiento de voz usando Web Speech API
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Verificar si el navegador soporta Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Inicializar el reconocimiento de voz
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // No continuar escuchando indefinidamente
      recognition.interimResults = true; // Mostrar resultados parciales
      recognition.lang = 'es-ES'; // Idioma español (cambiar a 'en-US' para inglés)
      recognition.maxAlternatives = 1;
      
      // Event listeners
      recognition.onstart = () => {
        console.log('Reconocimiento de voz iniciado');
        setError(null);
      };
      
      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const speechResult = event.results[lastResultIndex][0].transcript;
        console.log('Resultado:', speechResult);
        setTranscript(speechResult);
      };
      
      recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        
        // Si hay un error de red pero ya tenemos transcript, no mostrar error
        if (event.error === 'network' && transcript) {
          console.log('Error de red pero transcript capturado:', transcript);
          setIsListening(false);
          return;
        }
        
        setIsListening(false);
        
        // Mensajes de error personalizados
        switch (event.error) {
          case 'no-speech':
            setError('No se detectó ningún audio. Por favor, intenta de nuevo.');
            break;
          case 'audio-capture':
            setError('No se pudo acceder al micrófono. Verifica los permisos.');
            break;
          case 'not-allowed':
            setError('Permiso de micrófono denegado. Por favor, habilita el acceso.');
            break;
          case 'network':
            // Si hay error de red, intentar usar el último transcript capturado
            console.warn('Error de red en Web Speech API. El texto capturado se usará de todos modos.');
            break;
          case 'aborted':
            setError('Reconocimiento de voz cancelado.');
            break;
          case 'service-not-allowed':
            setError('Servicio no permitido. Verifica que estés en HTTPS o localhost.');
            break;
          default:
            setError(`Error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        console.log('Reconocimiento de voz finalizado');
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn('Web Speech API no es soportada en este navegador');
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript(''); // Limpiar transcript anterior
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error al iniciar reconocimiento:', err);
        setError('Error al iniciar el reconocimiento de voz.');
      }
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};

export default useSpeechRecognition;
