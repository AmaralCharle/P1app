import { useTheme } from '../ThemeContext';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export function PersistenceGate({ ready, error, saving, retry, children }: PropsWithChildren<{
  ready: boolean; error: string | null; saving?: boolean; retry: () => unknown;
}>) {
  const { colors } = useTheme();
  const notice = <View style={{ padding: 16, gap: 10, backgroundColor: colors.backgroundPill }}>
    <Text accessibilityRole="alert" style={{ color: colors.warning, lineHeight: 21 }}>{error}</Text>
    <Pressable accessibilityRole="button" onPress={() => { void retry(); }} style={{ padding: 12, borderRadius: 10, backgroundColor: colors.primaryDark, alignSelf: 'flex-start' }}><Text style={{ color: colors.textInverse, fontWeight: '700' }}>Tentar novamente</Text></Pressable>
  </View>;
  if (!ready) return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16, backgroundColor: colors.background }}>
    <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Academy Notes</Text>
    {error ? notice : <><ActivityIndicator color={colors.primary} /><Text style={{ color: colors.textSoft }}>Carregando seus dados salvos...</Text></>}
  </View>;
  return <View style={{ flex: 1 }}>{error ? notice : saving ? <Text accessibilityLiveRegion="polite" style={{ paddingHorizontal: 16, paddingVertical: 4, backgroundColor: colors.backgroundPill, color: colors.textSecondary, fontSize: 12 }}>Salvando no aparelho...</Text> : null}{children}</View>;
}
