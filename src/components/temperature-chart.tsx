"use client";

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Thermometer, ThermometerSun, Droplets, CloudRain, Cloud } from 'lucide-react';

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
}

const chartConfig = {
  temperature: {
    label: "Temperature",
  },
} satisfies ChartConfig;

function getWeatherDescription(code: number): string {
    switch (code) {
        case 0: return "Clear sky";
        case 1: return "Mainly clear";
        case 2: return "Partly cloudy";
        case 3: return "Overcast";
        case 45: return "Fog";
        case 48: return "Depositing rime fog";
        case 51: return "Light drizzle";
        case 53: return "Moderate drizzle";
        case 55: return "Dense drizzle";
        case 56: return "Light freezing drizzle";
        case 57: return "Dense freezing drizzle";
        case 61: return "Slight rain";
        case 63: return "Moderate rain";
        case 65: return "Heavy rain";
        case 66: return "Light freezing rain";
        case 67: return "Heavy freezing rain";
        case 71: return "Slight snowfall";
        case 73: return "Moderate snowfall";
        case 75: return "Heavy snowfall";
        case 77: return "Snow grains";
        case 80: return "Slight rain showers";
        case 81: return "Moderate rain showers";
        case 82: return "Violent rain showers";
        case 85: return "Slight snow showers";
        case 86: return "Heavy snow showers";
        case 95: return "Thunderstorm";
        case 96: return "Thunderstorm with slight hail";
        case 99: return "Thunderstorm with heavy hail";
        default: return "Unknown";
    }
}

export function TemperatureChart({ data, location, unit, sunrise, sunset }: TemperatureChartProps) {
    const [currentHour, setCurrentHour] = useState<number | null>(null);
    const [currentDay, setCurrentDay] = useState<string | null>(null);

    useEffect(() => {
        const now = new Date();
        setCurrentHour(now.getHours());
        setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    }, []);

    const sunriseHour = new Date(sunrise).getHours();
    const sunsetHour = new Date(sunset).getHours();
    
    const mappedData = data.map(item => {
        const date = new Date(item.time);
        const hour = date.getHours();
        
        let fill = 'hsl(var(--primary))'; // Default fill color
        if (hour === currentHour) {
            fill = 'hsl(var(--accent))'; // Highlight current hour
        } else if (hour < sunriseHour || hour >= sunsetHour) {
            fill = 'hsl(var(--primary) / 0.5)'; // Dim for night
        } else {
            fill = 'hsl(var(--primary))'; // Bright for day
        }

        return {
            hour: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', ''),
            temperature: item.temperature,
            relativeHumidity: item.relativeHumidity,
            apparentTemperature: item.apparentTemperature,
            precipitationProbability: item.precipitationProbability,
            weatherCode: item.weatherCode,
            fill: fill
        };
    });

    const maxTemp = Math.max(...mappedData.map(d => d.temperature));
    // Adjust top tick calculation for Celsius if needed, or keep it dynamic
    const topTick = Math.ceil((maxTemp + 10) / 10) * 10;
    const yAxisTicks = Array.from({ length: Math.floor(topTick / 10) + 1 }, (_, i) => i * 10);
    const chartData = mappedData;

    const unitSymbol = unit === 'f' ? '°F' : '°C';

  return (
    <Card className="w-full mb-4 animate-in fade-in-0 duration-500 shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle>24-Hour Forecast for {currentDay}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[550px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis 
                dataKey="temperature"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${value}${unitSymbol}`}
                domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
                ticks={yAxisTicks}
            />
            <ChartTooltip
              content={<ChartTooltipContent 
                formatter={(value, name, props) => (
                    <div className="flex flex-col text-sm p-2">
                        <div className="flex items-center space-x-2 mb-1">
                            <Thermometer className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground"><span className="font-bold">Temp:</span> {`${value}${unitSymbol}`}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground"><span className="font-bold">Feels Like:</span> {`${props.payload.apparentTemperature}${unitSymbol}`}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground"><span className="font-bold">Humidity:</span> {`${props.payload.relativeHumidity}%`}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                            <CloudRain className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground"><span className="font-bold">Precipitation:</span> {`${props.payload.precipitationProbability}%`}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Cloud className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground"><span className="font-bold">Weather:</span> {getWeatherDescription(props.payload.weatherCode)}</span>
                        </div>
                    </div>
                )}
                indicator="dot"
              />}
            />
            <Bar dataKey="temperature" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
