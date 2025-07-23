import { z } from 'zod';

const zipCodeSchema = z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code format." });

interface GeocodeResult {
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}

export interface ForecastData {
    location: string;
    forecast: {
        time: string;
        temperature: number;
    }[];
}

export async function getWeatherDataByZip(zipCode: string): Promise<ForecastData> {
  const validation = zipCodeSchema.safeParse(zipCode);
  if (!validation.success) {
    throw new Error("Please enter a valid 5-digit US zip code.");
  }
  const validZip = validation.data;

  // Using a different, potentially more reliable geocoding API for US zip codes
  const geoUrl = `https://api.zippopotam.us/us/${validZip}`;
  const geoResponse = await fetch(geoUrl);
  
  if (!geoResponse.ok) {
      if (geoResponse.status === 404) {
           throw new Error(`Could not find location for ZIP code ${validZip}. Please double-check the number.`);
      }
      console.error("Geocoding API error:", geoResponse.statusText);
      throw new Error("Failed to fetch location data.");
  }

  const geoData = await geoResponse.json();
  if (!geoData || !geoData.places || geoData.places.length === 0) {
    throw new Error(`Could not find location for ZIP code ${validZip}.`);
  }
  
  const place = geoData.places[0];
  const latitude = parseFloat(place.latitude);
  const longitude = parseFloat(place.longitude);
  const location = `${place['place name']}, ${place['state abbreviation']}`;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=auto`;
  const weatherResponse = await fetch(weatherUrl);
   if (!weatherResponse.ok) {
      console.error("Weather API error:", weatherResponse.statusText);
      throw new Error("Failed to fetch weather data.");
  }
  const weatherData = await weatherResponse.json();
  const hourlyData = weatherData.hourly;

  const forecast = hourlyData.time.map((t: string, index: number) => ({
    time: t,
    temperature: Math.round(hourlyData.temperature_2m[index]),
  }));

  return { location, forecast };
}
