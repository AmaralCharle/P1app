import { useTheme } from '../../ThemeContext';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudents } from '../../StudentsContext';
import { getSubjects, getSubjectSummary, normalizeSearch } from '../../academic';
import { AcademicScreen, Action, Card, useAcademicStyles } from '../../components/AcademicUI';

export default function Disciplinas() {
  const { colors } = useTheme();
  const ui = useAcademicStyles();
  const { students } = useStudents();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const subjects = getSubjects(students).filter(subject => normalizeSearch(subject).includes(normalizeSearch(search)));
  return <AcademicScreen title="Disciplinas" subtitle="Acompanhe cada matéria e encontre os alunos que precisam de apoio.">
    <TextInput accessibilityLabel="Buscar disciplina" style={ui.input} placeholder="Buscar disciplina..." placeholderTextColor={colors.placeholder} value={search} onChangeText={setSearch} />
    <Text style={ui.muted}>{subjects.length} disciplina(s) encontrada(s)</Text>
    <View style={ui.grid}>{subjects.map(subject => {
      const { enrolled, average, approved } = getSubjectSummary(students, subject);
      return <View style={ui.column} key={subject}><Card>
        <View style={ui.spread}><Feather name="book-open" color={colors.info} size={25} /><Text style={ui.badge}>{enrolled.length} alunos</Text></View>
        <Text style={ui.heading}>{subject}</Text>
        <Text style={ui.muted}>Média da disciplina</Text><Text style={ui.metric}>{average.toFixed(1)} <Text style={ui.text}>/ 10</Text></Text>
        <Text style={ui.text}>{approved} com nota de aprovação · {enrolled.length - approved} abaixo de 7</Text>
        <Action label="Ver desempenho" onPress={() => router.push({ pathname: '/disciplina/[nome]', params: { nome: subject } })} />
      </Card></View>;
    })}</View>
    {!subjects.length && <Card><Text style={ui.heading}>Nenhuma disciplina encontrada</Text><Text style={ui.text}>Tente outro nome ou lance uma disciplina nas notas de um aluno.</Text></Card>}
  </AcademicScreen>;
}
