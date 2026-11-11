import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

type AuthContextValue = {
  usuario: string | null;
  entrar: () => void;
  sair: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [usuario, setUsuario] = useState<string | null>(null);

  const entrar = () => setUsuario('Admin');
  const sair = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
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
