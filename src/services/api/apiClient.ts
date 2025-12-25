// src/services/api/apiClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { requestDeduplicator } from '@/lib/requestDeduplicator';
import { BASE_URL } from '@/config/config';

// Configuration from environment variables or defaults
const API_CONFIG = {
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'), // 30 seconds
  maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
  retryDelay: 1000, // 1 second base delay
  maxConcurrentRequests: parseInt(process.env.NEXT_PUBLIC_MAX_CONCURRENT_REQUESTS || '5'),
  requestDelay: parseInt(process.env.NEXT_PUBLIC_REQUEST_DELAY_MS || '200'), // 200ms between requests
};

// Request queue for rate limiting
class RequestQueue {
  private queue: Array<() => void> = [];
  private activeRequests = 0;
  private lastRequestTime = 0;

  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    // Wait if we've hit the concurrent request limit
    while (this.activeRequests >= API_CONFIG.maxConcurrentRequests) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Enforce delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < API_CONFIG.requestDelay) {
      await new Promise(resolve =>
        setTimeout(resolve, API_CONFIG.requestDelay - timeSinceLastRequest)
      );
    }

    this.activeRequests++;
    this.lastRequestTime = Date.now();

    try {
      return await requestFn();
    } finally {
      this.activeRequests--;
    }
  }

  getStats() {
    return {
      activeRequests: this.activeRequests,
      queueLength: this.queue.length,
    };
  }
}

const requestQueue = new RequestQueue();

// Create an API client with enhanced error handling and timeout settings
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    // Don't set Content-Type here - let axios auto-detect based on data type
    // For FormData, axios will automatically set: multipart/form-data; boundary=...
    // For JSON, axios will set: application/json
  },
});

// Determine if we're running on the server (in the container) or client (in browser)
const isServer = typeof window === 'undefined';

// Retry logic with exponential backoff
async function retryRequest<T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retries = API_CONFIG.maxRetries,
  delay = API_CONFIG.retryDelay
): Promise<AxiosResponse<T>> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    const axiosError = error as AxiosError;

    // Retry on specific error codes
    const shouldRetry =
      !axiosError.response || // Network error
      axiosError.code === 'ECONNABORTED' || // Timeout
      axiosError.response.status === 429 || // Too many requests
      axiosError.response.status >= 500; // Server error

    if (!shouldRetry) {
      throw error;
    }

    // Log retry attempt
    console.log(`[API Client] Retrying request (${API_CONFIG.maxRetries - retries + 1}/${API_CONFIG.maxRetries}) after ${delay}ms`);

    // Wait before retrying (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, delay));

    // Retry with increased delay
    return retryRequest(requestFn, retries - 1, delay * 2);
  }
}

// Intercept requests to use the external URL consistently and add to queue
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // NOTE: URL replacement disabled for development
      // This was redirecting all localhost requests to production server
      // Uncomment for production deployment if needed

      // if (config.url && config.url.includes('localhost:8080')) {
      //   config.url = config.url.replace('http://localhost:8080/api/v1', 'https://compsci.president.ac.id/api/v1');
      // }

      // Add request metadata for deduplication
      const deduplicationKey = requestDeduplicator.generateKey(
        config.url || '',
        {
          method: config.method,
          body: config.data ? JSON.stringify(config.data) : undefined,
        }
      );
      (config as any).__deduplicationKey = deduplicationKey;

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
  (error: AxiosError) => {
    // Handle network errors or timeouts gracefully
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('[API Client] Network error or timeout:', error.message);
    } else if (error.response) {
      const status = error.response.status;

      if (status === 429) {
        console.error('[API Client] Rate limit exceeded (429). Request will be retried.');
      } else if (status >= 500) {
        console.error('[API Client] Server error:', status, error.response.data);
      } else if (status >= 400) {
        console.error('[API Client] Client error:', status, error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Enhanced request methods with queue and retry logic
const enhancedApiClient = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const deduplicationKey = requestDeduplicator.generateKey(url, { method: 'GET' });

    return requestDeduplicator.deduplicate(deduplicationKey, () =>
      requestQueue.enqueue(() =>
        retryRequest(() => apiClient.get<T>(url, config))
      )
    );
  },

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return requestQueue.enqueue(() =>
      retryRequest(() => apiClient.post<T>(url, data, config))
    );
  },

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return requestQueue.enqueue(() =>
      retryRequest(() => apiClient.put<T>(url, data, config))
    );
  },

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return requestQueue.enqueue(() =>
      retryRequest(() => apiClient.patch<T>(url, data, config))
    );
  },

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return requestQueue.enqueue(() =>
      retryRequest(() => apiClient.delete<T>(url, config))
    );
  },

  // Expose queue stats for monitoring
  getQueueStats: () => requestQueue.getStats(),
};

export default enhancedApiClient;
export { API_CONFIG };