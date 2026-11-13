import assert from 'node:assert/strict';
import test from 'node:test';
import { createJsonStorage } from '../services/core/jsonStorage.ts';
import { createPersistedStore } from '../services/core/persistedStore.ts';
import {
  isStudentList,
  isAcademicData,
  isSession,
} from '../services/validators.ts';

function fixture(entries = []) {
  const values = new Map(entries);
  const writes = [];
  const adapter = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      writes.push([key, value]);
      values.set(key, value);
    },
    removeItem: async (key) => {
      values.delete(key);
    },
    getAllKeys: async () => [...values.keys()],
  };
  return { values, writes, adapter, storage: createJsonStorage(adapter) };
}
const isNumber = (value) => typeof value === 'number';

test('primeira leitura usa padrão sem gravar por cima de dados', async () => {
  const f = fixture();
  assert.equal(await f.storage.get('count', 3, isNumber), 3);
  assert.equal(f.writes.length, 0);
});
test('JSON corrompido e formato incompatível são preservados', async () => {
  const f = fixture([
    ['bad', '{invalido'],
    ['wrong', '"texto"'],
  ]);
  await assert.rejects(
    f.storage.get('bad', 0, isNumber),
    /Nenhum dado foi substituído/
  );
  await assert.rejects(f.storage.get('wrong', 0, isNumber), /incompatível/);
  assert.equal(f.values.get('bad'), '{invalido');
  assert.equal(f.writes.length, 0);
});
test('gravações concorrentes mantêm ordem e a leitura espera a última', async () => {
  const f = fixture();
  const first = f.storage.set('count', 1);
  const second = f.storage.set('count', 2);
  assert.equal(await f.storage.get('count', 0, isNumber), 2);
  await Promise.all([first, second]);
  assert.deepEqual(
    f.writes.map(([, value]) => value),
    ['1', '2']
  );
});
test('limpeza por prefixo preserva sessão, preferências e dados de outros apps', async () => {
  const f = fixture([
    ['academy:v1:weather:a', '1'],
    ['academy:v1:students', '[]'],
    ['other:weather', '2'],
  ]);
  await f.storage.removePrefix('academy:v1:weather:');
  assert.equal(f.values.has('academy:v1:weather:a'), false);
  assert.equal(f.values.has('academy:v1:students'), true);
  assert.equal(f.values.has('other:weather'), true);
});
test('hidratação bloqueia alterações até ler os dados e não grava o padrão', async () => {
  const f = fixture([['count', '7']]);
  const store = createPersistedStore(
    0,
    {
      read: () => f.storage.get('count', 0, isNumber),
      write: (value) => f.storage.set('count', value),
    },
    isNumber
  );
  assert.equal(await store.update(9), false);
  await store.hydrate();
  assert.equal(store.getSnapshot().value, 7);
  assert.equal(store.getSnapshot().ready, true);
  assert.equal(f.writes.length, 0);
});
test('falha de hidratação permite tentar de novo sem perder conteúdo', async () => {
  let failing = true;
  const store = createPersistedStore(
    0,
    {
      read: async () => {
        if (failing) throw new Error('disco');
        return 8;
      },
      write: async () => assert.fail('Não deve gravar'),
    },
    isNumber
  );
  await store.hydrate();
  assert.equal(store.getSnapshot().ready, false);
  assert.ok(store.getSnapshot().error);
  failing = false;
  await store.retry();
  assert.equal(store.getSnapshot().value, 8);
});
test('atualizações funcionais rápidas preservam todos os incrementos', async () => {
  const saved = [];
  const store = createPersistedStore(
    0,
    {
      read: async () => 0,
      write: async (value) => {
        saved.push(value);
      },
    },
    isNumber
  );
  await store.hydrate();
  await Promise.all([
    store.update((value) => value + 1),
    store.update((value) => value + 1),
    store.update((value) => value + 1),
  ]);
  assert.equal(store.getSnapshot().value, 3);
  assert.deepEqual(saved, [1, 2, 3]);
  assert.equal(store.getSnapshot().saving, false);
});
test('erro de gravação mantém o trabalho em memória e retry salva o valor recente', async () => {
  let failing = true;
  let saved = 0;
  const store = createPersistedStore(
    0,
    {
      read: async () => 0,
      write: async (value) => {
        if (failing) throw new Error('quota');
        saved = value;
      },
    },
    isNumber
  );
  await store.hydrate();
  assert.equal(await store.update(9), false);
  assert.equal(store.getSnapshot().value, 9);
  assert.match(store.getSnapshot().error, /só na memória/);
  failing = false;
  await store.retry();
  assert.equal(saved, 9);
  assert.equal(store.getSnapshot().error, null);
});
test('reabrir um store recupera exatamente o último valor confirmado', async () => {
  const f = fixture();
  const open = () =>
    createPersistedStore(
      0,
      {
        read: () => f.storage.get('count', 0, isNumber),
        write: (value) => f.storage.set('count', value),
      },
      isNumber
    );
  const first = open();
  await first.hydrate();
  await first.update(42);
  const reopened = open();
  await reopened.hydrate();
  assert.equal(reopened.getSnapshot().value, 42);
});
test('validadores impedem notas inválidas, ids duplicados e agenda incompatível', () => {
  const student = {
    id: 1,
    name: 'Ana',
    curso: 'Software',
    notas: { Física: 8 },
  };
  assert.equal(isStudentList([student]), true);
  assert.equal(isStudentList([student, student]), false);
  assert.equal(isStudentList([{ ...student, notas: { Física: 12 } }]), false);
  assert.equal(isAcademicData({ events: [], completedSessions: [] }), true);
  assert.equal(isAcademicData({ events: [{}], completedSessions: [] }), false);
  assert.equal(isSession('Admin'), true);
  assert.equal(isSession({ token: 'nao-existe' }), false);
});
