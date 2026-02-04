import { getStripe } from '@/lib/stripe';
import { apiClient } from '@/lib/apiClient';

interface PaymentIntentData {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  description?: string;
}

interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

class PaymentService {
  /**
   * Create a payment intent with Stripe
   */
  async createPaymentIntent(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      // In a real implementation, this would call your backend API
      // to create a payment intent with Stripe
      console.log('Creating payment intent for order:', data.orderId);
      
      // For demo purposes, we'll simulate a successful payment
      // In a real app, you would:
      // 1. Call your backend to create a payment intent
      // 2. Return the client secret to the frontend
      // 3. Use Stripe Elements to collect payment details
      // 4. Confirm the payment intent
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock payment intent ID
      const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 16)}`;
      
      return {
        success: true,
        paymentIntentId
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment intent'
      };
    }
  }

  /**
   * Process a card payment using Stripe
   */
  async processCardPayment(orderId: string, paymentMethodId: string): Promise<PaymentResult> {
    try {
      // In a real implementation, this would:
      // 1. Call your backend API with the payment method ID
      // 2. Your backend would use the Stripe SDK to confirm the payment
      
      console.log('Processing card payment for order:', orderId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock payment intent ID
      const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 16)}`;
      
      return {
        success: true,
        paymentIntentId
      };
    } catch (error: any) {
      console.error('Error processing card payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to process payment'
      };
    }
  }

  /**
   * Update order payment status in the database
   */
  async updateOrderPaymentStatus(orderId: string, status: 'paid' | 'failed' | 'refunded'): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/orders/${orderId}/payment-status`, { status });
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to update order payment status');
      }
      
      console.log(`Order ${orderId} payment status updated to ${status}`);
    } catch (error: any) {
      console.error('Error updating order payment status:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update order payment status');
    }
  }

  /**
   * Record payment transaction in the database
   */
  async recordPaymentTransaction(paymentData: {
    orderId: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    gatewayResponse?: any;
  }): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/payments', paymentData);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to record payment transaction');
      }
      
      console.log(`Payment transaction recorded for order ${paymentData.orderId}`);
    } catch (error: any) {
      console.error('Error recording payment transaction:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to record payment transaction');
    }
  }
}

export const paymentService = new PaymentService();