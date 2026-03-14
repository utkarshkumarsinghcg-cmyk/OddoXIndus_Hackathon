import axios from 'axios';

// Create an Axios instance pointing to the backend API
// The Vite proxy in vite.config.js forwards /api → http://localhost:5000/api
const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('Unauthorized – token may be invalid or expired.');
      } else if (error.response.status === 403) {
        console.warn('Forbidden access.');
      } else if (error.response.status === 500) {
        console.error('Server error from backend.');
      }
    } else if (error.request) {
      console.error('No response received from backend. Is it running?');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
