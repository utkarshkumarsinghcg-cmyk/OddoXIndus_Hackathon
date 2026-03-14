import api from './api';

/**
 * Example Service specific to Authentication functionality.
 * As you build your backend, you can create new files for each domain, like:
 * - productService.js for `api.get('/products')`
 * - inventoryService.js for `api.post('/inventory')`
 */

export const loginUser = async (credentials) => {
  // Posts `credentials` to `/api/auth/login` on your backend
  const response = await api.post('/auth/login', credentials);
  
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  // Add any logic to invalidate token on the backend if sessions are used
};

// Check if user is logged in
export const fetchCurrentUser = async () => {
  // Get `/api/users/me` (auth handled by interceptor)
  const response = await api.get('/users/me');
  return response.data;
};
