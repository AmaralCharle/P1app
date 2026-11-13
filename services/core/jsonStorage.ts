export type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  getAllKeys: () => Promise<readonly string[]>;
};
export type Validator<T> = (value: unknown) => value is T;

export function createJsonStorage(adapter: StorageAdapter) {
  const pending = new Map<string, Promise<void>>();
  function enqueue(key: string, operation: () => Promise<void>) {
    const job = (pending.get(key) ?? Promise.resolve()).catch(() => {}).then(operation);
    pending.set(key, job);
    void job.finally(() => { if (pending.get(key) === job) pending.delete(key); }).catch(() => {});
    return job;
  }
  return {
    async get<T>(key: string, fallback: T, validate: Validator<T>): Promise<T> {
      await pending.get(key)?.catch(() => {});
      const raw = await adapter.getItem(key);
      if (raw === null) return fallback;
      let value: unknown;
      try { value = JSON.parse(raw); } catch { throw new Error('Os dados salvos não puderam ser lidos. Nenhum dado foi substituído.'); }
      if (!validate(value)) throw new Error('Os dados salvos têm um formato incompatível. Nenhum dado foi substituído.');
      return value;
    },
    set<T>(key: string, value: T) {
      const serialized = JSON.stringify(value);
      if (serialized === undefined) return Promise.reject(new Error('Valor inválido para armazenamento.'));
      return enqueue(key, () => adapter.setItem(key, serialized));
    },
    remove: (key: string) => enqueue(key, () => adapter.removeItem(key)),
    async removePrefix(prefix: string) {
      await Promise.allSettled([...pending.values()]);
      const keys = await adapter.getAllKeys();
      await Promise.all(keys.filter(key => key.startsWith(prefix)).map(key => enqueue(key, () => adapter.removeItem(key))));
    },
  };
}
