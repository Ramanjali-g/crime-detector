import axios from 'axios';

const TOKEN_KEY = 'cd_token';

// Use Render in production and localhost during local development.
export const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:8080'
    : 'https://crime-detector-2.onrender.com')
).replace(/\/+$/, '');

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
});

// Attach the JWT token to requests.
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle authentication errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && !isAuthCall) {
      clearToken();
      window.dispatchEvent(new Event('cd:unauthorized'));
    }

    return Promise.reject(error);
  }
);

// Convert API errors into readable messages.
export function getErrorMessage(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.';
    }

    return 'Cannot reach the server. Check the backend URL, network connection, and CORS settings.';
  }

  const { status, data } = error.response;

  if (data?.errors && Object.keys(data.errors).length) {
    return Object.values(data.errors).join(' ');
  }

  if (data?.message) {
    return data.message;
  }

  if (status === 401) {
    return 'Your session has expired. Please log in again.';
  }

  if (status === 403) {
    return 'You do not have permission to do that.';
  }

  if (status === 404) {
    return 'We could not find that.';
  }

  if (status >= 500) {
    return 'Something went wrong on the server. Please try again.';
  }

  return 'Something went wrong. Please try again.';
}

// Authentication APIs.
export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
};

// User APIs.
export const usersApi = {
  me: () => api.get('/users/me'),
  update: (payload) => api.put('/users/me', payload),
};

// Crime report APIs.
export const reportsApi = {
  list: () => api.get('/reports'),
  get: (id) => api.get(`/reports/${id}`),

  create: (data, image) => {
    const form = new FormData();

    form.append(
      'data',
      new Blob([JSON.stringify(data)], {
        type: 'application/json',
      })
    );

    if (image) {
      form.append('image', image);
    }

    return api.post('/reports', form);
  },

  update: (id, payload) => api.put(`/reports/${id}`, payload),
  remove: (id) => api.delete(`/reports/${id}`),
};

// Emergency contact APIs.
export const contactsApi = {
  list: () => api.get('/contacts'),
  create: (payload) => api.post('/contacts', payload),
  update: (id, payload) => api.put(`/contacts/${id}`, payload),
  remove: (id) => api.delete(`/contacts/${id}`),
};

// AI crime-category suggestion API.
export const aiApi = {
  suggestCategory: (description) =>
    api.post('/ai/suggest-category', { description }),
};

export default api;