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
  { label: 'Contatos', route: '/contatos' },
  { label: 'Config', route: '/config' },
] as const;

export default function AppLayout() {
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
                    : pathname === route || pathname.startsWith(`${route}/`) || (route === '/disciplinas' && pathname.startsWith('/disciplina/')) || (route === '/contatos' && pathname.startsWith('/contato/'));

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0F1E',
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
    color: '#93C5FD',
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#CBD5E1',
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
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
});
