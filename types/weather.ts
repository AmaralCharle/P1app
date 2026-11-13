export type WeatherCondition = { text: string; code: number };
export type ForecastHour = {
  time: string;
  temp_c: number;
  chance_of_rain: number;
  condition: WeatherCondition;
};
export type ForecastDay = {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    daily_chance_of_rain: number;
    condition: WeatherCondition;
  };
  hour: ForecastHour[];
};
export type WeatherForecast = {
  location: { name: string; region: string; country: string; lat: number; lon: number };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    last_updated: string;
    condition: WeatherCondition;
  };
  forecast: { forecastday: ForecastDay[] };
};
