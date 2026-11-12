import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../theme';
import { getAverage, getStatus, initialStudents } from '../../dados.js';

const statusFilters = ['Todos', 'Aprovado', 'Em revisão', 'Atenção'] as const;
type StatusFilter = (typeof statusFilters)[number];

export default function Alunos() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return initialStudents.filter((student) => {
      const matchesSearch = `${student.name} ${student.curso}`
        .toLocaleLowerCase()
        .includes(normalizedSearch);
      const status = getStatus(getAverage(student.notas));
      const matchesStatus =
        statusFilter === 'Todos' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Alunos</Text>
        <Text style={styles.subtitle}>
          Lista geral dos estudantes cadastrados
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar aluno ou curso"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />

        <View style={styles.filterChips}>
          {statusFilters.map((filter) => {
            const isSelected = statusFilter === filter;

            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setStatusFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.studentList}
          keyboardShouldPersistTaps="handled"
        >
          {filteredStudents.length ? (
            filteredStudents.map((student) => {
              const average = getAverage(student.notas);
              const status = getStatus(average);

              return (
                <View
                  key={student.id}
                  style={[
                    styles.studentCard,
                    student.id === selectedStudentId &&
                      styles.studentCardSelected,
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
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
                      <Text style={styles.metricText}>
                        Média: {average.toFixed(1)}
                      </Text>
                      <Text style={styles.metricText}>
                        Notas: {Object.keys(student.notas).length}
                      </Text>
                    </View>
                    <Text style={styles.studentNotes}>
                      {Object.entries(student.notas)
                        .map(([subjectName, value]) => `${subjectName}: ${value}`)
                        .join(' • ')}
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    style={styles.notesButton}
                    onPress={() =>
                      router.push({
                        pathname: '/aluno/[id]',
                        params: { id: student.id },
                      })
                    }
                  >
                    <Text style={styles.notesButtonText}>Lançar notas</Text>
                  </Pressable>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyMessage}>
              Nenhum aluno encontrado para os filtros selecionados.
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.card,
    paddingTop: spacing.md,
    paddingBottom: spacing.bottom,
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
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.backgroundPill,
    borderRadius: radius.full,
    paddingHorizontal: spacing.mdCompact,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderInput,
  },
  filterChipSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryBorder,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: colors.textInverse,
  },
  scrollView: {
    flex: 1,
  },
  studentList: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  studentCard: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.lg,
    padding: spacing.input,
    borderWidth: 1,
    borderColor: colors.borderStudent,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
  notesButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.mdCompact,
    marginTop: spacing.md,
  },
  notesButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyMessage: {
    color: colors.textSoft,
    fontSize: 14,
    paddingVertical: spacing.md,
    textAlign: 'center',
  },
});
