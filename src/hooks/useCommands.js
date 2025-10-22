/**
 * 🎯 Hook para gestión de comandos de voz
 * Maneja el estado, procesamiento y caché de comandos
 */

import { useState, useCallback, useRef } from 'react';
import commandService from '../services/commandService';

export function useCommands() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Caché simple en memoria
  const cacheRef = useRef(new Map());
  const MAX_CACHE_SIZE = 50;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Procesa un comando de voz/texto
   */
  const processCommand = useCallback(async (text) => {
    // Validar entrada
    const validation = commandService.validateCommand(text);
    if (!validation.valid) {
      setError(validation.error);
      return { success: false, error: validation.error };
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestions([]);

    // Verificar caché
    const cacheKey = text.toLowerCase().trim();
    const cached = cacheRef.current.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('📦 Usando resultado desde caché');
      setResult(cached.data);
      setLoading(false);
      return cached.data;
    }

    try {
      const response = await commandService.processCommand(text);

      if (response.success) {
        setResult(response.data);
        
        // Guardar en caché
        if (cacheRef.current.size >= MAX_CACHE_SIZE) {
          const firstKey = cacheRef.current.keys().next().value;
          cacheRef.current.delete(firstKey);
        }
        cacheRef.current.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      } else {
        setError(response.data?.error_message || 'No se pudo procesar el comando');
        setSuggestions(response.suggestions || []);
      }

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Error al procesar el comando';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Descarga un reporte en PDF
   */
  const downloadPDF = useCallback(async (commandId, filename) => {
    try {
      const blob = await commandService.downloadPDF(commandId);
      const finalFilename = filename || commandService.generateFilename('reporte', 'pdf', commandId);
      commandService.downloadBlob(blob, finalFilename);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al descargar PDF');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Descarga un reporte en Excel
   */
  const downloadExcel = useCallback(async (commandId, filename) => {
    try {
      const blob = await commandService.downloadExcel(commandId);
      const finalFilename = filename || commandService.generateFilename('reporte', 'excel', commandId);
      commandService.downloadBlob(blob, finalFilename);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error al descargar Excel');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Descarga datos en JSON
   */
  const downloadJSON = useCallback((data, filename) => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      commandService.downloadBlob(blob, filename || 'reporte.json');
      return { success: true };
    } catch (err) {
      setError('Error al descargar JSON');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Obtiene el historial de comandos
   */
  const fetchHistory = useCallback(async (params = {}) => {
    try {
      const response = await commandService.getHistory(params);
      if (response.success && response.data) {
        setHistory(response.data);
      }
      return response;
    } catch (err) {
      console.error('Error al obtener historial:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Limpia el estado actual
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setSuggestions([]);
  }, []);

  /**
   * Limpia la caché
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    console.log('🗑️ Caché limpiada');
  }, []);

  /**
   * Reutiliza un comando del historial
   */
  const reuseCommand = useCallback(async (commandText) => {
    return await processCommand(commandText);
  }, [processCommand]);

  return {
    // Estado
    loading,
    error,
    result,
    suggestions,
    history,
    
    // Acciones
    processCommand,
    downloadPDF,
    downloadExcel,
    downloadJSON,
    fetchHistory,
    clearResult,
    clearCache,
    reuseCommand,
  };
}

export default useCommands;
