import { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import LoadingSpinner from '@/components/ui/loading-spinner';

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
      
      // For now, we'll simulate loading reports
      // In a real implementation, we'd call adminService.getSalesReport() and adminService.getCustomerAnalytics()
      setSalesData([
        { date: '2023-01-01', order_count: 15, total_revenue: 450.75 },
        { date: '2023-01-02', order_count: 22, total_revenue: 680.50 },
        { date: '2023-01-03', order_count: 18, total_revenue: 520.25 },
        { date: '2023-01-04', order_count: 25, total_revenue: 720.00 },
        { date: '2023-01-05', order_count: 30, total_revenue: 890.30 },
        { date: '2023-01-06', order_count: 28, total_revenue: 840.75 },
        { date: '2023-01-07', order_count: 35, total_revenue: 1050.20 },
      ]);
      
      setCustomerData({
        customerStats: {
          total_customers: 1250,
          new_customers_30_days: 125
        },
        topCustomers: [
          { username: 'john_doe', total_orders: 45, total_spent: 1250.50 },
          { username: 'jane_smith', total_orders: 38, total_spent: 980.25 },
          { username: 'robert_johnson', total_orders: 32, total_spent: 875.75 },
          { username: 'emily_davis', total_orders: 28, total_spent: 720.00 },
          { username: 'michael_wilson', total_orders: 25, total_spent: 650.50 }
        ]
      });
    } catch (error) {
      console.error('Failed to load reports:', error);
      setSalesData([]);
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalRevenue = salesData.reduce((sum, day) => sum + day.total_revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.order_count, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Business insights and performance metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="border rounded-md px-3 py-2"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customerData?.customerStats.total_customers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Overview
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Sales chart visualization would appear here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {salesData.length} days of data
                </p>
                <Button variant="outline" className="mt-4">View Detailed Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-xl font-bold">{customerData?.customerStats.total_customers || 0}</p>
                </div>
                <Users className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">New Customers (30 days)</p>
                  <p className="text-xl font-bold">{customerData?.customerStats.new_customers_30_days || 0}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Orders per Customer</p>
                  <p className="text-xl font-bold">3.2</p>
                </div>
                <Package className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerData?.topCustomers.map((customer, index) => (
                <div key={customer.username} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {customer.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{customer.username}</p>
                      <p className="text-sm text-muted-foreground">{customer.total_orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(customer.total_spent)}</p>
                    <p className="text-sm text-muted-foreground">spent</p>
                  </div>
                </div>
              ))}
              
              {(!customerData || customerData.topCustomers.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  No customer data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Top Performing Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Restaurant</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Pizza Palace</td>
                  <td className="py-3 px-4">125</td>
                  <td className="py-3 px-4">{formatCurrency(3250.75)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="default">+12.5%</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Burger Barn</td>
                  <td className="py-3 px-4">98</td>
                  <td className="py-3 px-4">{formatCurrency(2850.50)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="default">+8.2%</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Sushi Spot</td>
                  <td className="py-3 px-4">87</td>
                  <td className="py-3 px-4">{formatCurrency(2450.25)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">+3.1%</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Taco Tower</td>
                  <td className="py-3 px-4">76</td>
                  <td className="py-3 px-4">{formatCurrency(1980.00)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="default">+15.7%</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}