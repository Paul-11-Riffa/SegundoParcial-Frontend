import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Este interceptor se asegura de que CADA petición que salga
// de apiClient tenga el token de autenticación si existe.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Funciones de Autenticación ---
export const registerUser = (userData) => {
  return apiClient.post('/register/', userData);
};

export const loginUser = (credentials) => {
  return apiClient.post('/login/', credentials);
};

export const logoutUser = () => {
  return apiClient.post('/logout/');
};

export const getUserProfile = () => {
  return apiClient.get('/profile/');
};

// --- Funciones de Gestión de Usuarios (Admin) ---
export const getAllUsers = () => {
  return apiClient.get('/users/');
};

export const createUser = (userData) => {
  return apiClient.post('/users/', userData);
};

export const updateUser = (userId, userData) => {
  return apiClient.put(`/users/${userId}/`, userData);
};

export const deleteUser = (userId) => {
  return apiClient.delete(`/users/${userId}/`);
};

export const requestPasswordReset = (email) => {
  return apiClient.post('/password-reset/', { email });
};

export const resetPasswordConfirm = (data) => {
  return apiClient.post('/password-reset/confirm/', data);
};

export const updateUserProfile = (userData) => {
  return apiClient.put('/profile/', userData);
};

// --- Funciones de Gestión de la Tienda (Admin) ---

// -- Categorías --
export const getCategories = () => {
  return apiClient.get('/shop/categories/');
};

// -- Productos --
export const getProducts = (filters = {}) => {
  // Soporta filtros: name, category_slug, price_min, price_max, stock_min, in_stock, search, ordering
  return apiClient.get('/shop/products/', { params: filters });
};

export const createProduct = (productData) => {
  // Si productData es FormData (contiene imagen), debemos cambiar el Content-Type
  const config = productData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};

  return apiClient.post('/shop/products/', productData, config);
};

export const updateProduct = (productId, productData) => {
  // Si productData es FormData (contiene imagen), debemos cambiar el Content-Type
  const config = productData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};

  return apiClient.put(`/shop/products/${productId}/`, productData, config);
};

export const deleteProduct = (productId) => {
  return apiClient.delete(`/shop/products/${productId}/`);
};

// --- Funciones del Carrito (Cliente) ---

export const getCart = () => {
  return apiClient.get('/orders/cart/');
};

export const addToCart = (productId, quantity = 1) => {
  return apiClient.post('/orders/cart/', { product_id: productId, quantity });
};

export const updateCartItem = (itemId, quantity) => {
  return apiClient.put(`/orders/cart/items/${itemId}/`, { quantity });
};

// -- Historial de Ventas --
export const getSalesHistory = (filters = {}) => {
  // filters puede ser un objeto como { start_date, end_date, customer, status, min_price, max_price }
  return apiClient.get('/orders/sales-history/', { params: filters });
};

// Ver detalle de una orden específica
export const getOrderDetail = (orderId) => {
  return apiClient.get(`/orders/sales-history/${orderId}/`);
};

// Función para descargar el PDF
export const downloadReceipt = (orderId) => {
  return apiClient.get(`/orders/sales-history/${orderId}/receipt/`, {
    responseType: 'blob', // ¡Importante! Le dice a Axios que espere un archivo binario
  });
};

export const removeCartItem = (itemId) => {
  return apiClient.delete(`/orders/cart/items/${itemId}/`);
};

export const initiateCheckout = () => {
  return apiClient.post('/orders/checkout/');
};

export const completeOrder = () => {
  return apiClient.post('/orders/complete-order/');
};

export const getMyOrders = () => {
  return apiClient.get('/orders/my-orders/');
};

// --- NUEVAS FUNCIONES PARA REPORTES DINÁMICOS ---

/**
 * Genera un reporte dinámico basado en un prompt de texto
 * @param {string} prompt - El comando de texto para generar el reporte
 * @returns {Promise} - Respuesta con los datos del reporte o archivo descargable
 */
export const generateDynamicReport = async (prompt) => {
  // Si el prompt incluye PDF o Excel, usar responseType blob para descargar
  const lowerPrompt = prompt.toLowerCase();
  const isFileDownload = lowerPrompt.includes('pdf') || lowerPrompt.includes('excel');
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/orders/reports/generate/', { prompt }, config);
  
  // Si es un archivo, descargarlo automáticamente
  if (isFileDownload && response.data instanceof Blob) {
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    
    // Extraer el nombre del archivo del header Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'reporte';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) filename = filenameMatch[1];
    } else {
      // Si no hay header, usar extensión según el tipo
      filename = lowerPrompt.includes('pdf') ? 'reporte.pdf' : 'reporte.xlsx';
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, downloaded: true };
  }
  
  return response;
};

/**
 * Descarga un reporte en formato PDF
 * @param {string} prompt - El comando de texto con "en PDF" al final
 * @returns {Promise} - Respuesta con el archivo PDF
 */
export const downloadReportPDF = (prompt) => {
  return apiClient.post('/orders/reports/generate/', { prompt }, {
    responseType: 'blob'
  });
};

/**
 * Descarga un reporte en formato Excel
 * @param {string} prompt - El comando de texto con "en Excel" al final
 * @returns {Promise} - Respuesta con el archivo Excel
 */
export const downloadReportExcel = (prompt) => {
  return apiClient.post('/orders/reports/generate/', { prompt }, {
    responseType: 'blob'
  });
};

// --- REPORTES AVANZADOS ⭐ NUEVO ---

/**
 * Análisis RFM de Clientes - Segmenta clientes en VIP, Regular, Nuevo, En Riesgo, Inactivo
 * @param {Object} params - { start_date, end_date, format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con datos del análisis o archivo descargable
 */
export const getCustomerAnalysis = async (params) => {
  const { format = 'json', ...otherParams } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/orders/reports/customer-analysis/', 
    { ...otherParams, format }, 
    config
  );
  
  // Si es un archivo, descargarlo automáticamente
  if (isFileDownload && response.data instanceof Blob) {
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const filename = `analisis_clientes_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, downloaded: true };
  }
  
  return response;
};

/**
 * Análisis ABC de Productos - Clasifica productos según Pareto (80/20)
 * @param {Object} params - { start_date, end_date, format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con clasificación ABC
 */
export const getProductABCAnalysis = async (params) => {
  const { format = 'json', ...otherParams } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/orders/reports/product-abc/', 
    { ...otherParams, format }, 
    config
  );
  
  if (isFileDownload && response.data instanceof Blob) {
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const filename = `analisis_abc_productos_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, downloaded: true };
  }
  
  return response;
};

/**
 * Reporte Comparativo - Compara métricas entre dos períodos
 * @param {Object} params - { start_date, end_date, comparison: 'previous_month'|'previous_period', format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con comparación de períodos
 */
export const getComparativeReport = async (params) => {
  const { format = 'json', ...otherParams } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/orders/reports/comparative/', 
    { ...otherParams, format }, 
    config
  );
  
  if (isFileDownload && response.data instanceof Blob) {
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const filename = `reporte_comparativo_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, downloaded: true };
  }
  
  return response;
};

/**
 * Dashboard Ejecutivo - Panel con KPIs, tops y alertas
 * @param {Object} params - { start_date, end_date }
 * @returns {Promise} - Respuesta con datos del dashboard
 */
export const getExecutiveDashboard = (params) => {
  return apiClient.post('/orders/reports/dashboard/', params);
};

/**
 * Análisis de Inventario - Análisis inteligente del inventario
 * @param {Object} params - { format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con análisis de inventario
 */
export const getInventoryAnalysis = async (params = {}) => {
  const { format = 'json' } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/orders/reports/inventory-analysis/', 
    { format }, 
    config
  );
  
  if (isFileDownload && response.data instanceof Blob) {
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const filename = `analisis_inventario_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, downloaded: true };
  }
  
  return response;
};

// =================== Machine Learning APIs ===================

/**
 * Dashboard de ML - Obtiene métricas y estado del modelo
 * @returns {Promise} - Respuesta con información del modelo ML
 */
export const getMLDashboard = async () => {
  const response = await apiClient.get('/orders/ml/dashboard/');
  return response;
};

/**
 * Predicciones de ML - Obtiene predicciones de ventas
 * @param {Object} params - { days: number } - Número de días a predecir (default: 30)
 * @returns {Promise} - Respuesta con predicciones
 */
export const getMLPredictions = async (params = {}) => {
  const { days = 30 } = params;
  const response = await apiClient.get('/orders/ml/predictions/', {
    params: { days }
  });
  return response;
};

/**
 * Entrenar Modelo ML - Inicia entrenamiento del modelo
 * @returns {Promise} - Respuesta con resultado del entrenamiento
 */
export const trainMLModel = async () => {
  const response = await apiClient.post('/orders/ml/train/');
  return response;
};

/**
 * Top Productos - Obtiene ranking de productos con mejores predicciones
 * @param {Object} params - { days, limit, category }
 * @returns {Promise} - Respuesta con ranking de productos
 */
export const getTopProducts = async (params = {}) => {
  const response = await apiClient.get('/sales/predictions/top-products/', {
    params
  });
  return response;
};

/**
 * Alertas de Stock - Obtiene alertas inteligentes de productos
 * @param {Object} params - { days, alert_level }
 * @returns {Promise} - Respuesta con alertas de stock
 */
export const getStockAlerts = async (params = {}) => {
  const response = await apiClient.get('/sales/predictions/stock-alerts/', {
    params
  });
  return response;
};

/**
 * Predicción de Producto Individual
 * @param {number} productId - ID del producto
 * @param {Object} params - { days, include_confidence }
 * @returns {Promise} - Respuesta con predicción del producto
 */
export const getProductPrediction = async (productId, params = {}) => {
  const response = await apiClient.get(`/sales/predictions/product/${productId}/`, {
    params
  });
  return response;
};

/**
 * Predicción por Categoría
 * @param {number} categoryId - ID de la categoría
 * @param {Object} params - { days }
 * @returns {Promise} - Respuesta con predicción de la categoría
 */
export const getCategoryPrediction = async (categoryId, params = {}) => {
  const response = await apiClient.get(`/sales/predictions/category/${categoryId}/`, {
    params
  });
  return response;
};

/**
 * Comparar Productos - Compara predicciones de múltiples productos
 * @param {Array} productIds - Array de IDs de productos
 * @param {number} days - Días a predecir
 * @returns {Promise} - Respuesta con comparación
 */
export const compareProducts = async (productIds, days = 30) => {
  const response = await apiClient.post('/sales/predictions/compare/', {
    product_ids: productIds,
    days
  });
  return response;
};

// =================== Voice Commands APIs ===================

/**
 * Procesar comando de texto - Procesa consulta de texto con IA
 * @param {string} text - Texto del comando/consulta
 * @returns {Promise} - Respuesta con resultado del procesamiento
 */
export const processTextCommand = async (text) => {
  const response = await apiClient.post('/voice-commands/process-text/', { text });
  return response;
};

/**
 * Procesar comando de audio - Procesa archivo de audio con IA
 * @param {File} audioFile - Archivo de audio a procesar
 * @returns {Promise} - Respuesta con transcripción y resultado
 */
export const processAudioCommand = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  const response = await apiClient.post('/voice-commands/process-audio/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

// --- Funciones de Predicciones ML (Dashboard) ---

/**
 * Obtener dashboard combinado de predicciones (ventas + productos)
 * @param {number} productsLimit - Número de productos a mostrar por período (default: 5)
 * @param {boolean} includeHistorical - Incluir datos históricos (default: false)
 * @returns {Promise} - Respuesta con predicciones combinadas
 */
export const getCombinedPredictionsDashboard = (productsLimit = 5, includeHistorical = false) => {
  return apiClient.get('/orders/dashboard/predictions/combined/', {
    params: {
      products_limit: productsLimit,
      include_historical: includeHistorical
    }
  });
};

/**
 * Obtener predicciones de ventas totales por período
 * @param {boolean} includeHistorical - Incluir datos históricos (default: true)
 * @param {boolean} chartFormat - Formato optimizado para gráficas (default: true)
 * @returns {Promise} - Respuesta con predicciones de ventas
 */
export const getSalesPredictionsDashboard = (includeHistorical = true, chartFormat = true) => {
  return apiClient.get('/orders/dashboard/predictions/sales/', {
    params: {
      include_historical: includeHistorical,
      chart_format: chartFormat
    }
  });
};

/**
 * Obtener top productos más vendidos predichos (Dashboard)
 * @param {number} limit - Número de productos por período (default: 10, max: 20)
 * @param {number} categoryId - ID de categoría para filtrar (opcional)
 * @param {boolean} chartFormat - Formato optimizado para gráficas (default: true)
 * @returns {Promise} - Respuesta con ranking de productos predichos
 */
export const getTopProductsDashboard = (limit = 10, categoryId = null, chartFormat = true) => {
  const params = {
    limit,
    chart_format: chartFormat
  };
  
  if (categoryId) {
    params.category = categoryId;
  }
  
  return apiClient.get('/orders/dashboard/predictions/top-products/', { params });
};

/**
 * Limpiar caché de predicciones (Solo Admin)
 * @returns {Promise} - Respuesta de confirmación
 */
export const clearPredictionsCache = () => {
  return apiClient.post('/orders/predictions/clear-cache/');
};

/**
 * Obtener estado del modelo ML (Solo Admin)
 * @returns {Promise} - Respuesta con estado del modelo
 */
export const getMLModelStatus = () => {
  return apiClient.get('/orders/ml/dashboard/');
};

// --- Funciones de Auditoría/Bitácora (Solo Admin) ---

/**
 * Obtener logs de auditoría con filtros
 * @param {Object} filters - Filtros opcionales (user, action_type, start_date, end_date, severity, success, ip_address, limit)
 * @returns {Promise} - Lista de logs
 */
export const getAuditLogs = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.user) params.append('user', filters.user);
  if (filters.action_type) params.append('action_type', filters.action_type);
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.severity) params.append('severity', filters.severity);
  if (filters.success !== undefined) params.append('success', filters.success);
  if (filters.ip_address) params.append('ip_address', filters.ip_address);
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', filters.limit);
  
  return apiClient.get(`/sales/audit/logs/?${params.toString()}`);
};

/**
 * Obtener detalle de un log específico
 * @param {number} id - ID del log
 * @returns {Promise} - Detalle del log
 */
export const getAuditLogDetail = (id) => {
  return apiClient.get(`/sales/audit/logs/${id}/`);
};

/**
 * Obtener estadísticas de auditoría
 * @param {number} days - Días hacia atrás para analizar (default: 7)
 * @returns {Promise} - Estadísticas
 */
export const getAuditStatistics = (days = 7) => {
  return apiClient.get(`/sales/audit/statistics/?days=${days}`);
};

/**
 * Obtener actividad de un usuario específico
 * @param {string} username - Nombre de usuario
 * @param {number} days - Días hacia atrás (default: 30)
 * @returns {Promise} - Actividad del usuario
 */
export const getUserActivity = (username, days = 30) => {
  return apiClient.get(`/sales/audit/user-activity/${username}/?days=${days}`);
};

/**
 * Obtener sesiones activas
 * @returns {Promise} - Lista de sesiones activas
 */
export const getActiveSessions = () => {
  return apiClient.get('/sales/audit/sessions/active/');
};

/**
 * Obtener historial de sesiones
 * @param {Object} filters - Filtros opcionales (user, limit)
 * @returns {Promise} - Historial de sesiones
 */
export const getSessionHistory = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.user) params.append('user', filters.user);
  if (filters.limit) params.append('limit', filters.limit);
  
  return apiClient.get(`/sales/audit/sessions/history/?${params.toString()}`);
};

/**
 * Obtener alertas de seguridad
 * @returns {Promise} - Alertas de seguridad
 */
export const getSecurityAlerts = () => {
  return apiClient.get('/sales/audit/security-alerts/');
};

/**
 * Generar reporte de auditoría
 * @param {Object} filters - Filtros para el reporte
 * @param {string} format - Formato del reporte (pdf, excel, json)
 * @returns {Promise} - Archivo del reporte o datos JSON
 */
export const generateAuditReport = (filters = {}, format = 'pdf') => {
  return apiClient.post('/sales/audit/generate-report/', {
    filters,
    format
  }, {
    responseType: format === 'json' ? 'json' : 'blob'
  });
};

/**
 * Generar reporte de sesiones
 * @param {Object} filters - Filtros para el reporte
 * @param {string} format - Formato del reporte (pdf, excel, json)
 * @returns {Promise} - Archivo del reporte o datos JSON
 */
export const generateSessionReport = (filters = {}, format = 'pdf') => {
  return apiClient.post('/sales/audit/generate-session-report/', {
    filters,
    format
  }, {
    responseType: format === 'json' ? 'json' : 'blob'
  });
};

/**
 * Limpiar logs antiguos
 * @param {number} days - Días de antigüedad (mínimo 30)
 * @returns {Promise} - Resultado de la limpieza
 */
export const cleanOldLogs = (days) => {
  return apiClient.post('/sales/audit/clean-old-logs/', { days });
};
