import { useState } from 'react';
import { Plus, Minus, Leaf } from 'lucide-react';
import { MenuItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <Card className="flex gap-4 p-4 card-hover">
      {/* Image */}
      {item.image_url && (
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold line-clamp-1">{item.name}</h4>
              {item.is_vegetarian && (
                <Leaf className="h-4 w-4 text-success flex-shrink-0" title="Vegetarian" />
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
            )}
          </div>
          <span className="font-semibold text-primary flex-shrink-0">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Add to cart controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!item.is_available}
            className="flex-1"
          >
            {item.is_available ? 'Add to Cart' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
