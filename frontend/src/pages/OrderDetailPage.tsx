import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Clock, Receipt, Phone } from 'lucide-react';
import { orderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

const statusSteps: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const data = await orderService.getOrderById(orderId);
      if (!data) {
        toast({
          title: 'Order not found',
          variant: 'destructive',
        });
        navigate('/orders');
        return;
      }
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast({
        title: 'Error loading order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground">Order #{order.order_number}</p>
            </div>
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>

          {/* Order Status Timeline */}
          {!isCancelled && (
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-lg mb-6">Order Status</h3>
              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs mt-2 text-center max-w-20">
                          {statusLabels[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Restaurant Info */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Restaurant</h3>
              </div>
              <p className="font-medium mb-1">{order.restaurant?.name}</p>
              {order.restaurant?.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{order.restaurant.phone}</span>
                </div>
              )}
            </Card>

            {/* Delivery Address */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Delivery To</h3>
              </div>
              <p className="text-sm">
                {order.delivery_address.address_line1}
                {order.delivery_address.address_line2 && (
                  <>, {order.delivery_address.address_line2}</>
                )}
                <br />
                {order.delivery_address.city}
                {order.delivery_address.state && `, ${order.delivery_address.state}`}
                {order.delivery_address.postal_code && ` ${order.delivery_address.postal_code}`}
              </p>
            </Card>

            {/* Order Time */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Order Time</h3>
              </div>
              <p className="text-sm">
                {format(new Date(order.created_at), 'MMM dd, yyyy')}
                <br />
                {format(new Date(order.created_at), 'hh:mm a')}
              </p>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.item_name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    {item.special_instructions && (
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Note: {item.special_instructions}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">${(item.item_price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${order.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="capitalize">{order.payment_method || 'N/A'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
