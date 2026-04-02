import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use environment variable or default to backend port 3001
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL: apiBaseUrl,
      timeout: 15000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add a request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Log error details
        console.error('[API Error]', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url,
          method: error.config?.method,
        });
        
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
          console.warn('[API] 401 Unauthorized - Clearing auth data');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
          
          // Don't redirect if already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        // Handle network errors
        if (!error.response) {
          console.error('[API] Network error - Server may be unreachable');
          throw new Error('Unable to connect to server. Please check if the backend is running.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  // GET request
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  // POST request
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  // PUT request
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  // DELETE request
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Set token for authenticated requests
  public setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }
}

export const apiClient = new ApiClient();