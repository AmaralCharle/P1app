import { useCallback, useEffect, useRef, useState } from 'react';

// Passe uma função estável (declarada no módulo ou com useCallback).
export function useRemoteData<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const active = useRef<AbortController | null>(null);
  const reload = useCallback(async () => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setState(current => ({ ...current, loading: true, error: null }));
    try {
      const data = await load(controller.signal);
      if (!controller.signal.aborted) setState({ data, loading: false, error: null });
    } catch (error) {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Não foi possível carregar os dados.' });
    }
  }, [load]);
  useEffect(() => {
    setState({ data: null, loading: true, error: null });
    void reload();
    return () => active.current?.abort();
  }, [reload]);
  return { ...state, reload };
}
