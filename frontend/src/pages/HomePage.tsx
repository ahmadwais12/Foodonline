import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Star, 
  MapPin, 
  Filter, 
  Heart, 
  Zap, 
  Tag, 
  Timer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { Category, MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useLanguage } from '@/contexts/LanguageContext'; // Import the useLanguage hook
import logo from '@/assets/logo.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage(); // Use the translation hook
  const [categories, setCategories] = useState<Category[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<MenuItem[]>([]);
  const [specialOffers, setSpecialOffers] = useState<MenuItem[]>([]);
  const [fastFoods, setFastFoods] = useState<MenuItem[]>([]);
  const [discountedFoods, setDiscountedFoods] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [statistics, setStatistics] = useState({ totalOrders: 0, averageRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Hero slides data - using translations
  const heroSlides = [
    {
      title: t('delicious_food_title'),
      subtitle: t('delicious_food_subtitle'),
      image: logo
    },
    {
      title: t('craving_special_title'),
      subtitle: t('craving_special_subtitle'),
      image: logo
    },
    {
      title: t('fast_fresh_title'),
      subtitle: t('fast_fresh_subtitle'),
      image: logo
    }
  ];

  useEffect(() => {
    loadData();
    loadStatistics();
    // Auto-rotate hero slides
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [
        categoriesData, 
        favoriteFoodsData,
        specialOffersData,
        fastFoodsData,
        discountedFoodsData
      ] = await Promise.all([
        restaurantService.getCategories(),
        restaurantService.getPopularItems(),
        restaurantService.getSpecialOffers(),
        restaurantService.getFastFoodItems(),
        restaurantService.getDiscountedItems(),
      ]);
      
      setCategories(categoriesData);
      setFavoriteFoods(favoriteFoodsData.slice(0, 6));
      setSpecialOffers(specialOffersData.slice(0, 6));
      setFastFoods(fastFoodsData.slice(0, 6));
      setDiscountedFoods(discountedFoodsData.slice(0, 6));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await restaurantService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
  };

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentHeroSlide].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </motion.div>
        </AnimatePresence>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <motion.h1 
              key={`title-${currentHeroSlide}`}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {heroSlides[currentHeroSlide].title}
            </motion.h1>
            <motion.p 
              key={`subtitle-${currentHeroSlide}`}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {heroSlides[currentHeroSlide].subtitle}
            </motion.p>

            {/* Search Bar */}
            <motion.form 
              onSubmit={handleSearch} 
              className="max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex gap-2 bg-white rounded-full p-2 shadow-2xl">
                <Input
                  type="text"
                  placeholder={t('search_placeholder')}
                  className="flex-1 border-0 focus-visible:ring-0 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="rounded-full px-6 gradient-primary">
                  <Search className="h-5 w-5 mr-2" />
                  {t('search')}
                </Button>
              </div>
            </motion.form>

            {/* Statistics */}
            <motion.div 
              className="flex items-center justify-center space-x-8 mt-8 text-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="font-bold text-white">{statsLoading ? '...' : statistics.totalOrders.toLocaleString()}</span>
                <span className="text-white/90">{t('orders_delivered')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="font-bold text-white">{statsLoading ? '...' : statistics.averageRating}</span>
                <span className="text-white/90">{t('average_rating')}</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Slider Controls */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full"
              onClick={prevHeroSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full"
              onClick={nextHeroSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            {t('popular_categories')}
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden">
                <motion.div 
                  className="flex gap-4"
                  animate={{ x: -currentCategoryIndex * (150 + 16) }} // 150px width + 16px gap
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      className="group relative overflow-hidden rounded-2xl w-36 h-36 flex-shrink-0 card-hover"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      <img
                        src={category.image_url || 'https://via.placeholder.com/300'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 transition-all duration-300 group-hover:from-black/50">
                        <span className="text-white font-semibold text-lg transition-transform duration-300 group-hover:translate-y-[-5px]">{category.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
              
              {/* Navigation Arrows */}
              <button 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 z-10"
                onClick={() => setCurrentCategoryIndex(prev => Math.max(0, prev - 1))}
                disabled={currentCategoryIndex === 0}
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 z-10"
                onClick={() => setCurrentCategoryIndex(prev => Math.min(categories.length - 4, prev + 1))}
                disabled={currentCategoryIndex >= categories.length - 4}
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Favorite Foods */}
      <motion.section 
        className="py-16 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-3xl font-bold">{t('favorite_foods')}</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/favorites')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {favoriteFoods.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Special Offers */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <h2 className="text-3xl font-bold">{t('special_offers')}</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/special-offers')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {specialOffers.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Fast Foods */}
      <motion.section 
        className="py-16 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Timer className="h-6 w-6 text-blue-500" />
              <h2 className="text-3xl font-bold">{t('fast_foods')}</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/fast-food')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {fastFoods.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Discounted Foods */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-6 w-6 text-green-500" />
              <h2 className="text-3xl font-bold">{t('discounted_foods')}</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/discounts')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {discountedFoods.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            {t('why_choose_us')}
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center p-6 glass-effect rounded-2xl"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('fast_delivery')}</h3>
              <p className="text-muted-foreground">
                {t('fast_delivery_desc')}
              </p>
            </motion.div>
            <motion.div 
              className="text-center p-6 glass-effect rounded-2xl"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('top_restaurants')}</h3>
              <p className="text-muted-foreground">
                {t('top_restaurants_desc')}
              </p>
            </motion.div>
            <motion.div 
              className="text-center p-6 glass-effect rounded-2xl"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('real_time_tracking')}</h3>
              <p className="text-muted-foreground">
                {t('real_time_tracking_desc')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}