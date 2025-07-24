
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

interface Forecast {
  time: string;
  temperature: number;
}

interface TemperatureChartProps {
  data: Forecast[];
  location: string;
  unit: 'f' | 'c'; // 'f' for Fahrenheit, 'c' for Celsius
}

const chartConfig = {
  temperature: {
    label: "Temperature",
  },
} satisfies ChartConfig;

export function TemperatureChart({ data, location, unit }: TemperatureChartProps) {
    const [currentHour, setCurrentHour] = useState<number | null>(null);
    const [currentDay, setCurrentDay] = useState<string | null>(null);

    useEffect(() => {
        const now = new Date();
        setCurrentHour(now.getHours());
        setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    }, []);
    
    const mappedData = data.map(item => {
        const date = new Date(item.time);
        const hour = date.getHours();
        return {
            hour: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', ''),
            temperature: Math.round(item.temperature), // Temperature is already in the correct unit from API
            fill: hour === currentHour ? 'hsl(var(--accent))' : 'hsl(var(--primary))'
        };
    });

    const maxTemp = Math.max(...mappedData.map(d => d.temperature));
    // Adjust top tick calculation for Celsius if needed, or keep it dynamic
    const topTick = Math.ceil((maxTemp + 10) / 10) * 10;
    const yAxisTicks = Array.from({ length: Math.floor(topTick / 10) + 1 }, (_, i) => i * 10);
    const chartData = mappedData;

    const unitSymbol = unit === 'f' ? '°F' : '°C';

  return (
    <Card className="w-full animate-in fade-in-0 duration-500 shadow-lg border-primary/20">
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
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value, name, props) => (
                    <div className="flex flex-col">
                        <span className="font-semibold">{props.payload.hour}</span>
                        <span className="text-muted-foreground">{`${value}${unitSymbol}`}</span>
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
