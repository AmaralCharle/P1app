import { useCallback, useState, type ReactNode } from 'react';
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchWeather, hasWeatherApiKey } from '../../services/weather';
import { useRemoteData } from '../../hooks/useRemoteData';
import { Action, Card, ui } from '../../components/AcademicUI';
import { WeatherAttribution, WeatherHero, WeatherTip, weatherStyles } from '../../components/WeatherUI';
import { weatherDate, weatherIcon } from '../../weatherPresentation';
import { colors } from '../../theme';

function ForecastResults({ city, header }: { city: string; header: ReactNode }) {
  const router = useRouter();
  const load = useCallback((signal: AbortSignal) => fetchWeather(city, signal), [city]);
  const { data, loading, error, reload } = useRemoteData(load);
  const { width } = useWindowDimensions();
  const days = data?.forecast.forecastday ?? [];
  return <FlatList style={ui.screen} contentContainerStyle={[ui.container, width < 600 && { padding: 16 }]}
    data={error ? [] : days} keyExtractor={item => item.date} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
    refreshing={loading && !!data} onRefresh={() => { void reload(); }}
    ListHeaderComponent={<View style={{ gap: 16 }}>{header}
      {data && !error && <>
        <WeatherHero weather={data} />
        {!!days.length && <WeatherTip chanceOfRain={days[0].day.daily_chance_of_rain} maxTemperature={days[0].day.maxtemp_c} />}
        <View style={ui.spread}><Text style={ui.heading}>Próximos dias</Text><Text style={ui.badge}>Previsão de até 3 dias</Text></View>
        <Text style={ui.muted}>Toque em um dia para consultar os horários.</Text>
        <Action label={loading ? 'Atualizando...' : 'Atualizar previsão'} secondary icon="refresh-cw" onPress={() => { void reload(); }} />
      </>}
    </View>}
    ListEmptyComponent={loading ? <Card><ActivityIndicator size="large" color={colors.primary} /><Text style={ui.text}>Consultando o tempo em {city}...</Text></Card> : error ? <Card><Text style={ui.heading}>Não foi possível consultar</Text><Text accessibilityRole="alert" style={ui.error}>{error}</Text><Action label="Tentar novamente" icon="refresh-cw" onPress={() => { void reload(); }} /></Card> : <Card><Text style={ui.heading}>Sem previsão disponível</Text><Text style={ui.text}>O serviço não retornou dias para esta cidade. Tente atualizar a consulta.</Text></Card>}
    renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`Ver previsão de ${weatherDate(item.date)}`} onPress={() => router.push({ pathname: '/previsao/[data]', params: { data: item.date, cidade: city } })} style={({ pressed }) => [ui.card, pressed && { opacity: 0.7 }]}>
      <View style={ui.spread}><Text style={ui.heading}>{weatherDate(item.date)}</Text><Feather name={weatherIcon(item.day.condition.text)} size={26} color={colors.info} /></View>
      <Text style={ui.text}>{item.day.condition.text}</Text>
      <View style={ui.spread}><Text style={weatherStyles.range}>{Math.round(item.day.maxtemp_c)}° <Text style={ui.muted}>/ {Math.round(item.day.mintemp_c)}°</Text></Text><Text style={ui.badge}>{item.day.daily_chance_of_rain}% de chuva</Text></View>
      <View style={ui.spread}><Text style={ui.muted}>Ver previsão por horário</Text><Feather name="arrow-right" size={18} color={colors.info} /></View>
    </Pressable>}
    ListFooterComponent={<WeatherAttribution />}
  />;
}

export default function Clima() {
  const { cidade } = useLocalSearchParams<{ cidade?: string }>();
  const initialCity = typeof cidade === 'string' ? cidade : '';
  const [draft, setDraft] = useState(initialCity);
  const [search, setSearch] = useState(initialCity ? { city: initialCity, revision: 0 } : null);
  const [error, setError] = useState('');
  const { width } = useWindowDimensions();
  const configured = hasWeatherApiKey();
  function consult() {
    const city = draft.trim();
    if (city.length < 2 || city.length > 100) { setError('Digite uma cidade com 2 a 100 caracteres.'); return; }
    setError(''); Keyboard.dismiss();
    setSearch(current => ({ city, revision: (current?.revision ?? 0) + 1 }));
  }
  const header = <View style={{ gap: 16 }}>
    <Text style={ui.eyebrow}>ACADEMY NOTES / SUA ROTINA</Text><Text style={ui.title}>Clima para sua rotina</Text>
    <Text style={ui.text}>Vai sair para a aula? Consulte o tempo na sua cidade e organize o trajeto.</Text>
    <Card><View style={ui.row}><Feather name="map-pin" size={20} color={colors.info} /><Text style={ui.heading}>Onde você estuda?</Text></View>
      <TextInput accessibilityLabel="Cidade para consultar o clima" value={draft} onChangeText={setDraft} placeholder="Ex.: Vassouras, Rio de Janeiro" placeholderTextColor={colors.placeholder} style={ui.input} maxLength={100} returnKeyType="search" onSubmitEditing={consult} />
      {!!error && <Text accessibilityRole="alert" style={ui.error}>{error}</Text>}
      <Action label="Consultar cidade" icon="search" onPress={consult} />
    </Card>
  </View>;
  return <KeyboardAvoidingView style={ui.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    {configured && search ? <ForecastResults key={`${search.city}:${search.revision}`} city={search.city} header={header} /> : <ScrollView style={ui.screen} contentContainerStyle={[ui.container, width < 600 && { padding: 16 }]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      {header}<Card><Feather name={configured ? 'cloud' : 'key'} size={36} color={colors.info} /><Text style={ui.heading}>{configured ? 'Sua próxima parada começa aqui' : 'Clima ainda não ativado'}</Text><Text style={ui.text}>{configured ? 'Informe a cidade para ver temperatura, chance de chuva e previsão dos próximos dias.' : 'O serviço de clima precisa ser ativado pela equipe do app antes da primeira consulta.'}</Text></Card><WeatherAttribution />
    </ScrollView>}
  </KeyboardAvoidingView>;
}
