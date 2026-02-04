import { apiClient } from '@/lib/apiClient';
import { UserAddress } from '@/types';

interface CreateAddressData {
  user_id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class AddressService {
  async getAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<ApiResponse<UserAddress[]>>(`/addresses/user/${userId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch addresses');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch addresses');
    }
  }

  async getAddressById(id: string): Promise<UserAddress | null> {
    try {
      const response = await apiClient.get<ApiResponse<UserAddress>>(`/addresses/${id}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else if (response.data.status === 'error' && response.data.message === 'Address not found') {
        return null;
      } else {
        throw new Error(response.data.message || 'Failed to fetch address');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch address');
    }
  }

  async addAddress(address: Omit<UserAddress, 'id' | 'created_at'>): Promise<UserAddress> {
    try {
      const response = await apiClient.post<ApiResponse<UserAddress>>('/addresses', address);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add address');
    }
  }

  async updateAddress(id: string, updates: Partial<UserAddress>): Promise<UserAddress> {
    try {
      const response = await apiClient.put<ApiResponse<UserAddress>>(`/addresses/${id}`, updates);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update address');
    }
  }

  async deleteAddress(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/addresses/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete address');
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/addresses/${addressId}/default`, { userId });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to set default address');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to set default address');
    }
  }

  async getFavoriteAddresses(userId: string, limit: number = 5): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<ApiResponse<UserAddress[]>>(`/addresses/user/${userId}/favorites?limit=${limit}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch favorite addresses');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch favorite addresses');
    }
  }
}

export const addressService = new AddressService();