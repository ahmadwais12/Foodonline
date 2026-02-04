import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Leaf, Tag } from 'lucide-react';
import { MenuItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import defaultImage from '@/assets/logo.jpg';

interface FoodItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
}

export default function FoodItemCard({ item, onAddToCart }: FoodItemCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity);
    } else {
      // Use the cart context if no custom handler is provided
      // Note: This requires knowing the restaurant, which we don't have here
      // In a real implementation, you'd need to pass the restaurant as well
    }
    setQuantity(1);
  };

  // Check if this is a discounted item (simplified check)
  const isDiscounted = item.price > 10; // Just for demo purposes

  return (
    <Card className="flex flex-col h-full overflow-hidden card-hover group transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div 
        className="relative cursor-pointer overflow-hidden"
        onClick={() => navigate(`/food/${item.id}`)}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 brightness-100 group-hover:brightness-110"
          />
        ) : (
          <img
            src={defaultImage}
            alt={item.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 brightness-100 group-hover:brightness-110"
          />
        )}
        
        {/* Discount badge */}
        {isDiscounted && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            SALE
          </div>
        )}
        
        {/* Vegetarian badge */}
        {item.is_vegetarian && (
          <div className="absolute top-2 left-2 bg-success text-success-foreground text-xs font-bold px-2 py-1 rounded-full">
            <Leaf className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 transition-all duration-300 group-hover:bg-muted/50 rounded-b-lg">
        <div 
          className="flex-1 cursor-pointer transition-all duration-300 group-hover:translate-x-1"
          onClick={() => navigate(`/food/${item.id}`)}
        >
          <h4 className="font-semibold line-clamp-1 transition-colors duration-300 group-hover:text-primary">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 transition-all duration-300 group-hover:text-foreground">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 transition-all duration-300 group-hover:translate-y-[-2px]">
          <span 
            className="font-semibold text-primary cursor-pointer transition-all duration-300 group-hover:scale-105"
            onClick={() => navigate(`/food/${item.id}`)}
          >
            ${item.price.toFixed(2)}
            {isDiscounted && (
              <span className="line-through text-muted-foreground text-sm ml-1 transition-all duration-300 group-hover:text-foreground">
                ${(item.price + 2).toFixed(2)}
              </span>
            )}
          </span>
          
          {/* Add to cart controls */}
          <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1 transition-all duration-300 group-hover:bg-primary/10">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                onClick={handleDecrement}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium transition-all duration-300 group-hover:font-bold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                onClick={handleIncrement}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!item.is_available}
              className="h-8 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}