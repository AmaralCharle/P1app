import React, { useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAverage, getStatus } from '../../dados.js';
import { useStudents } from '../../StudentsContext';

export default function Dashboard() {
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
    const emRevisao = students.filter((student) => {
      const average = getAverage(student.notas);
      return average >= 5 && average < 7;
    }).length;

    return { total, mediaGeral, aprovados, atencao, emRevisao };
  }, [students]);

  const topStudents = useMemo(
    () =>
      students
        .map((student) => ({
          ...student,
          average: getAverage(student.notas),
        }))
        .sort((first, second) => second.average - first.average)
        .slice(0, 3),
    [students]
  );

  const getPercentage = (count: number) =>
    summary.total ? (count / summary.total) * 100 : 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Resumo geral do desempenho acadêmico
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={[styles.metricCard, styles.totalCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total de alunos</Text>
              <Feather name="users" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.metricValue}>{summary.total}</Text>
            <Text style={styles.metricCaption}>Estudantes cadastrados</Text>
          </View>

          <View style={[styles.metricCard, styles.averageCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Média geral</Text>
              <Feather name="bar-chart-2" size={20} color="#06B6D4" />
            </View>
            <View style={styles.averageValueRow}>
              <Text style={styles.metricValue}>
                {summary.mediaGeral.toFixed(1)}
              </Text>
              <Text style={styles.averageScale}>/ 10.0</Text>
            </View>
            <Text style={styles.metricCaption}>Desempenho da turma</Text>
          </View>

          <View style={[styles.metricCard, styles.approvedCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Aprovados</Text>
              <Feather name="check-circle" size={20} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{summary.aprovados}</Text>
            <Text style={styles.metricCaption}>Média igual ou maior que 7</Text>
          </View>

          <View style={[styles.metricCard, styles.reviewCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Em revisão</Text>
              <Feather name="alert-triangle" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.metricValue}>{summary.emRevisao}</Text>
            <Text style={styles.metricCaption}>Média entre 5 e 6.9</Text>
          </View>
        </View>

        <View style={styles.lowerGrid}>
          <View style={[styles.panel, styles.distributionPanel]}>
            <Text style={styles.panelTitle}>Distribuição de Desempenho</Text>
            <Text style={styles.panelSubtitle}>
              Alunos por faixa de média
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressSegment,
                  styles.progressApproved,
                  { width: `${getPercentage(summary.aprovados)}%` },
                ]}
              />
              <View
                style={[
                  styles.progressSegment,
                  styles.progressReview,
                  { width: `${getPercentage(summary.emRevisao)}%` },
                ]}
              />
              <View
                style={[
                  styles.progressSegment,
                  styles.progressAttention,
                  { width: `${getPercentage(summary.atencao)}%` },
                ]}
              />
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.approvedDot]} />
                <Text style={styles.legendLabel}>Aprovados</Text>
                <Text style={styles.legendValue}>
                  {summary.aprovados} ({getPercentage(summary.aprovados).toFixed(0)}%)
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.reviewDot]} />
                <Text style={styles.legendLabel}>Em revisão</Text>
                <Text style={styles.legendValue}>
                  {summary.emRevisao} ({getPercentage(summary.emRevisao).toFixed(0)}%)
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.attentionDot]} />
                <Text style={styles.legendLabel}>Atenção</Text>
                <Text style={styles.legendValue}>
                  {summary.atencao} ({getPercentage(summary.atencao).toFixed(0)}%)
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.panel, styles.rankingPanel]}>
            <Text style={styles.panelTitle}>Quadro de Classificação</Text>
            <Text style={styles.panelSubtitle}>Top 3 alunos</Text>

            <View style={styles.rankingList}>
              {topStudents.map((student, index) => {
                const status = getStatus(student.average);

                return (
                  <View key={student.id} style={styles.studentCard}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {student.name}
                      </Text>
                      <Text style={styles.studentCourse} numberOfLines={1}>
                        {student.curso}
                      </Text>
                    </View>
                    <View style={styles.studentScore}>
                      <Text style={styles.averageScore}>
                        {student.average.toFixed(1)}
                      </Text>
                      <Text
                        style={[
                          styles.studentStatus,
                          status === 'Aprovado'
                            ? styles.statusApproved
                            : status === 'Em revisão'
                              ? styles.statusReview
                              : styles.statusAttention,
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  pageHeader: {
    marginBottom: 32,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  pageSubtitle: {
    color: '#94A3B8',
    fontSize: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    minWidth: 220,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  totalCard: {
    borderTopColor: 'rgba(59,130,246,0.5)',
  },
  averageCard: {
    borderTopColor: 'rgba(6,182,212,0.5)',
  },
  approvedCard: {
    borderTopColor: 'rgba(16,185,129,0.5)',
  },
  reviewCard: {
    borderTopColor: 'rgba(245,158,11,0.5)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
  },
  averageValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  averageScale: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  metricCaption: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
  },
  lowerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 24,
  },
  panel: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  distributionPanel: {
    flex: 2,
    minWidth: 300,
  },
  rankingPanel: {
    flex: 1,
    minWidth: 280,
  },
  panelTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  panelSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
  },
  progressTrack: {
    flexDirection: 'row',
    width: '100%',
    height: 12,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 28,
    marginBottom: 24,
  },
  progressSegment: {
    height: '100%',
  },
  progressApproved: {
    backgroundColor: '#10B981',
  },
  progressReview: {
    backgroundColor: '#F59E0B',
  },
  progressAttention: {
    backgroundColor: '#EF4444',
  },
  legend: {
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  approvedDot: {
    backgroundColor: '#10B981',
  },
  reviewDot: {
    backgroundColor: '#F59E0B',
  },
  attentionDot: {
    backgroundColor: '#EF4444',
  },
  legendLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    flex: 1,
  },
  legendValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  rankingList: {
    gap: 12,
    marginTop: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rankBadge: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(59,130,246,0.16)',
  },
  rankNumber: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  studentCourse: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  studentScore: {
    alignItems: 'flex-end',
  },
  averageScore: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  studentStatus: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  statusApproved: {
    color: '#34D399',
  },
  statusReview: {
    color: '#FBBF24',
  },
  statusAttention: {
    color: '#F87171',
  },
});
