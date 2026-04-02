import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Store,
  Calendar,
  Filter,
  ArrowUpRight,
  Activity,
  ChevronRight,
  Sparkles,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SalesReport {
  date: string;
  order_count: number;
  total_revenue: number;
}

interface CustomerAnalytics {
  customerStats: {
    total_customers: number;
    new_customers_30_days: number;
  };
  topCustomers: {
    username: string;
    total_orders: number;
    total_spent: number;
  }[];
}

export default function AdminReportsPage() {
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReports(dateRange);
      setSalesData(data.salesData || []);
      setCustomerData(data.customerData || null);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setSalesData([]);
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    const value = amount ?? 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = Array.isArray(salesData) ? salesData.reduce((sum, day) => sum + (day.total_revenue || 0), 0) : 0;
  const totalOrders = Array.isArray(salesData) ? salesData.reduce((sum, day) => sum + (day.order_count || 0), 0) : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) {
    return (
      <div className="p-6 min-h-[80vh]">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-10 w-10 text-primary" />
            Intelligence Hub
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Analyze platform performance and business health with real-time data.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-muted/30 px-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-transparent h-11 focus:outline-none font-bold text-muted-foreground min-w-[140px]"
            >
              <option value="day">Past 24 Hours</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">
            <Download className="mr-2 h-5 w-5" /> Export Data
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12.5%' },
          { label: 'Total Volume', value: totalOrders.toLocaleString(), icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+8.2%' },
          { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: '+3.1%' },
          { label: 'Platform Users', value: (customerData?.customerStats.total_customers || 0).toLocaleString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+5.4%' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black">{stat.value}</p>
                    <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Revenue Performance
              </CardTitle>
              <CardDescription className="text-base mt-1">Trends and growth analysis for the selected period.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full">View Details</Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full bg-muted/20 rounded-3xl border-2 border-dashed border-muted flex items-center justify-center group">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium max-w-[200px]">Interactive visualization for {salesData.length} data points will render here.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Breakdown */}
        <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              Customer Segments
            </CardTitle>
            <CardDescription className="text-base mt-1">Growth and retention metrics.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl group hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-tighter">Total Accounts</p>
                    <p className="text-xl font-black">{customerData?.customerStats.total_customers || 0}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl group hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-tighter">New This Month</p>
                    <p className="text-xl font-black">{customerData?.customerStats.new_customers_30_days || 0}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>

              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl group hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <Package className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-tighter">Avg Order Frequency</p>
                    <p className="text-xl font-black">3.2x</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Customers */}
        <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-primary" />
              VIP Customers
            </CardTitle>
            <CardDescription className="text-base mt-1">High-value users by total platform spend.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Orders</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customerData?.topCustomers.map((customer, i) => (
                    <tr key={customer.username} className="hover:bg-muted/10 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary">
                            {customer.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold">{customer.username}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-bold text-muted-foreground">{customer.total_orders}</td>
                      <td className="px-8 py-4 text-right font-black text-primary">{formatCurrency(customer.total_spent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Restaurants */}
        <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              Market Leaders
            </CardTitle>
            <CardDescription className="text-base mt-1">Top performing restaurant partners.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Restaurant</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Orders</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { name: 'Pizza Palace', orders: 125, revenue: 3250 },
                    { name: 'Burger Barn', orders: 98, revenue: 2850 },
                    { name: 'Sushi Spot', orders: 87, revenue: 2450 },
                    { name: 'Taco Tower', orders: 76, revenue: 1980 },
                  ].map((store) => (
                    <tr key={store.name} className="hover:bg-muted/10 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center font-black text-orange-500 text-xs">
                            <Store className="h-5 w-5" />
                          </div>
                          <span className="font-bold">{store.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-bold text-muted-foreground">{store.orders}</td>
                      <td className="px-8 py-4 text-right font-black text-primary">{formatCurrency(store.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}