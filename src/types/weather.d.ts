declare module '@/config/weather-codes.json' {
  type LucideIconName =
    | 'Sun'
    | 'Moon'
    | 'CloudSun'
    | 'CloudMoon'
    | 'Cloudy'
    | 'Cloud'
    | 'CloudFog'
    | 'CloudDrizzle'
    | 'CloudRain'
    | 'CloudSnow'
    | 'Snowflake'
    | 'CloudLightning'
    | 'CloudHail';

  interface WeatherCodeIcon {
    day: LucideIconName;
    night: LucideIconName;
  }

  interface WeatherCodeColor {
    day: string;
    night: string;
  }

  interface WeatherCodeEntry {
    description: string;
    icon: WeatherCodeIcon;
    color: WeatherCodeColor;
  }

  const weatherCodes: {
    [key: string]: WeatherCodeEntry;
    default: WeatherCodeEntry;
  };

  export default weatherCodes;
}
