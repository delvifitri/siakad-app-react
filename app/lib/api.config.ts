import axios from 'axios';
import { storage } from '../utils/storage';

// Get API base URL from environment variable
// In development, use relative URL to leverage Vite proxy
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://api-siakad.test');

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear auth data
        // Let individual components handle the redirect
        storage.clearAuth(); // Use storage utility instead of direct localStorage
      }

      // Return error message from API if available
      return Promise.reject({
        message: data?.message || 'Terjadi kesalahan pada server',
        status,
        data,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'Terjadi kesalahan yang tidak diketahui',
        status: 0,
      });
    }
  }
);

export default apiClient;
