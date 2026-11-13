import { createContext, useContext, useState, type PropsWithChildren } from 'react';

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

// Estado compartilhado entre rotas. A persistência em disco será a etapa da Aula 10.
export function AcademicProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  const addEvent: AcademicValue['addEvent'] = (event) => setEvents(current => [
    ...current, { ...event, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, done: false },
  ]);
  const toggleEvent = (id: string) => setEvents(current => current.map(event => event.id === id ? { ...event, done: !event.done } : event));
  const removeEvent = (id: string) => setEvents(current => current.filter(event => event.id !== id));
  const toggleSession = (key: string) => setCompletedSessions(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
  return <AcademicContext.Provider value={{ events, addEvent, toggleEvent, removeEvent, completedSessions, toggleSession }}>{children}</AcademicContext.Provider>;
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) throw new Error('useAcademic deve ser usado dentro de AcademicProvider.');
  return context;
}
