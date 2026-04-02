import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Eye, 
  Download,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Activity,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: string;
  status: string;
  transaction_id: string;
  created_at: string;
  customer_name: string;
  order_number?: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPayments();
      setPayments(data || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.order_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (payment.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (payment.transaction_id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, color: string, bg: string, icon: any }> = {
      completed: { label: 'Successful', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle },
      pending: { label: 'Processing', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Clock },
      failed: { label: 'Declined', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
    };
    const s = statusMap[status.toLowerCase()] || { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertTriangle };
    return (
      <Badge className={`${s.bg} ${s.color} border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider gap-1`}>
        <s.icon className="h-3 w-3" />
        {s.label}
      </Badge>
    );
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
            <DollarSign className="h-10 w-10 text-primary" />
            Financial Central
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Track and reconcile all {payments.length} transactions on the platform.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">Payout History</Button>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">
            <Download className="mr-2 h-5 w-5" /> Export Ledger
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Net Revenue', value: formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0)), icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
          { label: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+0.5%' },
          { label: 'Pending Payouts', value: formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: '-2%' },
          { label: 'Total Volume', value: payments.length, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+8%' },
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
                    <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                  </div>
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
                placeholder="Search by order number, customer, or transaction ID..."
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
                  <option value="completed">Successful</option>
                  <option value="pending">Processing</option>
                  <option value="failed">Declined</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Transaction Info</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Customer Details</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Payment Status</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.map((payment, i) => (
                  <motion.tr 
                    key={payment.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-lg leading-none mb-1">{payment.order_number || `#${payment.order_id.slice(0, 8)}`}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Calendar className="h-3 w-3" />
                            {new Date(payment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-base font-bold">
                          <UserIcon className="h-4 w-4 text-primary" />
                          {payment.customer_name || 'Guest User'}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter pl-6">TXN: {payment.transaction_id || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-foreground">{formatCurrency(payment.amount)}</span>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground">
                          <CreditCard className="h-3 w-3" />
                          {payment.method}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(payment.status)}
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
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold">View Receipt</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold">Refund Payment</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold">Verify with Stripe</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold text-red-500 focus:text-red-500">Flag Transaction</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Transactions Found</h3>
                <p className="text-muted-foreground text-lg">Your filters didn't return any results.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}