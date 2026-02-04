import { apiClient } from '@/lib/apiClient';
import { Restaurant, Order, AuthUser, MenuItem } from '@/types';

interface CreateRestaurantData {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  cover_image_url?: string;
  category_id?: string;
  rating: number;
  total_reviews: number;
  delivery_time?: string;
  delivery_fee: number;
  min_order: number;
  is_active: boolean;
  address?: string;
  phone?: string;
  opening_hours?: Record<string, string>;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalRestaurants: number;
  todayOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  activeUsers: number;
  activeRestaurants: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface TopRestaurant {
  name: string;
  order_count: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  restaurant_name: string;
  customer_name: string;
}

interface DeliveryRider {
  id: string;
  name: string;
  status: string;
  orders_completed: number;
  earnings: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topRestaurants: TopRestaurant[];
  orderStatuses: OrderStatus[];
  deliveryRiders: DeliveryRider[];
  notifications: Notification[];
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

// Extended user interface for admin purposes
export interface AdminUser extends AuthUser {
  created_at?: string;
}

class AdminService {
  // Restaurant Management
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await apiClient.get<ApiResponse<Restaurant[]>>('/admin/restaurants');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch restaurants');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch restaurants');
    }
  }

  async addRestaurant(restaurant: CreateRestaurantData): Promise<Restaurant> {
    try {
      const response = await apiClient.post<ApiResponse<Restaurant>>('/admin/restaurants', restaurant);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add restaurant');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add restaurant');
    }
  }

  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response = await apiClient.put<ApiResponse<Restaurant>>(`/admin/restaurants/${id}`, updates);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update restaurant');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update restaurant');
    }
  }

  async deleteRestaurant(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/admin/restaurants/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete restaurant');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete restaurant');
    }
  }

  // Order Management
  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>('/admin/orders');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch orders');
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, { status });
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update order status');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update order status');
    }
  }

  // User Management
  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await apiClient.get<ApiResponse<AdminUser[]>>('/admin/users');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
  }

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    try {
      const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${userId}/role`, { role });
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update user role');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update user role');
    }
  }

  // Menu Management
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/admin/menu-items');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch menu items');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch menu items');
    }
  }

  // Dashboard Statistics
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardData>>('/admin/dashboard');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dashboard data');
    }
  }

  // Reports
  async getSalesReport(dateRange: { from: string; to: string }): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/admin/reports/sales?from=${dateRange.from}&to=${dateRange.to}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch sales report');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch sales report');
    }
  }

  async getCustomerAnalytics(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/admin/reports/customers');
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch customer analytics');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch customer analytics');
    }
  }
}

export const adminService = new AdminService();