import { useTheme } from '../../../ThemeContext';
import { ActivityIndicator, FlatList, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useWeather } from '../../../hooks/useWeather';
import { Action, Card, useAcademicStyles } from '../../../components/AcademicUI';
import { WeatherAttribution, WeatherCacheNotice, WeatherTip, useWeatherStyles } from '../../../components/WeatherUI';
import { weatherDate, weatherIcon } from '../../../weatherPresentation';

export default function Previsao() {
  const { colors } = useTheme();
  const ui = useAcademicStyles();
  const weatherStyles = useWeatherStyles();
  const { data: date, cidade: city } = useLocalSearchParams<{ data: string; cidade: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data, loading, error, reload, cache } = useWeather(typeof city === 'string' ? city : '');
  const day = data?.forecast.forecastday.find(item => item.date === date);
  return <FlatList style={ui.screen} contentContainerStyle={[ui.container, width < 600 && { padding: 16 }]}
    data={error ? [] : day?.hour ?? []} keyExtractor={item => item.time}
    refreshing={loading && !!data} onRefresh={() => { void reload(); }}
    ListHeaderComponent={<View style={{ gap: 16 }}>
      <Text style={ui.eyebrow}>ACADEMY NOTES / SEU TRAJETO</Text><Text style={ui.title}>Previsão por horário</Text>
      <Action label="Voltar ao clima" icon="arrow-left" secondary onPress={() => router.replace({ pathname: '/clima', params: { cidade: typeof city === 'string' ? city : '' } })} />
      {!!day && !!data && !error && <>
        <WeatherCacheNotice cache={cache} loading={loading} />
        <Card><View style={ui.spread}><Text style={ui.heading}>{weatherDate(day.date)}</Text><Feather name={weatherIcon(day.day.condition.text)} size={32} color={colors.info} /></View><Text style={ui.text}>{data.location.name} · {data.location.region}</Text><Text style={weatherStyles.range}>{Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°</Text><Text style={ui.text}>{day.day.condition.text}</Text><Text style={ui.badge}>{day.day.daily_chance_of_rain}% de chance de chuva</Text></Card>
        <WeatherTip chanceOfRain={day.day.daily_chance_of_rain} maxTemperature={day.day.maxtemp_c} />
        <Text style={ui.heading}>Planeje o horário de saída</Text><Text style={ui.muted}>Horários locais de {data.location.name}. Atualize para consultar uma previsão mais recente.</Text>
        <Action label={loading ? 'Atualizando...' : 'Atualizar horários'} icon="refresh-cw" secondary onPress={() => { void reload(); }} />
      </>}
    </View>}
    ListEmptyComponent={loading ? <Card><ActivityIndicator color={colors.primary} size="large" /><Text style={ui.text}>Consultando a previsão...</Text></Card> : error ? <Card><Text style={ui.heading}>Não foi possível abrir a previsão</Text><Text accessibilityRole="alert" style={ui.error}>{error}</Text><Action label="Tentar novamente" icon="refresh-cw" onPress={() => { void reload(); }} /></Card> : <Card><Text style={ui.heading}>Sem horários disponíveis</Text><Text style={ui.text}>Este dia pode estar fora do período da previsão. Volte ao clima e selecione uma data disponível.</Text></Card>}
    renderItem={({ item }) => <Card><View style={ui.spread}><View style={ui.row}><Feather name={weatherIcon(item.condition.text)} size={24} color={colors.info} /><Text style={ui.heading}>{item.time.slice(-5)}</Text></View><Text style={weatherStyles.range}>{Math.round(item.temp_c)} °C</Text></View><Text style={ui.text}>{item.condition.text}</Text><Text style={ui.muted}>{item.chance_of_rain}% de chance de chuva</Text></Card>}
    ListFooterComponent={<WeatherAttribution />}
  />;
}
