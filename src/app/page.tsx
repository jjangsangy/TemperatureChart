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
  const [celsiusData, setCelsiusData] = useState<ForecastData | null>(null); // Store original Celsius data
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState<string>('');

  // Initialize unit with a default value, then update from localStorage on mount
  const [unit, setUnit] = useState<'f' | 'c'>('f');

  // Save unit to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUnit = localStorage.getItem('temperatureUnit');
      setUnit(savedUnit === 'c' ? 'c' : 'f');
    }
  }, []); // Run once on mount

  const [timeFormat, setTimeFormat] = useState<'ampm' | 'military'>(() => {
    if (typeof window !== 'undefined') {
      const savedTimeFormat = localStorage.getItem('timeFormat');
      return savedTimeFormat === 'military' ? 'military' : 'ampm';
    }
    return 'ampm';
  });

  // Save unit to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('temperatureUnit', unit);
    }
  }, [unit]);

  // Save timeFormat to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('timeFormat', timeFormat);
  }, [timeFormat]);

  const handleFetchWeather = useCallback(async (zip: string) => {
    setLoading(true);
    setData(null);
    setCelsiusData(null); // Clear Celsius data on new fetch
    setError(null);
    try {
      const weatherData = await getWeatherDataByZip(zip); // Fetch in Celsius
      setCelsiusData(weatherData);
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
      handleFetchWeather(savedZipCode); 
    }
  }, [handleFetchWeather]); // Removed unit from dependency array

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (zipCode) {
      handleFetchWeather(zipCode);
    }
  };

  // Effect to convert Celsius data to Fahrenheit when unit changes
  useEffect(() => {
    if (celsiusData) {
      if (unit === 'f') {
        const fahrenheitForecast = celsiusData.forecast.map(item => ({
          ...item,
          temperature: Math.round((item.temperature * 9/5) + 32),
          apparentTemperature: Math.round((item.apparentTemperature * 9/5) + 32),
        }));
        setData({
          ...celsiusData,
          forecast: fahrenheitForecast,
          temperatureMax: Math.round((celsiusData.temperatureMax * 9/5) + 32),
          temperatureMin: Math.round((celsiusData.temperatureMin * 9/5) + 32),
        });
      } else {
        // If unit is Celsius, just use the original celsiusData
        setData(celsiusData);
      }
    }
  }, [celsiusData, unit]);

  const handleUnitToggle = () => {
    setUnit(prevUnit => (prevUnit === 'f' ? 'c' : 'f'));
  };

  const handleTimeFormatToggle = () => {
    setTimeFormat(prevFormat => (prevFormat === 'ampm' ? 'military' : 'ampm'));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
        <div className="z-10 w-full max-w-7xl items-center justify-center text-center">
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-center mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-foreground/90 mb-4 lg:mb-0 lg:text-center lg:flex-grow">
                TemperatureChart
            </h1>
            <div className="flex items-center space-x-2 justify-center lg:absolute lg:right-0 lg:top-0">
                <Button 
                    variant="ghost" 
                    onClick={handleUnitToggle} 
                    disabled={loading}
                    className="text-lg px-2 py-1 h-auto" // Adjust padding and height for smaller button
                >
                    {unit === 'f' ? '°C' : '°F'}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={handleTimeFormatToggle} 
                    disabled={loading}
                    className="text-lg px-2 py-1 h-auto" // Adjust padding and height for smaller button
                >
                    {timeFormat === 'ampm' ? '24H' : 'AM/PM'}
                </Button>
                <ThemeToggle />
            </div>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground mb-8">
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
              className="text-sm sm:text-base"
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
                  timeFormat={timeFormat}
                />
                <Metadata
                  temperatureMax={data.temperatureMax}
                  temperatureMin={data.temperatureMin}
                  sunrise={data.sunrise}
                  sunset={data.sunset}
                  precipitationProbabilityMax={data.precipitationProbabilityMax}
                  daylightDuration={data.daylightDuration}
                  unit={unit === 'f' ? 'fahrenheit' : 'celsius'} // This will be handled by the component
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
