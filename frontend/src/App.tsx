import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { UserProvider } from './contexts/UserContext';
import { AdminProvider } from './contexts/AdminContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotificationsPage from './pages/NotificationsPage';
import SavedAddressesPage from './pages/SavedAddressesPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import SearchPage from './pages/SearchPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import FastFoodPage from './pages/FastFoodPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminRestaurantsPage from './pages/admin/RestaurantsPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminMenuPage from './pages/admin/MenuPage';
import AdminPaymentsPage from './pages/admin/PaymentsPage';
import AdminCouponsPage from './pages/admin/CouponsPage';
import AdminReportsPage from './pages/admin/ReportsPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

// Driver Pages
import DriverLayout from './pages/driver/DriverLayout';
import NewOrdersPage from './pages/driver/NewOrdersPage';
import ActiveDeliveryPage from './pages/driver/ActiveDeliveryPage';
import DeliveryHistoryPage from './pages/driver/DeliveryHistoryPage';
import EarningsPage from './pages/driver/EarningsPage';

// Layout
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
                      <Route element={<MainLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/restaurants" element={<RestaurantsPage />} />
                      <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/food/:foodId" element={<FoodDetailPage />} />
                      <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
                      <Route path="/fast-food" element={<FastFoodPage />} />
                      
                      {/* Protected routes */}
                      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                      <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                      <Route path="/addresses" element={<ProtectedRoute><SavedAddressesPage /></ProtectedRoute>} />
                      <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
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
                      <Route index element={<DashboardPage />} />
                      <Route path="restaurants" element={<AdminRestaurantsPage />} />
                      <Route path="menu" element={<AdminMenuPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="users" element={<AdminUsersPage />} />
                      <Route path="payments" element={<AdminPaymentsPage />} />
                      <Route path="coupons" element={<AdminCouponsPage />} />
                      <Route path="reports" element={<AdminReportsPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
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