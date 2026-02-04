import { createContext, useContext, useState, ReactNode } from 'react';
import { Restaurant, Order, AuthUser } from '@/types';

interface AdminContextType {
  restaurants: Restaurant[];
  orders: Order[];
  users: AuthUser[];
  loading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => Promise<Restaurant | null>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<Restaurant | null>;
  deleteRestaurant: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: string) => Promise<boolean>;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // const data = await adminService.getRestaurants();
      // setRestaurants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch restaurants');
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // const data = await adminService.getOrders();
      // setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // const data = await adminService.getUsers();
      // setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRestaurant = async (restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // const newRestaurant = await adminService.addRestaurant(restaurant);
      // setRestaurants(prev => [...prev, newRestaurant]);
      // return newRestaurant;
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to add restaurant');
      console.error('Failed to add restaurant:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRestaurant = async (id: string, updates: Partial<Restaurant>) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // const updatedRestaurant = await adminService.updateRestaurant(id, updates);
      // setRestaurants(prev => 
      //   prev.map(restaurant => restaurant.id === id ? { ...restaurant, ...updates } : restaurant)
      // );
      // return updatedRestaurant;
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to update restaurant');
      console.error('Failed to update restaurant:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // await adminService.deleteRestaurant(id);
      // setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete restaurant');
      console.error('Failed to delete restaurant:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // await adminService.updateOrderStatus(orderId, status);
      // setOrders(prev => 
      //   prev.map(order => order.id === orderId ? { ...order, status } : order)
      // );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      console.error('Failed to update order status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would call an admin API
      // await adminService.updateUserRole(userId, role);
      // setUsers(prev => 
      //   prev.map(user => user.id === userId ? { ...user, role } : user)
      // );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
      console.error('Failed to update user role:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        restaurants,
        orders,
        users,
        loading,
        error,
        fetchRestaurants,
        fetchOrders,
        fetchUsers,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        updateOrderStatus,
        updateUserRole,
        clearError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}