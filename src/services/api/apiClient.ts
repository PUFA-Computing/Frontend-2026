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

// Intercept requests to use internal URL when in container
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // If we're in a server environment (inside the container)
      if (isServer && config.url) {
        // Replace the domain with direct container access
        config.url = config.url.replace('https://compsci.president.ac.id/api/v1', 'http://localhost:8080/api/v1');
        console.log(`Using internal API URL: ${config.url}`);
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
    // Handle network errors or timeouts
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error or timeout:', error.message);
    } else {
      console.error('API error response:', error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
