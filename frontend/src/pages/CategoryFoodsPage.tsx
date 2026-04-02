import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Utensils, Zap, Heart, Tag, Timer } from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import { FoodItemCardSkeletonGrid } from '@/components/restaurant/FoodItemCardSkeleton';
import { useToast } from '@/hooks/use-toast';

export default function CategoryFoodsPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Category configuration
  const categoryConfig: Record<string, { title: string; icon: any; description: string }> = {
    'favorite-foods': {
      title: 'Favorite Foods',
      icon: Heart,
      description: 'Most popular dishes loved by our customers'
    },
    'special-offers': {
      title: 'Special Offers',
      icon: Zap,
      description: 'Premium dishes at special prices'
    },
    'fast-food': {
      title: 'Fast Food',
      icon: Timer,
      description: 'Quick and delicious meals ready in minutes'
    },
    'discounted': {
      title: 'Discounted Foods',
      icon: Tag,
      description: 'Great food at amazing prices'
    }
  };

  const currentCategory = category ? categoryConfig[category] : null;

  useEffect(() => {
    loadCategoryData();
  }, [category]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      let data: MenuItem[];

      switch(category) {
        case 'favorite-foods':
          data = await restaurantService.getFavoriteFoods('user-id');
          break;
        case 'special-offers':
          data = await restaurantService.getSpecialOffers();
          break;
        case 'fast-food':
          data = await restaurantService.getFastFoodItems();
          break;
        case 'discounted':
          data = await restaurantService.getDiscountedItems();
          break;
        default:
          data = [];
          toast({
            title: 'Invalid Category',
            description: 'The requested category does not exist',
            variant: 'destructive',
          });
      }

      setItems(data);
      
      if (data.length === 0) {
        toast({
          title: 'No Items Found',
          description: 'This category currently has no items available',
        });
      }
    } catch (error: any) {
      console.error('Failed to load category data:', error);
      setItems([]);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const Icon = currentCategory?.icon || Utensils;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 bg-white/20 hover:bg-white/30 text-white border border-white/50 backdrop-blur-sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            {/* Category Title */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="p-4 bg-white rounded-full shadow-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Icon className="h-12 w-12 text-orange-600" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {currentCategory?.title || 'Category'}
                </h1>
                <p className="text-white/90 text-lg">
                  {currentCategory?.description || 'Delicious food delivered fast'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <FoodItemCardSkeletonGrid count={12} />
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Utensils className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Items Found</h3>
              <p className="text-muted-foreground mb-6">
                This category doesn't have any items yet
              </p>
              <Button onClick={() => navigate('/')} className="btn-grad">
                Browse Other Categories
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-primary">{items.length}</span> items
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <FoodItemCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
