import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Trash2, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardholderName: string;
  brand: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true,
    cardholderName: 'John Doe',
    brand: 'Visa'
  },
  {
    id: '2',
    type: 'debit',
    last4: '1234',
    expiryMonth: '06',
    expiryYear: '2024',
    isDefault: false,
    cardholderName: 'John Doe',
    brand: 'Mastercard'
  }
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handleAddPaymentMethod = () => {
    // In a real app, this would open a payment form
    alert('Add payment method functionality would be implemented here');
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const getCardIcon = (brand: string) => {
    // In a real app, you would use actual card brand icons
    return <CreditCard className="h-6 w-6 text-muted-foreground" />;
  };

  return (
    <div className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground">
              Manage your payment options
            </p>
          </div>
          <Button onClick={handleAddPaymentMethod}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-success" />
              Secure Payment
            </CardTitle>
            <CardDescription>
              Your payment information is encrypted and securely stored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>PCI DSS compliant</span>
            </div>
          </CardContent>
        </Card>

        {paymentMethods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-muted p-4 rounded-full mb-4">
              <CreditCard className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No payment methods</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              You haven't added any payment methods yet. Add your first payment method to get started.
            </p>
            <Button onClick={handleAddPaymentMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="bg-muted p-3 rounded-lg">
                          {getCardIcon(method.brand)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {method.brand} ending in {method.last4}
                            </h3>
                            {method.isDefault && (
                              <Badge variant="default">Default</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1">
                            {method.cardholderName}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Expires</span>
                              <div>{method.expiryMonth}/{method.expiryYear}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!method.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleAddPaymentMethod}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Payment Method
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}