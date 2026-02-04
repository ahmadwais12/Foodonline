import { apiClient } from '@/lib/apiClient';
import { Order, OrderItem, DeliveryAddress } from '@/types';

interface CreateOrderData {
  user_id: string;
  restaurant_id: string;
  delivery_address: DeliveryAddress;
  delivery_instructions?: string;
  items: {
    menu_item_id: string;
    item_name: string;
    item_price: number;
    quantity: number;
    special_instructions?: string;
  }[];
  subtotal: number;
  delivery_fee: number;
  tax: number;
  discount: number;
  total: number;
  payment_method?: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create order');
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`/orders/user/${userId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else if (response.data.status === 'error' && response.data.message === 'Order not found') {
        return null;
      } else {
        throw new Error(response.data.message || 'Failed to fetch order');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch order');
    }
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/orders/${orderId}/cancel`, { reason });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to cancel order');
    }
  }
}

export const orderService = new OrderService();