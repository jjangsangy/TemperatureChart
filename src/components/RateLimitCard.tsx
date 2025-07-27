import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface RateLimitCardProps {
  message?: string;
}

export function RateLimitCard({ message }: RateLimitCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-red-500 flex items-center justify-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          API Limit Exceeded
        </CardTitle>
        <CardDescription>This application is provided for free.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {message ||
            "You've made too many requests. Please ensure you don't exceed 10,000 API calls per day, 5,000 per hour, or 600 per minute."}
        </p>
      </CardContent>
    </Card>
  );
}
