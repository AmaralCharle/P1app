import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnline } from './useOnline';
import { loadWeather } from '../services/weatherCache';
import type { WeatherForecast } from '../types/weather';
import type { CachedResult } from '../services/core/cachedResource';

type WeatherState = {
  data: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  cache: Omit<CachedResult<WeatherForecast>, 'data'> | null;
};
export function useWeather(city: string) {
  const online = useOnline();
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
    cache: null,
  });
  const active = useRef<AbortController | null>(null);
  const previousOnline = useRef(online);
  const run = useCallback(
    async (force: boolean) => {
      active.current?.abort();
      const controller = new AbortController();
      active.current = controller;
      setState((current) => ({ ...current, loading: true, error: null }));
      try {
        const result = await loadWeather(city, {
          signal: controller.signal,
          online,
          force,
          onCached: (entry) => {
            if (!controller.signal.aborted)
              setState({
                data: entry.data,
                loading: true,
                error: null,
                cache: {
                  savedAt: entry.savedAt,
                  source: 'cache',
                  offline: !online,
                  stale: true,
                  warning: null,
                },
              });
          },
        });
        if (!controller.signal.aborted) {
          const { data, ...cache } = result;
          setState({ data, loading: false, error: null, cache });
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            data: null,
            loading: false,
            cache: null,
            error:
              error instanceof Error
                ? error.message
                : 'Não foi possível carregar o clima.',
          });
      }
    },
    [city, online]
  );
  useEffect(() => {
    const reconnected = !previousOnline.current && online;
    previousOnline.current = online;
    void run(reconnected);
    return () => active.current?.abort();
  }, [run, online]);
  const reload = useCallback(() => run(true), [run]);
  return { ...state, reload, online };
}
