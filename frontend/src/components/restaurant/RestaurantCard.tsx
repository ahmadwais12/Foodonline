import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Star } from 'lucide-react';
import { Restaurant } from '@/types';
import { Card } from '@/components/ui/card';
import defaultImage from '@/assets/logo.jpg';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="overflow-hidden cursor-pointer card-hover group relative"
        onClick={() => navigate(`/restaurant/${restaurant.slug}`)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image_url || defaultImage}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!restaurant.is_active && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold">Currently Closed</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
            {restaurant.category?.name || 'Food'}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg line-clamp-1">{restaurant.name}</h3>
            {/* {restaurant.is_promoted && (
              <span className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded">
                Promoted
              </span>
            )} */}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {restaurant.description || 'Delicious food awaits'}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-warning">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({restaurant.total_reviews})</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{restaurant.delivery_time || '30-40 min'}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${restaurant.delivery_fee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {restaurant.min_order > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Min. order: ${restaurant.min_order.toFixed(2)}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}