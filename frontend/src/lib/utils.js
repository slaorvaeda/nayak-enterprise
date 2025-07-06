import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Generic API call function
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  // Products API
  products: {
    async getAll(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return api.request(`/products?${queryString}`);
    },

    async getFeatured(limit = 8) {
      return api.request(`/products/featured?limit=${limit}`);
    },

    async getBestSellers(limit = 8) {
      return api.request(`/products/bestsellers?limit=${limit}`);
    },

    async getById(id) {
      return api.request(`/products/${id}`);
    },

    async getCategories() {
      return api.request('/products/categories');
    },

    async search(query, limit = 10) {
      return api.request(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    },
  },

  // Cart API
  cart: {
    async get() {
      return api.request('/cart', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async addItem(productId, quantity = 1) {
      return api.request('/cart/add', {
        method: 'POST',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify({ productId, quantity }),
      });
    },

    async updateQuantity(productId, quantity) {
      return api.request(`/cart/update/${productId}`, {
        method: 'PUT',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify({ quantity }),
      });
    },

    async removeItem(productId) {
      return api.request(`/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { ...api.getAuthHeaders() },
      });
    },

    async clear() {
      return api.request('/cart/clear', {
        method: 'DELETE',
        headers: { ...api.getAuthHeaders() },
      });
    },

    async getSummary() {
      return api.request('/cart/summary', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async applyPromoCode(code) {
      return api.request('/cart/promo', {
        method: 'POST',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify({ promoCode: code }),
      });
    },
  },

  // Orders API
  orders: {
    async create(orderData) {
      return api.request('/orders', {
        method: 'POST',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify(orderData),
      });
    },

    async getAll(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return api.request(`/orders?${queryString}`, { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async getById(id) {
      return api.request(`/orders/${id}`, { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async cancel(id) {
      return api.request(`/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { ...api.getAuthHeaders() },
      });
    },

    async getTracking(id) {
      return api.request(`/orders/${id}/tracking`, { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async getStats() {
      return api.request('/orders/stats', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },
  },

  // Users API
  users: {
    async getProfile() {
      return api.request('/users/profile', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async updateProfile(profileData) {
      return api.request('/users/profile', {
        method: 'PUT',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify(profileData),
      });
    },

    async getDashboard() {
      return api.request('/users/dashboard', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async uploadVerification(documentType, documentUrl) {
      return api.request('/users/verification', {
        method: 'POST',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify({ documentType, documentUrl }),
      });
    },

    async getVerificationStatus() {
      return api.request('/users/verification', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },
  },

  // Admin API
  admin: {
    async getDashboard() {
      return api.request('/admin/dashboard', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async getAnalytics(period = 30) {
      return api.request(`/admin/analytics?period=${period}`, { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async getOrders(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return api.request(`/admin/orders?${queryString}`, { 
        headers: { ...api.getAuthHeaders() } 
      });
    },

    async updateOrderStatus(orderId, statusData) {
      return api.request(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { ...api.getAuthHeaders() },
        body: JSON.stringify(statusData),
      });
    },

    async getStats() {
      return api.request('/admin/stats', { 
        headers: { ...api.getAuthHeaders() } 
      });
    },
  },

  // Get auth headers from auth store
  getAuthHeaders() {
    // This will be set by the auth store
    return {};
  },
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString('en-IN', defaultOptions);
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number (Indian format)
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

// Validate PIN code
export const validatePincode = (pincode) => {
  const re = /^[0-9]{6}$/;
  return re.test(pincode);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate order number
export const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}-${random}`;
};
