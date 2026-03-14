import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  // Use environment variable for production, fallback to /api for local proxy
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request Interceptor: Attach authentication token to every outgoing request
api.interceptors.request.use(
  (config) => {
    // You can adjust where you store your token (localStorage, sessionStorage, Zustand, Redux)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Broadly catch and handle errors across the whole application
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        console.warn('Unauthorized request. Token might be invalid or expired.');
        // Optionally auto-redirect to login
        // localStorage.removeItem('token');
        // window.location.href = '/login';
      } else if (error.response.status === 403) {
        console.warn('Forbidden access.');
      } else if (error.response.status === 500) {
        console.error('Server error reported by backend.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the backend. Is it running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
