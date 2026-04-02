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
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Star,
  Sparkles,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { adminService } from '@/services/admin.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    activeRestaurants: 0,
    todayOrders: 0,
    pendingOrders: 0
  });

  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      icon: DollarSign, 
      color: 'bg-blue-500/10 text-blue-500',
      trend: 'up',
      change: '+12.5%'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders.toString(), 
      icon: ShoppingBag, 
      color: 'bg-purple-500/10 text-purple-500',
      trend: 'up',
      change: '+8.2%'
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers.toString(), 
      icon: Users, 
      color: 'bg-orange-500/10 text-orange-500',
      trend: 'up',
      change: '+5.4%'
    },
    { 
      title: 'Active Stores', 
      value: stats.activeRestaurants.toString(), 
      icon: Store, 
      color: 'bg-emerald-500/10 text-emerald-500',
      trend: 'down',
      change: '-2.1%'
    },
  ];

  const orderStats = [
    { label: 'Delivered', count: stats.totalOrders - stats.pendingOrders, percentage: Math.round(((stats.totalOrders - stats.pendingOrders) / (stats.totalOrders || 1)) * 100), color: 'bg-emerald-500' },
    { label: 'Pending', count: stats.pendingOrders, percentage: Math.round((stats.pendingOrders / (stats.totalOrders || 1)) * 100), color: 'bg-orange-500' },
    { label: 'In Kitchen', count: Math.round(stats.totalOrders * 0.15), percentage: 15, color: 'bg-purple-500' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardData();
      if (data) {
        if (data.stats) setStats(data.stats);
        if (data.orderStatuses) setOrderStatuses(data.orderStatuses);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard stats:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-[80vh]">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-2 font-bold">
          <Activity className="h-6 w-6" />
          {error}
        </div>
        <Button onClick={loadData} className="rounded-full">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">
            Welcome Back, <span className="text-primary">{user?.username || 'Admin'}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with FoodDash today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6">Download Report</Button>
          <Button className="gradient-primary rounded-full px-6 shadow-lg shadow-primary/20">Manage Store</Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform origin-left duration-300">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Overview */}
        <Card className="lg:col-span-2 glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Revenue Analytics
              </CardTitle>
              <CardDescription className="text-base mt-1">Daily revenue performance for the current month</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full">View Details</Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full bg-muted/20 rounded-3xl border-2 border-dashed border-muted flex items-center justify-center group">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium max-w-[200px]">Revenue visualization chart will be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Distribution */}
        <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              Order Status
            </CardTitle>
            <CardDescription className="text-base mt-1">Live distribution of active orders</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            {orderStats.map((status) => (
              <div key={status.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-lg font-bold block">{status.label}</span>
                    <span className="text-sm text-muted-foreground font-medium">{status.count} orders total</span>
                  </div>
                  <span className="text-xl font-black text-primary">{status.percentage}%</span>
                </div>
                <Progress value={status.percentage} className={`h-3 ${status.color.replace('bg-', 'bg-muted ')}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10"
      >
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold">Quick Insights</h4>
          <p className="text-muted-foreground font-medium">You have 15 pending orders that need immediate attention from restaurants.</p>
        </div>
        <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20">Review Orders</Button>
      </motion.div>
    </div>
  );
}