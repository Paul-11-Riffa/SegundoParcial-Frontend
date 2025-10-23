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
export const getProducts = () => {
  return apiClient.get('/shop/products/');
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
  // filters puede ser un objeto como { start_date: 'YYYY-MM-DD', end_date: 'YYYY-MM-DD' }
  return apiClient.get('/orders/sales-history/', { params: filters });
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

// --- Función para descargar comprobante de una orden del cliente ---
export const downloadMyOrderReceipt = (orderId) => {
  return apiClient.get(`/orders/my-orders/${orderId}/receipt/`, {
    responseType: 'blob', // Importante para recibir el PDF como archivo binario
  });
};