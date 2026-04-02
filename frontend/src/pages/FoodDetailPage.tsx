import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Leaf, 
  ShoppingCart, 
  Star, 
  Timer,
  AlertCircle,
  Plus,
  Minus,
  ChevronRight,
  Store,
  Info,
  MapPin,
  Utensils
} from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { MenuItem, Restaurant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { Separator } from '@/components/ui/separator';

export default function FoodDetailPage() {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  
  const [foodItem, setFoodItem] = useState<MenuItem | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Check if item is already in cart
  const cartItem = items.find(item => item.menuItem.id === foodId);
  const currentCartQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (foodId) {
      loadFoodItem();
    }
  }, [foodId]);

  const loadFoodItem = async () => {
    if (!foodId) return;
    
    setLoading(true);
    try {
      const data = await restaurantService.getMenuItemById(foodId);
      const item = (data as any).menuItem || data;
      setFoodItem(item);
      
      if (item.restaurant_id) {
        const restaurantData = await restaurantService.getRestaurantBySlug(item.restaurant_id);
        setRestaurant(restaurantData);
      }
    } catch (error) {
      console.error('Failed to load food item:', error);
      toast({
        title: 'Error loading food item',
        description: 'Failed to load the food details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (foodItem && restaurant) {
      addToCart(restaurant, foodItem, quantity);
      toast({
        title: 'Added to cart',
        description: `${foodItem.name} (${quantity}) has been added to your cart.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Skeleton className="w-full aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-32 rounded-full" />
                <Skeleton className="h-14 flex-1 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <AlertCircle className="h-20 w-20 text-destructive mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Food Item Not Found</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          The food item you're looking for doesn't exist or is no longer available in our menu.
        </p>
        <Button size="lg" onClick={() => navigate('/restaurants')} className="rounded-full px-8">
          Browse All Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex px-3 py-1 border-primary/20 text-primary">
                {foodItem.category || 'Food Item'}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="rounded-full relative hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                <AnimatePresence>
                  {currentCartQuantity > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold"
                    >
                      {currentCartQuantity}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Left Column: 3D Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-3xl p-4 border shadow-2xl">
                <CardItem
                  translateZ="50"
                  className="text-2xl font-bold text-neutral-600 dark:text-white"
                >
                  {foodItem.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {foodItem.category} • Freshly prepared for you
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-6">
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    {foodItem.image_url ? (
                      <img
                        src={foodItem.image_url}
                        alt={foodItem.name}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Utensils className="h-20 w-20 text-muted-foreground/20" />
                      </div>
                    )}
                    
                    {foodItem.is_vegetarian && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white border-none px-3 py-1">
                          <Leaf className="h-3 w-3 mr-1" />
                          Vegetarian
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardItem>
                <div className="flex justify-between items-center mt-10">
                  <CardItem
                    translateZ={20}
                    className="flex items-center gap-2 text-neutral-500 dark:text-neutral-300"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">15-25 min</span>
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    className="px-6 py-2 rounded-full bg-primary text-white text-lg font-bold shadow-lg"
                  >
                    ${foodItem.price.toFixed(2)}
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                {foodItem.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1.5 font-bold text-foreground">4.8</span>
                  <span className="ml-1 text-muted-foreground">(120+ reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-primary font-semibold">
                  <Timer className="h-5 w-5 mr-1.5" />
                  <span>20-30 min</span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {foodItem.description || "Indulge in our delicious, freshly prepared dish made with high-quality ingredients and a passion for flavor. Perfect for any time of the day."}
              </p>

              {restaurant && (
                <Card className="border-none bg-muted/30 mb-8 rounded-2xl overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/restaurant/${restaurant.slug}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center shadow-sm overflow-hidden">
                        {restaurant.image_url ? (
                          <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg flex items-center gap-1.5">
                          {restaurant.name}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {restaurant.address || "Main Street, Food City"}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-background text-primary">
                        Top Rated
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-2 text-foreground font-bold text-xl">
                <Info className="h-5 w-5 text-primary" />
                <h3>Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-muted flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Category</span>
                  <span className="font-semibold">{foodItem.category || 'Main Dish'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-muted flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Dietary</span>
                  <span className="font-semibold">{foodItem.is_vegetarian ? 'Vegetarian' : 'Non-Veg'}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Controls */}
            <div className="mt-auto pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-full border w-full sm:w-auto min-w-[140px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-full bg-background shadow-sm hover:bg-primary hover:text-white transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold px-4">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrement}
                    className="h-10 w-10 rounded-full bg-background shadow-sm hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  size="lg" 
                  className="w-full flex-1 h-14 rounded-full text-lg font-bold gradient-primary shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart • ${(foodItem.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}