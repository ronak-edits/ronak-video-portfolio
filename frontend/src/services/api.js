import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    if (
      status === 401 &&
      !requestUrl.includes('/auth/login') &&
      !requestUrl.includes('/auth/me')
    ) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    const wrappedError = new Error(message);
    wrappedError.status = status;
    wrappedError.errors = error.response?.data?.errors || [];
    return Promise.reject(wrappedError);
  }
);

export const getHealthStatus = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
