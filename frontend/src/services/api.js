import axios from 'axios';
import { handleMockRequest } from './mockService';

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const hasConfiguredBackend = Boolean(import.meta.env.VITE_API_URL);

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: async (config) => {
    // If deployed on Vercel/cloud without a dedicated remote API URL, use the persistent mock store directly
    if (!isLocalhost && !hasConfiguredBackend) {
      return handleMockRequest(config);
    }

    // Otherwise attempt real backend request
    try {
      const defaultAdapter = axios.defaults.adapter;
      // In Axios v1.x, defaultAdapter might be an array or function
      const adapterFn = Array.isArray(defaultAdapter) ? defaultAdapter[0] : defaultAdapter;
      return await adapterFn(config);
    } catch (err) {
      // If backend is offline or returned 404/405 (e.g. static host without proxy), fallback gracefully to mock store
      const status = err.response?.status;
      if (!err.response || status === 404 || status === 405 || status === 502 || status === 503 || status === 504) {
        console.warn(`[API Notice] Backend unavailable (${status || 'Network Error'}). Falling back to demo data store.`);
        return handleMockRequest(config);
      }
      throw err;
    }
  },
});

// Interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swiftship_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/track')) {
        localStorage.removeItem('swiftship_token');
        localStorage.removeItem('swiftship_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
