import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#000',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: 'rgba(0,0,0,0.5)',
      },
    },
    invalid: {
      color: '#e74c3c',
      iconColor: '#e74c3c',
    },
  },
};

export default function StripePaymentForm({ 
  amount, 
  currency, 
  onPaymentSuccess, 
  onPaymentError 
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      // In a real implementation, you would:
      // 1. Create a payment intent on your server
      // 2. Get the client secret from the server
      // 3. Confirm the payment with Stripe
      
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 16)}`;
      
      setSuccess(true);
      onPaymentSuccess(paymentIntentId);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your payment');
      onPaymentError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-green-500 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Payment successful! Your order is being processed.</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Card Details</h3>
        </div>
        <CardElement 
          options={CARD_ELEMENT_OPTIONS} 
          onChange={(e) => setCardComplete(e.complete)}
        />
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <h4 className="font-medium mb-2">Test Card Numbers</h4>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Visa:</span>
            <span className="font-mono">4242 4242 4242 4242</span>
          </li>
          <li className="flex justify-between">
            <span>Visa Debit:</span>
            <span className="font-mono">4000 0566 5566 5556</span>
          </li>
          <li className="flex justify-between">
            <span>Mastercard:</span>
            <span className="font-mono">5555 5555 5555 4444</span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Use any future expiration date and 3-digit CVC.
        </p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing || success || !cardComplete}
        className="w-full py-6 rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        size="lg"
      >
        {processing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : success ? (
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Payment Successful
          </div>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
}