import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import type { WeatherForecast } from '../types/weather';
import { Card, ui } from './AcademicUI';
import { colors } from '../theme';
import { weatherIcon, weatherStudyTip } from '../weatherPresentation';

export function WeatherHero({ weather }: { weather: WeatherForecast }) {
  const today = weather.forecast.forecastday[0];
  return <View style={weatherStyles.hero}>
    <View style={ui.spread}><Text style={weatherStyles.kicker}>ANTES DE SAIR PARA A AULA</Text><Feather name="map-pin" color={colors.info} size={20} /></View>
    <Text style={weatherStyles.city}>{weather.location.name}</Text>
    <Text style={ui.text}>{[weather.location.region, weather.location.country].filter(Boolean).join(' · ')}</Text>
    <View style={ui.spread}><Text style={weatherStyles.temperature}>{Math.round(weather.current.temp_c)}°<Text style={weatherStyles.unit}>C</Text></Text><Feather name={weatherIcon(weather.current.condition.text)} size={64} color={colors.info} /></View>
    <Text style={weatherStyles.condition}>{weather.current.condition.text}</Text>
    <Text style={ui.text}>Sensação de {Math.round(weather.current.feelslike_c)} °C</Text>
    <View style={weatherStyles.metrics}>
      <View style={weatherStyles.metric}><Feather name="droplet" size={18} color={colors.info} /><Text style={ui.muted}>Umidade</Text><Text style={weatherStyles.value}>{weather.current.humidity}%</Text></View>
      <View style={weatherStyles.metric}><Feather name="wind" size={18} color={colors.info} /><Text style={ui.muted}>Vento</Text><Text style={weatherStyles.value}>{weather.current.wind_kph.toFixed(0)} km/h</Text></View>
      <View style={weatherStyles.metric}><Feather name="cloud-rain" size={18} color={colors.info} /><Text style={ui.muted}>Chuva hoje</Text><Text style={weatherStyles.value}>{today ? `${today.day.daily_chance_of_rain}%` : '—'}</Text></View>
    </View>
    <Text style={ui.muted}>Atualizado em {weather.current.last_updated.split(' ').reverse().join(' · ')} · horário da cidade</Text>
  </View>;
}

export function WeatherTip({ chanceOfRain, maxTemperature }: { chanceOfRain: number; maxTemperature: number }) {
  return <Card><View style={ui.row}><Feather name="briefcase" color={colors.info} size={22} /><Text style={ui.heading}>Prepare sua mochila</Text></View><Text style={ui.text}>{weatherStudyTip(chanceOfRain, maxTemperature)}</Text><Text style={ui.muted}>Sugestão de organização com base na previsão, que pode mudar.</Text></Card>;
}

export function WeatherAttribution() {
  return <View style={{ gap: 6, paddingVertical: 12 }}><Link href="https://www.weatherapi.com/" style={[ui.muted, { color: colors.info }]}>Dados meteorológicos: WeatherAPI.com ↗</Link><Text style={ui.muted}>Previsão de tempo para a cidade consultada. Sem acesso ao GPS.</Text></View>;
}

export const weatherStyles = StyleSheet.create({
  hero: { backgroundColor: '#101f3b', borderColor: '#304f80', borderWidth: 1, borderRadius: 24, padding: 22, gap: 10 },
  kicker: { color: colors.info, fontSize: 10, letterSpacing: 1.1, fontWeight: '800', flexShrink: 1 },
  city: { color: colors.text, fontSize: 26, fontWeight: '800' },
  temperature: { color: colors.text, fontSize: 72, fontWeight: '800', letterSpacing: -3 },
  unit: { fontSize: 28, fontWeight: '500', letterSpacing: 0, color: colors.textSoft },
  condition: { color: colors.text, fontSize: 19, fontWeight: '700' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 8 },
  metric: { backgroundColor: '#0c172c', borderRadius: 14, padding: 12, flexGrow: 1, flexBasis: 90, gap: 6 },
  value: { color: colors.text, fontWeight: '800', fontSize: 16 },
  range: { color: colors.text, fontSize: 22, fontWeight: '800' },
});
