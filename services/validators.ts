import type { Student } from '../StudentsContext';
import type { AcademicEvent } from '../AcademicContext';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function isStudentList(value: unknown): value is Student[] {
  return Array.isArray(value) && new Set(value.map(item => item?.id)).size === value.length && value.every(item => isRecord(item)
    && Number.isSafeInteger(item.id) && Number(item.id) > 0 && typeof item.name === 'string' && !!item.name.trim()
    && typeof item.curso === 'string' && isRecord(item.notas)
    && Object.entries(item.notas).every(([name, grade]) => !!name.trim() && typeof grade === 'number' && Number.isFinite(grade) && grade >= 0 && grade <= 10));
}
export type AcademicData = { events: AcademicEvent[]; completedSessions: string[] };
export function isAcademicData(value: unknown): value is AcademicData {
  return isRecord(value) && Array.isArray(value.events) && Array.isArray(value.completedSessions)
    && value.completedSessions.every(key => typeof key === 'string')
    && new Set(value.events.map(item => item?.id)).size === value.events.length
    && value.events.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.title === 'string'
      && typeof item.subject === 'string' && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && typeof item.done === 'boolean');
}
export function isSession(value: unknown): value is string | null {
  return value === null || value === 'Admin';
}
