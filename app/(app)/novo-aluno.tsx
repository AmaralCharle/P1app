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
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../theme';
import { useStudents } from '../../StudentsContext';

function ScreenShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
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

export default function NovoAluno() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { addStudent: registerStudent } = useStudents();
  const [newStudentName, setNewStudentName] = useState('');

  const addStudent = () => {
    if (!newStudentName.trim()) return;

    registerStudent(newStudentName.trim());
    setNewStudentName('');
    router.replace('/alunos');
  };

  return (
    <SafeAreaView
      style={[styles.screen, colorScheme === 'dark' && styles.darkScreen]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenShell
          title="Adicionar aluno"
          subtitle="Cadastre um novo estudante no sistema"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TextInput
              value={newStudentName}
              onChangeText={setNewStudentName}
              placeholder="Nome do aluno"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />
            <Pressable style={styles.primaryButton} onPress={addStudent}>
              <Text style={[styles.textoBase, styles.primaryButtonText]}>
                Cadastrar aluno
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        </ScreenShell>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
