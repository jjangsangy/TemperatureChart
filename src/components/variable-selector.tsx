'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, ThermometerSun, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariableSelectorProps {
  selectedVariable: string;
  onVariableChange: (variable: string) => void;
  className?: string;
}

export function VariableSelector({ selectedVariable, onVariableChange, className }: VariableSelectorProps) {
  const variables = [
    { value: 'temperature_2m', label: 'Temperature' },
    { value: 'apparent_temperature', label: 'Feels Like' },
    { value: 'relative_humidity_2m', label: 'Humidity' },
    { value: 'precipitation_probability', label: 'Precipitation' },
  ];

  const getVariableIcon = (variable: string) => {
    switch (variable) {
      case 'temperature_2m':
        return <Thermometer className="mr-2 h-4 w-4" />;
      case 'relative_humidity_2m':
        return <Droplets className="mr-2 h-4 w-4" />;
      case 'apparent_temperature':
        return <ThermometerSun className="mr-2 h-4 w-4" />;
      case 'precipitation_probability':
        return <CloudRain className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-start', className)}>
          {getVariableIcon(selectedVariable)}
          {variables.find((v) => v.value === selectedVariable)?.label || 'Select Variable'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px] z-50">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Hourly Variable</CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenuRadioGroup value={selectedVariable} onValueChange={onVariableChange}>
              {variables.map((variable) => (
                <DropdownMenuRadioItem key={variable.value} value={variable.value}>
                  {getVariableIcon(variable.value)}
                  {variable.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
