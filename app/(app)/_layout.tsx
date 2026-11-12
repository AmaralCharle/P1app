import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {
  Redirect,
  Slot,
  usePathname,
  useRouter,
} from 'expo-router';
import { useAuth } from '../../AuthContext';
import { StudentsProvider } from '../../StudentsContext';
import { colors, radius, spacing } from '../../theme';

const screenOrder = [
  { label: 'Dashboard', route: '/' },
  { label: 'Alunos', route: '/alunos' },
  { label: 'Adicionar', route: '/novo-aluno' },
  { label: 'Notas', route: '/notas' },
  { label: 'Relatórios', route: '/relatorios' },
  { label: 'Config', route: '/config' },
] as const;

export default function AppLayout() {
  const { usuario } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  if (!usuario) {
    return <Redirect href="/login" />;
  }

  return (
    <StudentsProvider>
      <View
        style={[
          styles.screen,
          colorScheme === 'dark' && styles.darkScreen,
        ]}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.textoBase, styles.eyebrow]}>
              Sistema acadêmico
            </Text>
            <Text style={[styles.titulo, styles.title]}>Academy Notes</Text>
            <Text style={[styles.subtitulo, styles.subtitle]}>
              Painel de desempenho e notas
            </Text>
          </View>

          <View style={styles.tabBar}>
            {screenOrder.map(({ label, route }) => {
              const isActive =
                route === '/'
                  ? pathname === '/'
                  : pathname === route || pathname.startsWith(`${route}/`);

              return (
                <Pressable
                  key={label}
                  style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                  ]}
                  onPress={() => router.replace(route)}
                >
                  <Text
                    style={[
                      styles.textoBase,
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Slot />
      </View>
    </StudentsProvider>
  );
}

const styles = StyleSheet.create({
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
  header: {
    marginBottom: spacing.md,
  },
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
  eyebrow: {
    color: colors.info,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 15,
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.card,
  },
  tabButton: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryBorder,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textInverse,
  },
});
