"use client";

import { useState, useEffect, useCallback } from 'react';
import { getWeatherDataByZip, ForecastData } from '@/lib/weather';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TemperatureChart } from '@/components/temperature-chart';
import { Metadata } from '@/components/metadata'; // Import the new Metadata component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ThermometerSun } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';

export default function Home() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState<string>('');

  // Initialize unit from localStorage directly
  const [unit, setUnit] = useState<'f' | 'c'>(() => {
    if (typeof window !== 'undefined') {
      const savedUnit = localStorage.getItem('temperatureUnit');
      return savedUnit === 'c' ? 'c' : 'f';
    }
    return 'f';
  });

  // Save unit to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('temperatureUnit', unit);
  }, [unit]);

  const handleFetchWeather = useCallback(async (zip: string, currentUnit: 'f' | 'c') => {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const apiUnit = currentUnit === 'f' ? 'fahrenheit' : 'celsius';
      const weatherData = await getWeatherDataByZip(zip, apiUnit);
      setData(weatherData);
      localStorage.setItem('lastZipCode', zip); // Save to localStorage on success
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const savedZipCode = localStorage.getItem('lastZipCode');
    if (savedZipCode) {
      setZipCode(savedZipCode);
      // Use the current unit state when fetching data on mount
      handleFetchWeather(savedZipCode, unit); 
    }
  }, [handleFetchWeather, unit]); // Add unit to dependency array

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (zipCode) {
      handleFetchWeather(zipCode, unit);
    }
  };

  const handleUnitToggle = () => {
    setUnit(prevUnit => (prevUnit === 'f' ? 'c' : 'f'));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Button 
              variant="ghost" 
              onClick={handleUnitToggle} 
              disabled={loading}
              className="text-lg px-2 py-1 h-auto" // Adjust padding and height for smaller button
          >
              {unit === 'f' ? '°C' : '°F'}
          </Button>
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
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="text-base"
            />
            <Button type="submit" disabled={loading} className="font-semibold">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Weather
            </Button>
          </form>

          <div> {/* Removed w-full from this div */}
            {loading && (
              <Card className="w-full mx-auto"> {/* Removed max-w-md */}
                <CardContent className="flex flex-col items-center justify-center h-96">
                  <Loader2 className="w-24 h-24 text-primary animate-spin" />
                </CardContent>
              </Card>
            )}
            {data && !loading && (
              <>
                <TemperatureChart 
                  data={data.forecast} 
                  location={data.location} 
                  unit={unit} 
                  sunrise={data.sunrise} 
                  sunset={data.sunset} 
                />
                <Metadata
                  temperatureMax={data.temperatureMax}
                  temperatureMin={data.temperatureMin}
                  sunrise={data.sunrise}
                  sunset={data.sunset}
                  precipitationProbabilityMax={data.precipitationProbabilityMax}
                  daylightDuration={data.daylightDuration}
                  unit={unit === 'f' ? 'fahrenheit' : 'celsius'}
                />
              </>
            )}
            {!data && !loading && !zipCode && ( // Only show welcome card if no data and no zip code entered yet
              <Card className="w-full mx-auto animate-in fade-in-0 duration-500"> {/* Removed max-w-md */}
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
      <Footer />
    </div>
  );
}
