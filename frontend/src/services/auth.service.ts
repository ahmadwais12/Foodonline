import { apiClient } from '@/lib/apiClient';
import { AuthUser } from '@/types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

interface UserData {
  id: number;
  email: string;
  username: string;
  role?: string;
}

interface AuthResponseData {
  user: UserData;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login({ email, password }: LoginData): Promise<AuthUser> {
    try {
      console.log('[AuthService] Attempting login for:', email);
      const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', { email, password });
      
      if (response.data.status === 'success' && response.data.data) {
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        
        // Store user info in session storage for faster access
        const userData = {
          id: response.data.data.user.id.toString(),
          email: response.data.data.user.email,
          username: response.data.data.user.username,
          role: response.data.data.user.role || 'customer',
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        console.log('[AuthService] Login successful:', userData.username);
        return userData;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('[AuthService] Login error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async register({ email, password, username }: RegisterData): Promise<AuthUser> {
    try {
      console.log('[AuthService] Attempting registration for:', username);
      const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', { email, password, username });
      
      if (response.data.status === 'success' && response.data.data) {
        // Store tokens in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        
        const userData = {
          id: response.data.data.user.id.toString(),
          email: response.data.data.user.email,
          username: response.data.data.user.username,
          role: 'customer',
        };
        
        console.log('[AuthService] Registration successful:', userData.username);
        return userData;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      console.error('[AuthService] Registration error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
        console.log('[AuthService] Logout successful');
      }
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // Clear user data from session storage
      sessionStorage.removeItem('user');
      console.log('[AuthService] Cleared auth data');
    }
  }

  async forgotPassword({ email }: ForgotPasswordData): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/auth/forgot-password', { email });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to send password reset email');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to send password reset email');
    }
  }

  async resetPassword({ token, newPassword }: ResetPasswordData): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/auth/reset-password', { token, newPassword });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to reset password');
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/refresh-token', { refreshToken });
      
      if (response.data.status === 'success' && response.data.data) {
        // Update tokens in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      } else {
        throw new Error(response.data.message || 'Failed to refresh token');
      }
    } catch (error: any) {
      // If refresh fails, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw new Error(error.response?.data?.message || error.message || 'Failed to refresh token');
    }
  }
}

export const authService = new AuthService();