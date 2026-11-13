import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export function PersistenceGate({ ready, error, saving, retry, children }: PropsWithChildren<{
  ready: boolean; error: string | null; saving?: boolean; retry: () => unknown;
}>) {
  const notice = <View style={{ padding: 16, gap: 10, backgroundColor: '#18243a' }}>
    <Text accessibilityRole="alert" style={{ color: '#ffda7a', lineHeight: 21 }}>{error}</Text>
    <Pressable accessibilityRole="button" onPress={() => { void retry(); }} style={{ padding: 12, borderRadius: 10, backgroundColor: '#254db3', alignSelf: 'flex-start' }}><Text style={{ color: '#fff', fontWeight: '700' }}>Tentar novamente</Text></Pressable>
  </View>;
  if (!ready) return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16, backgroundColor: '#0b1020' }}>
    <Text style={{ color: '#f5f7ff', fontSize: 24, fontWeight: '800' }}>Academy Notes</Text>
    {error ? notice : <><ActivityIndicator color="#5b8cff" /><Text style={{ color: '#b7c5e6' }}>Carregando seus dados salvos...</Text></>}
  </View>;
  return <View style={{ flex: 1 }}>{error ? notice : saving ? <Text accessibilityLiveRegion="polite" style={{ paddingHorizontal: 16, paddingVertical: 4, backgroundColor: '#18243a', color: '#dfe8ff', fontSize: 12 }}>Salvando no aparelho...</Text> : null}{children}</View>;
}
