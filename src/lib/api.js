import axios from 'axios';

export const TOKEN_KEY = 'nimbus_token';

// Backend URL comes from the VITE_API_URL environment variable (see .env.example).
const api = axios.create({
  baseURL:  'https://saas-backend-1.vercel.app/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Expired / invalid session: clear it and let the app redirect to /login.
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error) =>
  error.response?.data?.message ||
  (error.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : error.message) ||
  'Something went wrong';

export default api;
