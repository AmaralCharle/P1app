import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../theme';
import { getAverage } from '../../dados.js';
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

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const { students } = useStudents();

  const summary = useMemo(() => {
    const total = students.length;
    const medias = students.map((student) => getAverage(student.notas));
    const mediaGeral = medias.length
      ? medias.reduce((sum, value) => sum + value, 0) / medias.length
      : 0;
    const aprovados = students.filter(
      (student) => getAverage(student.notas) >= 7
    ).length;
    const atencao = students.filter(
      (student) => getAverage(student.notas) < 5
    ).length;

    return { total, mediaGeral, aprovados, atencao };
  }, [students]);

  return (
    <SafeAreaView
      style={[styles.screen, colorScheme === 'dark' && styles.darkScreen]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenShell
          title="Dashboard"
          subtitle="Resumo geral do desempenho acadêmico"
        >
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={[styles.textoBase, styles.summaryLabel]}>Total</Text>
              <Text style={[styles.textoBase, styles.summaryValue]}>
                {summary.total}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.textoBase, styles.summaryLabel]}>Média</Text>
              <Text style={[styles.textoBase, styles.summaryValue]}>
                {summary.mediaGeral.toFixed(1)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.textoBase, styles.summaryLabel]}>
                Aprovados
              </Text>
              <Text style={[styles.textoBase, styles.summaryValue]}>
                {summary.aprovados}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.textoBase, styles.summaryLabel]}>
                Atenção
              </Text>
              <Text style={[styles.textoBase, styles.summaryValue]}>
                {summary.atencao}
              </Text>
            </View>
          </View>
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
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
});
