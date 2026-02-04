import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Star, Heart, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { Restaurant, MenuItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import MenuItemCard from '@/components/restaurant/MenuItemCard';
import defaultCover from '@/assets/logo.jpg';

export default function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadRestaurant();
    }
  }, [slug]);

  const loadRestaurant = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const restaurantData = await restaurantService.getRestaurantBySlug(slug);
      if (!restaurantData) {
        toast({
          title: 'Restaurant not found',
          variant: 'destructive',
        });
        navigate('/restaurants');
        return;
      }

      setRestaurant(restaurantData);
      const items = await restaurantService.getMenuItems({ restaurantId: restaurantData.id });
      setMenuItems(items);

      if (user) {
        const favorite = await restaurantService.checkIsFavorite(user.id, restaurantData.id);
        setIsFavorite(favorite);
      }
    } catch (error) {
      console.error('Failed to load restaurant:', error);
      toast({
        title: 'Error loading restaurant',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!restaurant) return;

    try {
      if (isFavorite) {
        await restaurantService.removeFromFavorites(user.id, restaurant.id);
        setIsFavorite(false);
        toast({ title: 'Removed from favorites' });
      } else {
        await restaurantService.addToFavorites(user.id, restaurant.id);
        setIsFavorite(true);
        toast({ title: 'Added to favorites' });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        title: 'Error updating favorites',
        variant: 'destructive',
      });
    }
  };

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    if (restaurant) {
      addToCart(restaurant, item, quantity);
    }
  };

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={restaurant.cover_image_url || restaurant.image_url || defaultCover}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white"
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
          <p className="text-muted-foreground mb-4">{restaurant.description}</p>

          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning fill-current" />
              <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({restaurant.total_reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>{restaurant.delivery_time || '30-40 min'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-5 w-5" />
              <span>${restaurant.delivery_fee.toFixed(2)} delivery</span>
            </div>
          </div>

          {restaurant.address && (
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-5 w-5" />
              <span>{restaurant.address}</span>
            </div>
          )}

          {restaurant.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>{restaurant.phone}</span>
            </div>
          )}

          {restaurant.min_order > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                Minimum order: <span className="font-semibold">${restaurant.min_order.toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Menu */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Menu</h2>
          
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 pb-2 border-b">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}