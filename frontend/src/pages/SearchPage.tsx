import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { Restaurant, MenuItem, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SearchPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'delivery_time' | 'delivery_fee'>('rating');
  const [foodSortBy, setFoodSortBy] = useState<'price' | 'name'>('name');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'foods'>('restaurants');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
    if (searchQuery) {
      performSearch();
    } else {
      setRestaurants([]);
      setFoodItems([]);
      setLoading(false);
    }
  }, []);

  const loadCategories = async () => {
    try {
      const data = await restaurantService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const debouncedSearch = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await restaurantService.searchMenuItems(query);
        setSearchSuggestions(results.slice(0, 5));
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const restaurantResults = await restaurantService.searchRestaurants({ query: searchQuery });
      setRestaurants(restaurantResults);
      
      const foodResults = await restaurantService.searchMenuItems(searchQuery);
      setFoodItems(foodResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch();
    }
  };

  const handleSuggestionClick = (itemName: string) => {
    setSearchQuery(itemName);
    setShowSuggestions(false);
    setSearchParams({ q: itemName });
    performSearch();
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSortBy('rating');
    setFoodSortBy('name');
  };

  const filteredRestaurants = selectedCategory 
    ? restaurants.filter(r => r.category_id === selectedCategory)
    : restaurants;

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'delivery_time') {
      const aTime = parseInt(a.delivery_time || '30');
      const bTime = parseInt(b.delivery_time || '30');
      return aTime - bTime;
    }
    return a.delivery_fee - b.delivery_fee;
  });

  const filteredFoodItems = selectedCategory 
    ? foodItems.filter(item => item.category === selectedCategory)
    : foodItems;

  const sortedFoodItems = [...filteredFoodItems].sort((a, b) => {
    if (foodSortBy === 'price') {
      return a.price - b.price;
    }
    return a.name.localeCompare(b.name);
  });

  // Simple food item card for search results
  const FoodItemCard = ({ item }: { item: MenuItem }) => {
    return (
      <Card className="flex gap-4 p-4 card-hover">
        {item.image_url && (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold line-clamp-1">{item.name}</h4>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
              )}
            </div>
            <span className="font-semibold text-primary flex-shrink-0">
              ${item.price.toFixed(2)}
            </span>
          </div>
          
          <Button
            size="sm"
            onClick={() => {
              // Navigate to the restaurant page instead of adding to cart directly
              navigate(`/restaurant/${item.restaurant_id}`);
            }}
            className="mt-2"
          >
            {t('view_restaurant')}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6">{t('search_results')}</h1>
        
        <Card className="mb-6 glass-effect border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1" ref={searchContainerRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('search_placeholder')}
                  className="pl-10 py-6 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    debouncedSearch(query);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim() !== '' && searchSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-xl z-50 overflow-hidden">
                    {searchSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                        onClick={() => handleSuggestionClick(item.name)}
                      >
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="px-8 rounded-xl gradient-primary">
                {t('search')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(selectedCategory || sortBy !== 'rating' || foodSortBy !== 'name') && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">{t('filters')}:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 rounded-full">
                {categories.find(c => c.id === selectedCategory)?.name || 'Category'}
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {sortBy !== 'rating' && (
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 rounded-full">
                {t('sorted_by')} {sortBy.replace('_', ' ')}
                <button 
                  onClick={() => setSortBy('rating')}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-6 px-2 text-xs rounded-full hover:bg-primary/10"
            >
              {t('clear_all')}
            </Button>
          </div>
        )}

        {searchQuery && (
          <div className="flex gap-4 mb-6 border-b">
            <button
              className={`pb-3 px-1 font-medium relative ${activeTab === 'restaurants' ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('restaurants')}
            >
              {t('restaurants')}
              {activeTab === 'restaurants' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="tabIndicator"
                />
              )}
            </button>
            <button
              className={`pb-3 px-1 font-medium relative ${activeTab === 'foods' ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('foods')}
            >
              {t('foods')}
              {activeTab === 'foods' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : searchQuery ? (
          <>
            {activeTab === 'restaurants' ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('restaurants_found', { count: sortedRestaurants.length })}
                </p>
                {sortedRestaurants.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{t('no_restaurants_found')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedRestaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('foods_found', { count: sortedFoodItems.length })}
                </p>
                {sortedFoodItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">{t('no_foods_found')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedFoodItems.map((item) => (
                      <FoodItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('search_prompt')}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}