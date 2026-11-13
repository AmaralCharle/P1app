import type { ThemeColors } from '../../theme';
import { useTheme } from '../../ThemeContext';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Redirect,
  Slot,
  usePathname,
  useRouter,
} from 'expo-router';
import { useAuth } from '../../AuthContext';
import { StudentsProvider } from '../../StudentsContext';
import { AcademicProvider } from '../../AcademicContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenOrder = [
  { label: 'Dashboard', route: '/' },
  { label: 'Alunos', route: '/alunos' },
  { label: 'Adicionar', route: '/novo-aluno' },
  { label: 'Notas', route: '/notas' },
  { label: 'Relatórios', route: '/relatorios' },
  { label: 'Disciplinas', route: '/disciplinas' },
  { label: 'Agenda', route: '/agenda' },
  { label: 'Estudos', route: '/plano-estudos' },
  { label: 'Clima', route: '/clima' },
  { label: 'Config', route: '/config' },
] as const;

export default function AppLayout() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { usuario } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 1040;

  if (!usuario) {
    return <Redirect href="/login" />;
  }

  return (
    <StudentsProvider>
      <AcademicProvider>
      <SafeAreaView style={styles.screen}>
        <View
          style={[
            styles.headerContainer,
            {
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 12 : 24,
              padding: isMobile ? 16 : 24,
            },
          ]}
        >
          <View style={styles.brand}>
            <Text style={styles.eyebrow}>Sistema acadêmico</Text>
            <Text style={[styles.title, isMobile && { fontSize: 28 }]}>Academy Notes</Text>
            <Text style={styles.subtitle}>Painel de desempenho e notas</Text>
          </View>

          <ScrollView
            style={{ flexGrow: 0, flexShrink: 1, maxWidth: '100%' }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingBottom: 10,
              paddingRight: 20,
            }}
          >
            {screenOrder.map(({ label, route }) => {
              const isActive =
                route === '/'
                  ? pathname === '/'
                    : pathname === route || pathname.startsWith(`${route}/`) || (route === '/disciplinas' && pathname.startsWith('/disciplina/')) || (route === '/clima' && pathname.startsWith('/previsao/'));

              return (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={`Ir para ${label}`}
                  accessibilityState={{ selected: isActive }}
                  style={[
                    styles.tabButton,
                    isActive ? styles.tabButtonActive : styles.tabButtonInactive,
                  ]}
                  onPress={() => router.replace(route)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
      </AcademicProvider>
    </StudentsProvider>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexShrink: 0,
  },
  eyebrow: {
    color: colors.info,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 15,
  },
  tabButton: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  tabText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textInverse,
  },
  content: {
    flex: 1,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
});
