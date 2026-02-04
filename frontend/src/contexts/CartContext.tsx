import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Cart, CartItem, MenuItem, Restaurant } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart;
  addToCart: (restaurant: Restaurant, item: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'fooddash_cart';

function calculateCart(restaurant: Restaurant | null, items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const delivery_fee = restaurant?.delivery_fee || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + delivery_fee + tax;

  return {
    restaurant,
    items,
    subtotal,
    delivery_fee,
    tax,
    total,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const { restaurant: storedRestaurant, items: storedItems } = JSON.parse(stored);
        setRestaurant(storedRestaurant);
        setItems(storedItems);
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (restaurant || items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ restaurant, items }));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [restaurant, items]);

  const addToCart = (
    newRestaurant: Restaurant,
    item: MenuItem,
    quantity: number = 1,
    instructions?: string
  ) => {
    // Check if switching restaurants
    if (restaurant && restaurant.id !== newRestaurant.id) {
      if (!confirm('Your cart contains items from another restaurant. Clear cart and add this item?')) {
        return;
      }
      setItems([]);
    }

    setRestaurant(newRestaurant);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.id === item.id);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          special_instructions: instructions,
        };
        toast({
          title: 'Cart updated',
          description: `${item.name} quantity updated`,
        });
        return updated;
      } else {
        toast({
          title: 'Added to cart',
          description: `${item.name} added to your cart`,
        });
        return [...prev, { menuItem: item, quantity, special_instructions: instructions }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.menuItem.id !== itemId);
      if (updated.length === 0) {
        setRestaurant(null);
      }
      return updated;
    });
    toast({
      title: 'Item removed',
      description: 'Item removed from cart',
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setRestaurant(null);
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast({
      title: 'Cart cleared',
      description: 'All items removed from cart',
    });
  };

  const cart = calculateCart(restaurant, items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
