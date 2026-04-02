import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus, 
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  Users,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  Tag
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

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number;
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  used_count: number;
  created_at: string;
  is_active?: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'full'>('all');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCoupons();
      setCoupons(data || []);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const isCouponActive = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);
    return now >= validFrom && now <= validUntil && coupon.used_count < coupon.usage_limit;
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = (coupon.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (coupon.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'active') matchesFilter = isCouponActive(coupon);
    else if (filterStatus === 'expired') matchesFilter = new Date(coupon.valid_until) < new Date();
    else if (filterStatus === 'full') matchesFilter = coupon.used_count >= coupon.usage_limit;
    
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

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.valid_until);
    
    if (coupon.used_count >= coupon.usage_limit) {
      return <Badge className="bg-orange-500/10 text-orange-500 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider gap-1"><Users className="h-3 w-3" /> Fully Used</Badge>;
    }
    if (validUntil < now) {
      return <Badge className="bg-red-500/10 text-red-500 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider gap-1"><Clock className="h-3 w-3" /> Expired</Badge>;
    }
    return <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider gap-1"><CheckCircle className="h-3 w-3" /> Active</Badge>;
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
            <Ticket className="h-10 w-10 text-primary" />
            Promo Hub
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Manage your marketing campaigns and discount codes for {coupons.length} active offers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">Campaign Stats</Button>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">
            <Plus className="mr-2 h-5 w-5" /> New Coupon
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Coupons', value: coupons.length, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Promos', value: coupons.filter(c => isCouponActive(c)).length, icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Redemptions', value: coupons.reduce((sum, c) => sum + c.used_count, 0), icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Avg Discount', value: coupons.length > 0 ? `${Math.round(coupons.reduce((sum, c) => sum + (c.discount_type === 'percentage' ? c.discount_value : 0), 0) / (coupons.filter(c => c.discount_type === 'percentage').length || 1))}%` : '0%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
                placeholder="Search by code or description..."
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
                  <option value="all">All Offers</option>
                  <option value="active">Active Only</option>
                  <option value="expired">Expired Only</option>
                  <option value="full">Limit Reached</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Promo Code</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Discount Value</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Usage Stats</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Valid Period</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCoupons.map((coupon, i) => (
                  <motion.tr 
                    key={coupon.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Ticket className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-black text-lg bg-muted px-3 py-1 rounded-xl w-fit mb-1 border-2 border-dashed border-primary/20 group-hover:border-primary/50 transition-colors uppercase tracking-widest">
                            {coupon.code}
                          </div>
                          <p className="text-xs text-muted-foreground font-medium max-w-[200px] truncate">{coupon.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-2xl text-foreground">
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground">
                          {coupon.discount_type === 'percentage' ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
                          {coupon.discount_type === 'percentage' ? 'Percentage Off' : 'Fixed Discount'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-base font-bold">
                          <Users className="h-4 w-4 text-primary" />
                          {coupon.used_count} / {coupon.usage_limit}
                        </div>
                        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${isCouponActive(coupon) ? 'bg-primary' : 'bg-muted-foreground/30'}`} 
                            style={{ width: `${Math.min((coupon.used_count / coupon.usage_limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(coupon.valid_until).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        {getStatusBadge(coupon)}
                      </div>
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
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold"><Eye className="h-4 w-4 mr-2" /> View Usage</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold"><Edit className="h-4 w-4 mr-2" /> Edit Coupon</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold"><Activity className="h-4 w-4 mr-2" /> Analytics</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold text-red-500 focus:text-red-500"><Trash2 className="h-4 w-4 mr-2" /> Delete Coupon</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredCoupons.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Coupons Found</h3>
                <p className="text-muted-foreground text-lg">Your search didn't return any active campaigns.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}