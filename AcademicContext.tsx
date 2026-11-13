import { createContext, useContext, type PropsWithChildren } from 'react';
import { usePersistedState } from './hooks/usePersistedState';
import { storageKeys } from './services/storage';
import { isAcademicData, type AcademicData } from './services/validators';
import { PersistenceGate } from './components/PersistenceGate';

export type AcademicEvent = { id: string; title: string; subject: string; date: string; done: boolean };
type AcademicValue = {
  events: AcademicEvent[];
  addEvent: (event: Omit<AcademicEvent, 'id' | 'done'>) => void;
  toggleEvent: (id: string) => void;
  removeEvent: (id: string) => void;
  completedSessions: string[];
  toggleSession: (key: string) => void;
};
const AcademicContext = createContext<AcademicValue | undefined>(undefined);

export function AcademicProvider({ children }: PropsWithChildren) {
  const persisted = usePersistedState<AcademicData>(storageKeys.academic, { events: [], completedSessions: [] }, isAcademicData);
  const { events, completedSessions } = persisted.value;
  const setEvents = (update: (current: AcademicEvent[]) => AcademicEvent[]) => persisted.update(current => ({ ...current, events: update(current.events) }));
  const setCompletedSessions = (update: (current: string[]) => string[]) => persisted.update(current => ({ ...current, completedSessions: update(current.completedSessions) }));
  const addEvent: AcademicValue['addEvent'] = (event) => setEvents(current => [
    ...current, { ...event, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, done: false },
  ]);
  const toggleEvent = (id: string) => setEvents(current => current.map(event => event.id === id ? { ...event, done: !event.done } : event));
  const removeEvent = (id: string) => setEvents(current => current.filter(event => event.id !== id));
  const toggleSession = (key: string) => setCompletedSessions(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
  return <PersistenceGate ready={persisted.ready} error={persisted.error} saving={persisted.saving} retry={persisted.retry}><AcademicContext.Provider value={{ events, addEvent, toggleEvent, removeEvent, completedSessions, toggleSession }}>{children}</AcademicContext.Provider></PersistenceGate>;
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) throw new Error('useAcademic deve ser usado dentro de AcademicProvider.');
  return context;
}
