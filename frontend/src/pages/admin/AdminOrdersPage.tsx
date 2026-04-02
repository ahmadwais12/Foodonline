import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Clock, 
  User as UserIcon,
  CheckCircle,
  Truck,
  CreditCard,
  MoreVertical,
  Calendar,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getOrders();
      setOrders(data || []);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.order_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number | undefined | null) => {
    const value = amount ?? 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, color: string, bg: string }> = {
      pending: { label: 'Pending', color: 'text-orange-500', bg: 'bg-orange-500/10' },
      confirmed: { label: 'Confirmed', color: 'text-blue-500', bg: 'bg-blue-500/10' },
      preparing: { label: 'Preparing', color: 'text-purple-500', bg: 'bg-purple-500/10' },
      ready: { label: 'Ready', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
      out_for_delivery: { label: 'In Transit', color: 'text-blue-600', bg: 'bg-blue-600/10' },
      delivered: { label: 'Delivered', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      cancelled: { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-500/10' },
    };
    const currentStatus = (status || 'pending').toString().toLowerCase();
    const s = statusMap[currentStatus] || { label: status?.toString() || 'Pending', color: 'text-gray-500', bg: 'bg-gray-500/10' };
    return <Badge className={`${s.bg} ${s.color} border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider`}>{s.label}</Badge>;
  };

  const getDeliveryAddress = (address: any) => {
    if (!address) return 'Address not available';
    if (typeof address === 'object') {
      return address.address_line1 || 'Address not available';
    }
    try {
      const parsed = JSON.parse(address);
      return parsed.address_line1 || address;
    } catch {
      return address;
    }
  };

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

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-2 font-bold">
          <AlertCircle className="h-6 w-6" />
          {error}
        </div>
        <Button onClick={loadOrders} className="rounded-full">
          Try Again
        </Button>
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
            <Package className="h-10 w-10 text-primary" />
            Order Central
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Track, manage, and process all {orders.length} platform orders.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">Export Logs</Button>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">Live Tracking</Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Action Required', value: orders.filter(o => o.status === 'pending').length, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'In Kitchen', value: orders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'On the Road', value: orders.filter(o => o.status === 'out_for_delivery').length, icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-muted/30 px-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-transparent h-12 focus:outline-none font-medium text-muted-foreground min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Only</option>
                  <option value="preparing">In Kitchen</option>
                  <option value="out_for_delivery">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Order Details</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Customer & Address</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Total Value</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Current Status</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order, i) => (
                  <motion.tr 
                    key={order.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-lg leading-none mb-1">{order.order_number}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-base font-bold">
                          <UserIcon className="h-4 w-4 text-primary" />
                          {order.customer_name || 'Anonymous Customer'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pl-6">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">
                            {getDeliveryAddress(order.delivery_address)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-foreground">{formatCurrency(order.total)}</span>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground">
                          <CreditCard className="h-3 w-3" />
                          {order.payment_status}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateOrderStatus(order.id, 'confirmed')}><CheckCircle className="h-4 w-4 mr-2 text-blue-500" /> Confirm Order</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateOrderStatus(order.id, 'preparing')}><Clock className="h-4 w-4 mr-2 text-purple-500" /> Start Preparing</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}><Truck className="h-4 w-4 mr-2 text-indigo-500" /> Out for Delivery</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold" onClick={() => updateOrderStatus(order.id, 'delivered')}><CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> Mark Delivered</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold text-red-500 focus:text-red-500" onClick={() => updateOrderStatus(order.id, 'cancelled')}><XCircle className="h-4 w-4 mr-2" /> Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground text-lg">Your filters didn't return any results.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}