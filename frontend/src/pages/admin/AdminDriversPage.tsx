import { motion } from 'framer-motion';
import { Truck, Search, Plus, Filter, MoreVertical, Star, CheckCircle2, XCircle, Clock, AlertCircle, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { adminService } from '@/services/admin.service';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'busy'>('all');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDrivers();
      setDrivers(data || []);
    } catch (err: any) {
      console.error('Failed to load drivers:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  const filteredDrivers = (drivers || []).filter(driver => {
    const matchesSearch = (driver.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (driver.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, color: string, bg: string, icon: any }> = {
      active: { label: 'Online', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
      busy: { label: 'On Delivery', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: Clock },
      inactive: { label: 'Offline', color: 'text-gray-500', bg: 'bg-gray-500/10', icon: XCircle },
    };
    const s = statusMap[status.toLowerCase()] || { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle };
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

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-2 font-bold">
          <AlertCircle className="h-6 w-6" />
          {error}
        </div>
        <Button onClick={loadDrivers} className="rounded-full">
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
            <Truck className="h-10 w-10 text-primary" />
            Fleet Management
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Monitor and manage {drivers.length} delivery partners in your fleet.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">Export Fleet Data</Button>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">
            <Plus className="mr-2 h-5 w-5" /> Add New Driver
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Fleet', value: drivers.length, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Currently Online', value: drivers.filter(d => d.status === 'active').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'On Delivery', value: drivers.filter(d => d.status === 'busy').length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Average Rating', value: (drivers.reduce((acc, d) => acc + (d.rating || 0), 0) / (drivers.length || 1)).toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
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
                placeholder="Search by driver name or phone number..."
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
                  <option value="active">Online</option>
                  <option value="busy">On Delivery</option>
                  <option value="inactive">Offline</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Driver Details</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Performance</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Fleet Status</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Earnings</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDrivers.map((driver, i) => (
                  <motion.tr 
                    key={driver.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                          <Truck className="h-6 w-6 text-primary" />
                          {driver.status === 'active' && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-lg leading-none mb-1">{driver.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Phone className="h-3 w-3" />
                            {driver.phone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-base font-bold">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {(driver.rating || 0).toFixed(1)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                          <CheckCircle2 className="h-3 w-3" />
                          {driver.totalDeliveries || 0} Total Deliveries
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(driver.status || 'inactive')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-foreground">${(driver.earnings || 0).toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground">
                          <CreditCard className="h-3 w-3" />
                          This Month
                        </div>
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
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold">View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold">Assign Order</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold">Payout Details</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold text-red-500 focus:text-red-500">Suspend Access</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredDrivers.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Drivers Found</h3>
                <p className="text-muted-foreground text-lg">Your filters didn't return any results.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
