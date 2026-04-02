import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, ShoppingBag, Heart, Star, Bell, Settings,
  TrendingUp, Package, Clock, ChevronRight, Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import { restaurantService } from '@/services/restaurant.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Order, UserAddress, Restaurant } from '@/types';

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  favoriteRestaurants: number;
  pendingOrders: number;
  recentOrders: Order[];
  favoriteRestaurantsList: Restaurant[];
  recentAddresses: UserAddress[];
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteRestaurants: 0,
    pendingOrders: 0,
    recentOrders: [],
    favoriteRestaurantsList: [],
    recentAddresses: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user orders
      const orders = await orderService.getUserOrders();
      const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'out_for_delivery').length;
      
      // Load favorite restaurants
      const favorites = await restaurantService.getFavorites();
      
      // Load addresses
      const addresses = await userService.getAddresses();
      
      setStats({
        totalOrders: orders.length,
        totalSpent,
        favoriteRestaurants: favorites.length,
        pendingOrders,
        recentOrders: orders.slice(0, 5),
        favoriteRestaurantsList: favorites.slice(0, 4),
        recentAddresses: addresses.slice(0, 3)
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Error loading dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      preparing: 'default',
      out_for_delivery: 'default',
      delivered: 'outline',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace(/_/g, ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-48 mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-8 w-8 rounded-full mb-4" />
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </Card>
              
              <Card className="p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your account
              </p>
            </div>
            <Button onClick={() => navigate('/user/profile')} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Profile
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/user/orders')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">{stats.totalOrders} total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/user/orders')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <Badge variant="outline">Lifetime</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/user/favorites')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Heart className="h-8 w-8 text-red-500" />
                  <Badge variant="secondary">Saved</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favoriteRestaurants}</div>
                <p className="text-sm text-muted-foreground">Favorite Restaurants</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/user/orders')}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Package className="h-8 w-8 text-orange-500" />
                  {stats.pendingOrders > 0 && (
                    <Badge variant="default" className="animate-pulse">
                      {stats.pendingOrders} active
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest food orders</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/user/orders')}>
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {stats.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/restaurants')}
                    >
                      Browse Restaurants
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/user/orders/${order.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total_amount?.toFixed(2)}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/restaurants')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Order Food
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/user/addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/user/favorites')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Favorites
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/user/notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Addresses */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Your delivery locations</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {stats.recentAddresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">No addresses saved</p>
                      <Button 
                        size="sm" 
                        onClick={() => navigate('/user/addresses')}
                      >
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentAddresses.map((address) => (
                        <div 
                          key={address.id} 
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <MapPin className="h-4 w-4 text-primary mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{address.label}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {address.address_line1}, {address.city}
                            </p>
                            {address.is_default && (
                              <Badge variant="secondary" className="mt-1 text-xs">Default</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate('/user/addresses')}
                      >
                        Manage All Addresses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Favorite Restaurants Preview */}
              {stats.favoriteRestaurantsList.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Favorites</CardTitle>
                      <CardDescription>Restaurants you love</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.favoriteRestaurantsList.map((restaurant) => (
                        <div 
                          key={restaurant.id}
                          className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Star className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{restaurant.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {restaurant.cuisine_type} • {restaurant.rating}⭐
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate('/user/favorites')}
                      >
                        View All Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
