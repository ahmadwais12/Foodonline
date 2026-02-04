import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, User, Phone, Euro, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data
const newOrders = [
  {
    id: '#ORD-3210',
    customer: 'John Doe',
    phone: '+1 (555) 123-4567',
    restaurant: 'Italian Bistro',
    restaurantAddress: '123 Main St, New York, NY',
    deliveryAddress: '456 Park Ave, Apt 5B, New York, NY',
    distance: '2.3 km',
    estimatedTime: '25 mins',
    amount: '$24.50',
    tip: '$3.00',
    total: '$27.50',
    timePlaced: '2 mins ago',
    items: [
      { name: 'Margherita Pizza', quantity: 1 },
      { name: 'Caesar Salad', quantity: 1 },
      { name: 'Garlic Bread', quantity: 2 },
    ],
  },
  {
    id: '#ORD-3209',
    customer: 'Jane Smith',
    phone: '+1 (555) 987-6543',
    restaurant: 'Burger Palace',
    restaurantAddress: '789 Broadway, New York, NY',
    deliveryAddress: '321 5th Ave, New York, NY',
    distance: '1.8 km',
    estimatedTime: '20 mins',
    amount: '$18.75',
    tip: '$2.50',
    total: '$21.25',
    timePlaced: '5 mins ago',
    items: [
      { name: 'Classic Burger', quantity: 1 },
      { name: 'French Fries', quantity: 1 },
      { name: 'Coke', quantity: 2 },
    ],
  },
  {
    id: '#ORD-3208',
    customer: 'Robert Johnson',
    phone: '+1 (555) 456-7890',
    restaurant: 'Sushi Corner',
    restaurantAddress: '555 6th Ave, New York, NY',
    deliveryAddress: '777 Lexington Ave, New York, NY',
    distance: '3.1 km',
    estimatedTime: '30 mins',
    amount: '$32.00',
    tip: '$5.00',
    total: '$37.00',
    timePlaced: '8 mins ago',
    items: [
      { name: 'Salmon Roll', quantity: 2 },
      { name: 'California Roll', quantity: 1 },
      { name: 'Miso Soup', quantity: 2 },
    ],
  },
];

export default function NewOrdersPage() {
  const [acceptedOrder, setAcceptedOrder] = useState<string | null>(null);

  const handleAcceptOrder = (orderId: string) => {
    setAcceptedOrder(orderId);
    // In a real app, this would trigger navigation to the active delivery page
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">New Orders</h1>
            <p className="text-muted-foreground">
              Accept new delivery orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </div>

        {newOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No New Orders</h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are currently no new orders available for delivery. New orders will appear here automatically.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {newOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          {order.id}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Timer className="h-4 w-4" />
                          {order.timePlaced}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{order.distance}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {/* Customer Info */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{order.customer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{order.phone}</span>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">{order.restaurant}</h4>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{order.restaurantAddress}</span>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Delivery Address</h4>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Info */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{order.amount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tip:</span>
                        <span className="text-success">+{order.tip}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-1 pt-1 border-t">
                        <span>Total:</span>
                        <span>{order.total}</span>
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        Est. delivery time: <span className="font-medium">{order.estimatedTime}</span>
                      </span>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button 
                      className="w-full"
                      disabled={acceptedOrder !== null && acceptedOrder !== order.id}
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      {acceptedOrder === order.id ? 'Order Accepted!' : 'Accept Order'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}