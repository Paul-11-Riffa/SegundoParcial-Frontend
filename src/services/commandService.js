/**
 * 🎤 Servicio de Comandos de Voz Inteligentes
 * Sistema completo de procesamiento de comandos en lenguaje natural
 * Basado en GUIA_INTEGRACION_FRONTEND.md
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class CommandService {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/voice-commands/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token automáticamente
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores globalmente
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Sesión expirada. Redirigiendo a login...');
          // Aquí podrías disparar un evento para redirigir al login
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Procesa un comando de texto en lenguaje natural
   * @param {string} text - Comando en lenguaje natural
   * @returns {Promise} Respuesta del servidor
   */
  async processCommand(text) {
    try {
      const response = await this.client.post('process/', { text });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene el historial de comandos del usuario
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise} Historial de comandos
   */
  async getHistory(params = {}) {
    try {
      const response = await this.client.get('history/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene las capacidades del sistema
   * @returns {Promise} Capacidades y ejemplos del sistema
   */
  async getCapabilities() {
    try {
      const response = await this.client.get('capabilities/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Descarga un reporte en formato PDF
   * @param {number} commandId - ID del comando ejecutado
   * @returns {Promise<Blob>} Archivo PDF
   */
  async downloadPDF(commandId) {
    try {
      const response = await this.client.get(`${commandId}/download/pdf/`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Descarga un reporte en formato Excel
   * @param {number} commandId - ID del comando ejecutado
   * @returns {Promise<Blob>} Archivo Excel
   */
  async downloadExcel(commandId) {
    try {
      const response = await this.client.get(`${commandId}/download/excel/`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene los datos JSON de un comando
   * @param {number} commandId - ID del comando ejecutado
   * @returns {Promise} Datos del reporte
   */
  async getCommandData(commandId) {
    try {
      const response = await this.client.get(`${commandId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Manejo centralizado de errores
   * @param {Error} error - Error de axios
   * @returns {Object} Objeto de error formateado
   */
  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      let message = 'Error al procesar la solicitud';

      switch (status) {
        case 400:
          message = data.error || data.detail || 'Solicitud inválida';
          break;
        case 401:
          message = 'Sesión expirada. Por favor inicia sesión nuevamente.';
          break;
        case 403:
          message = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          message = 'Comando no encontrado';
          break;
        case 408:
        case 504:
          message = 'El comando está tardando demasiado. Intenta con un reporte más simple.';
          break;
        case 500:
        case 502:
        case 503:
          message = 'Error del servidor. Intenta nuevamente en unos momentos.';
          break;
        default:
          message = data.error || data.detail || 'Error desconocido';
      }

      return {
        message,
        details: data,
        status,
      };
    }

    if (error.request) {
      return {
        message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        details: error.message,
      };
    }

    return {
      message: error.message || 'Error inesperado',
      details: error,
    };
  }

  /**
   * Valida un comando antes de enviarlo
   * @param {string} text - Texto del comando
   * @returns {Object} { valid: boolean, error?: string }
   */
  validateCommand(text) {
    if (!text || !text.trim()) {
      return { valid: false, error: 'El comando no puede estar vacío' };
    }

    if (text.trim().length < 3) {
      return { 
        valid: false, 
        error: 'El comando debe tener al menos 3 caracteres' 
      };
    }

    if (text.length > 1000) {
      return { 
        valid: false, 
        error: 'El comando es demasiado largo (máximo 1000 caracteres)' 
      };
    }

    return { valid: true };
  }

  /**
   * Descarga un archivo blob con nombre personalizado
   * @param {Blob} blob - Archivo blob
   * @param {string} filename - Nombre del archivo
   */
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Genera un nombre de archivo para descarga
   * @param {string} reportType - Tipo de reporte
   * @param {string} format - Formato (pdf, excel, json)
   * @param {number} id - ID del comando
   * @returns {string} Nombre del archivo
   */
  generateFilename(reportType, format, id) {
    const timestamp = new Date().toISOString().split('T')[0];
    const extensions = {
      pdf: '.pdf',
      excel: '.xlsx',
      json: '.json',
    };
    const extension = extensions[format] || '';
    const cleanType = reportType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return `${cleanType}_${timestamp}_${id}${extension}`;
  }
}

export default new CommandService();
