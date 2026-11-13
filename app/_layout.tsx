import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../AuthContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { PersistenceGate } from '../components/PersistenceGate';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../ThemeContext';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function Navigation() {
  const auth = useAuth();
  const theme = useTheme();
  const ready = auth.ready && theme.ready;
  const error = auth.error ?? theme.error;
  useEffect(() => { if (ready || error) void SplashScreen.hideAsync().catch(() => {}); }, [ready, error]);
  return <PersistenceGate ready={ready} error={error} saving={auth.saving || theme.saving} retry={() => { void auth.retry(); void theme.retry(); }}><StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} /></PersistenceGate>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider><ThemeProvider><AuthProvider>
      <Navigation />
    </AuthProvider></ThemeProvider></SafeAreaProvider>
  );
}
