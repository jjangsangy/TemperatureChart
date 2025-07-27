import { z } from 'zod';
import { format } from 'date-fns';

export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded.') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class GenericApiError extends Error {
  constructor(message = 'Failed to fetch data from API.') {
    super(message);
    this.name = 'GenericApiError';
  }
}

const zipCodeSchema = z.string().regex(/^\d{5}$/, { message: 'Invalid ZIP code format.' });

export interface ForecastData {
  location: string;
  forecast: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation_probability: number;
    weatherCode: number;
  }[];
  sunrise: string;
  sunset: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax: number;
  daylightDuration: number;
}

export async function getWeatherDataByCoords(
  latitude: number,
  longitude: number,
  date: Date | undefined,
  locationName?: string, // Add optional locationName parameter
): Promise<ForecastData> {
  const formattedDate = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,daylight_duration&temperature_unit=celsius&timezone=auto&start_date=${formattedDate}&end_date=${formattedDate}`;
  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
    const errorData = await weatherResponse.json();
    if (errorData.reason && errorData.reason.includes('limit exceeded')) {
      throw new RateLimitError(errorData.reason);
    }
    console.error('Weather API error:', weatherResponse.statusText);
    throw new GenericApiError(errorData.reason || 'Failed to fetch weather data.');
  }
  const weatherData = await weatherResponse.json();
  const hourlyData = weatherData.hourly;
  const dailyData = weatherData.daily;

  const forecast = hourlyData.time.map((t: string, index: number) => ({
    time: t,
    temperature_2m: Math.round(hourlyData.temperature_2m[index]),
    relative_humidity_2m: Math.round(hourlyData.relative_humidity_2m[index]),
    apparent_temperature: Math.round(hourlyData.apparent_temperature[index]),
    precipitation_probability: Math.round(hourlyData.precipitation_probability[index]),
    weatherCode: hourlyData.weather_code[index],
  }));

  const sunrise = dailyData.sunrise[0];
  const sunset = dailyData.sunset[0];
  const temperatureMax = dailyData.temperature_2m_max[0];
  const temperatureMin = dailyData.temperature_2m_min[0];
  const precipitationProbabilityMax = dailyData.precipitation_probability_max[0];
  const daylightDuration = dailyData.daylight_duration[0];

  const location = locationName || `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

  return {
    location,
    forecast,
    sunrise,
    sunset,
    temperatureMax,
    temperatureMin,
    precipitationProbabilityMax,
    daylightDuration,
  };
}

export async function getWeatherDataByZip(zipCode: string, date: Date | undefined): Promise<ForecastData> {
  const validation = zipCodeSchema.safeParse(zipCode);
  if (!validation.success) {
    throw new Error('Please enter a valid 5-digit US zip code.');
  }
  const validZip = validation.data;

  const geoUrl = `https://api.zippopotam.us/us/${validZip}`;
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    if (geoResponse.status === 404) {
      throw new Error(`Could not find location for ZIP code ${validZip}. Please double-check the number.`);
    }
    console.error('Geocoding API error:', geoResponse.statusText);
    // For any other non-OK response from zippopotam.us, treat as a generic API error
    throw new GenericApiError('Failed to fetch location data from Zippopotam.us.');
  }

  const geoData = await geoResponse.json();
  if (!geoData || !geoData.places || geoData.places.length === 0) {
    throw new Error(`Could not find location for ZIP code ${validZip}.`);
  }

  const place = geoData.places[0];
  const latitude = parseFloat(place.latitude);
  const longitude = parseFloat(place.longitude);
  const locationName = `${place['place name']}, ${place['state abbreviation']}`;

  return getWeatherDataByCoords(latitude, longitude, date, locationName);
}
