import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Login({ onLoginSuccess, onNavigateToCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail e senha.');
      return;
    }
    // Sucesso no login -> redireciona para tela de agendamento
    onLoginSuccess();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Acesse sua conta para agendar uma consulta</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={styles.input}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                style={styles.passwordInput}
                placeholder="Sua senha"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setMostrarSenha(!mostrarSenha)}
              >
                <Ionicons 
                  name={mostrarSenha ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={onNavigateToCadastro}>
            <Text style={styles.linkText}>Ainda não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 30, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748B' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#0F172A' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10 },
  passwordInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#0F172A' },
  eyeButton: { paddingHorizontal: 14, paddingVertical: 12 },
  button: { backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 12, elevation: 3 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#64748B', fontSize: 14 },
  linkBold: { color: '#2563EB', fontWeight: '600' }
});