import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { initialStudents } from './dados.js';

export type Student = {
  id: number;
  name: string;
  curso: string;
  notas: Record<string, number>;
};

type StudentsContextValue = {
  students: Student[];
  addStudent: (name: string) => void;
};

const StudentsContext = createContext<StudentsContextValue | undefined>(
  undefined
);

export function StudentsProvider({ children }: PropsWithChildren) {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const addStudent = (name: string) => {
    const student: Student = {
      id: Date.now(),
      name: name.trim(),
      curso: 'Novo curso',
      notas: {
        Matemática: 0,
        Física: 0,
        Programação: 0,
        História: 0,
      },
    };

    setStudents((current) => [student, ...current]);
  };

  return (
    <StudentsContext.Provider value={{ students, addStudent }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);

  if (!context) {
    throw new Error('useStudents deve ser usado dentro de StudentsProvider.');
  }

  return context;
}
