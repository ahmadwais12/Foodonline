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
  ChevronRight,
  Sparkles,
  Flame,
  Award, 
  Truck, 
  Shield, 
  ThumbsUp,
  UtensilsCrossed,
  ChefHat,
  Bike,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';
import { Category, MenuItem, Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FoodItemCard from '@/components/restaurant/FoodItemCard';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { FoodItemCardSkeleton, FoodItemCardSkeletonGrid } from '@/components/restaurant/FoodItemCardSkeleton';
import { RestaurantCardSkeletonGrid } from '@/components/restaurant/RestaurantCardSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Import background images - using public folder paths
const bgImage1 = '/assets/backgroundimage.jpg';
const bgImage2 = '/assets/backgroundimage1.jpg';
const bgImage3 = '/assets/backgroundimage2.jpg';
import logo from '/assets/logo.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage(); // Use the translation hook
  const [categories, setCategories] = useState<Category[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<MenuItem[]>([]);
  const [specialOffers, setSpecialOffers] = useState<MenuItem[]>([]);
  const [fastFoods, setFastFoods] = useState<MenuItem[]>([]);
  const [discountedFoods, setDiscountedFoods] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [statistics, setStatistics] = useState({ totalOrders: 0, averageRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Hero slides data - using actual background images
  const heroSlides = [
    {
      title: t('delicious_food_title'),
      subtitle: t('delicious_food_subtitle'),
      image: bgImage1,
      overlay: 'from-transparent via-transparent to-transparent'
    },
    {
      title: t('craving_special_title'),
      subtitle: t('craving_special_subtitle'),
      image: bgImage2,
      overlay: 'from-transparent via-transparent to-transparent'
    },
    {
      title: t('fast_fresh_title'),
      subtitle: t('fast_fresh_subtitle'),
      image: bgImage3,
      overlay: 'from-transparent via-transparent to-transparent'
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
        discountedFoodsData,
        restaurantsData
      ] = await Promise.all([
        restaurantService.getCategories(),
        restaurantService.getPopularItems(),
        restaurantService.getSpecialOffers(),
        restaurantService.getFastFoodItems(),
        restaurantService.getDiscountedItems(),
        restaurantService.getRestaurants()
      ]);
      
      setCategories(categoriesData);
      setFavoriteFoods(favoriteFoodsData.slice(0, 6));
      setSpecialOffers(specialOffersData.slice(0, 6));
      setFastFoods(fastFoodsData.slice(0, 6));
      setDiscountedFoods(discountedFoodsData.slice(0, 6));
      setRestaurants(restaurantsData.slice(0, 6));
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.4
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image Slider */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Image - Clear visibility */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroSlides[currentHeroSlide].image})` }}
            />
            
            {/* Gradient Overlay - Removed (transparent) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentHeroSlide].overlay}`} />
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
              <div className="flex gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 shadow-2xl">
                <Input
                  type="text"
                  placeholder={t('search_placeholder')}
                  className="flex-1 border-0 focus-visible:ring-0 text-base bg-transparent text-white placeholder:text-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="rounded-full px-6 gradient-primary text-white shadow-xl hover:scale-105 transition-transform">
                  <Search className="h-5 w-5 mr-2" />
                  {t('search')}
                </Button>
              </div>
            </motion.form>

            {/* Statistics */}
            <motion.div 
              className="flex flex-wrap gap-4 mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 hover:bg-white/30 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 bg-white/30 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white text-lg">{statsLoading ? '...' : statistics.totalOrders.toLocaleString()}</span>
                  <span className="text-white/90 ml-2 text-sm">{t('orders_delivered')}</span>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 hover:bg-white/30 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 bg-white/30 rounded-full">
                  <Star className="h-5 w-5 text-yellow-300 fill-current animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-white text-lg">{statsLoading ? '...' : statistics.averageRating}</span>
                  <span className="text-white/90 ml-2 text-sm">{t('average_rating')}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Slider Controls - Simplified */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3">
            {/* Navigation Arrows */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: -15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 transition-all shadow-lg"
                onClick={prevHeroSlide}
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Button>
            </motion.div>

            {/* Slider Indicators */}
            <div className="flex gap-3">
              {heroSlides.map((_, index) => (
                <motion.button
                  key={index}
                  className={`h-3 rounded-full transition-all ${
                    currentHeroSlide === index 
                      ? 'w-8 bg-white' 
                      : 'w-3 bg-white/50'
                  }`}
                  onClick={() => setCurrentHeroSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white/30 transition-all shadow-lg"
                onClick={nextHeroSlide}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4 shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Filter className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {t('popular_categories')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our diverse selection of delicious categories
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex gap-4 overflow-hidden py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36 h-36">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('no_categories_found')}</p>
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

      {/* Featured Restaurants */}
      <motion.section 
        id="restaurants-section"
        className="py-16 bg-white dark:bg-gray-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">{t('restaurants')}</h2>
            </div>
            <Button variant="outline" className="btn-grad-sm" onClick={() => navigate('/restaurants')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <RestaurantCardSkeletonGrid count={6} />
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {restaurants.map((restaurant) => (
                <motion.div key={restaurant.id} variants={itemVariants}>
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Special Offers */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-950"
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
            <Button variant="outline" className="btn-grad-sm" onClick={() => navigate('/category/special-offers')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <FoodItemCardSkeletonGrid count={6} />
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

      {/* Favorite Foods */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full shadow-lg"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="h-8 w-8 text-red-500 fill-red-500 animate-pulse" />
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                {t('favorite_foods')}
              </h2>
            </motion.div>
            <Button variant="outline" className="btn-grad-sm shadow-lg hover:shadow-xl transition-all" onClick={() => navigate('/category/favorite-foods')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <FoodItemCardSkeletonGrid count={6} />
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

      {/* Fast Foods */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-950"
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
            <Button variant="outline" className="btn-grad-sm" onClick={() => navigate('/category/fast-food')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <FoodItemCardSkeletonGrid count={6} />
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
        className="py-16 bg-white dark:bg-gray-950"
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
            <Button variant="outline" className="btn-grad-sm" onClick={() => navigate('/category/discounted')}>
              {t('view_all')}
            </Button>
          </motion.div>

          {loading ? (
            <FoodItemCardSkeletonGrid count={6} />
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

      {/* Why Choose Us & Services Combined */}
      <motion.section 
        id="services-section"
        className="py-20 bg-white dark:bg-gray-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4 shadow-xl"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Award className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {t('why_choose_us')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a perfect food delivery experience
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Bike,
                title: 'Express Delivery',
                desc: 'Get your food delivered in under 30 minutes with our network of dedicated delivery partners.',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-100 dark:bg-blue-900/30'
              },
              {
                icon: UtensilsCrossed,
                title: 'Top Restaurants',
                desc: 'We partner with the best local and international restaurants to bring you a wide variety of cuisines.',
                color: 'from-orange-500 to-yellow-500',
                bgColor: 'bg-orange-100 dark:bg-orange-900/30'
              },
              {
                icon: ShieldCheck,
                title: 'Secure Payments',
                desc: 'Your transactions are always safe with our PCI-compliant payment processing system.',
                color: 'from-green-500 to-emerald-500',
                bgColor: 'bg-green-100 dark:bg-green-900/30'
              },
              {
                icon: Smartphone,
                title: 'Mobile App',
                desc: 'Order on the go with our easy-to-use mobile app available for iOS and Android.',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-100 dark:bg-purple-900/30'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl p-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all h-full"
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.03 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                    >
                      <Icon className={`h-10 w-10 ${feature.color.replace('from-', 'text-').split(' ')[0]}`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-center mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about-section" className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                About Foodonline
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Foodonline was born from a simple idea: everyone deserves access to great food, no matter where they are. 
                What started as a small delivery service in Kabul has grown into Afghanistan's leading food delivery platform.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Today, we partner with over 500 restaurants across 15+ cities, delivering millions of meals every year. 
                But our mission remains the same – to bring people together through the love of food.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  <span className="font-semibold">#1 Food App</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl gradient-primary p-1">
                <img 
                  src={logo} 
                  alt="Our Story" 
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
