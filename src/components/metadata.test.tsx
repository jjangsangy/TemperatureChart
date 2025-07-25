import React from 'react';
import { render, screen } from '@testing-library/react';
import { Metadata } from './metadata';
import { format } from 'date-fns';

describe('Metadata', () => {
  const mockProps = {
    temperatureMax: 25,
    temperatureMin: 10,
    sunrise: '2025-07-24T05:30:00Z',
    sunset: '2025-07-24T20:00:00Z',
    precipitationProbabilityMax: 30,
    daylightDuration: 54000, // 15 hours in seconds
    unit: 'fahrenheit' as 'fahrenheit' | 'celsius',
  };

  it('renders the Daily Overview title', () => {
    render(<Metadata {...mockProps} />);
    expect(screen.getByText('Daily Overview')).toBeInTheDocument();
  });

  it('renders max and min temperatures correctly in Fahrenheit', () => {
    render(<Metadata {...mockProps} />);
    expect(screen.getByText(`Max Temp: ${Math.round(mockProps.temperatureMax)}°F`)).toBeInTheDocument();
    expect(screen.getByText(`Min Temp: ${Math.round(mockProps.temperatureMin)}°F`)).toBeInTheDocument();
  });

  it('renders max and min temperatures correctly in Celsius', () => {
    render(<Metadata {...mockProps} unit="celsius" />);
    expect(screen.getByText(`Max Temp: ${Math.round(mockProps.temperatureMax)}°C`)).toBeInTheDocument();
    expect(screen.getByText(`Min Temp: ${Math.round(mockProps.temperatureMin)}°C`)).toBeInTheDocument();
  });

  it('renders sunrise and sunset times correctly', () => {
    render(<Metadata {...mockProps} />);
    const formattedSunrise = format(new Date(mockProps.sunrise), "h:mm a");
    const formattedSunset = format(new Date(mockProps.sunset), "h:mm a");
    expect(screen.getByText(`Sunrise: ${formattedSunrise}`)).toBeInTheDocument();
    expect(screen.getByText(`Sunset: ${formattedSunset}`)).toBeInTheDocument();
  });

  it('renders precipitation probability correctly', () => {
    render(<Metadata {...mockProps} />);
    expect(screen.getByText(`Rain Prob: ${mockProps.precipitationProbabilityMax}%`)).toBeInTheDocument();
  });

  it('renders daylight duration correctly', () => {
    render(<Metadata {...mockProps} />);
    const hours = Math.floor(mockProps.daylightDuration / 3600);
    const minutes = Math.floor((mockProps.daylightDuration % 3600) / 60);
    expect(screen.getByText(`Daylight: ${hours}h ${minutes}m`)).toBeInTheDocument();
  });

  it('displays all icons', () => {
    render(<Metadata {...mockProps} />);
    expect(screen.getByTestId('max-temp-icon')).toBeInTheDocument();
    expect(screen.getByTestId('min-temp-icon')).toBeInTheDocument();
    expect(screen.getByTestId('sunrise-icon')).toBeInTheDocument();
    expect(screen.getByTestId('sunset-icon')).toBeInTheDocument();
    expect(screen.getByTestId('rain-prob-icon')).toBeInTheDocument();
    expect(screen.getByTestId('daylight-icon')).toBeInTheDocument();
  });
});
