import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Wallet, 
  ArrowLeft, 
  Shield, 
  CheckCircle2,
  Truck,
  Package,
  Home,
  Building2,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/order.service';
import { userService } from '@/services/user.service';
import { paymentService } from '@/services/payment.service';
import { getStripe } from '@/lib/stripe';
import { UserAddress } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import AddressDialog from '@/components/user/AddressDialog';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'card'>('select');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    loadAddresses();
  }, [user, cart.items.length]);

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      const data = await userService.getAddresses();
      setAddresses(data);
      
      const defaultAddr = data.find((a) => a.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      } else if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      toast({
        title: 'Error loading addresses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !cart.restaurant) return;

    if (!selectedAddress) {
      toast({
        title: 'Please select a delivery address',
        variant: 'destructive',
      });
      return;
    }

    const address = addresses.find((a) => a.id === selectedAddress);
    if (!address) return;

    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        user_id: user.id,
        restaurant_id: cart.restaurant.id,
        delivery_address: {
          label: address.label,
          address_line1: address.address_line1,
          address_line2: address.address_line2 || undefined,
          city: address.city,
          state: address.state || undefined,
          postal_code: address.postal_code || undefined,
        },
        delivery_instructions: deliveryInstructions || undefined,
        items: cart.items.map((item) => ({
          menu_item_id: item.menuItem.id,
          item_name: item.menuItem.name,
          item_price: item.menuItem.price,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
        })),
        subtotal: cart.subtotal,
        delivery_fee: cart.delivery_fee,
        tax: cart.tax,
        discount: 0,
        total: cart.total,
        payment_method: paymentMethod,
      });

      setOrderId(order.id);
      
      // If paying with card, move to payment step
      if (paymentMethod === 'card') {
        setPaymentStep('card');
      } else {
        // For cash on delivery, complete the order
        await completeOrder(order.id);
      }
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast({
        title: 'Error placing order',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!orderId) return;
    
    try {
      // Update order payment status
      await paymentService.updateOrderPaymentStatus(orderId, 'paid');
      
      // Record payment transaction
      await paymentService.recordPaymentTransaction({
        orderId,
        amount: cart.total,
        paymentMethod: 'card',
        transactionId: paymentIntentId,
        status: 'completed'
      });
      
      // Complete the order
      await completeOrder(orderId);
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Payment processed but order update failed',
        description: 'Please contact support with order #' + orderId,
        variant: 'destructive',
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment failed',
      description: error,
      variant: 'destructive',
    });
  };

  const completeOrder = async (orderId: string) => {
    clearCart();
    toast({
      title: 'Order placed successfully!',
      description: `Order #${orderId.substring(0, 8)}`,
    });
    navigate(`/order/${orderId}`);
  };

  const handleBackToSelection = () => {
    setPaymentStep('select');
  };

  const getAddressIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('home') || lower.includes('house')) return Home;
    if (lower.includes('work') || lower.includes('office')) return Building2;
    return MapPin;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-10 w-48 mb-8 rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-72 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-56 w-full rounded-2xl" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Progress Stepper */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="rounded-full hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                <p className="text-muted-foreground text-sm">Complete your order in just a few steps</p>
              </div>
            </div>
            
            {/* Steps */}
            <div className="flex items-center gap-2 max-w-lg">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${paymentStep === 'select' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-sm font-medium">Details</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted rounded-full" />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${paymentStep === 'card' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${paymentStep === 'card' ? 'bg-white/20' : 'bg-muted-foreground/20'}`}>2</div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-6 glass-effect border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Delivery Address</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressDialog(true)}
                      className="rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      Add New
                    </Button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl border-2 border-dashed border-muted">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-primary/60" />
                      </div>
                      <p className="text-muted-foreground mb-4 font-medium">No saved addresses yet</p>
                      <Button 
                        onClick={() => setShowAddressDialog(true)}
                        className="rounded-xl gradient-primary"
                      >
                        <Home className="h-4 w-4 mr-2" /> Add Address
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                      <div className="space-y-3">
                        {addresses.map((address) => {
                          const AddressIcon = getAddressIcon(address.label);
                          const isSelected = selectedAddress === address.id;
                          return (
                            <motion.div
                              key={address.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Label
                                htmlFor={address.id}
                                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                                  isSelected 
                                    ? 'border-primary bg-primary/5 shadow-md' 
                                    : 'border-muted hover:border-primary/30 hover:bg-muted/30'
                                }`}
                              >
                                <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                                      <AddressIcon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <span className="font-semibold">{address.label}</span>
                                    {address.is_default && (
                                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                                        <Star className="h-3 w-3 mr-1" /> Default
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground pl-9">
                                    {address.address_line1}
                                    {address.address_line2 && `, ${address.address_line2}`}
                                    <br />
                                    {address.city}
                                    {address.state && `, ${address.state}`}
                                    {address.postal_code && ` ${address.postal_code}`}
                                  </div>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                                )}
                              </Label>
                            </motion.div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  )}
                </Card>
              </motion.div>

              {/* Delivery Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-6 glass-effect border-0 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4">Delivery Instructions (Optional)</h3>
                  <Textarea
                    placeholder="e.g., Ring the doorbell, Leave at door, etc."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    rows={3}
                    className="rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </Card>
              </motion.div>

              {/* Payment Method */}
              {paymentStep === 'select' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card className="p-6 glass-effect border-0 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Payment Method</h3>
                    </div>

                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          <Label
                            htmlFor="card"
                            className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-muted/50 transition-all duration-300 hover:shadow-md"
                          >
                            <RadioGroupItem value="card" id="card" />
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <CreditCard className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">Credit / Debit Card</div>
                                <div className="text-sm text-muted-foreground">Pay securely online</div>
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        >
                          <Label
                            htmlFor="cash"
                            className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-muted/50 transition-all duration-300 hover:shadow-md"
                          >
                            <RadioGroupItem value="cash" id="cash" />
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Wallet className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">Cash on Delivery</div>
                                <div className="text-sm text-muted-foreground">Pay when you receive</div>
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                      </div>
                    </RadioGroup>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card className="p-6 glass-effect border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Card Payment</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleBackToSelection}
                        className="rounded-xl transition-all duration-300 hover:shadow-md"
                      >
                        Change Method
                      </Button>
                    </div>
                    
                    <div className="bg-primary/5 rounded-xl p-4 mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary">Your payment is secured with SSL encryption</span>
                    </div>
                    
                    <Elements stripe={getStripe()}>
                      <StripePaymentForm
                        amount={cart.total * 100} // Convert to cents
                        currency="usd"
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                      />
                    </Elements>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="sticky top-20"
              >
                <Card className="p-6 glass-effect border-0 shadow-xl rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Order Summary</h3>
                  </div>

                  {/* Restaurant */}
                  {cart.restaurant && (
                    <div className="mb-6 p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {cart.restaurant.name.charAt(0)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm">{cart.restaurant.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground pl-10">
                        {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} • 
                        Est. delivery: 30-45 min
                      </p>
                    </div>
                  )}

                  {/* Items */}
                  <div className="mb-6 max-h-52 overflow-y-auto space-y-3">
                    {cart.items.map((item, index) => (
                      <motion.div 
                        key={item.menuItem.id} 
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">{item.quantity}x</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.menuItem.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.menuItem.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="font-semibold text-sm">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Pricing */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Package className="h-3 w-3" /> Subtotal
                      </span>
                      <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Truck className="h-3 w-3" /> Delivery Fee
                      </span>
                      <span className="font-medium">${cart.delivery_fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${cart.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-xl text-primary">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {paymentStep === 'select' && (
                    <Button
                      className="w-full h-14 rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={submitting || addresses.length === 0}
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Placing Order...
                        </div>
                      ) : (
                        <>
                          Continue to Payment
                          <CreditCard className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                  
                  {paymentStep === 'card' && (
                    <div className="text-center py-3 bg-muted/30 rounded-xl">
                      <p className="text-sm text-muted-foreground">Enter your card details below</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AddressDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onSuccess={loadAddresses}
      />
    </div>
  );
}