import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { UserProvider } from './contexts/UserContext';
import { AdminProvider } from './contexts/AdminContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';

import { useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserOrdersPage from './pages/UserOrdersPage';
import UserOrderDetailPage from './pages/UserOrderDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import UserDashboard from './pages/UserDashboard';
import UserFavoritesPage from './pages/UserFavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserNotificationsPage from './pages/UserNotificationsPage';
import UserSavedAddressesPage from './pages/UserSavedAddressesPage';
import UserPaymentMethodsPage from './pages/UserPaymentMethodsPage';
import SearchPage from './pages/SearchPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import CategoryFoodsPage from './pages/CategoryFoodsPage';
import FastFoodPage from './pages/FastFoodPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminDriversPage from './pages/admin/AdminDriversPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Driver Pages
import DriverLayout from './pages/driver/DriverLayout';
import NewOrdersPage from './pages/driver/NewOrdersPage';
import ActiveDeliveryPage from './pages/driver/ActiveDeliveryPage';
import DeliveryHistoryPage from './pages/driver/DeliveryHistoryPage';
import EarningsPage from './pages/driver/EarningsPage';

// Layout
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Root Redirect Component
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <HomePage />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <OrderProvider>
            <CartProvider>
              <AdminProvider>
                <LanguageProvider>
                  <div dir={document.documentElement.dir} lang={document.documentElement.lang}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      {/* Main app routes */}
                      <Route element={<ErrorBoundary><MainLayout /></ErrorBoundary>}>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/restaurants" element={<RestaurantsPage />} />
                        <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/food/:foodId" element={<FoodDetailPage />} />
                        <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
                        {/* Category Foods Pages */}
                        <Route path="/category/favorite-foods" element={<CategoryFoodsPage />} />
                        <Route path="/category/special-offers" element={<CategoryFoodsPage />} />
                        <Route path="/category/fast-food" element={<CategoryFoodsPage />} />
                        <Route path="/category/discounted" element={<CategoryFoodsPage />} />
                        <Route path="/fast-food" element={<FastFoodPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        
                        {/* Protected routes */}
                        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                        <Route path="/user/orders" element={<ProtectedRoute><UserOrdersPage /></ProtectedRoute>} />
                        <Route path="/user/order/:orderId" element={<ProtectedRoute><UserOrderDetailPage /></ProtectedRoute>} />
                        <Route path="/user/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                        <Route path="/user/favorites" element={<ProtectedRoute><UserFavoritesPage /></ProtectedRoute>} />
                        <Route path="/user/notifications" element={<ProtectedRoute><UserNotificationsPage /></ProtectedRoute>} />
                        <Route path="/user/addresses" element={<ProtectedRoute><UserSavedAddressesPage /></ProtectedRoute>} />
                        <Route path="/user/payment-methods" element={<ProtectedRoute><UserPaymentMethodsPage /></ProtectedRoute>} />
                      </Route>

                    {/* Admin routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboardPage />} />
                      <Route path="restaurants" element={<AdminRestaurantsPage />} />
                      <Route path="menu" element={<AdminMenuPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="drivers" element={<AdminDriversPage />} />
                      <Route path="users" element={<AdminUsersPage />} />
                      <Route path="payments" element={<AdminPaymentsPage />} />
                      <Route path="coupons" element={<AdminCouponsPage />} />
                      <Route path="reports" element={<AdminReportsPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                      <Route path="profile" element={<AdminProfilePage />} />
                    </Route>

                    {/* Driver routes */}
                    <Route path="/driver" element={<DriverLayout />}>
                      <Route index element={<NewOrdersPage />} />
                      <Route path="active" element={<ActiveDeliveryPage />} />
                      <Route path="history" element={<DeliveryHistoryPage />} />
                      <Route path="earnings" element={<EarningsPage />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Toaster />
                </div>
              </LanguageProvider>
            </AdminProvider>
          </CartProvider>
        </OrderProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);
}

export default App;