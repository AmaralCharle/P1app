import type { Contact } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

function isContact(value: unknown): value is Contact {
  if (!value || typeof value !== 'object') return false;
  const item = value as Contact;
  return Number.isInteger(item.id) && item.id > 0
    && ['name', 'username', 'email', 'phone', 'website'].every(key => typeof item[key as keyof Contact] === 'string')
    && !!item.address && ['street', 'suite', 'city', 'zipcode'].every(key => typeof item.address[key as keyof Contact['address']] === 'string')
    && !!item.company && typeof item.company.name === 'string';
}

// A URL HTTPS funciona no celular sem apontar para localhost ou para o IP do computador.
async function request(path: string, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  let timedOut = false;
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', cancel);
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 12000);
  try {
    const response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (response.status === 404) throw new Error('Contato não encontrado.');
    if (!response.ok) throw new Error(`O serviço respondeu com erro ${response.status}. Tente novamente.`);
    return await response.json();
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timedOut) throw new Error('A consulta demorou demais. Verifique sua conexão e tente novamente.');
    if (error instanceof TypeError) throw new Error('Não foi possível conectar. Verifique sua internet e tente novamente.');
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}

export async function fetchContacts(signal?: AbortSignal): Promise<Contact[]> {
  const data = await request('/users', signal);
  if (!Array.isArray(data) || !data.every(isContact)) throw new Error('O serviço enviou uma lista de contatos inválida.');
  return data;
}

export async function fetchContact(id: number, signal?: AbortSignal): Promise<Contact> {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Identificador de contato inválido.');
  const data = await request(`/users/${id}`, signal);
  if (!isContact(data)) throw new Error('O serviço enviou um contato inválido.');
  return data;
}
