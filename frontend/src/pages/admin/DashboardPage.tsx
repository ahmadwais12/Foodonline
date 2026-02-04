import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Package,
  CreditCard,
  Star,
  MapPin,
  ChefHat,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { adminService } from '@/services/admin.service';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalRestaurants: number;
  todayOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  activeUsers: number;
  activeRestaurants: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface TopRestaurant {
  name: string;
  order_count: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  restaurant_name: string;
  customer_name: string;
  delivery_address?: string;
}

interface DeliveryRider {
  id: string;
  name: string;
  status: string;
  orders_completed: number;
  earnings: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRestaurants: 0,
    todayOrders: 0,
    weeklyOrders: 0,
    monthlyOrders: 0,
    activeUsers: 0,
    activeRestaurants: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [deliveryRiders, setDeliveryRiders] = useState<DeliveryRider[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardData();
      setStats(data.stats || {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRestaurants: 0,
        todayOrders: 0,
        weeklyOrders: 0,
        monthlyOrders: 0,
        activeUsers: 0,
        activeRestaurants: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
      });
      setRecentOrders(data.recentOrders || []);
      setTopRestaurants(data.topRestaurants || []);
      setOrderStatuses(data.orderStatuses || []);
      setDeliveryRiders(data.deliveryRiders || []);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default values on error
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRestaurants: 0,
        todayOrders: 0,
        weeklyOrders: 0,
        monthlyOrders: 0,
        activeUsers: 0,
        activeRestaurants: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
      });
      setRecentOrders([]);
      setTopRestaurants([]);
      setOrderStatuses([]);
      setDeliveryRiders([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate percentages for order statuses
  const calculatePercentages = () => {
    const total = orderStatuses.reduce((sum, status) => sum + status.count, 0);
    return orderStatuses.map(status => ({
      ...status,
      percentage: total > 0 ? Math.round((status.count / total) * 100) : 0
    }));
  };

  const orderStatsWithPercentages = calculatePercentages();

  // Stats cards data
  const statsCards = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      change: '+20.1%', 
      trend: 'up', 
      icon: DollarSign 
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders.toLocaleString(), 
      change: '+18.2%', 
      trend: 'up', 
      icon: ShoppingBag 
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers.toLocaleString(), 
      change: '+12.3%', 
      trend: 'up', 
      icon: Users 
    },
    { 
      title: 'Active Restaurants', 
      value: stats.activeRestaurants.toLocaleString(), 
      change: '+3.2%', 
      trend: 'up', 
      icon: Store 
    },
    { 
      title: 'Today Orders', 
      value: stats.todayOrders.toLocaleString(), 
      change: '+5.1%', 
      trend: 'up', 
      icon: Calendar 
    },
    { 
      title: 'Pending Orders', 
      value: stats.pendingOrders.toLocaleString(), 
      change: '-2.3%', 
      trend: 'down', 
      icon: Clock 
    },
  ];

  // Quick actions
  const quickActions = [
    { title: 'Add Restaurant', description: 'Register new restaurant', icon: Store, color: 'primary' },
    { title: 'Add Menu Item', description: 'Create new food item', icon: ChefHat, color: 'success' },
    { title: 'Manage Orders', description: 'View and manage orders', icon: Package, color: 'warning' },
    { title: 'Manage Users', description: 'View and manage users', icon: Users, color: 'info' },
    { title: 'Manage Riders', description: 'Assign deliveries', icon: Truck, color: 'secondary' },
    { title: 'View Payments', description: 'Check transactions', icon: CreditCard, color: 'success' },
    { title: 'Create Coupon', description: 'Add discount codes', icon: DollarSign, color: 'primary' },
    { title: 'View Reports', description: 'Analytics and insights', icon: BarChart3, color: 'info' },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={timeRange === 'day' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('day')}
            >
              Today
            </Button>
            <Button 
              variant={timeRange === 'week' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('week')}
            >
              This Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('month')}
            >
              This Month
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-success mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                      )}
                      <span className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>
                  Your revenue metrics for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Revenue chart visualization would appear here</p>
                    <Button variant="outline" className="mt-4">View Detailed Reports</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Distribution */}
          <div>
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Order Status Distribution
                </CardTitle>
                <CardDescription>
                  Current status of all orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatsWithPercentages.map((stat) => (
                    <div key={stat.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{stat.status}</span>
                        <span>{stat.count} ({stat.percentage}%)</span>
                      </div>
                      <Progress value={stat.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colorClass = action.color === 'primary' ? 'bg-primary/10 text-primary' :
                             action.color === 'success' ? 'bg-success/10 text-success' :
                             action.color === 'warning' ? 'bg-warning/10 text-warning' :
                             action.color === 'info' ? 'bg-info/10 text-info' :
                             'bg-secondary/10 text-secondary';
            
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${colorClass} mr-3`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Orders and Top Restaurants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Orders
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Latest orders from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'Completed' ? 'default' :
                            order.status === 'Processing' ? 'secondary' :
                            order.status === 'Cancelled' ? 'destructive' :
                            order.status === 'Pending' ? 'outline' :
                            'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Restaurants */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Top Performing Restaurants
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Restaurants with highest orders and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topRestaurants.slice(0, 5).map((restaurant) => (
                    <TableRow key={restaurant.name}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.order_count}</TableCell>
                      <TableCell>{formatCurrency(restaurant.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Riders and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Riders */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Riders
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </CardTitle>
              <CardDescription>
                Active delivery riders and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryRiders.slice(0, 3).map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell className="font-medium">{rider.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={rider.status === 'Online' ? 'default' : 'secondary'}
                        >
                          {rider.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{rider.orders_completed}</TableCell>
                      <TableCell>{formatCurrency(rider.earnings)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Notifications
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Recent system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className={`p-1 rounded-full ${notification.type === 'alert' ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                      {notification.type === 'alert' ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}