import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchContacts, fetchContact } from '../services/api.ts';

const contact = { id: 1, name: 'Contato teste', username: 'teste', email: 'teste@example.com', phone: '123', website: 'example.com', address: { street: 'Rua', suite: '1', city: 'Cidade', zipcode: '123' }, company: { name: 'Empresa' } };
function mockFetch(t, handler) {
  const previous = globalThis.fetch;
  globalThis.fetch = handler;
  t.after(() => { globalThis.fetch = previous; });
}

test('consulta lista por HTTPS e aceita lista vazia', async t => {
  mockFetch(t, async (url, options) => {
    assert.equal(url, 'https://jsonplaceholder.typicode.com/users');
    assert.ok(options.signal);
    return Response.json([]);
  });
  assert.deepEqual(await fetchContacts(), []);
});
test('busca detalhe pelo id e preserva os campos do contato', async t => {
  mockFetch(t, async url => { assert.equal(url.endsWith('/users/1'), true); return Response.json(contact); });
  assert.deepEqual(await fetchContact(1), contact);
});
test('rejeita id inválido antes de acessar a rede', async t => {
  mockFetch(t, () => { assert.fail('Não deveria consultar a API'); });
  for (const id of [NaN, -1, 0, 1.5]) await assert.rejects(fetchContact(id), /Identificador/);
});
test('trata contato inexistente e erros HTTP', async t => {
  mockFetch(t, async () => new Response('', { status: 404 }));
  await assert.rejects(fetchContact(99), /Contato não encontrado/);
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(fetchContacts(), /503/);
});
test('rejeita lista e detalhe com formato inválido', async t => {
  mockFetch(t, async () => Response.json([{ id: 1 }]));
  await assert.rejects(fetchContacts(), /lista de contatos inválida/);
  globalThis.fetch = async () => Response.json({ ...contact, address: null });
  await assert.rejects(fetchContact(1), /contato inválido/);
});
test('exibe mensagem compreensível em falha de conexão', async t => {
  mockFetch(t, async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(fetchContacts(), /Verifique sua internet/);
});
test('repassa cancelamento da tela para a requisição', async t => {
  mockFetch(t, async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  const controller = new AbortController();
  const pending = fetchContacts(controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});
