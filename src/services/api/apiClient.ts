// src/services/api/apiClient.ts
import axios from 'axios';

// Create an API client with better error handling and timeout settings
const apiClient = axios.create({
  timeout: 30000, // 30 second default timeout
});

// Determine if we're running on the server (in the container) or client (in browser)
const isServer = typeof window === 'undefined';
// 
// Get the API URL based on environment
const getApiUrl = (url: string): string => {
  // For development (localhost)
  if (process.env.NODE_ENV === 'development' || process.env.ENV === 'local') {
    return url; // Use URL as-is (from NEXT_PUBLIC_API_URL)
  }
  
  // For production in Docker container (server-side)
  if (isServer && url.includes('compsci.president.ac.id')) {
    return url.replace('https://compsci.president.ac.id/api/v1', 'http://backend:8080/api/v1');
  }
  
  return url;
};

// Intercept requests to use correct URL
apiClient.interceptors.request.use(
  async (config) => {
    if (config.url) {
      config.url = getApiUrl(config.url);
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
    } else if (error.code === 'ENOTFOUND') {
      console.error('Backend not found. Make sure backend is running on:', error.config.url);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
