import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { usePersistedState } from './hooks/usePersistedState';
import { storageKeys } from './services/storage';
import { isSession } from './services/validators';
import { clearWeatherCache } from './services/weatherCache';

type AuthContextValue = {
  usuario: string | null;
  entrar: () => Promise<boolean>;
  sair: () => Promise<boolean>;
  ready: boolean;
  error: string | null;
  saving: boolean;
  retry: () => unknown;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const persisted = usePersistedState<string | null>(
    storageKeys.session,
    null,
    isSession,
    { removeWhen: (value) => value === null }
  );
  const [clearing, setClearing] = useState(false);
  const [cleanupError, setCleanupError] = useState<string | null>(null);
  const usuario = persisted.value;
  const entrar = () =>
    clearing ? Promise.resolve(false) : persisted.update('Admin');
  async function clearCache() {
    setClearing(true);
    try {
      await clearWeatherCache();
      setCleanupError(null);
      return true;
    } catch {
      setCleanupError(
        'Você saiu da conta, mas não foi possível limpar as consultas de clima salvas. Tente novamente.'
      );
      return false;
    } finally {
      setClearing(false);
    }
  }
  async function sair() {
    if (clearing) return false;
    const saved = await persisted.update(null);
    if (saved) return clearCache();
    return false;
  }
  const retry = () => (cleanupError ? clearCache() : persisted.retry());

  return (
    <AuthContext.Provider
      value={{
        usuario,
        entrar,
        sair,
        ready: persisted.ready,
        error: persisted.error ?? cleanupError,
        saving: persisted.saving || clearing,
        retry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
