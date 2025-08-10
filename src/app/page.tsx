'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getWeatherDataByZip,
  getWeatherDataByCoords,
  ForecastData,
  RateLimitError,
  GenericApiError,
  DateRangeError,
} from '@/lib/weather';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TemperatureChart } from '@/components/temperature-chart';
import { Metadata } from '@/components/metadata';
import { MetadataSkeleton } from '@/components/MetadataSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ThermometerSun, CalendarIcon, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { RateLimitCard } from '@/components/RateLimitCard';
import { GenericErrorCard } from '@/components/GenericErrorCard';
import { DateRangeErrorCard } from '@/components/DateRangeErrorCard';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isToday, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { VariableSelector } from '@/components/variable-selector';
import { useHotkeys } from '@/hooks/use-hotkeys';

export default function Home() {
  const hourlyVariables = [
    { value: 'temperature_2m', label: 'Temperature' },
    { value: 'apparent_temperature', label: 'Feels Like' },
    { value: 'relative_humidity_2m', label: 'Humidity' },
    { value: 'precipitation_probability', label: 'Precipitation' },
  ];

  const [data, setData] = useState<ForecastData | null>(null);
  const [celsiusData, setCelsiusData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [selectedHourlyVariable, setSelectedHourlyVariable] = useState<string>('temperature_2m');
  const [errorType, setErrorType] = useState<'rate-limit' | 'generic' | 'date-range' | null>(null);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

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

  const handleFetchWeather = useCallback(
    async (zip: string | null, lat: number | null, lon: number | null, selectedDate: Date | undefined) => {
      setLoading(true);
      setData(null);
      setCelsiusData(null);
      setErrorType(null); // Reset error state at the beginning of a new fetch
      setRateLimitMessage(null); // Reset rate limit message
      try {
        let weatherData;
        if (zip) {
          weatherData = await getWeatherDataByZip(zip, selectedDate);
          localStorage.setItem('lastZipCode', zip);
          localStorage.removeItem('lastLatitude');
          localStorage.removeItem('lastLongitude');
        } else if (lat !== null && lon !== null) {
          weatherData = await getWeatherDataByCoords(lat, lon, selectedDate);
          localStorage.setItem('lastLatitude', lat.toString());
          localStorage.setItem('lastLongitude', lon.toString());
          localStorage.removeItem('lastZipCode');
        } else {
          throw new Error('No location information provided.');
        }
        setCelsiusData(weatherData);
      } catch (err: unknown) {
        console.error('Error fetching weather data:', err);
        if (err instanceof RateLimitError) {
          setErrorType('rate-limit');
          setRateLimitMessage(err.message);
        } else if (err instanceof DateRangeError) {
          setErrorType('date-range');
        } else if (err instanceof GenericApiError || err instanceof Error) {
          setErrorType('generic');
        } else {
          // Fallback for unexpected error types
          setErrorType('generic');
        }
      } finally {
        setLoading(false);
      }
    },
    [date],
  );

  useEffect(() => {
    const savedZipCode = localStorage.getItem('lastZipCode');
    const savedLatitude = localStorage.getItem('lastLatitude');
    const savedLongitude = localStorage.getItem('lastLongitude');

    if (savedZipCode) {
      setZipCode(savedZipCode);
      handleFetchWeather(savedZipCode, null, null, date);
    } else if (savedLatitude && savedLongitude) {
      const lat = parseFloat(savedLatitude);
      const lon = parseFloat(savedLongitude);
      handleFetchWeather(null, lat, lon, date);
    }
  }, [handleFetchWeather, date]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (zipCode) {
      handleFetchWeather(zipCode, null, null, date);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setZipCode(''); // Clear zip code when using geolocation
          handleFetchWeather(null, latitude, longitude, date);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          alert('Unable to retrieve your location. Please ensure location services are enabled.');
        },
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    if (celsiusData) {
      if (unit === 'f') {
        const fahrenheitForecast = celsiusData.forecast.map((item) => ({
          ...item,
          temperature_2m: Math.round((item.temperature_2m * 9) / 5 + 32),
          apparent_temperature: Math.round((item.apparent_temperature * 9) / 5 + 32),
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

  const handleHourlyVariableChange = (variable: string) => {
    setSelectedHourlyVariable(variable);
  };

  const handlePreviousDay = () => {
    setDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setDate((prevDate) => addDays(prevDate, 1));
  };

  useHotkeys({
    ArrowLeft: handlePreviousDay,
    ArrowRight: handleNextDay,
    ArrowUp: () => {
      const currentIndex = hourlyVariables.findIndex((variable) => variable.value === selectedHourlyVariable);
      const nextIndex = currentIndex === 0 ? hourlyVariables.length - 1 : currentIndex - 1;
      setSelectedHourlyVariable(hourlyVariables[nextIndex].value);
    },
    ArrowDown: () => {
      const currentIndex = hourlyVariables.findIndex((variable) => variable.value === selectedHourlyVariable);
      const nextIndex = currentIndex === hourlyVariables.length - 1 ? 0 : currentIndex + 1;
      setSelectedHourlyVariable(hourlyVariables[nextIndex].value);
    },
  });

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

          <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm mx-auto items-center space-y-2 mb-12">
            <div className="flex w-full space-x-2">
              <div className="w-1/2">
                <Input
                  type="text"
                  name="zipcode"
                  placeholder="Enter 5-digit zip code"
                  required
                  pattern="\d{5}"
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="text-sm sm:text-base w-full"
                />
              </div>
              <div className="w-1/2 flex space-x-2">
                <Button type="submit" disabled={loading} className="font-semibold flex-grow">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Get Weather
                </Button>
                <Button
                  type="button"
                  onClick={handleGeolocation}
                  disabled={loading}
                  variant="outline"
                  className="font-semibold px-3 bg-accent text-accent-foreground hover:bg-accent/90"
                  title="Get weather by current location"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex w-full space-x-2">
              <VariableSelector
                selectedVariable={selectedHourlyVariable}
                onVariableChange={handleHourlyVariableChange}
                className="w-full"
              />
            </div>
            <div className="flex w-full items-center justify-center space-x-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousDay}
                disabled={loading}
                className="h-9 w-20 shrink-0"
              >
                <ChevronLeft className="h-10 w-10" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? isToday(date) ? 'Today' : format(date, 'PPP') : <span>Pick a date</span>}
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
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextDay}
                disabled={loading}
                className="h-9 w-20 shrink-0"
              >
                <ChevronRight className="h-10 w-10" />
              </Button>
            </div>
          </form>

          <div>
            {loading && (
              <>
                <Card className="w-full mx-auto mb-4 shadow-lg border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-xl md:text-2xl opacity-0">Loading Forecast</CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base opacity-0">
                      Loading Location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center h-[324px] sm:h-[424px] md:h-[524px] lg:h-[624px]">
                    <Loader2 className="w-24 h-24 text-primary animate-spin" />
                  </CardContent>
                </Card>
                <MetadataSkeleton />
              </>
            )}
            {errorType === 'rate-limit' && !loading && <RateLimitCard message={rateLimitMessage || undefined} />}
            {errorType === 'generic' && !loading && <GenericErrorCard />}
            {errorType === 'date-range' && !loading && <DateRangeErrorCard />}
            {data && !loading && !errorType && (
              <>
                <TemperatureChart
                  data={data.forecast}
                  location={data.location}
                  unit={unit}
                  sunrise={data.sunrise}
                  sunset={data.sunset}
                  timeFormat={timeFormat}
                  selectedDate={date}
                  selectedHourlyVariable={selectedHourlyVariable}
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
            {!data && !loading && !zipCode && !errorType && (
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
