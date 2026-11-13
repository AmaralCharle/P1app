import {
  createContext,
  useContext,
  type PropsWithChildren,
} from 'react';
import { usePersistedState } from './hooks/usePersistedState';
import { storageKeys } from './services/storage';
import { isSession } from './services/validators';

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
  const persisted = usePersistedState<string | null>(storageKeys.session, null, isSession);
  const usuario = persisted.value;
  const entrar = () => persisted.update('Admin');
  const sair = () => persisted.update(null);

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair, ready: persisted.ready, error: persisted.error, saving: persisted.saving, retry: persisted.retry }}>
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
