import { loadCachedResource, type CacheEntry } from './core/cachedResource';
import { storage, storageKeys } from './storage';
import { fetchWeather, isWeatherForecast } from './weather';
import type { WeatherForecast } from '../types/weather';

export const WEATHER_TTL_MS = 5 * 60_000;
let generation = 0;
export function loadWeather(
  city: string,
  options: {
    signal: AbortSignal;
    online: boolean;
    force?: boolean;
    onCached?: (entry: CacheEntry<WeatherForecast>) => void;
  }
) {
  const attempt = generation;
  const normalized = city
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
  return loadCachedResource({
    ...options,
    storage,
    key: storageKeys.weatherPrefix + encodeURIComponent(normalized),
    validate: isWeatherForecast,
    fetch: () => fetchWeather(city, options.signal),
    ttlMs: WEATHER_TTL_MS,
    shouldSave: () => attempt === generation && !options.signal.aborted,
  });
}
export async function clearWeatherCache() {
  generation += 1;
  await storage.removePrefix(storageKeys.weatherPrefix);
}
