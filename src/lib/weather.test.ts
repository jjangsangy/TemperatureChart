import { getWeatherDataByZip } from './weather';

import fetchMock from 'jest-fetch-mock';

describe('getWeatherDataByZip', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mocks before each test
  });

  it('throws an error for invalid zip code format', async () => {
    await expect(getWeatherDataByZip('123', 'fahrenheit')).rejects.toThrow("Please enter a valid 5-digit US zip code.");
    await expect(getWeatherDataByZip('abcde', 'fahrenheit')).rejects.toThrow("Please enter a valid 5-digit US zip code.");
    await expect(getWeatherDataByZip('123456', 'fahrenheit')).rejects.toThrow("Please enter a valid 5-digit US zip code.");
  });

  it('throws an error if geocoding API returns 404', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

    await expect(getWeatherDataByZip('99999', 'fahrenheit')).rejects.toThrow("Could not find location for ZIP code 99999. Please double-check the number.");
  });

  it('throws an error if geocoding API fails for other reasons', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500, statusText: 'Internal Server Error' });

    await expect(getWeatherDataByZip('12345', 'fahrenheit')).rejects.toThrow("Failed to fetch location data.");
  });

  it('throws an error if geocoding API returns no places', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ places: [] }), { status: 200 });

    await expect(getWeatherDataByZip('12345', 'fahrenheit')).rejects.toThrow("Could not find location for ZIP code 12345.");
  });

  it('throws an error if weather API fails', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ places: [{ latitude: '34.05', longitude: '-118.25', 'place name': 'Los Angeles', 'state abbreviation': 'CA' }] }), { status: 200 }],
      [JSON.stringify({}), { status: 500, statusText: 'Internal Server Error' }]
    );

    await expect(getWeatherDataByZip('90210', 'fahrenheit')).rejects.toThrow("Failed to fetch weather data.");
  });

  it('returns formatted weather data for a valid zip code and unit', async () => {
    const mockGeoData = {
      places: [{ latitude: '34.05', longitude: '-118.25', 'place name': 'Los Angeles', 'state abbreviation': 'CA' }],
    };
    const mockWeatherData = {
      hourly: {
        time: ['2025-07-24T00:00', '2025-07-24T01:00'],
        temperature_2m: [20, 19],
        relative_humidity_2m: [70, 75],
        apparent_temperature: [22, 20],
        precipitation_probability: [10, 5],
        weather_code: [0, 1],
      },
      daily: {
        sunrise: ['2025-07-24T05:30'],
        sunset: ['2025-07-24T20:00'],
        temperature_2m_max: [25],
        temperature_2m_min: [10],
        precipitation_probability_max: [30],
        daylight_duration: [54000],
      },
    };

    fetchMock.mockResponses(
      [JSON.stringify(mockGeoData), { status: 200 }],
      [JSON.stringify(mockWeatherData), { status: 200 }]
    );

    const result = await getWeatherDataByZip('90210', 'fahrenheit');

    expect(result).toEqual({
      location: 'Los Angeles, CA',
      forecast: [
        { time: '2025-07-24T00:00', temperature: 20, relativeHumidity: 70, apparentTemperature: 22, precipitationProbability: 10, weatherCode: 0 },
        { time: '2025-07-24T01:00', temperature: 19, relativeHumidity: 75, apparentTemperature: 20, precipitationProbability: 5, weatherCode: 1 },
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
      'https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.25&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max,daylight_duration&temperature_unit=fahrenheit&forecast_days=1&timezone=auto'
    );
  });

  it('sends correct unit to weather API for celsius', async () => {
    const mockGeoData = {
      places: [{ latitude: '34.05', longitude: '-118.25', 'place name': 'Los Angeles', 'state abbreviation': 'CA' }],
    };
    const mockWeatherData = {
      hourly: {
        time: ['2025-07-24T00:00'],
        temperature_2m: [20],
        relative_humidity_2m: [70],
        apparent_temperature: [22],
        precipitation_probability: [10],
        weather_code: [0],
      },
      daily: {
        sunrise: ['2025-07-24T05:30'],
        sunset: ['2025-07-24T20:00'],
        temperature_2m_max: [25],
        temperature_2m_min: [10],
        precipitation_probability_max: [30],
        daylight_duration: [54000],
      },
    };

    fetchMock.mockResponses(
      [JSON.stringify(mockGeoData), { status: 200 }],
      [JSON.stringify(mockWeatherData), { status: 200 }]
    );

    await getWeatherDataByZip('90210', 'celsius');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('temperature_unit=celsius')
    );
  });
});
