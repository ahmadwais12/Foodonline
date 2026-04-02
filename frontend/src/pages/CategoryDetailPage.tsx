import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, DollarSign, Flame } from 'lucide-react';
import { imageService, FoodImage } from '@/services/image.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [category, setCategory] = useState<any>(null);
  const [foodItems, setFoodItems] = useState<FoodImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadCategoryData(slug);
    }
  }, [slug]);

  const loadCategoryData = async (categorySlug: string) => {
    try {
      setLoading(true);
      const data = await imageService.getCategoryBySlug(categorySlug);
      setCategory(data.category);
      setFoodItems(data.foodItems);
    } catch (error: any) {
      console.error('Error loading category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load category data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: FoodImage) => {
    // Create a minimal restaurant object
    const restaurant: any = {
      id: String(item.restaurant_id || 1),
      name: item.category,
      slug: item.category.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      image_url: item.image_url,
      cover_image_url: '',
      category_id: null,
      rating: 0,
      total_reviews: 0,
      delivery_time: item.preparation_time,
      delivery_fee: 2,
      min_order: 5,
      is_active: true,
      address: 'Kabul, Afghanistan',
      phone: ''
    };
    
    // Create menu item object
    const menuItem: any = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      category: item.category,
      is_vegetarian: false,
      is_available: true
    };
    
    addToCart(restaurant, menuItem, 1);
    
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart`,
    });
  };

  const getCategoryTitle = (categorySlug: string) => {
    const titles: Record<string, string> = {
      'favourite-foods': 'My Favourite Foods',
      'special-offers': 'Special Offers',
      'fast-foods': 'Fast Foods',
      'discounted-foods': 'Discounted Foods',
      'pizza': 'Pizza',
      'burgers': 'Burgers',
      'afghan-food': 'Afghan Food',
      'drinks': 'Drinks',
      'desserts': 'Desserts',
    };
    return titles[categorySlug] || 'Category';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!category && foodItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No items found</h1>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-primary/10 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 btn-grad-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              {getCategoryTitle(slug!)}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground mt-2 text-lg">{category.description}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="container mx-auto px-4 py-8">
        {foodItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No food items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {item.is_favorite && (
                        <Badge className="bg-red-500 hover:bg-red-600">
                          <Flame className="h-3 w-3 mr-1" />
                          Favorite
                        </Badge>
                      )}
                      {item.is_special && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                          Special
                        </Badge>
                      )}
                      {item.is_discounted && item.discount_percentage > 0 && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          -{item.discount_percentage}%
                        </Badge>
                      )}
                      {item.is_fast_food && (
                        <Badge className="bg-orange-500 hover:bg-orange-600">
                          Fast Food
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{item.preparation_time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Flame className="h-4 w-4" />
                        <span>{item.calories} cal</span>
                      </div>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="btn-grad-sm"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
