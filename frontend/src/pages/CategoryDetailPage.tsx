import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter } from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { MenuItem, Category } from '@/types';
import { Button } from '@/components/ui/button';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch category details
      if (categoryId) {
        // Try to find category by ID first
        try {
          const categoryData = await restaurantService.getCategoryById(categoryId);
          setCategory(categoryData);
        } catch (error) {
          // If not found by ID, try to find by name/slug
          const allCategories = await restaurantService.getCategories();
          const foundCategory = allCategories.find(cat => 
            cat.id === categoryId || 
            cat.name.toLowerCase().replace(/\s+/g, '-') === categoryId ||
            cat.slug === categoryId
          );
          
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            // Set a default category if not found
            setCategory({
              id: categoryId || '',
              name: categoryId?.replace('-', ' ') || 'Category',
              slug: categoryId || '',
              image_url: '',
              display_order: 0,
              created_at: new Date().toISOString()
            });
          }
        }
      }

      const itemsData = await restaurantService.getMenuItemsByCategory(categoryId || '');
      setItems(itemsData);
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white capitalize">
            {category?.name || categoryId}
          </h1>
          <p className="text-white/80 mt-2">
            {items.length} items available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Menu Items</h2>
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
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found in this category.</p>
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