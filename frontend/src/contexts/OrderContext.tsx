import { createContext, useContext, useState, ReactNode } from 'react';
import { Order } from '@/types';
import { orderService } from '@/services/order.service';
import { useAuth } from './AuthContext';

interface CreateOrderData {
  user_id: string;
  restaurant_id: string;
  delivery_address: any;
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

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  cancelOrder: (orderId: string, reason: string) => Promise<boolean>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOrders = await orderService.getOrders(userId);
      setOrders(fetchedOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrderById(orderId);
      setCurrentOrder(order);
      return order;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      console.error('Failed to fetch order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: CreateOrderData) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await orderService.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      console.error('Failed to create order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      await orderService.cancelOrder(orderId, reason);
      
      // Update in orders list
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      
      // Update current order if it's the one being updated
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({ ...currentOrder, status: 'cancelled' });
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
      console.error('Failed to cancel order:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        fetchOrders,
        fetchOrderById,
        createOrder,
        cancelOrder,
        clearError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}