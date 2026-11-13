import { ScreenShell } from '../../components/ScreenShell';
import type { ThemeColors } from '../../theme';
import { useTheme } from '../../ThemeContext';
import {
  Platform,
  Pressable,
  ScrollView,
  Switch,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing } from '../../theme';
import { useAuth } from '../../AuthContext';

export default function Config() {
  const { colors, mode, setMode, lastCity } = useTheme();
  const styles = createStyles(colors);
  const colorScheme = useColorScheme();
  const { usuario, sair } = useAuth();

  return (
    <SafeAreaView
      edges={[]}
      style={[styles.screen, colorScheme === 'dark' && styles.darkScreen]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenShell
          styles={styles}
          title="Configurações"
          subtitle="Informações do app acadêmico"
        >
          <View style={styles.configBox}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.textoBase, styles.configText]}>
                  Tema escuro
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  Sua escolha fica salva neste aparelho.
                </Text>
              </View>
              <Switch
                accessibilityLabel="Tema escuro"
                value={mode === 'dark'}
                onValueChange={(value) => setMode(value ? 'dark' : 'light')}
                trackColor={{
                  false: colors.borderInput,
                  true: colors.primaryDark,
                }}
                thumbColor={colors.textInverse}
              />
            </View>
            <Text style={[styles.textoBase, styles.configText]}>
              Sessão: {usuario}
            </Text>
            <Text style={[styles.textoBase, styles.configText]}>
              App: Academy Notes
            </Text>
            <Text style={[styles.textoBase, styles.configText]}>
              Tipo: React Native + Expo
            </Text>
            <Text style={[styles.textoBase, styles.configText]}>
              Dados acadêmicos: salvos neste aparelho
            </Text>
            <Text style={[styles.textoBase, styles.configText]}>
              Objetivo: gestão de notas universitárias
            </Text>
            <Text style={[styles.textoBase, styles.configText]}>
              Última cidade: {lastCity || 'Nenhuma consulta ainda'}
            </Text>
            <Text style={[styles.textoBase, styles.configText]}>
              Clima: consulta real com cache local
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={sair}
            style={{
              marginTop: spacing.md,
              padding: spacing.input,
              borderRadius: radius.md,
              backgroundColor: colors.dangerBackground,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.danger, fontWeight: '700' }}>
              Sair da conta
            </Text>
          </Pressable>
        </ScreenShell>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    titulo: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    subtitulo: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textSoft,
    },
    textoBase: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
    },
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundCard,
    },
    darkScreen: {
      backgroundColor: colors.background,
    },
    container: {
      padding: spacing.card,
      paddingTop: Platform.select({ ios: 20, android: 8 }),
      paddingBottom: spacing.bottom,
    },
    card: {
      flex: 1,
      backgroundColor: colors.backgroundCard,
      borderRadius: radius.xl,
      padding: spacing.card,
      marginBottom: spacing.card,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
      marginBottom: spacing.compact,
    },
    subtitleText: {
      color: colors.textSoft,
      fontSize: 13,
      marginBottom: spacing.input,
    },
    configBox: {
      backgroundColor: colors.backgroundSoft,
      borderRadius: radius.md,
      padding: spacing.input,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    configText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: spacing.sm,
    },
  });
