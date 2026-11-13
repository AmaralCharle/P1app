import { useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchContact } from '../../../services/api';
import { useRemoteData } from '../../../hooks/useRemoteData';
import { AcademicScreen, Action, Card, ui } from '../../../components/AcademicUI';
import { colors } from '../../../theme';

export default function Contato() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const load = useCallback((signal: AbortSignal) => fetchContact(Number(id), signal), [id]);
  const { data: contact, loading, error, reload } = useRemoteData(load);
  return <AcademicScreen title="Detalhe do contato" subtitle="Dados fictícios consultados na API pelo identificador do contato.">
    <Action label="Voltar aos contatos" icon="arrow-left" secondary onPress={() => router.replace('/contatos')} />
    {loading ? <Card><ActivityIndicator color={colors.primary} size="large" /><Text style={ui.text}>Buscando contato...</Text></Card> : error ? <Card>
      <Text style={ui.heading}>Não foi possível abrir o contato</Text><Text accessibilityRole="alert" style={ui.error}>{error}</Text><Action label="Tentar novamente" icon="refresh-cw" onPress={() => { void reload(); }} />
    </Card> : contact ? <>
      <Card><Text style={ui.badge}>Contato de demonstração #{contact.id}</Text><Text style={ui.title}>{contact.name}</Text><Text style={ui.text}>@{contact.username}</Text></Card>
      <Card><Text style={ui.heading}>Informações de contato</Text><Text selectable style={ui.text}>E-mail: {contact.email}</Text><Text selectable style={ui.text}>Telefone: {contact.phone}</Text><Text selectable style={ui.text}>Site: {contact.website}</Text></Card>
      <Card><Text style={ui.heading}>Endereço e organização</Text><Text style={ui.text}>{contact.address.street}, {contact.address.suite}</Text><Text style={ui.text}>{contact.address.city} · CEP {contact.address.zipcode}</Text><Text style={ui.text}>{contact.company.name}</Text></Card>
    </> : <Card><Text style={ui.text}>Contato não encontrado.</Text></Card>}
  </AcademicScreen>;
}
