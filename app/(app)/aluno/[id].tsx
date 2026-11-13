import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../../theme';
import { initialStudents } from '../../../dados.js';
import { useStudents } from '../../../StudentsContext';
import { parseGrade } from '../../../academic';

export default function LancarNotas() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const studentId = Number(id);
  const router = useRouter();
  const { students, updateGrade } = useStudents();
  const student =
    students.find((item) => item.id === studentId) ??
    initialStudents.find((item) => item.id === studentId);
  const [subject, setSubject] = useState('Matemática');
  const [grade, setGrade] = useState('8.5');
  const [error, setError] = useState('');

  const saveGrade = () => {
    const gradeValue = parseGrade(grade);
    if (!subject.trim() || gradeValue === null) {
      setError('Informe uma disciplina e uma nota de 0 a 10 (ex.: 8,5).');
      return;
    }

    if (!student) return;

    updateGrade(student.id, subject.trim(), gradeValue);
    router.back();
  };

  if (!Number.isFinite(studentId) || !student) {
    return (
      <SafeAreaView edges={[]} style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Aluno não encontrado</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.card}>
          <Text style={styles.title}>Lançamento de Notas</Text>
          <Text style={styles.subtitle}>Aluno selecionado</Text>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentCourse}>{student.curso}</Text>

          <Text style={styles.sectionTitle}>Notas atuais</Text>
          <View style={styles.currentGrades}>
            {Object.entries(student.notas).map(([subjectName, value]) => (
              <View key={subjectName} style={styles.gradeCard}>
                <Text style={styles.gradeSubject}>{subjectName}</Text>
                <Text style={styles.gradeValue}>{Number(value).toFixed(1)}</Text>
              </View>
            ))}
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TextInput
              accessibilityLabel="Disciplina"
              value={subject}
              onChangeText={setSubject}
              placeholder="Disciplina"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />
            <TextInput
              accessibilityLabel="Nota"
              value={grade}
              onChangeText={setGrade}
              placeholder="Nota"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={saveGrade}
            >
              <Text style={styles.primaryButtonText}>Salvar nota</Text>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
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
  card: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.compact,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  studentName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  studentCourse: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.input,
  },
  sectionTitle: {
    color: colors.textSoft,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  currentGrades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.control,
    marginBottom: spacing.md,
  },
  gradeCard: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: colors.backgroundSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.mdCompact,
  },
  gradeSubject: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  gradeValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
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
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.mdCompact,
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
});
