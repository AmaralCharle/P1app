import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext';
import { colors, radius, spacing } from '../../theme';

export default function Login() {
  const { entrar } = useAuth();
  const router = useRouter();

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
          onPress={() => {
            entrar();
            router.replace('/');
          }}
        >
          <Text style={styles.buttonText}>Entrar no Academy Notes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.card,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.input,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});
