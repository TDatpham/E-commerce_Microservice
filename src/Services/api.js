import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Through Gateway

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  getStats: () => api.get('/products/stats'),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  sendOtp: (email) => api.post(`/auth/send-otp?email=${email}`),
  verifyOtp: (email, code) => api.post(`/auth/verify-otp?email=${email}&code=${code}`),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  resetPassword: (email, otp, newPassword) =>
    api.post(`/auth/reset-password?email=${email}&otp=${otp}&newPassword=${encodeURIComponent(newPassword)}`),
};

export const orderApi = {
  create: (orderData) => api.post('/orders', orderData),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
};

export default api;
