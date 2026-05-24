import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos.');
    try {
      await login({ email, password });
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao entrar.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>NexusDesk</Text>
        <Text style={styles.subtitle}>Sistema de Chamados</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Entrar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  logo: { fontSize: 28, fontWeight: '700', color: '#185FA5', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888780', textAlign: 'center', marginBottom: 28 },
  input: { borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 14, color: '#2C2C2A' },
  btn: { backgroundColor: '#185FA5', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 14 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  link: { textAlign: 'center', color: '#185FA5', fontSize: 13 },
});
