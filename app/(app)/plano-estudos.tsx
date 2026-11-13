import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStudents } from '../../StudentsContext';
import { AcademicScreen, Card, ui } from '../../components/AcademicUI';

export default function PlanoEstudos() {
  const { students } = useStudents();
  const [studentId, setStudentId] = useState<number | null>(students[0]?.id ?? null);
  const student = students.find(item => item.id === studentId);
  const subjects = student ? Object.entries(student.notas) : [];
  return <AcademicScreen title="Plano de estudos" subtitle="Transforme as notas em uma rotina de revisão por aluno.">
    <Card><Text style={ui.heading}>Selecione o aluno</Text><View style={ui.row}>
      {students.map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: studentId === item.id }} key={item.id} style={[ui.chip, studentId === item.id && ui.chipActive]} onPress={() => setStudentId(item.id)}><Text style={ui.text}>{item.name}</Text></Pressable>)}
    </View></Card>
    {!student ? <Card><Text style={ui.text}>Cadastre um aluno para montar um plano de estudos.</Text></Card> : <>
      <Text style={ui.heading}>Revisão de {student.name}</Text>
      {!subjects.length && <Card><Text style={ui.text}>Lance notas para começar o plano deste aluno.</Text></Card>}
      <View style={ui.grid}>{subjects.map(([subject, grade]) => <View key={subject} style={ui.column}><Card>
        <View style={ui.spread}><Text style={ui.heading}>{subject}</Text><Text style={ui.badge}>Nota {grade.toFixed(1)}</Text></View>
        <Text style={ui.text}>Reserve um momento para revisar os conteúdos desta disciplina.</Text>
      </Card></View>)}</View>
    </>}
  </AcademicScreen>;
}
