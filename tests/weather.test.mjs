import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchWeather, hasWeatherApiKey } from '../services/weather.ts';
import { weatherDate, weatherIcon, weatherStudyTip } from '../weatherPresentation.ts';

const payload = {
  location: { name: 'Vassouras', region: 'Rio de Janeiro', country: 'Brazil', lat: -22.4, lon: -43.7 },
  current: { temp_c: 25, feelslike_c: 26, humidity: 70, wind_kph: 10, last_updated: '2026-11-13 10:00', condition: { text: 'Sol', code: 1000 } },
  forecast: { forecastday: [{ date: '2026-11-13', day: { maxtemp_c: 29, mintemp_c: 20, daily_chance_of_rain: 40, condition: { text: 'Nublado', code: 1006 } }, hour: [{ time: '2026-11-13 10:00', temp_c: 25, chance_of_rain: 40, condition: { text: 'Nublado', code: 1006 } }] }] },
};
function setup(t, handler) {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  process.env.EXPO_PUBLIC_WEATHER_API_KEY = 'test-only-key';
  globalThis.fetch = handler;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    else process.env.EXPO_PUBLIC_WEATHER_API_KEY = originalKey;
  });
}

test('consulta cidade real com HTTPS, chave, português e três dias', async t => {
  setup(t, async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://api.weatherapi.com');
    assert.equal(parsed.pathname, '/v1/forecast.json');
    assert.equal(parsed.searchParams.get('q'), 'São Paulo, Brasil');
    assert.equal(parsed.searchParams.get('key'), 'test-only-key');
    assert.equal(parsed.searchParams.get('lang'), 'pt');
    assert.equal(parsed.searchParams.get('days'), '3');
    assert.ok(options.signal);
    return Response.json(payload);
  });
  assert.deepEqual(await fetchWeather(' São Paulo, Brasil '), payload);
});
test('chave ausente ou de exemplo não faz chamada externa', async t => {
  setup(t, () => assert.fail('Não deve chamar a rede'));
  for (const value of ['', '  ', 'SUA_CHAVE_AQUI']) {
    process.env.EXPO_PUBLIC_WEATHER_API_KEY = value;
    assert.equal(hasWeatherApiKey(), false);
    await assert.rejects(fetchWeather('Vassouras'), /ativado/);
  }
});
test('cidade inválida é rejeitada antes da chamada', async t => {
  setup(t, () => assert.fail('Não deve chamar a rede'));
  for (const city of ['', ' ', 'A', 'x'.repeat(101)]) await assert.rejects(fetchWeather(city), /cidade/);
});
test('trata cidade inexistente, chave inválida, quota e indisponibilidade', async t => {
  setup(t, async () => Response.json({ error: { code: 1006 } }, { status: 400 }));
  await assert.rejects(fetchWeather('Cidade desconhecida'), /Cidade não encontrada/);
  globalThis.fetch = async () => Response.json({ error: { code: 2006 } }, { status: 401 });
  await assert.rejects(fetchWeather('Vassouras'), /chave.*não é válida/);
  globalThis.fetch = async () => Response.json({ error: { code: 2007 } }, { status: 403 });
  await assert.rejects(fetchWeather('Vassouras'), /limite de consultas/);
  globalThis.fetch = async () => Response.json({}, { status: 503 });
  await assert.rejects(fetchWeather('Vassouras'), /503/);
});
test('permite estado vazio e rejeita previsão malformada', async t => {
  setup(t, async () => Response.json({ ...payload, forecast: { forecastday: [] } }));
  assert.deepEqual((await fetchWeather('Vassouras')).forecast.forecastday, []);
  globalThis.fetch = async () => Response.json({ ...payload, current: { temp_c: 25 } });
  await assert.rejects(fetchWeather('Vassouras'), /formato inesperado/);
});
test('falha de rede e resposta não JSON mostram mensagens claras', async t => {
  setup(t, async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(fetchWeather('Vassouras'), /Verifique sua internet/);
  globalThis.fetch = async () => new Response('<html>Falha</html>');
  await assert.rejects(fetchWeather('Vassouras'), /resposta inválida/);
});
test('cancelar ao sair da tela interrompe a consulta', async t => {
  setup(t, (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))));
  const controller = new AbortController();
  const pending = fetchWeather('Vassouras', controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});
test('sugestões de organização usam chuva e temperatura da previsão', () => {
  assert.match(weatherStudyTip(50, 25), /Guarda-chuva/);
  assert.match(weatherStudyTip(10, 30), /Leve água/);
  assert.match(weatherStudyTip(10, 25), /material separado/);
  assert.equal(weatherIcon('Chuva leve'), 'cloud-rain');
  assert.equal(weatherIcon('Céu limpo'), 'sun');
  assert.equal(weatherIcon('Trovoada'), 'cloud-lightning');
  assert.match(weatherDate('2026-11-13'), /13\/11/);
});
