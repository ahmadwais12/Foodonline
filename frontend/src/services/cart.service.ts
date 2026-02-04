import { apiClient } from '@/lib/apiClient';
import { CartItem } from '@/types';

interface CartItemData {
  user_id: string;
  restaurant_id: string;
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class CartService {
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<CartItem[]>>(`/cart/user/${userId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch cart items');
    }
  }

  async addToCart(item: CartItemData): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/cart', item);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to add item to cart');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add item to cart');
    }
  }

  async updateCartItem(id: string, updates: Partial<CartItemData>): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/cart/${id}`, updates);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to update cart item');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update cart item');
    }
  }

  async removeCartItem(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/cart/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to remove cart item');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to remove cart item');
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/cart/user/${userId}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to clear cart');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to clear cart');
    }
  }

  async getCartItemCount(userId: string): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>(`/cart/user/${userId}/count`);
      
      if (response.data.status === 'success' && response.data.data !== undefined) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart item count');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch cart item count');
    }
  }
}

export const cartService = new CartService();