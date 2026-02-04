import { apiClient } from '@/lib/apiClient';
import { AuthUser, UserAddress } from '@/types';

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

interface UserData {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

class UserService {
  async getProfile(): Promise<AuthUser> {
    try {
      const response = await apiClient.get<ApiResponse<UserData>>('/users/profile');
      
      if (response.data.status === 'success' && response.data.data) {
        return {
          id: response.data.data.id.toString(),
          email: response.data.data.email,
          username: response.data.data.username,
          role: response.data.data.role,
          avatar: response.data.data.avatar_url,
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user profile');
    }
  }

  async updateProfile(userData: Partial<{ username: string; avatar_url: string }>): Promise<AuthUser> {
    try {
      const response = await apiClient.put<ApiResponse<UserData>>('/users/profile', userData);
      
      if (response.data.status === 'success' && response.data.data) {
        return {
          id: response.data.data.id.toString(),
          email: response.data.data.email,
          username: response.data.data.username,
          role: response.data.data.role,
          avatar: response.data.data.avatar_url,
        };
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  }

  async getAddresses(): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<ApiResponse<UserAddress[]>>('/users/addresses');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch addresses');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch addresses');
    }
  }

  async addAddress(address: Omit<UserAddress, 'id' | 'created_at'>): Promise<UserAddress> {
    try {
      const response = await apiClient.post<ApiResponse<UserAddress>>('/users/addresses', address);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add address');
    }
  }

  async updateAddress(id: string, updates: Partial<UserAddress>): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/users/addresses/${id}`, updates);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to update address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update address');
    }
  }

  async deleteAddress(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/users/addresses/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete address');
    }
  }

  async setDefaultAddress(id: string): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/users/addresses/${id}/default`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to set default address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to set default address');
    }
  }
}

export const userService = new UserService();