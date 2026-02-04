import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Timer } from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function FastFoodPage() {
  const navigate = useNavigate();
  const [fastFoods, setFastFoods] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const fastFoodsData = await restaurantService.getFastFoodItems();
      setFastFoods(fastFoodsData);
    } catch (error) {
      console.error('Failed to load fast food data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedItems = [...fastFoods].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-700 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/10"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-white">
            Fast Foods
          </h1>
          <p className="text-white/80 mt-2">
            Quick and delicious meals ready in minutes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{fastFoods.length} Items Available</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : fastFoods.length === 0 ? (
          <div className="text-center py-12">
            <Timer className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No fast food items found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any fast food items at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {sortedItems.map((item) => (
              <FoodItemCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}