import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../theme';
import { initialStudents } from '../../dados.js';
import { useStudents } from '../../StudentsContext';

type ScreenShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.titulo, styles.sectionTitle]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitulo, styles.subtitleText]}>{subtitle}</Text>
      ) : null}
      {children}
    </View>
  );
}

export default function Notas() {
  const colorScheme = useColorScheme();
  const { students, updateGrade } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialStudents[0].id
  );
  const [subject, setSubject] = useState('Matemática');
  const [grade, setGrade] = useState('8.5');

  const addGrade = () => {
    const gradeValue = Number(grade);
    if (!subject.trim() || Number.isNaN(gradeValue)) return;

    updateGrade(selectedStudentId, subject.trim(), gradeValue);
    setGrade('');
    setSubject('Matemática');
  };

  return (
    <SafeAreaView
      style={[styles.screen, colorScheme === 'dark' && styles.darkScreen]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenShell
          title="Notas"
          subtitle="Registre e atualize as avaliações do aluno selecionado"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Text style={[styles.textoBase, styles.label]}>
              Aluno selecionado
            </Text>
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
                      styles.textoBase,
                      styles.pillText,
                      student.id === selectedStudentId &&
                        styles.pillTextSelected,
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
              <Text style={[styles.textoBase, styles.primaryButtonText]}>
                Salvar nota
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        </ScreenShell>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSoft,
  },
  textoBase: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
  },
  darkScreen: {
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.card,
    paddingTop: Platform.select({ ios: 20, android: 8 }),
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
});
