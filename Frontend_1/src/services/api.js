import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach authentication token to every outgoing request
api.interceptors.request.use(
  (config) => {
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
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('Unauthorized request. Token might be invalid or expired.');
      } else if (error.response.status === 403) {
        console.warn('Forbidden access.');
      } else if (error.response.status === 500) {
        console.error('Server error reported by backend.');
      }
    } else if (error.request) {
      console.error('No response received from the backend. Is it running?');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════
export const fetchProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const fetchProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const searchProductBySku = async (sku) => {
  const res = await api.get(`/products/search?sku=${sku}`);
  return res.data;
};

export const fetchProductsByCategory = async (categoryId) => {
  const res = await api.get(`/products/category/${categoryId}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════
export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const createCategory = async (data) => {
  const res = await api.post('/categories', data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  WAREHOUSES
// ═══════════════════════════════════════════════════════════════════════════
export const fetchWarehouses = async () => {
  const res = await api.get('/warehouses');
  return res.data;
};

export const createWarehouse = async (data) => {
  const res = await api.post('/warehouses', data);
  return res.data;
};

export const updateWarehouse = async (id, data) => {
  const res = await api.put(`/warehouses/${id}`, data);
  return res.data;
};

export const deleteWarehouse = async (id) => {
  const res = await api.delete(`/warehouses/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  RECEIPTS
// ═══════════════════════════════════════════════════════════════════════════
export const fetchReceipts = async () => {
  const res = await api.get('/receipts');
  return res.data;
};

export const createReceipt = async (data) => {
  const res = await api.post('/receipts', data);
  return res.data;
};

export const validateReceipt = async (id) => {
  const res = await api.post(`/receipts/${id}/validate`);
  return res.data;
};

export const deleteReceipt = async (id) => {
  const res = await api.delete(`/receipts/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  DELIVERIES
// ═══════════════════════════════════════════════════════════════════════════
export const fetchDeliveries = async () => {
  const res = await api.get('/deliveries');
  return res.data;
};

export const createDelivery = async (data) => {
  const res = await api.post('/deliveries', data);
  return res.data;
};

export const validateDelivery = async (id) => {
  const res = await api.post(`/deliveries/${id}/validate`);
  return res.data;
};

export const deleteDelivery = async (id) => {
  const res = await api.delete(`/deliveries/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  TRANSFERS
// ═══════════════════════════════════════════════════════════════════════════
export const fetchTransfers = async () => {
  const res = await api.get('/transfers');
  return res.data;
};

export const createTransfer = async (data) => {
  const res = await api.post('/transfers', data);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  ADJUSTMENTS
// ═══════════════════════════════════════════════════════════════════════════
export const fetchAdjustments = async () => {
  const res = await api.get('/adjustments');
  return res.data;
};

export const createAdjustment = async (data) => {
  const res = await api.post('/adjustments', data);
  return res.data;
};

export const deleteAdjustment = async (id) => {
  const res = await api.delete(`/adjustments/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  INVENTORY STOCK
// ═══════════════════════════════════════════════════════════════════════════
export const fetchInventory = async () => {
  const res = await api.get('/inventory');
  return res.data;
};

export const fetchInventoryByProduct = async (productId) => {
  const res = await api.get(`/inventory/product/${productId}`);
  return res.data;
};

export const fetchInventoryByLocation = async (locationId) => {
  const res = await api.get(`/inventory/location/${locationId}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  MOVES / LEDGER
// ═══════════════════════════════════════════════════════════════════════════
export const fetchMoves = async () => {
  const res = await api.get('/moves');
  return res.data;
};

export const fetchMovesByProduct = async (productId) => {
  const res = await api.get(`/moves/product/${productId}`);
  return res.data;
};

export const fetchMovesByLocation = async (locationId) => {
  const res = await api.get(`/moves/location/${locationId}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  REORDER RULES
// ═══════════════════════════════════════════════════════════════════════════
export const fetchReorderRules = async () => {
  const res = await api.get('/reorder-rules');
  return res.data;
};

export const createReorderRule = async (data) => {
  const res = await api.post('/reorder-rules', data);
  return res.data;
};

export const updateReorderRule = async (id, data) => {
  const res = await api.put(`/reorder-rules/${id}`, data);
  return res.data;
};

export const deleteReorderRule = async (id) => {
  const res = await api.delete(`/reorder-rules/${id}`);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════════════════════
export const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const fetchUserProfile = async () => {
  const res = await api.get('/users/profile');
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await api.put('/users/profile', data);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post('/users', data);
  return res.data;
};

// ═══════════════════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export const fetchDashboardStats = async () => {
  const [products, receipts, deliveries, transfers, warehouses] = await Promise.all([
    fetchProducts().catch(() => []),
    fetchReceipts().catch(() => []),
    fetchDeliveries().catch(() => []),
    fetchTransfers().catch(() => []),
    fetchWarehouses().catch(() => [])
  ]);

  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const lowStockItems = products.filter(p => (Number(p.stock) || 0) < 50 && (Number(p.stock) || 0) > 0).length;
  const outOfStock = products.filter(p => (Number(p.stock) || 0) === 0).length;
  const pendingReceipts = receipts.filter(r => r.status !== 'VALIDATED').length;
  const pendingDeliveries = deliveries.filter(d => d.status !== 'VALIDATED').length;

  return {
    totalProducts: products.length,
    totalStock,
    lowStockItems,
    outOfStock,
    pendingReceipts,
    pendingDeliveries,
    transferCount: transfers.length,
    products,
    receipts,
    deliveries,
    transfers,
    warehouses
  };
};

export default api;
