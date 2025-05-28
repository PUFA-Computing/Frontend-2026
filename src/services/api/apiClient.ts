// src/services/api/apiClient.ts
import axios from 'axios';

// Create an API client that tries the internal URL first, then falls back to the public URL
const apiClient = axios.create();

// Determine if we're running on the server (in the container) or client (in browser)
const isServer = typeof window === 'undefined';

// Intercept requests to use internal URL when in container
apiClient.interceptors.request.use(async (config) => {
  // If we're in a server environment (inside the container)
  if (isServer && config.url) {
    // Replace the domain with direct container access
    config.url = config.url.replace('https://compsci.president.ac.id/api/v1', 'http://localhost:8080/api/v1');
    console.log(`Using internal API URL: ${config.url}`);
  }
  
  return config;
});

export default apiClient;
