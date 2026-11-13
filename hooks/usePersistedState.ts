import { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPersistedStore } from '../services/core/persistedStore';
import type { Validator } from '../services/core/jsonStorage';
import { storage } from '../services/storage';

// Chave, valor inicial e validador são estáveis durante a vida do provider.
export function usePersistedState<T>(key: string, initial: T, validate: Validator<T>) {
  const storeRef = useRef<ReturnType<typeof createPersistedStore<T>> | null>(null);
  if (!storeRef.current) storeRef.current = createPersistedStore(initial, {
    read: () => storage.get(key, initial, validate),
    write: value => storage.set(key, value),
  }, validate);
  const store = storeRef.current;
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useEffect(() => { void store.hydrate(); }, [store]);
  return { ...state, update: store.update, retry: store.retry };
}
