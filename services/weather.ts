import type { WeatherForecast } from '../types/weather';

const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

export function hasWeatherApiKey() {
  const key = process.env.EXPO_PUBLIC_WEATHER_API_KEY?.trim();
  return !!key && key !== 'SUA_CHAVE_AQUI';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function numbers(value: Record<string, unknown>, keys: string[]) {
  return keys.every(key => typeof value[key] === 'number' && Number.isFinite(value[key]));
}
function condition(value: unknown) {
  return isRecord(value) && typeof value.text === 'string' && typeof value.code === 'number';
}
export function isWeatherForecast(value: unknown): value is WeatherForecast {
  if (!isRecord(value) || !isRecord(value.location) || !isRecord(value.current) || !isRecord(value.forecast)) return false;
  const { location, current, forecast } = value;
  return ['name', 'region', 'country'].every(key => typeof location[key] === 'string')
    && numbers(location, ['lat', 'lon'])
    && numbers(current, ['temp_c', 'feelslike_c', 'humidity', 'wind_kph'])
    && typeof current.last_updated === 'string' && condition(current.condition)
    && Array.isArray(forecast.forecastday) && forecast.forecastday.every(item => {
      if (!isRecord(item) || typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !isRecord(item.day)) return false;
      return numbers(item.day, ['maxtemp_c', 'mintemp_c', 'daily_chance_of_rain']) && condition(item.day.condition)
        && Array.isArray(item.hour) && item.hour.every(hour => isRecord(hour) && typeof hour.time === 'string'
          && numbers(hour, ['temp_c', 'chance_of_rain']) && condition(hour.condition));
    });
}

export async function fetchWeather(city: string, signal?: AbortSignal): Promise<WeatherForecast> {
  const query = city.trim();
  if (query.length < 2 || query.length > 100) throw new Error('Informe uma cidade com 2 a 100 caracteres.');
  if (!hasWeatherApiKey()) throw new Error('O serviço de clima ainda não foi ativado neste app.');
  const params = new URLSearchParams({
    key: process.env.EXPO_PUBLIC_WEATHER_API_KEY!.trim(), q: query,
    days: '3', lang: 'pt', aqi: 'no', alerts: 'no',
  });
  const controller = new AbortController();
  const cancel = () => controller.abort();
  let timedOut = false;
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', cancel);
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 12000);
  try {
    const response = await fetch(`${BASE_URL}?${params}`, { signal: controller.signal, headers: { Accept: 'application/json' } });
    const data: unknown = await response.json();
    if (!response.ok) {
      const code = isRecord(data) && isRecord(data.error) ? data.error.code : undefined;
      if (code === 1006) throw new Error('Cidade não encontrada. Tente informar também o estado ou o país.');
      if (code === 2006 || code === 1002) throw new Error('A chave do serviço de clima não é válida.');
      if (code === 2007) throw new Error('O limite de consultas do serviço de clima foi atingido.');
      if (code === 2008 || code === 2009) throw new Error('A conta do serviço de clima não tem acesso a esta consulta.');
      throw new Error(`O serviço de clima está indisponível (HTTP ${response.status}). Tente novamente.`);
    }
    if (!isWeatherForecast(data)) throw new Error('O serviço enviou dados de clima em um formato inesperado.');
    return data;
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timedOut) throw new Error('A consulta demorou demais. Verifique a internet e tente novamente.');
    if (error instanceof TypeError) throw new Error('Não foi possível conectar ao clima. Verifique sua internet.');
    if (error instanceof SyntaxError) throw new Error('O serviço de clima enviou uma resposta inválida.');
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
