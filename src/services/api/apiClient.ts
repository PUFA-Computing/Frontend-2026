// src/services/api/apiClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '@/config/config';

// Configuration from environment variables or defaults
const API_CONFIG = {
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'), // 30 seconds
  maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
  retryDelay: 1000, // 1 second base delay
};

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

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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

// Enhanced request methods with retry logic (no throttling for SSR performance)
const enhancedApiClient = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return retryRequest(() => apiClient.get<T>(url, config));
  },

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return retryRequest(() => apiClient.post<T>(url, data, config));
  },

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return retryRequest(() => apiClient.put<T>(url, data, config));
  },

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return retryRequest(() => apiClient.patch<T>(url, data, config));
  },

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return retryRequest(() => apiClient.delete<T>(url, config));
  },
};

export default enhancedApiClient;
export { API_CONFIG };