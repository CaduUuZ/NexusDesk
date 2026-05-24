import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTickets } from '../hooks/useTickets';

const STATUS_COLORS = { OPEN:'#185FA5', IN_PROGRESS:'#854F0B', RESOLVED:'#3B6D11', CLOSED:'#888780' };
const STATUS_LABELS = { OPEN:'Aberto', IN_PROGRESS:'Andamento', RESOLVED:'Resolvido', CLOSED:'Fechado' };
const PRIORITY_COLORS = { CRITICAL:'#E24B4A', HIGH:'#EF9F27', MEDIUM:'#378ADD', LOW:'#888780' };

function TicketCard({ ticket, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.ticketId}>{ticket.id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[ticket.priority] + '22' }]}>
          <Text style={[styles.badgeText, { color: PRIORITY_COLORS[ticket.priority] }]}>{ticket.priority}</Text>
        </View>
      </View>
      <Text style={styles.title}>{ticket.title}</Text>
      <View style={styles.footer}>
        <Text style={styles.creator}>{ticket.creator?.name}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[ticket.status] + '22' }]}>
          <Text style={[styles.badgeText, { color: STATUS_COLORS[ticket.status] }]}>{STATUS_LABELS[ticket.status]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const FILTERS = ['Todos', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];

export default function TicketsScreen({ navigation }) {
  const [filter, setFilter] = useState(null);
  const { data, isLoading, refetch } = useTickets(filter ? { status: filter } : {});

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chamados</Text>
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[styles.chip, (filter === f || (!filter && f === 'Todos')) && styles.chipActive]} onPress={() => setFilter(f === 'Todos' ? null : f)}>
            <Text style={[styles.chipText, (filter === f || (!filter && f === 'Todos')) && styles.chipTextActive]}>{f === 'Todos' ? 'Todos' : STATUS_LABELS[f]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={data?.tickets || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketCard ticket={item} onPress={() => navigation.navigate('DetalheTicket', { id: item.id })} />}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8', padding: 16 },
  header: { fontSize: 22, fontWeight: '700', color: '#2C2C2A', marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, borderWidth: 0.5, borderColor: '#D3D1C7', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#E6F1FB', borderColor: '#185FA5' },
  chipText: { fontSize: 12, color: '#888780' },
  chipTextActive: { color: '#185FA5', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  ticketId: { fontSize: 11, fontFamily: 'monospace', color: '#888780' },
  title: { fontSize: 14, fontWeight: '600', color: '#2C2C2A', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creator: { fontSize: 12, color: '#888780' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { fontSize: 10, fontWeight: '600' },
});
