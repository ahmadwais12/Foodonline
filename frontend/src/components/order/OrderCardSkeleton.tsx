import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function OrderCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>

      <Skeleton className="h-4 w-3/4" />
    </Card>
  );
}

export function OrderCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}
