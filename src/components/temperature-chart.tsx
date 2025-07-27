'use client';

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  Thermometer,
  ThermometerSun,
  Droplets,
  CloudRain,
  Cloud,
  Sun,
  Moon,
  Cloudy,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  Snowflake,
  CloudSun,
  CloudMoon,
  CloudHail, // Added CloudHail icon
} from 'lucide-react';

interface Forecast {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

interface TemperatureChartProps {
  data: Forecast[];
  location: string;
  unit: 'f' | 'c'; // 'f' for Fahrenheit, 'c' for Celsius
  sunrise: string;
  sunset: string;
  timeFormat: 'ampm' | 'military';
  selectedDate: Date;
}

const chartConfig = {
  temperature: {
    label: 'Temperature',
  },
} satisfies ChartConfig;

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear sky';
    case 1:
      return 'Mainly clear';
    case 2:
      return 'Partly cloudy';
    case 3:
      return 'Overcast';
    case 45:
      return 'Fog';
    case 48:
      return 'Depositing rime fog';
    case 51:
      return 'Light drizzle';
    case 53:
      return 'Moderate drizzle';
    case 55:
      return 'Dense drizzle';
    case 56:
      return 'Light freezing drizzle';
    case 57:
      return 'Dense freezing drizzle';
    case 61:
      return 'Slight rain';
    case 63:
      return 'Moderate rain';
    case 65:
      return 'Heavy rain';
    case 66:
      return 'Light freezing rain';
    case 67:
      return 'Heavy freezing rain';
    case 71:
      return 'Slight snowfall';
    case 73:
      return 'Moderate snowfall';
    case 75:
      return 'Heavy snowfall';
    case 77:
      return 'Snow grains';
    case 80:
      return 'Slight rain showers';
    case 81:
      return 'Moderate rain showers';
    case 82:
      return 'Violent rain showers';
    case 85:
      return 'Slight snow showers';
    case 86:
      return 'Heavy snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
      return 'Thunderstorm with slight hail';
    case 99:
      return 'Thunderstorm with heavy hail';
    default:
      return 'Unknown';
  }
}

function getWeatherIcon(code: number, hour: number, sunriseHour: number, sunsetHour: number) {
  const isDay = hour >= sunriseHour && hour < sunsetHour;
  const baseIconClass = 'h-6 w-6';

  let iconComponent;
  let colorClass = 'text-muted-foreground'; // Default color

  switch (code) {
    case 0: // Clear sky
      iconComponent = isDay ? <Sun /> : <Moon />;
      colorClass = isDay ? 'text-yellow-500' : 'text-gray-400'; // Bright yellow for day, light gray for night
      break;
    case 1: // Mainly clear
      iconComponent = isDay ? <CloudSun /> : <CloudMoon />;
      colorClass = isDay ? 'text-yellow-400' : 'text-gray-300'; // Slightly less bright for day, lighter gray for night
      break;
    case 2: // Partly cloudy
      iconComponent = <Cloudy />;
      colorClass = 'text-gray-500'; // Medium gray
      break;
    case 3: // Overcast
      iconComponent = <Cloud />;
      colorClass = 'text-gray-600'; // Darker gray
      break;
    case 45: // Fog
      iconComponent = <CloudFog />;
      colorClass = 'text-gray-400'; // Light gray for fog
      break;
    case 48: // Depositing rime fog
      iconComponent = <CloudFog />;
      colorClass = 'text-gray-500'; // Darker, icy gray for rime fog
      break;
    case 51: // Light drizzle
      iconComponent = <CloudDrizzle />;
      colorClass = 'text-blue-300'; // Light blue
      break;
    case 53: // Moderate drizzle
      iconComponent = <CloudDrizzle />;
      colorClass = 'text-blue-500'; // Medium blue
      break;
    case 55: // Dense drizzle
      iconComponent = <CloudDrizzle />;
      colorClass = 'text-blue-700'; // Dark blue
      break;
    case 56: // Light freezing drizzle
      iconComponent = <CloudDrizzle />;
      colorClass = 'text-cyan-300'; // Light cyan for freezing
      break;
    case 57: // Dense freezing drizzle
      iconComponent = <CloudDrizzle />;
      colorClass = 'text-cyan-700'; // Dark cyan for freezing
      break;
    case 61: // Slight rain
    case 80: // Slight rain showers
      iconComponent = <CloudRain />;
      colorClass = 'text-blue-300'; // Light blue
      break;
    case 63: // Moderate rain
    case 81: // Moderate rain showers
      iconComponent = <CloudRain />;
      colorClass = 'text-blue-500'; // Medium blue
      break;
    case 65: // Heavy rain
    case 82: // Violent rain showers
      iconComponent = <CloudRain />;
      colorClass = 'text-blue-700'; // Dark blue
      break;
    case 66: // Light freezing rain
      iconComponent = <CloudRain />;
      colorClass = 'text-cyan-300'; // Light cyan for freezing
      break;
    case 67: // Heavy freezing rain
      iconComponent = <CloudRain />;
      colorClass = 'text-cyan-700'; // Dark cyan for freezing
      break;
    case 71: // Slight snowfall
    case 85: // Slight snow showers
      iconComponent = <CloudSnow />;
      colorClass = 'text-indigo-300'; // Light indigo
      break;
    case 73: // Moderate snowfall
    case 86: // Heavy snow showers
      iconComponent = <CloudSnow />;
      colorClass = 'text-indigo-500'; // Medium indigo
      break;
    case 75: // Heavy snowfall
      iconComponent = <CloudSnow />;
      colorClass = 'text-indigo-700'; // Dark indigo
      break;
    case 77: // Snow grains
      iconComponent = <Snowflake />;
      colorClass = 'text-indigo-500'; // Medium indigo
      break;
    case 95: // Thunderstorm
      iconComponent = <CloudLightning />;
      colorClass = 'text-yellow-500'; // Bright yellow
      break;
    case 96: // Thunderstorm with slight hail
      iconComponent = <CloudHail />;
      colorClass = 'text-blue-400'; // Icy light blue
      break;
    case 99: // Thunderstorm with heavy hail
      iconComponent = <CloudHail />;
      colorClass = 'text-blue-600'; // Deeper icy blue
      break;
    default:
      iconComponent = <Cloud />; // Default icon for unknown codes
      colorClass = 'text-muted-foreground';
      break;
  }

  return React.cloneElement(iconComponent, {
    className: `${baseIconClass} ${colorClass}`,
    stroke: 'currentColor',
  });
}

function formatTime(dateString: string, format: 'ampm' | 'military'): string {
  const date = new Date(dateString);
  if (format === 'military') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
  } else {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', '');
  }
}

export function TemperatureChart({
  data,
  location,
  unit,
  sunrise,
  sunset,
  timeFormat,
  selectedDate,
}: TemperatureChartProps) {
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<string | null>(null);
  const [isCurrentDay, setIsCurrentDay] = useState<boolean>(false);

  useEffect(() => {
    const now = new Date();
    setCurrentHour(now.getHours());
    setCurrentDay(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    );

    const today = new Date();
    setIsCurrentDay(
      selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear(),
    );
  }, [selectedDate]);

  const sunriseHour = new Date(sunrise).getHours();
  const sunsetHour = new Date(sunset).getHours();

  const chartData = data.map((item) => {
    const date = new Date(item.time);
    const hour = date.getHours();

    let fill = 'hsl(var(--primary))'; // Default fill color
    if (hour === currentHour && isCurrentDay) {
      fill = 'hsl(var(--accent))'; // Highlight current hour only if it's the current day
    } else if (hour < sunriseHour || hour >= sunsetHour) {
      fill = 'hsl(var(--primary) / 0.5)'; // Dim for night
    } else {
      fill = 'hsl(var(--primary))'; // Bright for day
    }

    return {
      hour: formatTime(item.time, timeFormat),
      temperature: item.temperature,
      relativeHumidity: item.relativeHumidity,
      apparentTemperature: item.apparentTemperature,
      precipitationProbability: item.precipitationProbability,
      weatherCode: item.weatherCode,
      fill: fill,
    };
  });

  const maxTemp = Math.max(...chartData.map((d) => d.temperature));
  const topTick = Math.ceil((maxTemp + 10) / 10) * 10;
  const yAxisTicks = Array.from({ length: Math.floor(topTick / 10) + 1 }, (_, i) => i * 10);

  const unitSymbol = unit === 'f' ? '°F' : '°C';

  interface CustomXAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
      value: string;
      offset: number;
    };
  }

  const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
    const item = chartData.find((d) => d.hour === payload?.value);
    const hour = new Date(data.find((d) => formatTime(d.time, timeFormat) === payload?.value)?.time || '').getHours();

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={10} textAnchor="middle" fill="hsl(var(--foreground))" style={{ fontSize: '0.75rem' }}>
          {payload?.value}
        </text>
        {item && (
          <g transform={`translate(-12, 25)`}>
            {' '}
            {/* Adjust translate to center the icon (24px wide) */}
            {/* Render the icon directly as an SVG element */}
            {getWeatherIcon(item.weatherCode, hour, sunriseHour, sunsetHour)}
          </g>
        )}
      </g>
    );
  };

  return (
    <Card className="w-full mb-4 animate-in fade-in-0 duration-500 shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">24-Hour Forecast for {currentDay}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{location}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[600px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: -10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={CustomXAxisTick}
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis
              dataKey="temperature"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}${unitSymbol}`}
              domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
              ticks={yAxisTicks}
              style={{ fontSize: '0.75rem' }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => (
                    <div className="text-base sm:text-lg font-bold text-foreground">{value}</div>
                  )}
                  formatter={(value, name, props) => (
                    <div className="flex flex-col text-xs sm:text-sm p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          <span className="font-bold">Temp:</span> {`${props.payload.temperature}${unitSymbol}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          <span className="font-bold">Feels Like:</span>{' '}
                          {`${props.payload.apparentTemperature}${unitSymbol}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          <span className="font-bold">Humidity:</span> {`${props.payload.relativeHumidity}%`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <CloudRain className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          <span className="font-bold">Precipitation:</span>{' '}
                          {`${props.payload.precipitationProbability}%`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          <span className="font-bold">Weather:</span> {getWeatherDescription(props.payload.weatherCode)}
                        </span>
                      </div>
                    </div>
                  )}
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="temperature" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
