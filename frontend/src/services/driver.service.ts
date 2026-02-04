import { apiClient } from '@/lib/apiClient';
import { Order } from '@/types';

interface UpdateDriverLocationData {
  driver_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

interface UpdateDeliveryStatusData {
  order_id: string;
  status: string;
  timestamp: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class DriverService {
  async getAvailableOrders(driverId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`/driver/orders/available?driverId=${driverId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch available orders');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch available orders');
    }
  }

  async getActiveDeliveries(driverId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`/driver/orders/active?driverId=${driverId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch active deliveries');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch active deliveries');
    }
  }

  async getDeliveryHistory(driverId: string, limit: number = 20): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`/driver/orders/history?driverId=${driverId}&limit=${limit}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch delivery history');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch delivery history');
    }
  }

  async acceptOrder(driverId: string, orderId: string): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`/driver/orders/${orderId}/accept`, { driverId });
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to accept order');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to accept order');
    }
  }

  async updateDeliveryStatus({ order_id, status, timestamp }: UpdateDeliveryStatusData): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`/driver/orders/${order_id}/status`, { status, timestamp });
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update delivery status');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update delivery status');
    }
  }

  async updateDriverLocation({ driver_id, latitude, longitude, updated_at }: UpdateDriverLocationData): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/driver/location`, { driver_id, latitude, longitude, updated_at });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to update driver location');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update driver location');
    }
  }

  async getDriverEarnings(driverId: string, dateRange: { from: string; to: string }): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/driver/earnings?driverId=${driverId}&from=${dateRange.from}&to=${dateRange.to}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch driver earnings');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch driver earnings');
    }
  }

  async getDriverProfile(driverId: string): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/driver/profile/${driverId}`);
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch driver profile');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch driver profile');
    }
  }
}

export const driverService = new DriverService();