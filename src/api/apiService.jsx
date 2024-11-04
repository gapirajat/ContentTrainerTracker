// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_HOST2, // Replace with your API base URL
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle success and error messages
api.interceptors.response.use(
    (response) => {
      // Show success message for POST, PUT, DELETE requests
      if (['post', 'put', 'delete'].includes(response.config.method)) {
        showMessage('Operation successful!', 'success');
      }
      return response;
    },
    (error) => {
      // Show error message
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      showMessage(message, 'error');
      return Promise.reject(error);
    }
  );
  

// Export the Axios instance
export default api;
