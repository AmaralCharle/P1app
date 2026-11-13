import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStudents } from '../../../StudentsContext';
import { getSubjects, getSubjectSummary } from '../../../academic';
import { AcademicScreen, Action, Card, ui } from '../../../components/AcademicUI';
import { getStatus } from '../../../dados';

export default function Disciplina() {
  const { nome } = useLocalSearchParams<{ nome: string }>();
  const { students } = useStudents();
  const router = useRouter();
  const { enrolled, average, approved } = getSubjectSummary(students, nome);
  const exists = getSubjects(students).includes(nome);
  return <AcademicScreen title={exists ? nome : 'Disciplina não encontrada'} subtitle="Notas por aluno e acompanhamento da turma.">
    <Action label="Voltar às disciplinas" icon="arrow-left" secondary onPress={() => router.replace('/disciplinas')} />
    {!exists ? <Card><Text style={ui.text}>Esta disciplina não possui notas cadastradas. Selecione uma matéria na lista.</Text></Card> : <>
      <Card><View style={ui.spread}><View><Text style={ui.muted}>Média da turma</Text><Text style={ui.metric}>{average.toFixed(1)}</Text></View><Text style={ui.badge}>{approved} de {enrolled.length} com nota ≥ 7</Text></View></Card>
      <Text style={ui.heading}>Desempenho individual</Text>
      {enrolled.slice().sort((a, b) => a.notas[nome] - b.notas[nome]).map(student => <Card key={student.id}>
        <View style={ui.spread}><View><Text style={ui.heading}>{student.name}</Text><Text style={ui.muted}>{student.curso}</Text></View><Text style={ui.metric}>{student.notas[nome].toFixed(1)}</Text></View>
        <Text style={ui.badge}>{getStatus(student.notas[nome])}</Text>
        <Action label="Editar notas do aluno" secondary icon="edit-2" onPress={() => router.push({ pathname: '/aluno/[id]', params: { id: String(student.id) } })} />
      </Card>)}
      <Action label="Organizar revisão no plano de estudos" icon="target" onPress={() => router.push('/plano-estudos')} />
    </>}
  </AcademicScreen>;
}
