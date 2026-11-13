import type { Validator } from './jsonStorage';

type Persistence<T> = { read: () => Promise<T>; write: (value: T) => Promise<void> };
export type PersistedSnapshot<T> = { value: T; ready: boolean; saving: boolean; error: string | null };

// O store mantém efeitos fora dos callbacks de atualização do React e serializa as gravações.
export function createPersistedStore<T>(initial: T, persistence: Persistence<T>, validate: Validator<T>) {
  let state: PersistedSnapshot<T> = { value: initial, ready: false, saving: false, error: null };
  const listeners = new Set<() => void>();
  let revision = 0;
  let hydration = 0;
  let writes: Promise<void> = Promise.resolve();
  const publish = (next: PersistedSnapshot<T>) => { state = next; listeners.forEach(listener => listener()); };
  async function hydrate() {
    const attempt = ++hydration;
    publish({ ...state, error: null });
    try {
      const value = await persistence.read();
      if (attempt === hydration) publish({ value, ready: true, saving: false, error: null });
    } catch {
      if (attempt === hydration) publish({ ...state, error: 'Não foi possível carregar os dados salvos. Tente novamente; seus dados não foram substituídos.' });
    }
  }
  function update(next: T | ((current: T) => T)): Promise<boolean> {
    if (!state.ready) return Promise.resolve(false);
    const value = typeof next === 'function' ? (next as (current: T) => T)(state.value) : next;
    if (!validate(value)) return Promise.resolve(false);
    const currentRevision = ++revision;
    publish({ value, ready: true, saving: true, error: null });
    const job = writes.catch(() => {}).then(() => persistence.write(value));
    writes = job;
    return job.then(() => {
      if (currentRevision === revision) publish({ ...state, saving: false, error: null });
      return true;
    }, () => {
      if (currentRevision === revision) publish({ ...state, saving: false, error: 'A alteração está só na memória: não foi possível salvar no aparelho. Tente novamente antes de fechar o app.' });
      return false;
    });
  }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    hydrate, update,
    retry: () => state.ready ? update(state.value) : hydrate(),
  };
}
