import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { Restaurant, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useLanguage } from '@/contexts/LanguageContext'; // Import the useLanguage hook

export default function RestaurantsPage() {
  const { t } = useLanguage(); // Use the translation hook
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<'rating' | 'delivery_time' | 'delivery_fee'>('rating');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [selectedCategory, sortBy, searchParams]);

  const loadCategories = async () => {
    try {
      const data = await restaurantService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      // Get search parameter correctly
      const searchParam = searchParams.get('search');
      
      const data = await restaurantService.getRestaurants({
        category: selectedCategory || undefined,
        ...(searchParam && { query: searchParam }), // Use 'query' instead of 'search'
        sortBy,
      });
      setRestaurants(data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('restaurants')}</h1>
          <p className="text-muted-foreground">
            {t('restaurants_discover')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('search_restaurants')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">{t('search')}</Button>
          </form>

          {/* Category & Sort */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('all_categories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('all_categories')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[200px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">{t('highest_rated')}</SelectItem>
                <SelectItem value="delivery_time">{t('fastest_delivery')}</SelectItem>
                <SelectItem value="delivery_fee">{t('lowest_delivery_fee')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t('no_restaurants_found')}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {t('restaurants_found', { count: restaurants.length })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}