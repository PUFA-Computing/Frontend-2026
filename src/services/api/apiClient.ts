// src/services/api/apiClient.ts
import axios from 'axios';

// Create an API client with better error handling and timeout settings
const apiClient = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Determine if we're running on the server (in the container) or client (in browser)
const isServer = typeof window === 'undefined';

// Intercept requests to use the external URL consistently
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Always use the external URL - the backend is accessible via the domain
      // from both inside and outside the container
      if (config.url && config.url.includes('localhost:8080')) {
        // If somehow localhost:8080 is used, replace it with the external URL
        config.url = config.url.replace('http://localhost:8080/api/v1', 'https://compsci.president.ac.id/api/v1');
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors or timeouts gracefully
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error or timeout:', error.message);
    } else if (error.response) {
      console.error('API error response:', error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;