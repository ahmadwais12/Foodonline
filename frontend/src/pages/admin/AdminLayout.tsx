import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Utensils, 
  ShoppingBag, 
  Users, 
  Truck, 
  Ticket, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.jpg';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ErrorBoundary from '@/components/ErrorBoundary';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Restaurants', href: '/admin/restaurants', icon: Store },
  { name: 'Menu Items', href: '/admin/menu', icon: Utensils },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Drivers', href: '/admin/drivers', icon: Truck },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Profile', href: '/admin/profile', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load collapse state from local storage
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('admin-sidebar-collapsed', String(newState));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-black">
      {/* Sidebar - Desktop */}
      <motion.div 
        animate={{ width: isCollapsed ? '88px' : '288px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-50"
      >
        <div className="flex flex-col flex-grow border-r bg-white dark:bg-[#0a0a0a] shadow-sm relative h-full">
          <div className="flex flex-col items-center justify-center h-32 px-6 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
                <img src={logo} alt="FoodDash Logo" className="w-8 h-8 rounded-lg" />
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <span className="text-2xl font-black tracking-tighter text-foreground block leading-none">
                    Admin
                  </span>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    Dashboard
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Collapse Toggle in Center under Logo */}
            <motion.div 
              className="mt-4"
              initial={false}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className="h-8 w-8 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar sidebar-scroll-container">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => 
                      `flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group relative ${
                        isActive 
                          ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`
                    }
                  >
                    <Icon className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 transition-transform group-hover:scale-110 shrink-0`} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-xl border border-white/10">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className={`p-6 border-t bg-muted/30 ${isCollapsed ? 'flex flex-col items-center px-4' : ''}`}>
            {!isCollapsed && (
              <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl shadow-sm border mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Status</span>
                </div>
                <p className="text-xs font-bold text-foreground">All systems operational</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start'} text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl font-bold transition-all`}
              onClick={handleLogout}
            >
              <LogOut className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        animate={{ paddingLeft: isCollapsed ? '88px' : '288px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex flex-col flex-1 w-full"
      >
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-6 md:px-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b">
          <div className="flex items-center md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-none">
                {/* Mobile Sidebar Content */}
                <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a]">
                  <div className="h-24 px-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <img src={logo} alt="Logo" className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black">FoodDash</span>
                  </div>
                  <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all ${
                              isActive ? 'bg-primary text-white' : 'text-muted-foreground'
                            }`
                          }
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </NavLink>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="hidden sm:flex items-center bg-muted/50 px-4 h-11 rounded-full border border-transparent hover:border-primary/20 transition-all cursor-pointer">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground font-medium">Quick search...</span>
              <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <Button variant="ghost" size="icon" className="rounded-full relative bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-black" />
            </Button>

            <div className="h-10 w-[1px] bg-muted mx-2 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-foreground leading-none mb-1">{user?.username || 'Admin User'}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Super Admin</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-[0.9rem] bg-white dark:bg-black flex items-center justify-center">
                  <span className="text-primary font-black text-lg">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white dark:from-[#0a0a0a] to-transparent pointer-events-none -z-10" />
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </motion.div>
    </div>
  );
}