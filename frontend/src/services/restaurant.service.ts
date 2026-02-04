import { apiClient } from '@/lib/apiClient';
import { Restaurant, MenuItem, Category, Review } from '@/types';

interface SearchRestaurantsParams {
  query?: string;
  category?: string;
  minRating?: number;
  sortBy?: 'rating' | 'delivery_time' | 'delivery_fee';
}

interface StatisticsData {
  totalOrders: number;
  averageRating: number;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class RestaurantService {
  async getStatistics(): Promise<StatisticsData> {
    try {
      const response = await apiClient.get<ApiResponse<StatisticsData>>('/restaurants/statistics');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch statistics');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch statistics');
    }
  }

  async getRestaurants(filters?: SearchRestaurantsParams): Promise<Restaurant[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minRating) params.append('minRating', filters.minRating.toString());
      if (filters?.query) params.append('query', filters.query);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await apiClient.get<ApiResponse<Restaurant[]>>(`/restaurants?${params.toString()}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch restaurants');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch restaurants');
    }
  }

  async getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
    try {
      const response = await apiClient.get<ApiResponse<Restaurant>>(`/restaurants/slug/${slug}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else if (response.data.status === 'error' && response.data.message === 'Restaurant not found') {
        return null;
      } else {
        throw new Error(response.data.message || 'Failed to fetch restaurant');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch restaurant');
    }
  }

  async getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu/restaurant/${restaurantId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch restaurant menu');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch restaurant menu');
    }
  }

  async getMenuItems(filters?: { 
    restaurantId?: string, 
    category?: string, 
    isVegetarian?: boolean,
    sortBy?: 'price' | 'name' | 'popularity'
  }): Promise<MenuItem[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.restaurantId) params.append('restaurantId', filters.restaurantId);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isVegetarian !== undefined) params.append('isVegetarian', filters.isVegetarian.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu?${params.toString()}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch menu items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch menu items');
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/restaurants/categories');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch categories');
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/restaurants/categories/${id}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch category');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch category');
    }
  }

  async searchRestaurants(params: SearchRestaurantsParams): Promise<Restaurant[]> {
    return this.getRestaurants(params);
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu/search?q=${encodeURIComponent(query)}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to search menu items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to search menu items');
    }
  }

  // Favorite methods
  async checkIsFavorite(userId: string, restaurantId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(`/users/favorites/check?userId=${userId}&restaurantId=${restaurantId}`);
      
      if (response.data.status === 'success' && response.data.data !== undefined) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to check favorite status');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to check favorite status');
    }
  }

  async addToFavorites(userId: string, restaurantId: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/users/favorites', { userId, restaurantId });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to add to favorites');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add to favorites');
    }
  }

  async removeFromFavorites(userId: string, restaurantId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/users/favorites?userId=${userId}&restaurantId=${restaurantId}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to remove from favorites');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to remove from favorites');
    }
  }

  // New methods for special food sections
  async getFavoriteFoods(userId: string): Promise<MenuItem[]> {
    // This would fetch items that the user has ordered frequently
    // For now, we'll return popular items
    return this.getPopularItems();
  }

  async getPopularItems(): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/popular');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch popular items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch popular items');
    }
  }

  async getSpecialOffers(): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/special-offers');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch special offers');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch special offers');
    }
  }

  async getFastFoodItems(): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/fast-food');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch fast food items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch fast food items');
    }
  }

  async getDiscountedItems(): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu/discounted');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch discounted items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch discounted items');
    }
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(`/menu/category/${category}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch menu items by category');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch menu items by category');
    }
  }
}

export const restaurantService = new RestaurantService();