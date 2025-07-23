"use server";

import { z } from 'zod';

const zipCodeSchema = z.string().regex(/^\d{5}$/, { message: "Invalid ZIP code format." });

interface GeocodeResult {
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}

interface ForecastData {
    location: string;
    forecast: {
        time: string;
        temperature: number;
    }[];
}

interface ActionState {
    data: ForecastData | null;
    error: string | null;
}

export async function getWeatherDataByZip(prevState: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const zipCode = formData.get('zipcode');

  const validation = zipCodeSchema.safeParse(zipCode);
  if (!validation.success) {
    return { data: null, error: "Please enter a valid 5-digit US zip code." };
  }
  const validZip = validation.data;

  try {
    // Using a different, potentially more reliable geocoding API for US zip codes
    const geoUrl = `https://api.zippopotam.us/us/${validZip}`;
    const geoResponse = await fetch(geoUrl, { next: { revalidate: 3600 } });
    
    if (!geoResponse.ok) {
        if (geoResponse.status === 404) {
             return { data: null, error: `Could not find location for ZIP code ${validZip}. Please double-check the number.` };
        }
        console.error("Geocoding API error:", geoResponse.statusText);
        throw new Error("Failed to fetch location data.");
    }

    const geoData = await geoResponse.json();
    if (!geoData || !geoData.places || geoData.places.length === 0) {
      return { data: null, error: `Could not find location for ZIP code ${validZip}.` };
    }
    
    const place = geoData.places[0];
    const latitude = parseFloat(place.latitude);
    const longitude = parseFloat(place.longitude);
    const location = `${place['place name']}, ${place['state abbreviation']}`;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl, { next: { revalidate: 600 } });
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

    return {
      data: { location, forecast },
      error: null
    };

  } catch (error) {
    console.error(error);
    return { data: null, error: "An unexpected error occurred. Please try again later." };
  }
}
