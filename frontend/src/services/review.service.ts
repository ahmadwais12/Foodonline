import { apiClient } from '@/lib/apiClient';
import { Review } from '@/types';

interface CreateReviewData {
  user_id: string;
  restaurant_id: string;
  order_id?: string;
  rating: number;
  comment?: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class ReviewService {
  async getReviews(restaurantId: string): Promise<Review[]> {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/restaurant/${restaurantId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch reviews');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch reviews');
    }
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user reviews');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user reviews');
    }
  }

  async addReview(review: CreateReviewData): Promise<Review> {
    try {
      const response = await apiClient.post<ApiResponse<Review>>('/reviews', review);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add review');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add review');
    }
  }

  async updateReview(id: string, updates: Partial<CreateReviewData>): Promise<Review> {
    try {
      const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, updates);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update review');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update review');
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/reviews/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete review');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete review');
    }
  }

  async getRestaurantAverageRating(restaurantId: string): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ averageRating: number }>>(`/reviews/restaurant/${restaurantId}/average`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data.averageRating;
      } else {
        throw new Error(response.data.message || 'Failed to fetch restaurant rating');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch restaurant rating');
    }
  }

  async getUserReviewForRestaurant(userId: string, restaurantId: string): Promise<Review | null> {
    try {
      const response = await apiClient.get<ApiResponse<Review | null>>(`/reviews/user/${userId}/restaurant/${restaurantId}`);
      
      if (response.data.status === 'success') {
        return response.data.data || null;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user review');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user review');
    }
  }
}

export const reviewService = new ReviewService();