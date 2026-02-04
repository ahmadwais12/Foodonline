import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation, Check, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Mock data for active delivery
const activeDelivery = {
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
  timePlaced: '15 mins ago',
  items: [
    { name: 'Margherita Pizza', quantity: 1 },
    { name: 'Caesar Salad', quantity: 1 },
    { name: 'Garlic Bread', quantity: 2 },
  ],
  deliverySteps: [
    { id: 1, name: 'Order Received', completed: true, time: '2:30 PM' },
    { id: 2, name: 'Preparing', completed: true, time: '2:35 PM' },
    { id: 3, name: 'Ready for Pickup', completed: true, time: '2:50 PM' },
    { id: 4, name: 'On the Way', completed: true, time: '2:55 PM' },
    { id: 5, name: 'Near Destination', completed: false, time: '' },
    { id: 6, name: 'Delivered', completed: false, time: '' },
  ],
  currentStep: 4,
};

export default function ActiveDeliveryPage() {
  const [timeRemaining, setTimeRemaining] = useState(15); // minutes
  const [distanceRemaining, setDistanceRemaining] = useState('1.2 km');

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleCallCustomer = () => {
    // In a real app, this would initiate a phone call
    alert(`Calling ${activeDelivery.customer} at ${activeDelivery.phone}`);
  };

  const handleNavigateToCustomer = () => {
    // In a real app, this would open maps navigation
    alert(`Navigating to ${activeDelivery.deliveryAddress}`);
  };

  const handleMarkDelivered = () => {
    // In a real app, this would update the order status
    alert('Order marked as delivered!');
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
            <h1 className="text-3xl font-bold">Active Delivery</h1>
            <p className="text-muted-foreground">
              Order #{activeDelivery.id} - On the way to customer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm">In Progress</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Progress</CardTitle>
                <CardDescription>
                  Track the status of your delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDelivery.deliverySteps.map((step) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-primary text-primary-foreground' 
                          : step.id === activeDelivery.currentStep 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted'
                      }`}>
                        {step.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1 pb-4 border-l pl-4 ml-3">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${
                            step.completed || step.id === activeDelivery.currentStep 
                              ? 'text-foreground' 
                              : 'text-muted-foreground'
                          }`}>
                            {step.name}
                          </h3>
                          {step.time && (
                            <span className="text-sm text-muted-foreground">{step.time}</span>
                          )}
                        </div>
                        {step.id === activeDelivery.currentStep && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Current step
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Live Tracking</CardTitle>
                <CardDescription>
                  Real-time location of your delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Live map visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  {activeDelivery.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Customer</h4>
                    <div className="flex items-center justify-between">
                      <span>{activeDelivery.customer}</span>
                      <Button variant="ghost" size="sm" onClick={handleCallCustomer}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activeDelivery.phone}</p>
                  </div>

                  {/* Restaurant Info */}
                  <div>
                    <h4 className="font-medium mb-2">Restaurant</h4>
                    <p className="text-sm">{activeDelivery.restaurant}</p>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{activeDelivery.restaurantAddress}</span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="font-medium mb-2">Delivery Address</h4>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{activeDelivery.deliveryAddress}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={handleNavigateToCustomer}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <ul className="space-y-1">
                      {activeDelivery.items.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Financial Info */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{activeDelivery.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tip:</span>
                      <span className="text-success">+{activeDelivery.tip}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-1 pt-1 border-t">
                      <span>Total:</span>
                      <span>{activeDelivery.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Time Remaining</span>
                      <span className="text-sm font-medium">{timeRemaining} min</span>
                    </div>
                    <Progress value={(15 - timeRemaining) / 15 * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Distance Remaining</span>
                      <span className="text-sm font-medium">{distanceRemaining}</span>
                    </div>
                    <Progress value={48} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Estimated Arrival</span>
                    <Badge variant="secondary">3:25 PM</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button onClick={handleMarkDelivered} size="lg">
                <Check className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
              <Button variant="outline">
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}