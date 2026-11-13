import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../AuthContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { PersistenceGate } from '../components/PersistenceGate';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function Navigation() {
  const auth = useAuth();
  useEffect(() => { if (auth.ready || auth.error) void SplashScreen.hideAsync().catch(() => {}); }, [auth.ready, auth.error]);
  return <PersistenceGate ready={auth.ready} error={auth.error} saving={auth.saving} retry={auth.retry}><Stack screenOptions={{ headerShown: false }} /></PersistenceGate>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider><AuthProvider>
      <StatusBar style="light" />
      <Navigation />
    </AuthProvider></SafeAreaProvider>
  );
}
