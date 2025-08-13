import { getWeatherDataByZip, getWeatherDataByCoords } from './weather';
import cache from './cache'; // Import the cache instance

import fetchMock from 'jest-fetch-mock';

describe('getWeatherDataByZip', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mocks before each test
    cache.clear(); // Clear the cache before each test
  });

  it('throws an error for invalid zip code format', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    await expect(getWeatherDataByZip('123', mockDate)).rejects.toThrow('Please enter a valid 5-digit US zip code.');
    await expect(getWeatherDataByZip('abcde', mockDate)).rejects.toThrow('Please enter a valid 5-digit US zip code.');
    await expect(getWeatherDataByZip('123456', mockDate)).rejects.toThrow('Please enter a valid 5-digit US zip code.');
  });

  it('throws an error if geocoding API returns 404', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

    await expect(getWeatherDataByZip('99999', mockDate)).rejects.toThrow(
      'Could not find location for ZIP code 99999. Please double-check the number.',
    );
  });

  it('throws an error if geocoding API fails for other reasons', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    fetchMock.mockResponseOnce(JSON.stringify({}), {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(getWeatherDataByZip('12345', mockDate)).rejects.toThrow(
      'Failed to fetch location data from Zippopotam.us.',
    );
  });

  it('throws an error if geocoding API returns no places', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    fetchMock.mockResponseOnce(JSON.stringify({ places: [] }), { status: 200 });

    await expect(getWeatherDataByZip('12345', mockDate)).rejects.toThrow('Could not find location for ZIP code 12345.');
  });

  it('throws an error if weather API fails', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    fetchMock.mockResponses(
      [
        JSON.stringify({
          places: [
            {
              latitude: '34.05',
              longitude: '-118.25',
              'place name': 'Los Angeles',
              'state abbreviation': 'CA',
            },
          ],
        }),
        { status: 200 },
      ],
      [JSON.stringify({}), { status: 500, statusText: 'Internal Server Error' }],
    );

    await expect(getWeatherDataByZip('90210', mockDate)).rejects.toThrow('Failed to fetch weather data.');
  });

  it('returns formatted weather data for a valid zip code', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    const mockGeoData = {
      places: [
        {
          latitude: '34.05',
          longitude: '-118.25',
          'place name': 'Los Angeles',
          'state abbreviation': 'CA',
        },
      ],
    };
    const mockWeatherData = {
      hourly: {
        time: ['2025-07-24T00:00', '2025-07-24T01:00'],
        temperature_2m: [20, 19], // Celsius values
        relative_humidity_2m: [70, 75],
        apparent_temperature: [22, 20],
        precipitation_probability: [10, 5],
        weather_code: [0, 1],
        snowfall: [0, 0.5],
        cloud_cover: [20, 80],
      },
      daily: {
        sunrise: ['2025-07-24T05:30'],
        sunset: ['2025-07-24T20:00'],
        temperature_2m_max: [25], // Celsius values
        temperature_2m_min: [10], // Celsius values
        precipitation_probability_max: [30],
        daylight_duration: [54000],
      },
    };

    fetchMock.mockResponses(
      [JSON.stringify(mockGeoData), { status: 200 }],
      [JSON.stringify(mockWeatherData), { status: 200 }],
    );

    const result = await getWeatherDataByZip('90210', mockDate);

    expect(result).toEqual({
      location: 'Los Angeles, CA',
      forecast: [
        {
          apparent_temperature: 22,
          precipitation_probability: 10,
          relative_humidity_2m: 70,
          temperature_2m: 20,
          time: '2025-07-24T00:00',
          weatherCode: 0,
          snowfall: 0,
          cloud_cover: 20,
        },
        {
          apparent_temperature: 20,
          precipitation_probability: 5,
          relative_humidity_2m: 75,
          temperature_2m: 19,
          time: '2025-07-24T01:00',
          weatherCode: 1,
          snowfall: 0.5,
          cloud_cover: 80,
        },
      ],
      sunrise: '2025-07-24T05:30',
      sunset: '2025-07-24T20:00',
      temperatureMax: 25,
      temperatureMin: 10,
      precipitationProbabilityMax: 30,
      daylightDuration: 54000,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith('https://api.zippopotam.us/us/90210');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.25&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,snowfall,cloud_cover&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,daylight_duration&temperature_unit=celsius&timezone=auto&start_date=2025-07-24&end_date=2025-07-24',
    );
  });

  it('returns cached data on subsequent calls for the same zip code and date', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    const mockGeoData = {
      places: [
        {
          latitude: '34.05',
          longitude: '-118.25',
          'place name': 'Los Angeles',
          'state abbreviation': 'CA',
        },
      ],
    };
    const mockWeatherData = {
      hourly: {
        time: ['2025-07-24T00:00', '2025-07-24T01:00'],
        temperature_2m: [20, 19], // Celsius values
        relative_humidity_2m: [70, 75],
        apparent_temperature: [22, 20],
        precipitation_probability: [10, 5],
        weather_code: [0, 1],
        snowfall: [0, 0.5],
        cloud_cover: [20, 80],
      },
      daily: {
        sunrise: ['2025-07-24T05:30'],
        sunset: ['2025-07-24T20:00'],
        temperature_2m_max: [25], // Celsius values
        temperature_2m_min: [10], // Celsius values
        precipitation_probability_max: [30],
        daylight_duration: [54000],
      },
    };

    fetchMock.mockResponses(
      [JSON.stringify(mockGeoData), { status: 200 }],
      [JSON.stringify(mockWeatherData), { status: 200 }],
    );

    // First call - should hit APIs
    await getWeatherDataByZip('90210', mockDate);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fetchMock.resetMocks(); // Reset mocks to ensure no new API calls are made

    // Second call - should hit cache
    await getWeatherDataByZip('90210', mockDate);
    expect(fetchMock).toHaveBeenCalledTimes(0); // No new API calls
  });
});

describe('getWeatherDataByCoords', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    cache.clear(); // Clear the cache before each test
  });

  it('throws an error if weather API fails', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500, statusText: 'Internal Server Error' });

    await expect(getWeatherDataByCoords(34.05, -118.25, mockDate)).rejects.toThrow('Failed to fetch weather data.');
  });

  it('returns formatted weather data for valid coordinates', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    const mockWeatherData = {
      hourly: {
        time: ['2025-07-24T00:00', '2025-07-24T01:00'],
        temperature_2m: [20, 19], // Celsius values
        relative_humidity_2m: [70, 75],
        apparent_temperature: [22, 20],
        precipitation_probability: [10, 5],
        weather_code: [0, 1],
        snowfall: [0, 0.5],
        cloud_cover: [20, 80],
      },
      daily: {
        sunrise: ['2025-07-24T05:30'],
        sunset: ['2025-07-24T20:00'],
        temperature_2m_max: [25], // Celsius values
        temperature_2m_min: [10], // Celsius values
        precipitation_probability_max: [30],
        daylight_duration: [54000],
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockWeatherData), { status: 200 });

    const result = await getWeatherDataByCoords(34.05, -118.25, mockDate);

    expect(result).toEqual({
      location: '(34.0500, -118.2500)',
      forecast: [
        {
          apparent_temperature: 22,
          precipitation_probability: 10,
          relative_humidity_2m: 70,
          temperature_2m: 20,
          time: '2025-07-24T00:00',
          weatherCode: 0,
          snowfall: 0,
          cloud_cover: 20,
        },
        {
          apparent_temperature: 20,
          precipitation_probability: 5,
          relative_humidity_2m: 75,
          temperature_2m: 19,
          time: '2025-07-24T01:00',
          weatherCode: 1,
          snowfall: 0.5,
          cloud_cover: 80,
        },
      ],
      sunrise: '2025-07-24T05:30',
      sunset: '2025-07-24T20:00',
      temperatureMax: 25,
      temperatureMin: 10,
      precipitationProbabilityMax: 30,
      daylightDuration: 54000,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.25&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,snowfall,cloud_cover&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,daylight_duration&temperature_unit=celsius&timezone=auto&start_date=2025-07-24&end_date=2025-07-24',
    );
  });

  it('returns cached data on subsequent calls for the same coordinates and date', async () => {
    const mockDate = new Date('2025-07-24T12:00:00Z');
    const mockWeatherData = {
      hourly: {
        time: ['2025-07-24T00:00', '2025-07-24T01:00'],
        temperature_2m: [20, 19], // Celsius values
        relative_humidity_2m: [70, 75],
        apparent_temperature: [22, 20],
        precipitation_probability: [10, 5],
        weather_code: [0, 1],
        snowfall: [0, 0.5],
        cloud_cover: [20, 80],
      },
      daily: {
        sunrise: ['2025-07-24T05:30'],
        sunset: ['2025-07-24T20:00'],
        temperature_2m_max: [25], // Celsius values
        temperature_2m_min: [10], // Celsius values
        precipitation_probability_max: [30],
        daylight_duration: [54000],
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockWeatherData), { status: 200 });

    // First call - should hit API
    await getWeatherDataByCoords(34.05, -118.25, mockDate);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.resetMocks(); // Reset mocks to ensure no new API calls are made

    // Second call - should hit cache
    await getWeatherDataByCoords(34.05, -118.25, mockDate);
    expect(fetchMock).toHaveBeenCalledTimes(0); // No new API calls
  });
});
