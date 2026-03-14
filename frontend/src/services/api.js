<<<<<<< HEAD
import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  // Because we configured a proxy in vite.config.js, requests to /api will be 
  // forwarded to your backend (e.g., http://localhost:5000/api) 
  // thus avoiding CORS issues during local development.
  baseURL: '/api', 
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
=======
// Placeholder API service returning dummy data
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchProducts = async () => {
    await delay(500);
    return [
        { id: 1, name: 'Lumber - Oak', sku: 'LUM-OAK-001', category: 'Raw Materials', stock: 1500, uom: 'Board Feet', warehouse: 'Main Warehouse' },
        { id: 2, name: 'Screws - 2"', sku: 'SCR-2IN-001', category: 'Hardware', stock: 10000, uom: 'Box', warehouse: 'Local Store 1' },
        { id: 3, name: 'Paint - White', sku: 'PNT-WHT-001', category: 'Consumables', stock: 50, uom: 'Gallon', warehouse: 'Paint Facility' },
    ];
};

export const fetchReceipts = async () => {
    await delay(500);
    return [
        { id: 'REC-1001', supplier: 'Timber Co.', product: 'Lumber - Oak', quantity: 500, status: 'Done', date: '2026-03-10' },
        { id: 'REC-1002', supplier: 'Fasteners Inc.', product: 'Screws - 2"', quantity: 2000, status: 'Waiting', date: '2026-03-15' },
        { id: 'REC-1003', supplier: 'ColorMax', product: 'Paint - White', quantity: 100, status: 'Draft', date: '2026-03-16' },
    ];
};

export const fetchDeliveryOrders = async () => {
    await delay(500);
    return [
        { id: 'DO-2001', customer: 'BuildIt Corp', product: 'Lumber - Oak', quantity: 200, status: 'Done', date: '2026-03-11' },
        { id: 'DO-2002', customer: 'DIY Supplies', product: 'Screws - 2"', quantity: 500, status: 'Waiting', date: '2026-03-14' },
    ];
};

export const fetchTransfers = async () => {
    await delay(500);
    return [
        { id: 'TRF-3001', fromLocation: 'Main Warehouse', toLocation: 'Local Store 1', product: 'Screws - 2"', quantity: 1000, status: 'Done' },
        { id: 'TRF-3002', fromLocation: 'Paint Facility', toLocation: 'Main Warehouse', product: 'Paint - White', quantity: 20, status: 'Draft' },
    ];
};

export const fetchAdjustments = async () => {
    await delay(500);
    return [
        { id: 'ADJ-4001', product: 'Lumber - Oak', systemQty: 1550, actualQty: 1500, difference: -50, date: '2026-03-01' },
    ];
};
>>>>>>> d1009882834a549e4c2a650b5afe51864f428f02
