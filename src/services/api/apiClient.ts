// src/services/api/apiClient.ts
import axios from 'axios';

// Create an API client with better error handling and timeout settings
const apiClient = axios.create({
  timeout: 10000, // 10 second default timeout (reduced from 30s for faster failure detection)
  // Allow absolute URLs for backend communication
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
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
  (response) => {
    // Handle 404 errors gracefully
    if (response.status === 404) {
      console.warn(`Resource not found (404): ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const url = error.config?.url || 'unknown URL';

    if (error.code === 'ECONNABORTED') {
      console.error(`Request timeout: ${url}`);
      console.error('News API timeout - Please check if the backend is running');
    } else if (error.code === 'ENOTFOUND') {
      console.error(`Backend not found. Make sure backend is running on: ${url}`);
    } else if (error.response) {
      // Server responded with error status
      const { status, statusText } = error.response;
      if (status === 404) {
        console.warn(`API endpoint not found (404): ${url}`);
      } else if (status >= 500) {
        console.error(`Server error (${status} ${statusText}): ${url}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error(`No response received from: ${url}`);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
