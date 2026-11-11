export const initialStudents = [
  {
    id: 1,
    name: 'Ana Clara',
    curso: 'Engenharia de Software',
    notas: {
      Matemática: 9.2,
      Física: 8.6,
      Programação: 9.8,
      História: 7.5,
    },
  },
  {
    id: 2,
    name: 'Bruno Silva',
    curso: 'Análise de Sistemas',
    notas: {
      Matemática: 7.1,
      Física: 6.4,
      Programação: 8.8,
      História: 7.9,
    },
  },
  {
    id: 3,
    name: 'Carla Souza',
    curso: 'Ciência da Computação',
    notas: {
      Matemática: 5.8,
      Física: 6.2,
      Programação: 7.4,
      História: 6.9,
    },
  },
];

export const getAverage = (notas) => {
  const values = Object.values(notas || {});
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return total / values.length;
};

export const getStatus = (average) => {
  if (average >= 7) return 'Aprovado';
  if (average >= 5) return 'Em revisão';
  return 'Atenção';
};
