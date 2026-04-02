import { apiClient } from '@/lib/apiClient';

export interface FoodImage {
  id: number;
  name: string;
  image_url: string;
  category: string;
  is_favorite: boolean;
  is_special: boolean;
  is_fast_food: boolean;
  is_discounted: boolean;
  discount_percentage: number;
  price: number;
  description: string;
  ingredients: string;
  preparation_time: string;
  calories: number;
  is_available: boolean;
  restaurant_id?: number | null;
}

export interface BannerImage {
  id: number;
  title: string;
  image_url: string;
  type: 'hero' | 'category' | 'promotion' | 'background';
  link_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface PopularCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class ImageService {
  async getFoodImages(filters?: {
    category?: string;
    is_favorite?: boolean;
    is_special?: boolean;
    is_fast_food?: boolean;
    is_discounted?: boolean;
  }): Promise<FoodImage[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) params.append('category', filters.category);
      if (filters?.is_favorite !== undefined) params.append('is_favorite', filters.is_favorite.toString());
      if (filters?.is_special !== undefined) params.append('is_special', filters.is_special.toString());
      if (filters?.is_fast_food !== undefined) params.append('is_fast_food', filters.is_fast_food.toString());
      if (filters?.is_discounted !== undefined) params.append('is_discounted', filters.is_discounted.toString());
      
      const response = await apiClient.get<ApiResponse<FoodImage[]>>(`/images/food-images?${params.toString()}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch food images');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch food images');
    }
  }

  async getFoodImageById(id: number): Promise<FoodImage> {
    try {
      const response = await apiClient.get<ApiResponse<FoodImage>>(`/images/food-images/${id}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch food image');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch food image');
    }
  }

  async getBanners(type?: 'hero' | 'category' | 'promotion' | 'background'): Promise<BannerImage[]> {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await apiClient.get<ApiResponse<BannerImage[]>>(`/images/banners${params}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch banners');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch banners');
    }
  }

  async getPopularCategories(): Promise<PopularCategory[]> {
    try {
      const response = await apiClient.get<ApiResponse<PopularCategory[]>>('/images/popular-categories');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch popular categories');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch popular categories');
    }
  }

  async getCategoryBySlug(slug: string): Promise<{ category: PopularCategory; foodItems: FoodImage[] }> {
    try {
      const response = await apiClient.get<ApiResponse<{ category: PopularCategory; foodItems: FoodImage[] }>>(
        `/images/categories/${slug}`
      );
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch category');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch category');
    }
  }

  async submitFeedback(data: { name: string; email: string; message: string }): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/feedback', data);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to submit feedback');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit feedback');
    }
  }
}

export const imageService = new ImageService();
