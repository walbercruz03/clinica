import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';

export default function Cadastro({ onCadastroSuccess, onNavigateToLogin, onVoltarCardapio }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }

    Alert.alert(
      'Cadastro Realizado!',
      `Bem-vindo(a), ${nome}!`,
      [{ text: 'Continuar Pedido', onPress: () => onCadastroSuccess({ nome }) }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {onVoltarCardapio && (
          <TouchableOpacity style={styles.backButton} onPress={onVoltarCardapio}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
            <Text style={styles.backButtonText}>Voltar ao Cardápio</Text>
          </TouchableOpacity>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se rapidamente para enviar seu pedido</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput 
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#94A3B8"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone / WhatsApp</Text>
            <TextInput 
              style={styles.input}
              placeholder="(84) 99999-9999"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail *</Text>
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
            <Text style={styles.label}>Endereço de Entrega</Text>
            <TextInput 
              style={styles.input}
              placeholder="Rua, Número, Bairro"
              placeholderTextColor="#94A3B8"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                style={styles.passwordInput}
                placeholder="Crie uma senha"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCadastro} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Cadastrar e Concluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={onNavigateToLogin}>
            <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkBold}>Faça Login</Text></Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 50, paddingBottom: 40 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButtonText: { fontSize: 16, marginLeft: 8, color: '#0F172A', fontWeight: '500' },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748B' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#0F172A' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10 },
  passwordInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#0F172A' },
  eyeButton: { paddingHorizontal: 14, paddingVertical: 12 },
  button: { backgroundColor: '#DC2626', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 12, elevation: 4 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#64748B', fontSize: 14 },
  linkBold: { color: '#DC2626', fontWeight: '600' }
});