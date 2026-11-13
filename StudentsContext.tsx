import { createContext, useContext, type PropsWithChildren } from 'react';
import { initialStudents } from './dados.js';
import { usePersistedState } from './hooks/usePersistedState';
import { storageKeys } from './services/storage';
import { isStudentList } from './services/validators';
import { PersistenceGate } from './components/PersistenceGate';

export type Student = {
  id: number;
  name: string;
  curso: string;
  notas: Record<string, number>;
};

type StudentsContextValue = {
  students: Student[];
  addStudent: (name: string) => void;
  updateGrade: (studentId: number, subject: string, grade: number) => void;
};

const StudentsContext = createContext<StudentsContextValue | undefined>(
  undefined
);

export function StudentsProvider({ children }: PropsWithChildren) {
  const persisted = usePersistedState<Student[]>(
    storageKeys.students,
    initialStudents,
    isStudentList
  );
  const students = persisted.value;
  const setStudents = persisted.update;

  const addStudent = (name: string) => {
    const student: Student = {
      id: Math.max(Date.now(), ...students.map((item) => item.id + 1)),
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

  const updateGrade = (studentId: number, subject: string, grade: number) => {
    if (!subject.trim() || !Number.isFinite(grade) || grade < 0 || grade > 10)
      return;
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? {
              ...student,
              notas: {
                ...student.notas,
                [subject]: Number(grade.toFixed(1)),
              },
            }
          : student
      )
    );
  };

  return (
    <PersistenceGate
      ready={persisted.ready}
      error={persisted.error}
      saving={persisted.saving}
      retry={persisted.retry}
    >
      <StudentsContext.Provider value={{ students, addStudent, updateGrade }}>
        {children}
      </StudentsContext.Provider>
    </PersistenceGate>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);

  if (!context) {
    throw new Error('useStudents deve ser usado dentro de StudentsProvider.');
  }

  return context;
}
