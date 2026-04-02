import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FoodItemCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-56" />

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        {/* Description */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />

        {/* Price and Controls */}
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-md" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function FoodItemCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <FoodItemCardSkeleton key={i} />
      ))}
    </div>
  );
}
