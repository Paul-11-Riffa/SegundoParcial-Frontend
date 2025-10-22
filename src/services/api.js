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

export const getProductDetail = (productId) => {
  // Obtiene un producto específico con todos sus detalles incluyendo el campo 'category' (ID)
  return apiClient.get(`/shop/products/${productId}/`);
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

// ✅ NUEVAS FUNCIONES PARA GESTIÓN DE IMÁGENES (según backend actualizado)

/**
 * Subir o actualizar imagen de un producto
 * @param {number} productId - ID del producto
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise} Respuesta con el producto actualizado
 */
export const uploadProductImage = (productId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return apiClient.post(`/shop/products/${productId}/upload_image/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * Eliminar imagen de un producto
 * @param {number} productId - ID del producto
 * @returns {Promise} Respuesta con el producto actualizado
 */
export const deleteProductImage = (productId) => {
  return apiClient.delete(`/shop/products/${productId}/delete_image/`);
};

/**
 * Limpiar imágenes rotas del sistema (solo admin)
 * @returns {Promise} Respuesta con cantidad de imágenes limpiadas
 */
export const cleanBrokenImages = () => {
  return apiClient.post('/shop/products/clean_broken_images/');
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
 * Sistema Unificado de Reportes Inteligentes
 * @param {string} prompt - El comando de texto para generar el reporte
 * @returns {Promise} - Respuesta con los datos del reporte o archivo descargable
 */
export const generateDynamicReport = async (prompt) => {
  // Si el prompt incluye PDF o Excel, usar responseType blob para descargar
  const lowerPrompt = prompt.toLowerCase();
  const isFileDownload = lowerPrompt.includes('pdf') || lowerPrompt.includes('excel');
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  // ✅ Endpoint correcto del Sistema Unificado de tu compañero
  const response = await apiClient.post('/sales/reports/unified/generate/', { command: prompt }, config);
  
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
 * Sistema Unificado de Reportes Inteligentes
 * @param {string} prompt - El comando de texto con "en PDF" al final
 * @returns {Promise} - Respuesta con el archivo PDF
 */
export const downloadReportPDF = (prompt) => {
  return apiClient.post('/sales/reports/unified/generate/', { command: prompt }, {
    responseType: 'blob'
  });
};

/**
 * Descarga un reporte en formato Excel
 * Sistema Unificado de Reportes Inteligentes
 * @param {string} prompt - El comando de texto con "en Excel" al final
 * @returns {Promise} - Respuesta con el archivo Excel
 */
export const downloadReportExcel = (prompt) => {
  return apiClient.post('/sales/reports/unified/generate/', { command: prompt }, {
    responseType: 'blob'
  });
};

// --- REPORTES AVANZADOS ⭐ NUEVO ---

/**
 * Análisis RFM de Clientes - Segmenta clientes en VIP, Regular, Nuevo, En Riesgo, Inactivo
 * Sistema Unificado de Reportes Inteligentes
 * @param {Object} params - { start_date, end_date, format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con datos del análisis o archivo descargable
 */
export const getCustomerAnalysis = async (params) => {
  const { format = 'json', ...otherParams } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/sales/reports/customer-analysis/', 
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
 * Sistema Unificado de Reportes Inteligentes
 * @param {Object} params - { start_date, end_date, format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con clasificación ABC
 */
export const getProductABCAnalysis = async (params) => {
  const { format = 'json', ...otherParams } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/sales/reports/product-abc/', 
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
 * Sistema Unificado de Reportes Inteligentes
 * @param {Object} params - { start_date, end_date, comparison: 'previous_month'|'previous_period', format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con comparación de períodos
 */
export const getComparativeReport = async (params) => {
  const { format = 'json', ...otherParams } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/sales/reports/comparative/', 
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
 * Sistema Unificado de Reportes Inteligentes
 * @param {Object} params - { start_date, end_date }
 * @returns {Promise} - Respuesta con datos del dashboard
 */
export const getExecutiveDashboard = (params) => {
  return apiClient.post('/sales/reports/dashboard/', params);
};

/**
 * Análisis de Inventario - Análisis inteligente del inventario
 * Sistema Unificado de Reportes Inteligentes
 * @param {Object} params - { format: 'json'|'excel'|'pdf' }
 * @returns {Promise} - Respuesta con análisis de inventario
 */
export const getInventoryAnalysis = async (params = {}) => {
  const { format = 'json' } = params;
  const isFileDownload = format === 'pdf' || format === 'excel';
  
  const config = isFileDownload ? { responseType: 'blob' } : {};
  
  const response = await apiClient.post('/sales/reports/inventory-analysis/', 
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

// ❌ ELIMINADO: processTextCommand y processAudioCommand
// Estas funciones eran específicas de AIReportsPage que ya no se usa
// ReportsPage usa generateDynamicReport() del sistema unificado

// --- Funciones de Predicciones ML (Dashboard) ---

/**
 * Obtener dashboard combinado de predicciones (ventas + productos)
 * @param {number} productsLimit - Número de productos a mostrar por período (default: 5)
 * @param {boolean} includeHistorical - Incluir datos históricos (default: false)
 * @returns {Promise} - Respuesta con predicciones combinadas
 */
export const getCombinedPredictionsDashboard = (productsLimit = 5, includeHistorical = false) => {
  return apiClient.get('/sales/dashboard/predictions/combined/', {
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
  return apiClient.get('/sales/dashboard/predictions/sales/', {
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
  
  return apiClient.get('/sales/dashboard/predictions/top-products/', { params });
};

/**
 * Limpiar caché de predicciones (Solo Admin)
 * @returns {Promise} - Respuesta de confirmación
 */
export const clearPredictionsCache = () => {
  return apiClient.post('/sales/predictions/clear-cache/');
};

/**
 * Obtener estado del modelo ML (Solo Admin)
 * @returns {Promise} - Respuesta con estado del modelo
 */
export const getMLModelStatus = () => {
  return apiClient.get('/sales/ml/dashboard/');
};

// --- Funciones de Auditoría/Bitácora (Solo Admin) ---

/**
 * Obtener logs de auditoría con filtros y paginación
 * @param {Object} filters - Filtros opcionales
 * @param {number} page - Número de página (default: 1)
 * @param {number} pageSize - Tamaño de página (default: 50, max: 500)
 * @returns {Promise} - Respuesta paginada { count, next, previous, results }
 */
export const getAuditLogs = (filters = {}, page = 1, pageSize = 50) => {
  const params = new URLSearchParams();
  
  // Paginación
  params.append('page', page);
  params.append('page_size', pageSize);
  
  // Filtros simples
  if (filters.user) params.append('user', filters.user);
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.success !== undefined && filters.success !== '') {
    params.append('success', filters.success);
  }
  if (filters.ip_address) params.append('ip_address', filters.ip_address);
  if (filters.endpoint) params.append('endpoint', filters.endpoint);
  if (filters.search) params.append('search', filters.search);
  
  // Filtros múltiples (arrays)
  if (filters.action_type) {
    if (Array.isArray(filters.action_type)) {
      filters.action_type.forEach(type => params.append('action_type', type));
    } else if (filters.action_type !== '') {
      params.append('action_type', filters.action_type);
    }
  }
  
  if (filters.severity) {
    if (Array.isArray(filters.severity)) {
      filters.severity.forEach(sev => params.append('severity', sev));
    } else if (filters.severity !== '') {
      params.append('severity', filters.severity);
    }
  }
  
  if (filters.http_method) {
    if (Array.isArray(filters.http_method)) {
      filters.http_method.forEach(method => params.append('http_method', method));
    } else if (filters.http_method !== '') {
      params.append('http_method', filters.http_method);
    }
  }
  
  // Filtros de response status
  if (filters.response_status) params.append('response_status', filters.response_status);
  if (filters.response_status_gte) params.append('response_status_gte', filters.response_status_gte);
  if (filters.response_status_lte) params.append('response_status_lte', filters.response_status_lte);
  
  // Ordenamiento
  if (filters.ordering) params.append('ordering', filters.ordering);
  
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
 * Obtener sesiones activas con filtros y paginación
 * @param {Object} filters - Filtros opcionales
 * @param {number} page - Número de página (default: 1)
 * @param {number} pageSize - Tamaño de página (default: 50)
 * @returns {Promise} - Lista de sesiones activas paginada
 */
export const getActiveSessions = (filters = {}, page = 1, pageSize = 50) => {
  const params = new URLSearchParams();
  
  // Paginación
  params.append('page', page);
  params.append('page_size', pageSize);
  
  // Filtros
  if (filters.user) params.append('user', filters.user);
  if (filters.ip_address) params.append('ip_address', filters.ip_address);
  if (filters.search) params.append('search', filters.search);
  if (filters.ordering) params.append('ordering', filters.ordering);
  
  return apiClient.get(`/sales/audit/sessions/active/?${params.toString()}`);
};

/**
 * Obtener historial de sesiones con filtros y paginación
 * @param {Object} filters - Filtros opcionales
 * @param {number} page - Número de página (default: 1)
 * @param {number} pageSize - Tamaño de página (default: 50)
 * @returns {Promise} - Historial de sesiones paginado
 */
export const getSessionHistory = (filters = {}, page = 1, pageSize = 50) => {
  const params = new URLSearchParams();
  
  // Paginación
  params.append('page', page);
  params.append('page_size', pageSize);
  
  // Filtros
  if (filters.user) params.append('user', filters.user);
  if (filters.is_active !== undefined && filters.is_active !== '') {
    params.append('is_active', filters.is_active);
  }
  if (filters.login_start) params.append('login_start', filters.login_start);
  if (filters.login_end) params.append('login_end', filters.login_end);
  if (filters.ip_address) params.append('ip_address', filters.ip_address);
  if (filters.search) params.append('search', filters.search);
  if (filters.ordering) params.append('ordering', filters.ordering);
  
  return apiClient.get(`/sales/audit/sessions/history/?${params.toString()}`);
};

/**
 * Obtener alertas de seguridad
 * @param {number} hours - Horas hacia atrás para analizar (default: 24)
 * @returns {Promise} - Alertas de seguridad
 */
export const getSecurityAlerts = (hours = 24) => {
  return apiClient.get(`/sales/audit/security-alerts/?hours=${hours}`);
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

// =================== Dashboard en Tiempo Real APIs ===================

/**
 * Dashboard Principal en Tiempo Real - Métricas actualizadas del negocio
 * @returns {Promise} - Respuesta con métricas en tiempo real
 */
export const getRealtimeDashboard = () => {
  return apiClient.get('/sales/dashboard/realtime/');
};

/**
 * Performance de Productos - Métricas de todos los productos
 * @returns {Promise} - Respuesta con performance de productos
 */
export const getProductsPerformance = () => {
  return apiClient.get('/sales/dashboard/products/');
};

/**
 * Performance de Producto Individual - Métricas de un producto específico
 * @param {number} productId - ID del producto
 * @returns {Promise} - Respuesta con performance del producto
 */
export const getProductPerformance = (productId) => {
  return apiClient.get(`/sales/dashboard/products/${productId}/`);
};

/**
 * Insights de Clientes - Métricas de todos los clientes
 * @returns {Promise} - Respuesta con insights de clientes
 */
export const getCustomersInsights = () => {
  return apiClient.get('/sales/dashboard/customers/');
};

/**
 * Insights de Cliente Individual - Métricas de un cliente específico
 * @param {number} customerId - ID del cliente
 * @returns {Promise} - Respuesta con insights del cliente
 */
export const getCustomerInsights = (customerId) => {
  return apiClient.get(`/sales/dashboard/customers/${customerId}/`);
};

// =================== Recomendaciones ML APIs ===================

/**
 * Recomendaciones Personalizadas - Productos recomendados para el usuario actual
 * Basado en historial de compras, navegación y preferencias
 * @param {number} limit - Número de recomendaciones (default: 10)
 * @returns {Promise} - Respuesta con productos recomendados
 */
export const getPersonalizedRecommendations = (limit = 10) => {
  return apiClient.get('/products/ml/recommendations/personalized/', {
    params: { limit }
  });
};

/**
 * Productos Similares - Productos relacionados basados en ML
 * @param {number} productId - ID del producto base
 * @param {number} limit - Número de productos similares (default: 6)
 * @returns {Promise} - Respuesta con productos similares
 */
export const getSimilarProducts = (productId, limit = 6) => {
  return apiClient.get(`/products/ml/recommendations/similar/${productId}/`, {
    params: { limit }
  });
};

// =================== Reportes Disponibles APIs ===================

/**
 * Lista de Reportes Disponibles - Obtiene catálogo de reportes con permisos
 * @returns {Promise} - Respuesta con lista de reportes disponibles
 */
export const getAvailableReports = () => {
  return apiClient.get('/sales/reports/unified/list/');
};
