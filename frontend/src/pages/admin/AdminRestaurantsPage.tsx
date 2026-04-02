import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Star,
  Store,
  Package,
  Users,
  LayoutGrid,
  List,
  ChevronRight,
  Activity,
  ArrowUpRight,
  MoreVertical,
  AlertCircle
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

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  cover_image_url?: string;
  category_id?: string;
  rating: number;
  total_reviews: number;
  delivery_time?: string;
  delivery_fee: number;
  min_order: number;
  is_active: boolean;
  address?: string;
  phone?: string;
  opening_hours?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getRestaurants();
      setRestaurants(data || []);
    } catch (err: any) {
      console.error('Failed to load restaurants:', err);
      setError(err.message || 'Failed to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = (restaurant.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (restaurant.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (restaurant.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && restaurant.is_active) ||
                         (filterStatus === 'inactive' && !restaurant.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 min-h-[80vh]">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
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
        <Button onClick={loadRestaurants} className="rounded-full">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Store className="h-10 w-10 text-primary" />
            Restaurant Partners
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Oversee and manage your network of {restaurants.length} restaurants.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-muted/50 p-1 rounded-xl border">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setViewMode('grid')}
              className="rounded-lg h-9 w-9"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setViewMode('table')}
              className="rounded-lg h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gradient-primary rounded-full px-6 shadow-lg shadow-primary/20 h-11">
            <Plus className="h-5 w-5 mr-2" />
            Add Restaurant
          </Button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Partners', value: restaurants.length, icon: Store, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Now', value: restaurants.filter(r => r.is_active).length, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg. Rating', value: restaurants.length > 0 ? (restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1) : '0.0', icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Top Performers', value: restaurants.filter(r => r.rating >= 4.5).length, icon: ArrowUpRight, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
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

      {/* Search and Filters Bar */}
      <Card className="glass-effect border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by restaurant name, category or location..."
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
                  className="bg-transparent h-12 focus:outline-none font-medium text-muted-foreground min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              <Button variant="outline" className="h-12 rounded-2xl px-6 border-none bg-muted/30 hover:bg-muted/50 font-bold">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredRestaurants.map((restaurant, i) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass-effect border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] overflow-hidden group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    {restaurant.image_url ? (
                      <img 
                        src={restaurant.image_url} 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Store className="h-16 w-16 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${restaurant.is_active ? 'bg-emerald-500' : 'bg-red-500'} text-white border-none px-3 py-1.5 rounded-full shadow-lg font-bold uppercase tracking-wider text-[10px]`}>
                        {restaurant.is_active ? 'Active' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
                        <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                        <span className="font-bold text-sm">{(restaurant.rating || 0).toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs font-medium">({restaurant.total_reviews || 0})</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{restaurant.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full -mr-2">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
                          <DropdownMenuItem className="rounded-xl py-2 cursor-pointer"><Eye className="h-4 w-4 mr-2" /> View Public</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl py-2 cursor-pointer"><Edit className="h-4 w-4 mr-2" /> Edit Details</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl py-2 cursor-pointer text-red-500 focus:text-red-500"><Trash2 className="h-4 w-4 mr-2" /> Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-base leading-relaxed mb-6 flex-1">
                      {restaurant.description || 'No description provided for this restaurant partner.'}
                    </p>
                    <div className="pt-6 border-t flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold truncate max-w-[150px]">{restaurant.address || 'Location Pending'}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full font-bold group/btn">
                        Details <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-effect border-none shadow-xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b">
                        <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-muted-foreground">Restaurant Partner</th>
                        <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-muted-foreground">Location & Contact</th>
                        <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-muted-foreground">Performance</th>
                        <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredRestaurants.map((restaurant) => (
                        <tr key={restaurant.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Store className="h-7 w-7 text-primary" />
                              </div>
                              <div>
                                <p className="font-black text-xl leading-none mb-1">{restaurant.name}</p>
                                <p className="text-sm text-muted-foreground font-medium">ID: {restaurant.id?.toString().slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-bold">
                                <MapPin className="h-4 w-4 text-primary" />
                                {restaurant.address || 'N/A'}
                              </div>
                              <p className="text-xs text-muted-foreground font-medium pl-6">{restaurant.phone || 'No Phone'}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                              <span className="font-black text-lg">{(restaurant.rating || 0).toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-bold">{restaurant.total_reviews || 0} Total Reviews</p>
                          </td>
                          <td className="px-8 py-6">
                            <Badge className={`${restaurant.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} border-none rounded-full px-4 py-1 font-black text-xs uppercase tracking-tighter`}>
                              {restaurant.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3">
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"><Eye className="h-5 w-5" /></Button>
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-all"><Edit className="h-5 w-5" /></Button>
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash2 className="h-5 w-5" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredRestaurants.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed"
        >
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Restaurants Found</h3>
          <p className="text-muted-foreground text-lg">Try adjusting your search or filter settings to find what you're looking for.</p>
          <Button variant="outline" className="mt-8 rounded-full px-8 h-12" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
            Reset All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}