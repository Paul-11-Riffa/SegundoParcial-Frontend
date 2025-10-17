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
  
  return apiClient.post('/shop/products/', productData);
};

export const updateProduct = (productId, productData) => {
  return apiClient.put(`/shop/products/${productId}/`, productData);
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

export const removeCartItem = (itemId) => {
  return apiClient.delete(`/orders/cart/items/${itemId}/`);
};

export const initiateCheckout = () => {
  return apiClient.post('/orders/checkout/');
};