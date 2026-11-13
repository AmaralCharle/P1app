import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStudents } from '../../StudentsContext';
import { AcademicScreen, Action, Card, ui } from '../../components/AcademicUI';
import { getStudyPlan } from '../../academic';
import { useAcademic } from '../../AcademicContext';

export default function PlanoEstudos() {
  const { students } = useStudents();
  const { completedSessions, toggleSession } = useAcademic();
  const [studentId, setStudentId] = useState<number | null>(students[0]?.id ?? null);
  const student = students.find(item => item.id === studentId);
  const subjects = student ? getStudyPlan(student.notas) : [];
  const completed = student ? subjects.filter(item => completedSessions.includes(JSON.stringify([student.id, item.subject]))) : [];
  const totalMinutes = subjects.reduce((sum, item) => sum + item.minutes, 0);
  const remainingMinutes = totalMinutes - completed.reduce((sum, item) => sum + item.minutes, 0);
  return <AcademicScreen title="Plano de estudos" subtitle="Transforme as notas em uma rotina de revisão por aluno.">
    <Card><Text style={ui.heading}>Selecione o aluno</Text><View style={ui.row}>
      {students.map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: studentId === item.id }} key={item.id} style={[ui.chip, studentId === item.id && ui.chipActive]} onPress={() => setStudentId(item.id)}><Text style={ui.text}>{item.name}</Text></Pressable>)}
    </View></Card>
    {!student ? <Card><Text style={ui.text}>Cadastre um aluno para montar um plano de estudos.</Text></Card> : <>
      <Text style={ui.heading}>Revisão de {student.name}</Text>
      <Card>
        <View style={ui.spread}><Text style={ui.heading}>{completed.length} de {subjects.length} revisões</Text><Text style={ui.badge}>{remainingMinutes} min restantes</Text></View>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: subjects.length || 1, now: completed.length }} style={{ height: 8, backgroundColor: '#203257', borderRadius: 8, overflow: 'hidden' }}>
          <View style={{ height: 8, backgroundColor: '#5b8cff', width: `${subjects.length ? completed.length / subjects.length * 100 : 0}%` }} />
        </View>
        <Text style={ui.muted}>Tempo total sugerido: {totalMinutes} minutos. Suas revisões ficam salvas neste aparelho.</Text>
      </Card>
      {!subjects.length && <Card><Text style={ui.text}>Lance notas para começar o plano deste aluno.</Text></Card>}
      <Text style={ui.text}>As menores notas aparecem primeiro. Este plano usa regras simples com base nas notas cadastradas.</Text>
      <View style={ui.grid}>{subjects.map(({ subject, grade, minutes, priority, guidance }) => <View key={subject} style={ui.column}><Card>
        <View style={ui.spread}><Text style={ui.heading}>{subject}</Text><Text style={ui.badge}>Nota {grade.toFixed(1)}</Text></View>
        <Text style={ui.badge}>{priority} · {minutes} min</Text>
        <Text style={ui.text}>{guidance}</Text>
        <Action label={completedSessions.includes(JSON.stringify([student.id, subject])) ? 'Reabrir revisão' : 'Concluir revisão'} icon={completedSessions.includes(JSON.stringify([student.id, subject])) ? 'rotate-ccw' : 'check-circle'} secondary onPress={() => toggleSession(JSON.stringify([student.id, subject]))} />
        {completedSessions.includes(JSON.stringify([student.id, subject])) && <Text style={[ui.text, ui.success]}>Revisão concluída</Text>}
      </Card></View>)}</View>
    </>}
  </AcademicScreen>;
}
