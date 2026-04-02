import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus, 
  Trash2,
  Star,
  DollarSign,
  Package,
  ChefHat,
  Store,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import { MenuItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all');
  const [filterRestaurant, setFilterRestaurant] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [menuData, restaurantData] = await Promise.all([
        adminService.getMenuItems(),
        adminService.getRestaurants()
      ]);
      setMenuItems(menuData || []);
      setRestaurants(restaurantData || []);
    } catch (err: any) {
      console.error('Failed to load menu data:', err);
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && item.is_available) ||
                         (filterStatus === 'unavailable' && !item.is_available);
    const matchesRestaurant = filterRestaurant === 'all' || item.restaurant_id === filterRestaurant;
    return matchesSearch && matchesStatus && matchesRestaurant;
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

  const getRestaurantName = (restaurantId: any) => {
    if (!restaurantId) return 'Unknown Restaurant';
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : `Restaurant ${restaurantId}`;
  };

  const getCategoryName = (category: any) => {
    if (!category) return 'No Category';
    if (typeof category === 'object') return category.name || 'Unknown Category';
    return category;
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
        <Button onClick={loadData} className="rounded-full">
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
            <Utensils className="h-10 w-10 text-primary" />
            Kitchen Catalog
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Manage your platform's {menuItems.length} menu items and categories across all restaurants.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-11 border-none bg-muted/50 font-bold">Categories</Button>
          <Button className="gradient-primary rounded-full px-8 shadow-lg shadow-primary/20 h-11 font-bold">
            <Plus className="mr-2 h-5 w-5" /> New Menu Item
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: menuItems.length, icon: Utensils, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Dishes', value: menuItems.filter(i => i.is_available).length, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg Price', value: formatCurrency(menuItems.length > 0 ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length : 0), icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Top Categories', value: '12', icon: ChefHat, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
                placeholder="Search by dish name, description or restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-muted/30 px-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                <Store className="h-5 w-5 text-muted-foreground" />
                <select
                  value={filterRestaurant}
                  onChange={(e) => setFilterRestaurant(e.target.value)}
                  className="bg-transparent h-12 focus:outline-none font-medium text-muted-foreground min-w-[150px]"
                >
                  <option value="all">All Restaurants</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-transparent h-12 focus:outline-none font-medium text-muted-foreground min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Sold Out</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card className="glass-effect border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Dish Details</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Restaurant</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Category</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Price</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Availability</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMenuItems.map((item, i) => (
                  <motion.tr 
                    key={item.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Utensils className="h-7 w-7 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-lg leading-none mb-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-medium max-w-[200px] truncate">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Store className="h-4 w-4 text-primary" />
                        {getRestaurantName(item.restaurant_id)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <ChefHat className="h-4 w-4" />
                        {getCategoryName(item.category)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-xl text-foreground">{formatCurrency(item.price)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={`${item.is_available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} border-none rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-wider`}>
                        {item.is_available ? 'Available' : 'Sold Out'}
                      </Badge>
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
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold"><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold"><Edit className="h-4 w-4 mr-2" /> Edit Item</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold"><Activity className="h-4 w-4 mr-2" /> Stock Status</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer font-bold text-red-500 focus:text-red-500"><Trash2 className="h-4 w-4 mr-2" /> Delete Item</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredMenuItems.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Items Found</h3>
                <p className="text-muted-foreground text-lg">Your filters didn't return any culinary matches.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}