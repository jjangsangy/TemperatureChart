import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarOff } from 'lucide-react';

interface DateRangeErrorCardProps {
  message?: string;
}

export function DateRangeErrorCard({ message }: DateRangeErrorCardProps) {
  return (
    <Card className="w-full mx-auto animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="text-red-500">Date Out of Range</CardTitle>
        <CardDescription>The selected date is outside the available data range.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-64">
        <CalendarOff className="w-24 h-24 text-red-500 mb-4" />
        <p className="text-muted-foreground text-center">
          {message || 'Please select a date within the last 90 days or up to 16 days in the future.'}
        </p>
      </CardContent>
    </Card>
  );
}
