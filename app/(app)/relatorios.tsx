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

export default function Relatorios() {
  const colorScheme = useColorScheme();
  const { students } = useStudents();

  const summary = useMemo(() => {
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

    return { mediaGeral, aprovados, atencao };
  }, [students]);

  return (
    <SafeAreaView
      style={[styles.screen, colorScheme === 'dark' && styles.darkScreen]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenShell
          title="Relatórios"
          subtitle="Resumo de desempenho por categoria"
        >
          <View style={styles.reportList}>
            <View style={styles.reportItem}>
              <Text style={[styles.textoBase, styles.reportTitle]}>
                Média geral
              </Text>
              <Text style={[styles.textoBase, styles.reportValue]}>
                {summary.mediaGeral.toFixed(1)}
              </Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={[styles.textoBase, styles.reportTitle]}>
                Aprovados
              </Text>
              <Text style={[styles.textoBase, styles.reportValue]}>
                {summary.aprovados}
              </Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={[styles.textoBase, styles.reportTitle]}>
                Em revisão
              </Text>
              <Text style={[styles.textoBase, styles.reportValue]}>
                {
                  students.filter(
                    (student) =>
                      getAverage(student.notas) >= 5 &&
                      getAverage(student.notas) < 7
                  ).length
                }
              </Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={[styles.textoBase, styles.reportTitle]}>
                Atenção
              </Text>
              <Text style={[styles.textoBase, styles.reportValue]}>
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
  reportList: {
    gap: spacing.control,
  },
  reportItem: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.md,
    padding: spacing.mdCompact,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
});
