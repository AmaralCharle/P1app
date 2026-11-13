import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fetchContacts } from '../../services/api';
import { useRemoteData } from '../../hooks/useRemoteData';
import { Action, Card, ui } from '../../components/AcademicUI';
import { normalizeSearch } from '../../academic';
import { colors } from '../../theme';

export default function Contatos() {
  const { data, loading, error, reload } = useRemoteData(fetchContacts);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const contacts = (data ?? []).filter(contact => normalizeSearch(`${contact.name} ${contact.email} ${contact.address.city}`).includes(normalizeSearch(search)));
  return <FlatList
    style={ui.screen} contentContainerStyle={ui.container}
    data={error ? [] : contacts}
    keyExtractor={item => String(item.id)}
    keyboardShouldPersistTaps="handled"
    refreshing={loading && data !== null} onRefresh={() => { void reload(); }}
    ListHeaderComponent={<View style={{ gap: 16 }}>
      <Text style={ui.eyebrow}>ACADEMY NOTES / CONEXÕES</Text>
      <Text style={ui.title}>Contatos</Text>
      <Text style={ui.text}>Diretório de demonstração com pessoas fictícias do JSONPlaceholder. Os dados são consultados pela internet.</Text>
      <TextInput accessibilityLabel="Buscar contato" value={search} onChangeText={setSearch} style={ui.input} placeholder="Buscar nome, e-mail ou cidade" placeholderTextColor={colors.placeholder} />
      <Action label={loading ? 'Consultando contatos...' : 'Atualizar contatos'} icon="refresh-cw" secondary onPress={() => { void reload(); }} />
      {!!data && !error && <Text accessibilityLiveRegion="polite" style={ui.muted}>{contacts.length} de {data.length} contato(s) · consulta online</Text>}
    </View>}
    ListEmptyComponent={loading ? <Card><ActivityIndicator size="large" color={colors.primary} /><Text style={ui.text}>Buscando contatos na API...</Text></Card> : error ? <Card>
      <Text style={ui.heading}>Não foi possível carregar</Text><Text accessibilityRole="alert" style={ui.error}>{error}</Text><Action label="Tentar novamente" icon="refresh-cw" onPress={() => { void reload(); }} />
    </Card> : <Card><Text style={ui.heading}>Nenhum contato encontrado</Text><Text style={ui.text}>{search ? 'Tente outro nome, e-mail ou cidade.' : 'A API não retornou contatos. Você pode atualizar a lista.'}</Text></Card>}
    renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`Ver contato ${item.name}`} onPress={() => router.push({ pathname: '/contato/[id]', params: { id: String(item.id) } })} style={({ pressed }) => [ui.card, pressed && { opacity: 0.7 }]}>
      <View style={ui.spread}><Feather name="user" size={24} color={colors.info} /><Text style={ui.badge}>{item.address.city}</Text></View>
      <Text style={ui.heading}>{item.name}</Text><Text style={ui.text}>{item.email}</Text>
      <View style={ui.spread}><Text style={ui.muted}>{item.company.name}</Text><Feather name="arrow-right" size={20} color={colors.info} /></View>
    </Pressable>}
  />;
}
