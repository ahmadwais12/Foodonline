// Core domain types
export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  rating: number;
  total_reviews: number;
  delivery_time: string | null;
  delivery_fee: number;
  min_order: number;
  is_active: boolean;
  address: string | null;
  phone: string | null;
  opening_hours: Record<string, string> | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_vegetarian: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  delivery_address: DeliveryAddress;
  delivery_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  created_at: string;
  confirmed_at: string | null;
  preparing_at: string | null;
  ready_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  estimated_delivery_time: string | null;
  restaurant?: Restaurant;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  item_price: number;
  quantity: number;
  special_instructions: string | null;
  created_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
    username: string;
    avatar?: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  valid_from: string;
  valid_until: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

// Type unions
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

// Cart types
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export interface Cart {
  restaurant: Restaurant | null;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
}

// Address type for orders
export interface DeliveryAddress {
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role?: string;
}

export interface UserProfile extends AuthUser {
  created_at?: string;
}

// Filter types
export interface RestaurantFilters {
  category?: string;
  search?: string;
  minRating?: number;
  sortBy?: 'rating' | 'delivery_time' | 'delivery_fee';
}
