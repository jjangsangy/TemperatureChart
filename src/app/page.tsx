'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWeatherDataByZip, ForecastData } from '@/lib/weather';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TemperatureChart } from '@/components/temperature-chart';
import { Metadata } from '@/components/metadata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ThermometerSun, CalendarIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Home() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [celsiusData, setCelsiusData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());

  const [unit, setUnit] = useState<'f' | 'c'>('f');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUnit = localStorage.getItem('temperatureUnit');
      setUnit(savedUnit === 'c' ? 'c' : 'f');
    }
  }, []);

  const [timeFormat, setTimeFormat] = useState<'ampm' | 'military'>(() => {
    if (typeof window !== 'undefined') {
      const savedTimeFormat = localStorage.getItem('timeFormat');
      return savedTimeFormat === 'military' ? 'military' : 'ampm';
    }
    return 'ampm';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('temperatureUnit', unit);
    }
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('timeFormat', timeFormat);
  }, [timeFormat]);

  const handleFetchWeather = useCallback(async (zip: string, selectedDate: Date | undefined) => {
    setLoading(true);
    setData(null);
    setCelsiusData(null);
    try {
      const weatherData = await getWeatherDataByZip(zip, selectedDate); // Pass selectedDate
      setCelsiusData(weatherData);
      localStorage.setItem('lastZipCode', zip);
    } catch (err) {
      // Error is not currently displayed to the user, so we just log it.
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedZipCode = localStorage.getItem('lastZipCode');
    if (savedZipCode) {
      setZipCode(savedZipCode);
      handleFetchWeather(savedZipCode, date); // Pass date to initial fetch
    }
  }, [handleFetchWeather, date]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (zipCode) {
      handleFetchWeather(zipCode, date); // Pass date to submit fetch
    }
  };

  useEffect(() => {
    if (celsiusData) {
      if (unit === 'f') {
        const fahrenheitForecast = celsiusData.forecast.map((item) => ({
          ...item,
          temperature: Math.round((item.temperature * 9) / 5 + 32),
          apparentTemperature: Math.round((item.apparentTemperature * 9) / 5 + 32),
        }));
        setData({
          ...celsiusData,
          forecast: fahrenheitForecast,
          temperatureMax: Math.round((celsiusData.temperatureMax * 9) / 5 + 32),
          temperatureMin: Math.round((celsiusData.temperatureMin * 9) / 5 + 32),
        });
      } else {
        setData(celsiusData);
      }
    }
  }, [celsiusData, unit]);

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === 'f' ? 'c' : 'f'));
  };

  const handleTimeFormatToggle = () => {
    setTimeFormat((prevFormat) => (prevFormat === 'ampm' ? 'military' : 'ampm'));
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
                variant="outline"
                onClick={handleUnitToggle}
                disabled={loading}
                className="text-lg px-2 py-1 h-auto"
              >
                {unit === 'f' ? '°C' : '°F'}
              </Button>
              <Button
                variant="outline"
                onClick={handleTimeFormatToggle}
                disabled={loading}
                className="text-lg px-2 py-1 h-auto"
              >
                {timeFormat === 'ampm' ? '24H' : 'AM/PM'}
              </Button>
              <ThemeToggle />
            </div>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground mb-8">
            Enter a US zip code to see the 24-hour temperature forecast.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row w-full max-w-sm mx-auto items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-12"
          >
            <div className="flex w-full space-x-2">
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
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full sm:w-[180px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDay) => setDate(selectedDay || new Date())} // Ensure date is always defined
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </form>

          <div>
            {loading && (
              <Card className="w-full mx-auto">
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
                  selectedDate={date}
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
            {!data && !loading && !zipCode && (
              <Card className="w-full mx-auto animate-in fade-in-0 duration-500">
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
