/**
 * 🛠️ Utilidades para el Sistema de Comandos
 * Funciones de ayuda basadas en CONFIGURACION_FRONTEND.js
 */

import { commandsConfig } from '../config/commandsConfig';

/**
 * Formatea la confianza como porcentaje
 * @param {number} score - Score de confianza (0-1)
 * @returns {string} Porcentaje formateado
 */
export const formatConfidence = (score) => {
  return `${(score * 100).toFixed(0)}%`;
};

/**
 * Determina el nivel de confianza
 * @param {number} score - Score de confianza (0-1)
 * @returns {string} 'high' | 'medium' | 'low'
 */
export const getConfidenceLevel = (score) => {
  const { high, medium } = commandsConfig.confidence;
  
  if (score >= high) return 'high';
  if (score >= medium) return 'medium';
  return 'low';
};

/**
 * Obtiene el color según el nivel de confianza
 * @param {number} score - Score de confianza (0-1)
 * @returns {string} Clases CSS de color
 */
export const getConfidenceColor = (score) => {
  const level = getConfidenceLevel(score);
  
  const colors = {
    high: 'confidence-high',
    medium: 'confidence-medium',
    low: 'confidence-low',
  };
  
  return colors[level];
};

/**
 * Obtiene el emoji según el nivel de confianza
 * @param {number} score - Score de confianza (0-1)
 * @returns {string} Emoji
 */
export const getConfidenceEmoji = (score) => {
  const level = getConfidenceLevel(score);
  
  const emojis = {
    high: '🎯',
    medium: '⚠️',
    low: '❌',
  };
  
  return emojis[level];
};

/**
 * Formatea el tiempo de procesamiento
 * @param {number} ms - Milisegundos
 * @returns {string} Tiempo formateado
 */
export const formatProcessingTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

/**
 * Formatea fechas de manera legible
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea fecha corta
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha corta
 */
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Formatea hora
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Hora formateada
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

/**
 * Trunca texto largo
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Genera un nombre de archivo único
 * @param {string} reportType - Tipo de reporte
 * @param {string} format - Formato del archivo
 * @param {number} id - ID del comando
 * @returns {string} Nombre del archivo
 */
export const generateFilename = (reportType, format, id) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = commandsConfig.formats[format]?.extension || '';
  const cleanType = reportType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `${cleanType}_${timestamp}_${id}${extension}`;
};

/**
 * Obtiene el ícono para un formato
 * @param {string} format - Formato (pdf, excel, json)
 * @returns {string} Emoji del formato
 */
export const getFormatIcon = (format) => {
  return commandsConfig.formats[format]?.icon || '📄';
};

/**
 * Obtiene el color para un formato
 * @param {string} format - Formato (pdf, excel, json)
 * @returns {string} Color hex
 */
export const getFormatColor = (format) => {
  return commandsConfig.formats[format]?.color || '#6b7280';
};

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Obtiene el estatus con emoji
 * @param {string} status - EXECUTED | FAILED | PROCESSING
 * @returns {string} Estatus con emoji
 */
export const getStatusDisplay = (status) => {
  const statuses = {
    EXECUTED: '✅ Ejecutado',
    FAILED: '❌ Fallido',
    PROCESSING: '⏳ Procesando...',
  };
  return statuses[status] || status;
};

/**
 * Obtiene el color del estatus
 * @param {string} status - EXECUTED | FAILED | PROCESSING
 * @returns {string} Clase CSS
 */
export const getStatusColor = (status) => {
  const colors = {
    EXECUTED: 'status-success',
    FAILED: 'status-error',
    PROCESSING: 'status-processing',
  };
  return colors[status] || '';
};

/**
 * Valida si una URL es válida
 * @param {string} url - URL a validar
 * @returns {boolean} Es válida
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar:', err);
    return false;
  }
};

/**
 * Formatea números con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  return new Intl.NumberFormat('es-ES').format(num);
};

/**
 * Formatea moneda
 * @param {number} amount - Cantidad
 * @param {string} currency - Código de moneda
 * @returns {string} Moneda formateada
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Debounce para funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Obtiene un saludo según la hora del día
 * @returns {string} Saludo
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

/**
 * Verifica si el navegador soporta Web Speech API
 * @returns {boolean} Soporta Web Speech API
 */
export const supportsSpeechRecognition = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Verifica si el navegador soporta descarga de archivos
 * @returns {boolean} Soporta descargas
 */
export const supportsDownload = () => {
  return !!(document.createElement('a').download !== undefined);
};

export default {
  formatConfidence,
  getConfidenceLevel,
  getConfidenceColor,
  getConfidenceEmoji,
  formatProcessingTime,
  formatDate,
  formatDateShort,
  formatTime,
  truncateText,
  generateFilename,
  getFormatIcon,
  getFormatColor,
  capitalize,
  getStatusDisplay,
  getStatusColor,
  isValidUrl,
  copyToClipboard,
  formatNumber,
  formatCurrency,
  debounce,
  getGreeting,
  supportsSpeechRecognition,
  supportsDownload,
};
