import assert from 'node:assert/strict';
import test from 'node:test';
import { loadCachedResource } from '../services/core/cachedResource.ts';

function fixture(entry = null, overrides = {}) {
  let saved = entry;
  let calls = 0;
  const storage = { get: async () => saved, set: async (_key, value) => { saved = value; } };
  const options = {
    storage, key: 'weather:city', validate: value => Array.isArray(value),
    fetch: async () => { calls += 1; return ['novo']; }, signal: new AbortController().signal,
    online: true, ttlMs: 300000, now: () => 1000000, ...overrides,
  };
  return { options, get saved() { return saved; }, get calls() { return calls; } };
}
test('cache fresco evita chamada e força atualização quando solicitado', async () => {
  const f = fixture({ data: ['salvo'], savedAt: 999000 });
  const result = await loadCachedResource(f.options);
  assert.equal(result.source, 'cache');
  assert.equal(f.calls, 0);
  const fresh = await loadCachedResource({ ...f.options, force: true });
  assert.equal(fresh.source, 'network'); assert.equal(f.calls, 1);
});
test('cache vencido aparece antes da atualização e é substituído pela resposta', async () => {
  const events = [];
  const f = fixture({ data: ['antigo'], savedAt: 1 }, {
    onCached: entry => events.push(entry.data[0]), fetch: async () => { events.push('rede'); return ['novo']; },
  });
  const result = await loadCachedResource(f.options);
  assert.deepEqual(events, ['antigo', 'rede']);
  assert.deepEqual(result.data, ['novo']);
  assert.equal(f.saved.savedAt, 1000000);
});
test('sem internet usa cache e informa desatualização sem chamar a API', async () => {
  const f = fixture({ data: ['salvo'], savedAt: 1 }, { online: false });
  const result = await loadCachedResource(f.options);
  assert.equal(result.offline, true); assert.equal(result.stale, true);
  assert.equal(f.calls, 0); assert.match(result.warning, /desatualizada/);
});
test('primeira consulta offline sem cache mostra erro recuperável', async () => {
  const f = fixture(null, { online: false });
  await assert.rejects(loadCachedResource(f.options), /sem uma consulta salva/);
  assert.equal(f.calls, 0);
});
test('API indisponível conserva cache mas não inventa estado offline', async () => {
  const f = fixture({ data: ['salvo'], savedAt: 1 }, { fetch: async () => { throw new Error('HTTP 503'); } });
  const result = await loadCachedResource(f.options);
  assert.deepEqual(result.data, ['salvo']); assert.equal(result.offline, false);
  assert.match(result.warning, /Não foi possível atualizar/);
});
test('API indisponível sem cache preserva o erro original', async () => {
  const f = fixture(null, { fetch: async () => { throw new Error('HTTP 503'); } });
  await assert.rejects(loadCachedResource(f.options), /503/);
});
test('falha ao gravar cache não descarta dados válidos da API', async () => {
  const f = fixture();
  f.options.storage.set = async () => { throw new Error('quota'); };
  const result = await loadCachedResource(f.options);
  assert.equal(result.source, 'network'); assert.deepEqual(result.data, ['novo']);
  assert.match(result.warning, /não foi possível salvar/);
});
test('cache corrompido não impede consulta online', async () => {
  const f = fixture();
  f.options.storage.get = async () => { throw new Error('JSON inválido'); };
  const result = await loadCachedResource(f.options);
  assert.equal(result.source, 'network'); assert.deepEqual(result.data, ['novo']);
});
test('cancelar após resposta impede gravação e retorno de dados de outra tela', async () => {
  const controller = new AbortController();
  const f = fixture(null, { signal: controller.signal, fetch: async () => { controller.abort(); return ['novo']; } });
  await assert.rejects(loadCachedResource(f.options), /cancelada/);
  assert.equal(f.saved, null);
});
test('limpeza da sessão impede requisição antiga de recriar cache', async () => {
  const f = fixture(null, { shouldSave: () => false });
  assert.equal((await loadCachedResource(f.options)).source, 'network');
  assert.equal(f.saved, null);
});
test('cache no limite do TTL e relógio alterado são atualizados', async () => {
  for (const savedAt of [700000, 2000000]) {
    const f = fixture({ data: ['salvo'], savedAt });
    assert.equal((await loadCachedResource(f.options)).source, 'network');
  }
});
