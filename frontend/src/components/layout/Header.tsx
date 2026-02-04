import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Receipt, LogOut, Menu, Search, MapPin, Languages, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.jpg';
import { restaurantService } from '@/services/restaurant.service';
import { MenuItem } from '@/types';

export default function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<MenuItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState({ totalOrders: 0, averageRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await restaurantService.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);

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
        setSearchSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setMobileOpen(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSuggestionClick = (itemName: string) => {
    setSearchQuery(itemName);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(itemName)}`);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '' && searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const NavLinks = () => (
    <>
      {user && (
        <>
          <Link 
            to="/orders" 
            className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium relative group"
          >
            {t('orders')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/favorites" 
            className="text-foreground/80 hover:text-foreground transition-all duration-300 font-medium relative group"
          >
            {t('favorites')}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md py-2' 
        : 'border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/40 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="FoodDash Logo" className="w-8 h-8 rounded-lg" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                FoodDash
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder={t('search_placeholder')}
                  className="pl-10 w-full rounded-full shadow-lg"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchFocus}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-xl z-50 overflow-hidden"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Location Selector - Desktop */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Kabul, Afghanistan</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search Icon - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => navigate('/search')}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                  <Languages className="h-4 w-4" />
                  <span>{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ps')}>پښتو</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fa')}>فارسی</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />
              {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* User Actions */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.username}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <Receipt className="mr-2 h-4 w-4" />
                      <span>{t('orders')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t('favorites')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/addresses" className="cursor-pointer">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{t('addresses')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/payment-methods" className="cursor-pointer">
                      <span>{t('payment_methods')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="cursor-pointer">
                      <span>{t('notifications')}</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <span>{t('admin_panel')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} className="hidden md:flex">
                {t('sign_in')}
              </Button>
            )}
           
            
          

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <Link 
                        to="/" 
                        className="flex items-center space-x-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          <img src={logo} alt="FoodDash Logo" className="w-6 h-6 rounded-md" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                          FoodDash
                        </span>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-2xl">×</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Location Selector - Mobile */}
                  <div className="p-4 border-b flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Kabul, Afghanistan</span>
                  </div>
                  
                  {/* Search Bar - Mobile Menu */}
                  <div className="p-4 border-b">
                    <form onSubmit={handleSearch} className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-pulse" />
                        <Input
                          type="search"
                          placeholder={t('search_placeholder')}
                          className="pl-10 w-full rounded-full shadow-lg"
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          onFocus={handleSearchFocus}
                        />
                        {isLoading && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {showSuggestions && searchSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 bg-background border rounded-lg shadow-xl z-50 overflow-hidden"
                          >
                            {searchSuggestions.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                                onClick={() => {
                                  handleSuggestionClick(item.name);
                                  setMobileOpen(false);
                                }}
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                    
                    <NavLinks />
                  </div>
                  
                  {/* Navigation Menu */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <nav className="space-y-2">
                      {user ? (
                        <>
                          <Link
                            to="/profile"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('profile')}
                          </Link>
                          <Link
                            to="/orders"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('orders')}
                          </Link>
                          <Link
                            to="/favorites"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('favorites')}
                          </Link>
                          <Link
                            to="/addresses"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('addresses')}
                          </Link>
                          <Link
                            to="/payment-methods"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('payment_methods')}
                          </Link>
                          <Link
                            to="/notifications"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('notifications')}
                          </Link>
                          <Link
                            to="/settings"
                            className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t('settings')}
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="text-lg font-medium py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {t('admin_panel')}
                            </Link>
                          )}
                        </>
                      ) : (
                        <Button 
                          onClick={() => {
                            navigate('/login');
                            setMobileOpen(false);
                          }} 
                          className="w-full gradient-primary"
                        >
                          {t('sign_in')}
                        </Button>
                      )}
                    </nav>
                  </div>
                  
                  {/* Language Selector - Mobile */}
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('language')}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Languages className="h-4 w-4 mr-1" />
                            {language.toUpperCase()}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLanguage('ps')}>پښتو</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLanguage('fa')}>فارسی</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-4 border-t">
                    {!user ? (
                      <Button 
                        onClick={() => {
                          navigate('/login');
                          setMobileOpen(false);
                        }} 
                        className="w-full gradient-primary"
                      >
                        {t('sign_in')}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }} 
                        variant="outline" 
                        className="w-full"
                      >
                        {t('logout')}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}