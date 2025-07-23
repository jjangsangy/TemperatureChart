"use client";

import { useState, useEffect } from 'react';
import { getWeatherDataByZip, ForecastData } from '@/lib/weather';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TemperatureChart } from '@/components/temperature-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ThermometerSun } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
      setError(null); // Reset error after showing toast
    }
  }, [error, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setData(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const zipCode = formData.get('zipcode') as string;

    try {
      const weatherData = await getWeatherDataByZip(zipCode);
      setData(weatherData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background font-body">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="z-10 w-full max-w-7xl items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-foreground/90">
          TemperatureChart
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Enter a US zip code to see the 24-hour temperature forecast.
        </p>

        <form onSubmit={handleSubmit} className="flex w-full max-w-sm mx-auto items-center space-x-2 mb-12">
          <Input 
            type="text" 
            name="zipcode" 
            placeholder="Enter 5-digit zip code" 
            required 
            pattern="\d{5}"
            maxLength={5}
            className="text-base"
          />
          <Button type="submit" disabled={loading} className="font-semibold">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Get Weather
          </Button>
        </form>

        <div className="w-full">
          {loading && (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-24 h-24 text-primary animate-spin" />
              </CardContent>
            </Card>
          )}
          {data && !loading && (
            <TemperatureChart data={data.forecast} location={data.location} />
          )}
          {!data && !loading && (
            <Card className="w-full animate-in fade-in-0 duration-500">
                <CardHeader>
                    <CardTitle>Welcome!</CardTitle>
                    <CardDescription>Your 24-hour forecast will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-96">
                    <ThermometerSun className="w-24 h-24 text-primary mb-4" />
                    <p className="text-muted-foreground">Enter a zip code above to get started.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
