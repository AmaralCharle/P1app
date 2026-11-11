import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Pressable,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing } from './theme';

const initialStudents = [
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

const getAverage = (notas) => {
  const values = Object.values(notas || {});
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return total / values.length;
};

const getStatus = (average) => {
  if (average >= 7) return 'Aprovado';
  if (average >= 5) return 'Em revisão';
  return 'Atenção';
};

const screenOrder = [
  'Dashboard',
  'Alunos',
  'Adicionar',
  'Notas',
  'Relatórios',
  'Config',
];

function ScreenShell({ title, subtitle, children }) {
  return (
    <View style={styles.card}> 
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudents[0].id);
  const [subject, setSubject] = useState('Matemática');
  const [grade, setGrade] = useState('8.5');
  const [activeScreen, setActiveScreen] = useState('Dashboard');

  const summary = useMemo(() => {
    const total = students.length;
    const medias = students.map((student) => getAverage(student.notas));
    const mediaGeral = medias.length
      ? medias.reduce((sum, value) => sum + value, 0) / medias.length
      : 0;
    const aprovados = students.filter((student) => getAverage(student.notas) >= 7).length;
    const atencao = students.filter((student) => getAverage(student.notas) < 5).length;

    return { total, mediaGeral, aprovados, atencao };
  }, [students]);

  const addStudent = () => {
    if (!newStudentName.trim()) return;

    const student = {
      id: Date.now(),
      name: newStudentName.trim(),
      curso: 'Novo curso',
      notas: {
        Matemática: 0,
        Física: 0,
        Programação: 0,
        História: 0,
      },
    };

    setStudents((current) => [student, ...current]);
    setSelectedStudentId(student.id);
    setNewStudentName('');
    setActiveScreen('Alunos');
  };

  const addGrade = () => {
    const gradeValue = Number(grade);
    if (!subject.trim() || Number.isNaN(gradeValue)) return;

    setStudents((current) =>
      current.map((student) =>
        student.id === selectedStudentId
          ? {
              ...student,
              notas: {
                ...student.notas,
                [subject.trim()]: Number(gradeValue.toFixed(1)),
              },
            }
          : student
      )
    );

    setGrade('');
    setSubject('Matemática');
    setActiveScreen('Notas');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Dashboard':
        return (
          <ScreenShell title="Dashboard" subtitle="Resumo geral do desempenho acadêmico">
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>{summary.total}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Média</Text>
                <Text style={styles.summaryValue}>{summary.mediaGeral.toFixed(1)}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Aprovados</Text>
                <Text style={styles.summaryValue}>{summary.aprovados}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Atenção</Text>
                <Text style={styles.summaryValue}>{summary.atencao}</Text>
              </View>
            </View>
          </ScreenShell>
        );
      case 'Alunos':
        return (
          <ScreenShell title="Alunos" subtitle="Lista geral dos estudantes cadastrados">
            <View style={styles.studentList}>
              {students.map((student) => {
                const average = getAverage(student.notas);
                const status = getStatus(average);
                return (
                  <Pressable
                    key={student.id}
                    style={[
                      styles.studentCard,
                      student.id === selectedStudentId && styles.studentCardSelected,
                    ]}
                    onPress={() => setSelectedStudentId(student.id)}
                  >
                    <View style={styles.studentHeaderRow}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text
                        style={[
                          styles.statusBadge,
                          status === 'Aprovado'
                            ? styles.statusPassed
                            : status === 'Em revisão'
                              ? styles.statusReview
                              : styles.statusWarning,
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                    <Text style={styles.studentCourse}>{student.curso}</Text>
                    <View style={styles.studentMetricsRow}>
                      <Text style={styles.metricText}>Média: {average.toFixed(1)}</Text>
                      <Text style={styles.metricText}>Notas: {Object.keys(student.notas).length}</Text>
                    </View>
                    <Text style={styles.studentNotes}>
                      {Object.entries(student.notas)
                        .map(([subjectName, value]) => `${subjectName}: ${value}`)
                        .join(' • ')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScreenShell>
        );
      case 'Adicionar':
        return (
          <ScreenShell title="Adicionar aluno" subtitle="Cadastre um novo estudante no sistema">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TextInput
                value={newStudentName}
                onChangeText={setNewStudentName}
                placeholder="Nome do aluno"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
              <Pressable style={styles.primaryButton} onPress={addStudent}>
                <Text style={styles.primaryButtonText}>Cadastrar aluno</Text>
              </Pressable>
            </KeyboardAvoidingView>
          </ScreenShell>
        );
      case 'Notas':
        return (
          <ScreenShell title="Notas" subtitle="Registre e atualize as avaliações do aluno selecionado">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <Text style={styles.label}>Aluno selecionado</Text>
              <View style={styles.pillContainer}>
                {students.map((student) => (
                  <Pressable
                    key={student.id}
                    style={[
                      styles.pill,
                      student.id === selectedStudentId && styles.pillSelected,
                    ]}
                    onPress={() => setSelectedStudentId(student.id)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        student.id === selectedStudentId && styles.pillTextSelected,
                      ]}
                    >
                      {student.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Disciplina"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
              <TextInput
                value={grade}
                onChangeText={setGrade}
                placeholder="Nota"
                keyboardType="numeric"
                placeholderTextColor={colors.placeholder}
                style={styles.input}
              />
              <Pressable style={styles.primaryButton} onPress={addGrade}>
                <Text style={styles.primaryButtonText}>Salvar nota</Text>
              </Pressable>
            </KeyboardAvoidingView>
          </ScreenShell>
        );
      case 'Relatórios':
        return (
          <ScreenShell title="Relatórios" subtitle="Resumo de desempenho por categoria">
            <View style={styles.reportList}>
              <View style={styles.reportItem}>
                <Text style={styles.reportTitle}>Média geral</Text>
                <Text style={styles.reportValue}>{summary.mediaGeral.toFixed(1)}</Text>
              </View>
              <View style={styles.reportItem}>
                <Text style={styles.reportTitle}>Aprovados</Text>
                <Text style={styles.reportValue}>{summary.aprovados}</Text>
              </View>
              <View style={styles.reportItem}>
                <Text style={styles.reportTitle}>Em revisão</Text>
                <Text style={styles.reportValue}>{students.filter((student) => getAverage(student.notas) >= 5 && getAverage(student.notas) < 7).length}</Text>
              </View>
              <View style={styles.reportItem}>
                <Text style={styles.reportTitle}>Atenção</Text>
                <Text style={styles.reportValue}>{summary.atencao}</Text>
              </View>
            </View>
          </ScreenShell>
        );
      case 'Config':
        return (
          <ScreenShell title="Configurações" subtitle="Informações do app acadêmico">
            <View style={styles.configBox}>
              <Text style={styles.configText}>App: Academy Notes</Text>
              <Text style={styles.configText}>Tipo: React Native + Expo</Text>
              <Text style={styles.configText}>Modo: dados simulados</Text>
              <Text style={styles.configText}>Objetivo: gestão de notas universitárias</Text>
            </View>
          </ScreenShell>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Sistema acadêmico</Text>
          <Text style={styles.title}>Academy Notes</Text>
          <Text style={styles.subtitle}>Painel de desempenho e notas</Text>
        </View>

        <View style={styles.tabBar}>
          {screenOrder.map((screen) => (
            <Pressable
              key={screen}
              style={[styles.tabButton, activeScreen === screen && styles.tabButtonActive]}
              onPress={() => setActiveScreen(screen)}
            >
              <Text style={[styles.tabText, activeScreen === screen && styles.tabTextActive]}>{screen}</Text>
            </Pressable>
          ))}
        </View>

        {renderScreen()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.card,
    paddingBottom: spacing.bottom,
  },
  header: {
    marginBottom: spacing.md,
  },
  eyebrow: {
    color: colors.info,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 15,
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.card,
  },
  tabButton: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryBorder,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textInverse,
  },
  card: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.compact,
  },
  subtitleText: {
    color: colors.textSoft,
    fontSize: 13,
    marginBottom: spacing.input,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.control,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: colors.backgroundSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  summaryValue: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 28,
  },
  input: {
    backgroundColor: colors.backgroundSoft,
    borderWidth: 1,
    borderColor: colors.borderInput,
    color: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing.input,
    paddingVertical: spacing.mdCompact,
    marginBottom: spacing.mdCompact,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.mdCompact,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 15,
  },
  label: {
    color: colors.textSoft,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.mdCompact,
    gap: spacing.sm,
  },
  pill: {
    backgroundColor: colors.backgroundPill,
    borderRadius: radius.full,
    paddingHorizontal: spacing.mdCompact,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderInput,
  },
  pillSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryBorder,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: colors.textInverse,
  },
  studentCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.lg,
    padding: spacing.input,
    borderWidth: 1,
    borderColor: colors.borderStudent,
  },
  studentList: {
    gap: spacing.md,
  },
  studentCardSelected: {
    borderColor: colors.borderSelected,
    backgroundColor: colors.backgroundSelected,
  },
  studentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.compact,
  },
  studentName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
  },
  studentCourse: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  studentMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.compact,
  },
  metricText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  studentNotes: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  statusPassed: {
    backgroundColor: colors.successBackground,
    color: colors.success,
  },
  statusReview: {
    backgroundColor: colors.warningBackground,
    color: colors.warning,
  },
  statusWarning: {
    backgroundColor: colors.dangerBackground,
    color: colors.danger,
  },
  reportList: {
    gap: spacing.control,
  },
  reportItem: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.md,
    padding: spacing.mdCompact,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportTitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  reportValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  configBox: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.md,
    padding: spacing.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  configText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
});
