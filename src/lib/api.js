import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto Inject JWT Token if available in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tokiva_admin_token') || localStorage.getItem('tokiva_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// Safe Response Interceptor (Auto Clear Stale Session on 401 Unauthorized)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('tokiva_jwt_token');
      localStorage.removeItem('tokiva_user_profile');
      localStorage.removeItem('tokiva_toko_profile');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    const errorMsg =
      error.response?.data?.pesan ||
      error.message ||
      'Terjadi kesalahan pada koneksi server';
    return Promise.reject(new Error(errorMsg));
  }
);
