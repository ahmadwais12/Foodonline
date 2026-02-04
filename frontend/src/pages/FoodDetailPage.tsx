import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Leaf, 
  ShoppingCart, 
  Star, 
  Timer,
  AlertCircle
} from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { MenuItem, Restaurant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function FoodDetailPage() {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [foodItem, setFoodItem] = useState<MenuItem | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (foodId) {
      loadFoodItem();
    }
  }, [foodId]);

  const loadFoodItem = async () => {
    if (!foodId) return;
    
    setLoading(true);
    try {
      // In a real implementation, you would fetch the specific food item
      // For now, we'll simulate with a sample item
      const sampleItem: MenuItem = {
        id: foodId,
        restaurant_id: '1',
        name: 'Deluxe Burger',
        description: 'Juicy beef patty with fresh lettuce, tomato, cheese, and our special sauce on a sesame seed bun.',
        price: 12.99,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        category: 'Burgers',
        is_vegetarian: false,
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setFoodItem(sampleItem);
      
      // Simulate restaurant data
      const sampleRestaurant: Restaurant = {
        id: '1',
        name: 'Burger Palace',
        slug: 'burger-palace',
        description: 'The best burgers in town with fresh ingredients and quick service.',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        cover_image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        category_id: '1',
        rating: 4.7,
        total_reviews: 128,
        delivery_time: '20-30 min',
        delivery_fee: 2.99,
        min_order: 15.00,
        is_active: true,
        address: '123 Main St, Kabul, Afghanistan',
        phone: '+93 70 123 4567',
        opening_hours: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setRestaurant(sampleRestaurant);
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
        description: `${foodItem.name} has been added to your cart.`,
      });
    }
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Food Item Not Found</h2>
        <p className="text-muted-foreground mb-6 text-center">
          The food item you're looking for doesn't exist or is no longer available.
        </p>
        <Button onClick={() => navigate('/restaurants')}>
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="rounded-full relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  0
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Food Image Gallery */}
          <div className="relative mb-6 rounded-2xl overflow-hidden aspect-video">
            {foodItem.image_url ? (
              <img
                src={foodItem.image_url}
                alt={foodItem.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
            
            {/* Vegetarian Badge */}
            {foodItem.is_vegetarian && (
              <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
                <Leaf className="h-4 w-4 mr-1" />
                Vegetarian
              </Badge>
            )}
          </div>

          {/* Food Info */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{foodItem.name}</h1>
                <p className="text-muted-foreground">{foodItem.description}</p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  ${foodItem.price.toFixed(2)}
                </div>
                {foodItem.is_available ? (
                  <Badge variant="secondary" className="mt-2">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mt-2">
                    Unavailable
                  </Badge>
                )}
              </div>
            </div>

            {/* Restaurant Info */}
            {restaurant && (
              <Card className="p-4 mb-6">
                <div className="flex items-center gap-4">
                  {restaurant.image_url && (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.delivery_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${restaurant.delivery_fee.toFixed(2)} delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Customization Options */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Customize Your Order</h2>
              
              {/* Sample customization options */}
              <div className="space-y-6">
                {/* Size Options */}
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Small', 'Medium', 'Large'].map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        onClick={() => handleOptionChange('size', size)}
                        className={
                          selectedOptions.size === size
                            ? 'border-primary'
                            : ''
                        }
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Add-ons */}
                <div>
                  <h3 className="font-semibold mb-3">Add-ons</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: 'Extra Cheese', price: 1.5 },
                      { name: 'Bacon', price: 2.0 },
                      { name: 'Avocado', price: 1.75 },
                      { name: 'Onion Rings', price: 2.5 },
                    ].map((addon) => (
                      <Card 
                        key={addon.name} 
                        className="p-3 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleOptionChange('addon', addon.name)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{addon.name}</span>
                          <span className="text-primary">+${addon.price.toFixed(2)}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="sticky bottom-0 bg-background border-t py-4 -mx-4 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                  >
                    <span className="text-lg">-</span>
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                  >
                    <span className="text-lg">+</span>
                  </Button>
                </div>
                
                <Button
                  size="lg"
                  className="flex-1 max-w-md"
                  onClick={handleAddToCart}
                  disabled={!foodItem.is_available}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart • ${(foodItem.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Preparation Time</h3>
                  <p className="text-sm text-muted-foreground">10-15 minutes</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Delivery Time</h3>
                  <p className="text-sm text-muted-foreground">20-30 minutes</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Dietary Info</h3>
                  <p className="text-sm text-muted-foreground">
                    {foodItem.is_vegetarian ? 'Vegetarian' : 'Contains meat'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <Card className="p-4">
              <p className="text-muted-foreground">
                Beef patty, lettuce, tomato, onion, pickles, cheese, sesame seed bun, special sauce.
                Allergens: Gluten, Dairy. Prepared in a facility that processes nuts and soy.
              </p>
            </Card>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold">U{i}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">User {i}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>4.5</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        This burger is amazing! The meat is juicy and the toppings are fresh.
                        Will definitely order again.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        2 days ago
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}