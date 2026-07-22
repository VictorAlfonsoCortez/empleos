import axios from 'axios';

// Configuración base de Axios para cuando se conecte a una API real
const baseURL = import.meta.env.VITE_API_URL || 'https://api.example.com/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token de autenticación si existe en el futuro
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de errores
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Error al comunicarse con el servidor',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

// Flag para alternar entre API Real y Mock Data
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Helper para simular latencia de red en llamadas mock
export const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
