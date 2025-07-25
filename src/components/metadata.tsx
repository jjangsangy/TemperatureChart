import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, CloudRain, Thermometer, Clock } from "lucide-react";
import { format } from "date-fns";

interface MetadataProps {
  temperatureMax: number;
  temperatureMin: number;
  sunrise: string;
  sunset: string;
  precipitationProbabilityMax: number;
  daylightDuration: number;
  unit: 'fahrenheit' | 'celsius';
}

export function Metadata({
  temperatureMax,
  temperatureMin,
  sunrise,
  sunset,
  precipitationProbabilityMax,
  daylightDuration,
  unit,
}: MetadataProps) {

  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Daily Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <Thermometer data-testid="max-temp-icon" className="h-4 w-4 text-muted-foreground" />
          <span>Max Temp: {Math.round(temperatureMax)}°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <Thermometer data-testid="min-temp-icon" className="h-4 w-4 text-muted-foreground" />
          <span>Min Temp: {Math.round(temperatureMin)}°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <Sun data-testid="sunrise-icon" className="h-4 w-4 text-muted-foreground" />
          <span>Sunrise: {formatTime(sunrise)}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <Moon data-testid="sunset-icon" className="h-4 w-4 text-muted-foreground" />
          <span>Sunset: {formatTime(sunset)}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <CloudRain data-testid="rain-prob-icon" className="h-4 w-4 text-muted-foreground" />
          <span>Rain Prob: {precipitationProbabilityMax}%</span>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <Clock data-testid="daylight-icon" className="h-4 w-4 text-muted-foreground" />
          <span>Daylight: {formatDuration(daylightDuration)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
