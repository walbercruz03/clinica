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

export default function Cadastro({ onNavigateToLogin }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [sexo, setSexo] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha pelo menos os campos principais (Nome, E-mail e Senha).');
      return;
    }

    Alert.alert(
      'Cadastro Confirmado!',
      `Obrigado, ${nome}. Seus dados foram cadastrados com sucesso!`,
      [{ text: 'Ir para Login', onPress: () => onNavigateToLogin && onNavigateToLogin() }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para concluir o cadastro</Text>
        </View>

        <View style={styles.form}>
          
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput 
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#94A3B8"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Telefone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput 
              style={styles.input}
              placeholder="(84) 99999-9999"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>

          {/* E-mail */}
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

          {/* Endereço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput 
              style={styles.input}
              placeholder="Rua, Número, Bairro"
              placeholderTextColor="#94A3B8"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          {/* Linha dupla: Data de Nascimento + Sexo */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1, { marginRight: 8 }]}>
              <Text style={styles.label}>Nascimento</Text>
              <TextInput 
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={10}
                value={dataNascimento}
                onChangeText={setDataNascimento}
              />
            </View>

            <View style={[styles.inputGroup, styles.flex1, { marginLeft: 8 }]}>
              <Text style={styles.label}>Sexo</Text>
              <TextInput 
                style={styles.input}
                placeholder="M / F / Outro"
                placeholderTextColor="#94A3B8"
                value={sexo}
                onChangeText={setSexo}
              />
            </View>
          </View>

          {/* CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <TextInput 
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={14}
              value={cpf}
              onChangeText={setCpf}
            />
          </View>

          {/* Senha com ícone de olho */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                style={styles.passwordInput}
                placeholder="Crie uma senha segura"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setMostrarSenha(!mostrarSenha)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={mostrarSenha ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão de Cadastrar */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCadastro} 
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          {/* Botão para ir para o Login */}
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={onNavigateToLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Já possui uma conta? <Text style={styles.linkBold}>Faça Login</Text></Text>
          </TouchableOpacity>

        </View>
        
        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#64748B',
    fontSize: 14,
  },
  linkBold: {
    color: '#2563EB',
    fontWeight: '600',
  },
});