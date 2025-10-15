import axios from 'axios';

// Creamos una instancia de Axios con la URL base de tu API
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // La URL de tu backend Django
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para registrar un nuevo usuario
export const registerUser = (userData) => {
  return apiClient.post('/register/', userData);
};

// Función para iniciar sesión
export const loginUser = (credentials) => {
  return apiClient.post('/login/', credentials);
};

export const getUserProfile = () => {
  const token = localStorage.getItem('authToken');
  return apiClient.get('/profile/', {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export default apiClient;