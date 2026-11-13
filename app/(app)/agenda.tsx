import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useAcademic } from '../../AcademicContext';
import { formatAcademicDate, parseAcademicDate } from '../../academic';
import { AcademicScreen, Action, Card, ui } from '../../components/AcademicUI';
import { colors } from '../../theme';

export default function Agenda() {
  const { events, addEvent, toggleEvent } = useAcademic();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  function save() {
    const parsed = parseAcademicDate(date);
    setFeedback('');
    if (!title.trim() || !subject.trim() || !parsed) {
      setError('Preencha o título, a disciplina e uma data válida no formato DD/MM/AAAA.');
      return;
    }
    addEvent({ title: title.trim(), subject: subject.trim(), date: parsed });
    setTitle(''); setSubject(''); setDate(''); setError('');
    setFeedback('Compromisso adicionado à agenda.');
  }

  return <AcademicScreen title="Agenda acadêmica" subtitle="Organize provas, entregas e revisões em um só lugar.">
    <View style={ui.grid}>
      <View style={ui.column}><Card>
        <Text style={ui.heading}>Novo compromisso</Text>
        <Text style={ui.muted}>Título</Text><TextInput accessibilityLabel="Título do compromisso" style={ui.input} value={title} onChangeText={setTitle} placeholder="Ex.: Entrega do trabalho P2" placeholderTextColor={colors.placeholder} maxLength={100} />
        <Text style={ui.muted}>Disciplina</Text><TextInput accessibilityLabel="Disciplina do compromisso" style={ui.input} value={subject} onChangeText={setSubject} placeholder="Ex.: Programação" placeholderTextColor={colors.placeholder} maxLength={80} />
        <Text style={ui.muted}>Data (DD/MM/AAAA)</Text><TextInput accessibilityLabel="Data do compromisso" style={ui.input} value={date} onChangeText={setDate} placeholder="DD/MM/AAAA" placeholderTextColor={colors.placeholder} maxLength={10} keyboardType="numbers-and-punctuation" />
        {!!error && <Text accessibilityRole="alert" style={ui.error}>{error}</Text>}
        {!!feedback && <Text accessibilityLiveRegion="polite" style={[ui.text, ui.success]}>{feedback}</Text>}
        <Action label="Adicionar compromisso" icon="plus" onPress={save} />
        <Text style={ui.muted}>Nesta etapa os compromissos ficam na memória durante o uso do app.</Text>
      </Card></View>
      <View style={ui.column}>
        <Text style={ui.heading}>Meus compromissos</Text>
        {!events.length && <Card><Text style={ui.heading}>Sua agenda está livre</Text><Text style={ui.text}>Adicione a próxima prova ou entrega para começar.</Text></Card>}
        {events.map(event => <Card key={event.id}>
          <View style={ui.spread}><Text style={ui.badge}>{formatAcademicDate(event.date)}</Text><Text style={event.done ? [ui.text, ui.success] : ui.muted}>{event.done ? 'Concluído' : 'Pendente'}</Text></View>
          <Text style={ui.heading}>{event.title}</Text><Text style={ui.text}>{event.subject}</Text>
          <Action label={event.done ? 'Reabrir compromisso' : 'Marcar como concluído'} icon={event.done ? 'rotate-ccw' : 'check'} secondary onPress={() => toggleEvent(event.id)} />
        </Card>)}
      </View>
    </View>
  </AcademicScreen>;
}
