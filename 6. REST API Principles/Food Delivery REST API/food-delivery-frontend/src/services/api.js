import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Restaurant APIs
export const getRestaurants = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/restaurants${params ? `?${params}` : ''}`);
};

export const getRestaurantById = (id) => {
  return api.get(`/restaurants/${id}`);
};

export const getRestaurantMenu = (restaurantId) => {
  return api.get(`/restaurants/${restaurantId}/menu`);
};

// Order APIs
export const placeOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const getUserOrders = (userId) => {
  return api.get(`/orders/user/${userId}`);
};

export const updateOrderStatus = (orderId, status) => {
  return api.put(`/orders/${orderId}`, { status });
};

export const cancelOrder = (orderId) => {
  return api.delete(`/orders/${orderId}`);
};

// User APIs
export const getUsers = () => {
  return api.get('/users');
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

export const registerUser = (userData) => {
  return api.post('/users/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/users/login', credentials);
};

export const updateUserProfile = (userId, userData) => {
  return api.put(`/users/${userId}`, userData);
};

export const getUserOrdersHistory = (userId) => {
  return api.get(`/users/${userId}/orders`);
};

// ✅ Add these file upload functions
export const uploadProfilePhoto = (userId, file) => {
  const formData = new FormData();
  formData.append('photo', file);
  
  return axios.post(`${API_BASE_URL}/users/${userId}/upload-photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ✅ Delete profile photo
export const deleteProfilePhoto = (userId) => {
  return api.delete(`/users/${userId}/photo`);
};

// Delivery APIs
export const trackDelivery = (orderId) => {
  return api.get(`/deliveries/order/${orderId}`);
};

export default api;