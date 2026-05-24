import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useCreateTicket } from '../hooks/useTickets';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const PRIORITY_LABELS = { LOW:'Baixa', MEDIUM:'Média', HIGH:'Alta', CRITICAL:'Crítica' };
const PRIORITY_COLORS = { CRITICAL:'#E24B4A', HIGH:'#EF9F27', MEDIUM:'#378ADD', LOW:'#888780' };

export default function NewTicketScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const { mutateAsync, isPending } = useCreateTicket();

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) return Alert.alert('Erro', 'Preencha o assunto e a descrição.');
    try {
      await mutateAsync({ title, description, priority });
      Alert.alert('Sucesso', 'Chamado aberto com sucesso!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível abrir o chamado.');
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Novo Chamado</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Assunto *</Text>
        <TextInput style={styles.input} placeholder="Descreva o problema" value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Descrição *</Text>
        <TextInput style={[styles.input, styles.textarea]} placeholder="Detalhes, passos para reproduzir, erros..." value={description} onChangeText={setDescription} multiline numberOfLines={5} />
        <Text style={styles.label}>Prioridade</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity key={p} style={[styles.priorityBtn, priority === p && { backgroundColor: PRIORITY_COLORS[p] + '22', borderColor: PRIORITY_COLORS[p] }]} onPress={() => setPriority(p)}>
              <Text style={[styles.priorityText, priority === p && { color: PRIORITY_COLORS[p], fontWeight: '600' }]}>{PRIORITY_LABELS[p]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={isPending}>
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Abrir Chamado</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8', padding: 16 },
  header: { fontSize: 22, fontWeight: '700', color: '#2C2C2A', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  label: { fontSize: 12, color: '#888780', marginBottom: 6 },
  input: { borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16, color: '#2C2C2A' },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  priorityBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 0.5, borderColor: '#D3D1C7', backgroundColor: '#F1EFE8' },
  priorityText: { fontSize: 13, color: '#888780' },
  btn: { backgroundColor: '#185FA5', borderRadius: 10, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
