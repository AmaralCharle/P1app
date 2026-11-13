import {
  createContext,
  useCallback,
  useContext,
  type PropsWithChildren,
} from 'react';
import { colors as darkColors, lightColors, type ThemeColors } from './theme';
import { usePersistedState } from './hooks/usePersistedState';
import { storageKeys } from './services/storage';
import { isRecord } from './services/validators';

type Preferences = { mode: 'dark' | 'light'; lastCity: string };
function isPreferences(value: unknown): value is Preferences {
  return (
    isRecord(value) &&
    (value.mode === 'dark' || value.mode === 'light') &&
    typeof value.lastCity === 'string' &&
    value.lastCity.length <= 100
  );
}
type ThemeValue = Preferences & {
  colors: ThemeColors;
  ready: boolean;
  error: string | null;
  saving: boolean;
  retry: () => unknown;
  setMode: (mode: Preferences['mode']) => void;
  setLastCity: (city: string) => void;
};
const ThemeContext = createContext<ThemeValue | undefined>(undefined);
export function ThemeProvider({ children }: PropsWithChildren) {
  const persisted = usePersistedState<Preferences>(
    storageKeys.preferences,
    { mode: 'dark', lastCity: '' },
    isPreferences
  );
  const { mode, lastCity } = persisted.value;
  const setMode = useCallback(
    (next: Preferences['mode']) => {
      void persisted.update((current) => ({ ...current, mode: next }));
    },
    [persisted.update]
  );
  const setLastCity = useCallback(
    (city: string) => {
      void persisted.update((current) =>
        current.lastCity === city.trim()
          ? current
          : { ...current, lastCity: city.trim() }
      );
    },
    [persisted.update]
  );
  return (
    <ThemeContext.Provider
      value={{
        mode,
        lastCity,
        colors: mode === 'dark' ? darkColors : lightColors,
        ready: persisted.ready,
        error: persisted.error,
        saving: persisted.saving,
        retry: persisted.retry,
        setMode,
        setLastCity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme)
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  return theme;
}
