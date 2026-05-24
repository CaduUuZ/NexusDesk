import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useDashboard } from '../hooks/useTickets';

const PRIORITY_COLORS = { CRITICAL: '#E24B4A', HIGH: '#EF9F27', MEDIUM: '#378ADD', LOW: '#888780' };

function MetricCard({ label, value, color }) {
  return (
    <View style={[styles.metricCard, { borderLeftColor: color || '#185FA5', borderLeftWidth: 3 }]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, color && { color }]}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { data, isLoading, refetch } = useDashboard();

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
      <Text style={styles.header}>Dashboard</Text>
      <View style={styles.row}>
        <MetricCard label="Total" value={data?.total ?? '—'} />
        <MetricCard label="Abertos" value={data?.open ?? '—'} color="#185FA5" />
        <MetricCard label="Andamento" value={data?.inProgress ?? '—'} color="#EF9F27" />
        <MetricCard label="Resolvidos" value={data?.resolved ?? '—'} color="#3B6D11" />
      </View>
      <Text style={styles.sectionTitle}>Por Prioridade</Text>
      {(data?.byPriority || []).map((p) => (
        <View key={p.priority} style={styles.priorityRow}>
          <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[p.priority] || '#888' }]} />
          <Text style={styles.priorityLabel}>{p.priority}</Text>
          <Text style={styles.priorityCount}>{p._count}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NovoTicket')}>
        <Text style={styles.fabText}>+ Novo Chamado</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8', padding: 16 },
  header: { fontSize: 22, fontWeight: '700', color: '#2C2C2A', marginBottom: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  metricCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flex: 1, minWidth: 130 },
  metricLabel: { fontSize: 11, color: '#888780', marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '700', color: '#2C2C2A' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#2C2C2A', marginBottom: 10 },
  priorityRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  priorityLabel: { flex: 1, fontSize: 13, color: '#2C2C2A' },
  priorityCount: { fontSize: 13, fontWeight: '600', color: '#2C2C2A' },
  fab: { backgroundColor: '#185FA5', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  fabText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
