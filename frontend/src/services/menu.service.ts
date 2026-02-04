import { apiClient } from '@/lib/apiClient';
import { MenuItem } from '@/types';

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class MenuService {
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu/restaurant/${restaurantId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch menu items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch menu items');
    }
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem>>(`/menu/item/${id}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else if (response.data.status === 'error' && response.data.message === 'Menu item not found') {
        return null;
      } else {
        throw new Error(response.data.message || 'Failed to fetch menu item');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch menu item');
    }
  }

  async searchMenuItems(restaurantId: string, query: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu/restaurant/${restaurantId}/search?query=${encodeURIComponent(query)}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to search menu items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to search menu items');
    }
  }

  async getMenuCategories(restaurantId: string): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(`/menu/restaurant/${restaurantId}/categories`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch menu categories');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch menu categories');
    }
  }
}

export const menuService = new MenuService();