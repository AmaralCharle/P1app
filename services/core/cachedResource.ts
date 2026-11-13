import type { Validator } from './jsonStorage';

export type CacheEntry<T> = { data: T; savedAt: number };
export type CachedResult<T> = CacheEntry<T> & {
  source: 'network' | 'cache'; offline: boolean; stale: boolean; warning: string | null;
};
type CacheStorage = {
  get: <T>(key: string, fallback: T, validate: Validator<T>) => Promise<T>;
  set: <T>(key: string, value: T) => Promise<void>;
};
export async function loadCachedResource<T>(options: {
  storage: CacheStorage; key: string; validate: Validator<T>; fetch: () => Promise<T>;
  signal: AbortSignal; online: boolean; force?: boolean; ttlMs: number;
  now?: () => number; onCached?: (entry: CacheEntry<T>) => void; shouldSave?: () => boolean;
}): Promise<CachedResult<T>> {
  const now = options.now ?? Date.now;
  const cancelled = () => { if (options.signal.aborted) throw new Error('Consulta cancelada.'); };
  const valid = (value: unknown): value is CacheEntry<T> => !!value && typeof value === 'object'
    && 'data' in value && 'savedAt' in value && typeof value.savedAt === 'number' && Number.isFinite(value.savedAt) && value.savedAt > 0 && options.validate(value.data);
  let cached: CacheEntry<T> | null = null;
  let cacheReadFailed = false;
  try { cached = await options.storage.get<CacheEntry<T> | null>(options.key, null, (value): value is CacheEntry<T> | null => value === null || valid(value)); }
  catch { cacheReadFailed = true; }
  cancelled();
  if (cached) options.onCached?.(cached);
  const stale = !!cached && (now() - cached.savedAt >= options.ttlMs || now() < cached.savedAt);
  if (!options.online) {
    if (cached) return { ...cached, source: 'cache', offline: true, stale, warning: 'Você está sem conexão. A previsão salva pode estar desatualizada.' };
    throw new Error('Sem conexão e sem uma consulta salva para esta cidade. Conecte-se à internet para consultar pela primeira vez.');
  }
  if (cached && !stale && !options.force) return { ...cached, source: 'cache', offline: false, stale: false, warning: null };
  try {
    const data = await options.fetch();
    cancelled();
    const entry = { data, savedAt: now() };
    let warning = cacheReadFailed ? 'A consulta funcionou, mas houve uma falha na leitura do cache anterior.' : null;
    if (options.shouldSave?.() !== false) {
      try { await options.storage.set(options.key, entry); }
      catch { warning = 'Consulta online concluída, mas não foi possível salvar para uso sem internet.'; }
    }
    cancelled();
    return { ...entry, source: 'network', offline: false, stale: false, warning };
  } catch (error) {
    cancelled();
    if (cached) return { ...cached, source: 'cache', offline: false, stale, warning: 'Não foi possível atualizar o clima. Mostrando a última consulta salva, que pode estar desatualizada.' };
    throw error;
  }
}
