import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TriangleAlert } from 'lucide-react';

export function GenericErrorCard() {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center justify-center gap-2">
          <TriangleAlert className="h-6 w-6" />
          Error Fetching Data
        </CardTitle>
        <CardDescription>There was an issue retrieving weather data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Please check your internet connection and try again. If the problem persists, the service might be temporarily
          unavailable.
        </p>
      </CardContent>
    </Card>
  );
}
