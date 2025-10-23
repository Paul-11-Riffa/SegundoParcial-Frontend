/**
 * ⚙️ Configuración del Sistema de Comandos Inteligentes
 * Basado en CONFIGURACION_FRONTEND.js
 */

export const commandsConfig = {
  // Endpoints
  endpoints: {
    process: '/api/voice-commands/process/',
    history: '/api/voice-commands/history/',
    capabilities: '/api/voice-commands/capabilities/',
    downloadPDF: (id) => `/api/voice-commands/${id}/download/pdf/`,
    downloadExcel: (id) => `/api/voice-commands/${id}/download/excel/`,
  },

  // Configuración de voz
  voice: {
    language: 'es-ES',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
  },

  // Timeouts
  timeouts: {
    processing: 30000, // 30 segundos
    download: 60000,   // 60 segundos
  },

  // Límites
  limits: {
    minCommandLength: 3,
    maxCommandLength: 1000,
    historyPageSize: 20,
  },

  // Umbrales de confianza
  confidence: {
    high: 0.7,      // >= 70% = comando claro
    medium: 0.4,    // 40-70% = sugerencias
    low: 0.4,       // < 40% = error
  },

  // Caché
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutos
    maxSize: 50, // 50 comandos en caché
  },

  // Formatos soportados
  formats: {
    json: {
      name: 'JSON',
      extension: '.json',
      mimeType: 'application/json',
      icon: '💾',
      color: '#6366f1',
    },
    pdf: {
      name: 'PDF',
      extension: '.pdf',
      mimeType: 'application/pdf',
      icon: '📄',
      color: '#ef4444',
    },
    excel: {
      name: 'Excel',
      extension: '.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      icon: '📊',
      color: '#10b981',
    },
  },

  // Ejemplos de comandos por categoría
  examples: {
    basic: [
      'reporte de ventas del último mes',
      'ventas de esta semana',
      'reporte de ventas de octubre',
      'ventas de hoy',
      'ventas del año 2024',
    ],
    products: [
      'top 10 productos más vendidos',
      'productos más vendidos del mes',
      'ventas por producto',
      'análisis de productos',
    ],
    customers: [
      'ventas por cliente',
      'top 20 clientes',
      'mejores clientes del año',
      'reporte de clientes del mes',
    ],
    advanced: [
      'análisis RFM',
      'análisis ABC',
      'dashboard ejecutivo',
      'análisis de inventario',
    ],
    ml: [
      'predicción de ventas para 7 días',
      'forecast del próximo mes',
      'predice qué productos se venderán',
      'predicción de productos para la semana',
    ],
  },

  // Mensajes de error personalizados
  errorMessages: {
    network: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
    unauthorized: 'Sesión expirada. Por favor inicia sesión nuevamente.',
    timeout: 'El comando está tardando demasiado. Intenta con un reporte más simple.',
    serverError: 'Error del servidor. Intenta nuevamente en unos momentos.',
    invalidCommand: 'No pude entender el comando. Intenta ser más específico.',
    emptyCommand: 'El comando no puede estar vacío.',
    commandTooShort: 'El comando es demasiado corto. Sé más específico.',
    commandTooLong: 'El comando es demasiado largo.',
  },
};

/**
 * Tipos de reporte disponibles
 */
export const REPORT_TYPES = {
  VENTAS_BASICO: 'ventas_basico',
  TOP_PRODUCTOS: 'top_productos',
  VENTAS_POR_PRODUCTO: 'ventas_por_producto',
  VENTAS_POR_CLIENTE: 'ventas_por_cliente',
  VENTAS_POR_CATEGORIA: 'ventas_por_categoria',
  RFM_ANALYSIS: 'rfm_analysis',
  ABC_ANALYSIS: 'abc_analysis',
  DASHBOARD: 'dashboard',
  INVENTARIO: 'inventario',
  PREDICCION_VENTAS: 'prediccion_ventas',
  PREDICCION_PRODUCTOS: 'prediccion_productos',
  RECOMENDACIONES: 'recomendaciones',
  COMPARATIVO: 'comparativo',
  TENDENCIAS: 'tendencias',
};

/**
 * Nombres legibles de reportes
 */
export const REPORT_NAMES = {
  [REPORT_TYPES.VENTAS_BASICO]: 'Reporte Básico de Ventas',
  [REPORT_TYPES.TOP_PRODUCTOS]: 'Top Productos Más Vendidos',
  [REPORT_TYPES.VENTAS_POR_PRODUCTO]: 'Ventas por Producto',
  [REPORT_TYPES.VENTAS_POR_CLIENTE]: 'Ventas por Cliente',
  [REPORT_TYPES.VENTAS_POR_CATEGORIA]: 'Ventas por Categoría',
  [REPORT_TYPES.RFM_ANALYSIS]: 'Análisis RFM',
  [REPORT_TYPES.ABC_ANALYSIS]: 'Análisis ABC',
  [REPORT_TYPES.DASHBOARD]: 'Dashboard Ejecutivo',
  [REPORT_TYPES.INVENTARIO]: 'Análisis de Inventario',
  [REPORT_TYPES.PREDICCION_VENTAS]: 'Predicción de Ventas',
  [REPORT_TYPES.PREDICCION_PRODUCTOS]: 'Predicción de Productos',
  [REPORT_TYPES.RECOMENDACIONES]: 'Recomendaciones',
  [REPORT_TYPES.COMPARATIVO]: 'Análisis Comparativo',
  [REPORT_TYPES.TENDENCIAS]: 'Análisis de Tendencias',
};

/**
 * Íconos para tipos de reporte
 */
export const REPORT_ICONS = {
  [REPORT_TYPES.VENTAS_BASICO]: '📊',
  [REPORT_TYPES.TOP_PRODUCTOS]: '🏆',
  [REPORT_TYPES.VENTAS_POR_PRODUCTO]: '📦',
  [REPORT_TYPES.VENTAS_POR_CLIENTE]: '👥',
  [REPORT_TYPES.VENTAS_POR_CATEGORIA]: '🏷️',
  [REPORT_TYPES.RFM_ANALYSIS]: '📈',
  [REPORT_TYPES.ABC_ANALYSIS]: '📊',
  [REPORT_TYPES.DASHBOARD]: '🎯',
  [REPORT_TYPES.INVENTARIO]: '📦',
  [REPORT_TYPES.PREDICCION_VENTAS]: '🔮',
  [REPORT_TYPES.PREDICCION_PRODUCTOS]: '🎯',
  [REPORT_TYPES.RECOMENDACIONES]: '💡',
  [REPORT_TYPES.COMPARATIVO]: '⚖️',
  [REPORT_TYPES.TENDENCIAS]: '📈',
};

export default commandsConfig;
