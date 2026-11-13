import type { ThemeColors } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext';

export default function Login() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { entrar, usuario, saving } = useAuth();
  if (usuario && !saving) return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Academy Notes</Text>
        <Text style={styles.subtitle}>
          Entre para acessar o painel acadêmico.
        </Text>

        <Pressable
          accessibilityRole="button"
          style={styles.button}
          disabled={saving}
          onPress={() => { void entrar(); }}
        >
          <Text style={styles.buttonText}>{saving ? 'Salvando sessão...' : 'Entrar no Academy Notes'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
