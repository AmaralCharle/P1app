import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getSubjects,
  getSubjectSummary,
  getStudyPlan,
  normalizeSearch,
  parseAcademicDate,
  formatAcademicDate,
  parseGrade,
} from '../academic.ts';

const students = [
  {
    id: 1,
    name: 'Ana',
    curso: 'Software',
    notas: { Matemática: 8, Física: 4 },
  },
  { id: 2, name: 'Bruno', curso: 'Software', notas: { Matemática: 6 } },
];

test('lista disciplinas sem duplicar e considera apenas alunos com nota na matéria', () => {
  assert.deepEqual(getSubjects(students), ['Física', 'Matemática']);
  assert.equal(getSubjectSummary(students, 'Matemática').average, 7);
  assert.equal(getSubjectSummary(students, 'Matemática').approved, 1);
  assert.equal(getSubjectSummary(students, 'Física').enrolled.length, 1);
  assert.equal(getSubjectSummary(students, 'Física').average, 4);
});

test('disciplina inexistente e turma vazia não geram divisão por zero', () => {
  assert.deepEqual(getSubjects([]), []);
  assert.deepEqual(getSubjectSummary(students, 'História'), {
    enrolled: [],
    average: 0,
    approved: 0,
  });
});

test('datas rejeitam dias inexistentes e respeitam anos bissextos', () => {
  assert.equal(parseAcademicDate('29/02/2028'), '2028-02-29');
  for (const value of [
    '29/02/2026',
    '31/04/2026',
    '00/12/2026',
    '10/13/2026',
    '2026-11-13',
    '',
  ]) {
    assert.equal(parseAcademicDate(value), null, value);
  }
  assert.equal(formatAcademicDate('2026-11-13'), '13/11/2026');
});

test('notas aceitam vírgula e limites, mas rejeitam valores fora da escala', () => {
  assert.equal(parseGrade('8,5'), 8.5);
  assert.equal(parseGrade(' 0 '), 0);
  assert.equal(parseGrade('10'), 10);
  for (const value of [
    '',
    ' ',
    '-1',
    '10.1',
    'Infinity',
    'abc',
    '0xA',
    '8,5,2',
  ])
    assert.equal(parseGrade(value), null, value);
});

test('busca encontra Programação e Física sem exigir acentos', () => {
  assert.equal(normalizeSearch('  PROGRAMAÇÃO '), 'programacao');
  assert.equal(normalizeSearch('Física'), 'fisica');
});

test('plano prioriza menores notas e aplica limites de tempo e prioridade', () => {
  const plan = getStudyPlan({ Programação: 7, Física: 4.9, História: 5 });
  assert.deepEqual(
    plan.map((item) => item.subject),
    ['Física', 'História', 'Programação']
  );
  assert.deepEqual(
    plan.map((item) => item.minutes),
    [40, 30, 20]
  );
  assert.deepEqual(
    plan.map((item) => item.priority),
    ['Prioridade alta', 'Reforço', 'Manutenção']
  );
  assert.deepEqual(getStudyPlan({}), []);
});
