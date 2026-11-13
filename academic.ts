import type { Student } from './StudentsContext';

export function getSubjects(students: Student[]) {
  return [...new Set(students.flatMap(student => Object.keys(student.notas)))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function getSubjectSummary(students: Student[], subject: string) {
  const enrolled = students.filter(student => Object.hasOwn(student.notas, subject));
  const average = enrolled.length ? enrolled.reduce((sum, student) => sum + student.notas[subject], 0) / enrolled.length : 0;
  return { enrolled, average, approved: enrolled.filter(student => student.notas[subject] >= 7).length };
}

export function parseAcademicDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null;
  return `${year}-${month}-${day}`;
}

export function formatAcademicDate(value: string) {
  return value.split('-').reverse().join('/');
}

export function getStudyPlan(grades: Record<string, number>) {
  return Object.entries(grades).sort((a, b) => a[1] - b[1]).map(([subject, grade]) => ({
    subject, grade, minutes: grade < 5 ? 40 : grade < 7 ? 30 : 20,
    priority: grade < 5 ? 'Prioridade alta' : grade < 7 ? 'Reforço' : 'Manutenção',
    guidance: grade < 5 ? 'Retome os conceitos básicos e resolva exercícios com correção.' : grade < 7 ? 'Revise os pontos de dúvida e refaça as questões que errou.' : 'Faça uma revisão breve e pratique para manter o desempenho.',
  }));
}
