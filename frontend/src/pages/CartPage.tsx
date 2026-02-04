import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add items from restaurants to get started
          </p>
          <Button onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Restaurant Info */}
              {cart.restaurant && (
                <Card className="p-4 mb-6">
                  <h3 className="font-semibold mb-1">{cart.restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cart.restaurant.address}
                  </p>
                </Card>
              )}

              {/* Items */}
              {cart.items.map((item) => (
                <Card key={item.menuItem.id} className="p-4">
                  <div className="flex gap-4">
                    {item.menuItem.image_url && (
                      <img
                        src={item.menuItem.image_url}
                        alt={item.menuItem.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.menuItem.name}</h4>
                      {item.menuItem.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {item.menuItem.description}
                        </p>
                      )}
                      {item.special_instructions && (
                        <p className="text-sm text-muted-foreground italic">
                          Note: {item.special_instructions}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-lg">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.menuItem.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>${cart.delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${cart.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {cart.restaurant && cart.restaurant.min_order > cart.subtotal && (
                  <div className="mb-4 p-3 bg-warning/10 text-warning rounded-lg text-sm">
                    Minimum order amount: ${cart.restaurant.min_order.toFixed(2)}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cart.restaurant ? cart.subtotal < cart.restaurant.min_order : false}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
