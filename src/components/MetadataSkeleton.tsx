import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming a Skeleton component exists or will be created

export function MetadataSkeleton() {
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Daily Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-[120px] sm:h-[120px] lg:h-[90px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
