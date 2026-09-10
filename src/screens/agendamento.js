import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ESPECIALIDADES = ['Cardiologia', 'Dermatologia', 'Ginecologia', 'Ortopedia', 'Pediatria', 'Clínica Geral'];
const HORARIOS = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];

const gerarProximosDias = () => {
  const dias = [];
  const hoje = new Date();
  for (let i = 1; i <= 7; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    const diaFormatado = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    dias.push({ id: data.toISOString().split('T')[0], dataExtenso: diaFormatado, diaSemana });
  }
  return dias;
};

export default function Home({ onLogout }) {
  // Controle da barra inferior: 'home', 'agendamentos', 'contatos'
  const [abaInferior, setAbaInferior] = useState('home');
  
  // Sub-aba interna da tela de Agendamentos: 'meus' ou 'novo'
  const [subAbaAgendamento, setSubAbaAgendamento] = useState('meus');

  // Estados de formulário e dados
  const [especialidade, setEspecialidade] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horario, setHorario] = useState('');
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);

  const proximosDias = gerarProximosDias();

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const dados = await AsyncStorage.getItem('@clinica_agendamentos');
      if (dados) setMeusAgendamentos(JSON.parse(dados));
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmarAgendamento = async () => {
    if (!especialidade || !diaSelecionado || !horario) {
      Alert.alert('Atenção', 'Selecione a especialidade, o dia e o horário.');
      return;
    }

    const novoAgendamento = {
      id: Date.now().toString(),
      especialidade,
      dia: diaSelecionado.dataExtenso,
      horario,
      status: 'Confirmado'
    };

    try {
      const listaAtualizada = [novoAgendamento, ...meusAgendamentos];
      await AsyncStorage.setItem('@clinica_agendamentos', JSON.stringify(listaAtualizada));
      setMeusAgendamentos(listaAtualizada);
      
      Alert.alert('Sucesso!', 'Agendamento realizado com sucesso.', [
        { 
          text: 'Ver Meus Agendamentos', 
          onPress: () => {
            setEspecialidade('');
            setDiaSelecionado(null);
            setHorario('');
            setSubAbaAgendamento('meus');
          } 
        }
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
    }
  };

  const handleCancelarAgendamento = async (id) => {
    const listaAtualizada = meusAgendamentos.filter(item => item.id !== id);
    setMeusAgendamentos(listaAtualizada);
    await AsyncStorage.setItem('@clinica_agendamentos', JSON.stringify(listaAtualizada));
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {abaInferior === 'home' && 'Página Inicial'}
          {abaInferior === 'agendamentos' && 'Agendamentos'}
          {abaInferior === 'contatos' && 'Contato da Clínica'}
        </Text>
        
        <TouchableOpacity style={styles.gearButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.content}>
        
        {/* 1. ABA HOME */}
        {abaInferior === 'home' && (
          <View style={styles.centerView}>
            <Text style={styles.homeText}>Página Inicial!</Text>
          </View>
        )}

        {/* 2. ABA AGENDAMENTOS */}
        {abaInferior === 'agendamentos' && (
          <View style={{ flex: 1 }}>
            {/* Sub-navegação interna */}
            <View style={styles.subTabContainer}>
              <TouchableOpacity 
                style={[styles.subTabButton, subAbaAgendamento === 'meus' && styles.subTabActive]}
                onPress={() => setSubAbaAgendamento('meus')}
              >
                <Text style={[styles.subTabText, subAbaAgendamento === 'meus' && styles.subTabActiveText]}>
                  Meus Agendamentos ({meusAgendamentos.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.subTabButton, subAbaAgendamento === 'novo' && styles.subTabActive]}
                onPress={() => setSubAbaAgendamento('novo')}
              >
                <Text style={[styles.subTabText, subAbaAgendamento === 'novo' && styles.subTabActiveText]}>
                  + Novo Agendamento
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sub-conteúdo: Meus Agendamentos */}
            {subAbaAgendamento === 'meus' ? (
              meusAgendamentos.length === 0 ? (
                <View style={styles.centerView}>
                  <Text style={{ color: '#94A3B8' }}>Nenhuma consulta agendada.</Text>
                </View>
              ) : (
                <FlatList
                  data={meusAgendamentos}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.appointmentCard}>
                      <View style={styles.appointmentHeader}>
                        <Text style={styles.appointmentTitle}>{item.especialidade}</Text>
                        <Text style={styles.appointmentBadge}>{item.status}</Text>
                      </View>
                      <Text style={styles.appointmentDetail}>📅 Dia: {item.dia}</Text>
                      <Text style={styles.appointmentDetail}>⏰ Horário: {item.horario}</Text>
                      <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => handleCancelarAgendamento(item.id)}
                      >
                        <Text style={styles.cancelText}>Cancelar Consulta</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )
            ) : (
              /* Sub-conteúdo: Novo Agendamento */
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>1. Especialidade</Text>
                <View style={styles.grid}>
                  {ESPECIALIDADES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.card, especialidade === item && styles.cardSelected]}
                      onPress={() => setEspecialidade(item)}
                    >
                      <Text style={[styles.cardText, especialidade === item && styles.cardTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>2. Selecione o Dia</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
                  {proximosDias.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.dayCard, diaSelecionado?.id === item.id && styles.dayCardSelected]}
                      onPress={() => setDiaSelecionado(item)}
                    >
                      <Text style={[styles.daySemana, diaSelecionado?.id === item.id && styles.dayTextSelected]}>
                        {item.diaSemana.toUpperCase()}
                      </Text>
                      <Text style={[styles.dayData, diaSelecionado?.id === item.id && styles.dayTextSelected]}>
                        {item.dataExtenso}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>3. Selecione o Horário</Text>
                <View style={styles.gridHorarios}>
                  {HORARIOS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.chip, horario === item && styles.chipSelected]}
                      onPress={() => setHorario(item)}
                    >
                      <Text style={[styles.chipText, horario === item && styles.chipTextSelected]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmarAgendamento}>
                  <Text style={styles.primaryButtonText}>Confirmar Agendamento</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        )}

        {/* 3. ABA CONTATOS */}
        {abaInferior === 'contatos' && (
          <View style={styles.contactContainer}>
            <View style={styles.contactCard}>
              <Ionicons name="business-outline" size={32} color="#10B981" style={{ marginBottom: 12 }} />
              <Text style={styles.contactName}>Clínica Saúde & Vida</Text>
              
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={20} color="#64748B" />
                <Text style={styles.contactInfo}>contato@clinicasaudevida.com.br</Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={20} color="#64748B" />
                <Text style={styles.contactInfo}>(84) 3222-0000 / (84) 99999-8888</Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="location-outline" size={20} color="#64748B" />
                <Text style={styles.contactInfo}>Av. Principal, 1000 - Natal / RN</Text>
              </View>
            </View>
          </View>
        )}

      </View>

      {/* Barra de Navegação Inferior: Home | Agendamentos | Contatos */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setAbaInferior('home')}
        >
          <Ionicons 
            name="home-outline" 
            size={22} 
            color={abaInferior === 'home' ? '#10B981' : '#94A3B8'} 
          />
          <Text style={[styles.tabLabel, abaInferior === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setAbaInferior('agendamentos')}
        >
          <Ionicons 
            name="calendar-outline" 
            size={22} 
            color={abaInferior === 'agendamentos' ? '#10B981' : '#94A3B8'} 
          />
          <Text style={[styles.tabLabel, abaInferior === 'agendamentos' && styles.tabLabelActive]}>
            Agendamentos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setAbaInferior('contatos')}
        >
          <Ionicons 
            name="call-outline" 
            size={22} 
            color={abaInferior === 'contatos' ? '#10B981' : '#94A3B8'} 
          />
          <Text style={[styles.tabLabel, abaInferior === 'contatos' && styles.tabLabelActive]}>
            Contatos
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingTop: 45 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  gearButton: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#FEE2E2', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { flex: 1, padding: 20 },
  centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  homeText: { fontSize: 24, fontWeight: '700', color: '#1F2937' },

  // Navegação Inferior
  bottomBar: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderColor: '#E5E7EB', 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 8 
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 11, marginTop: 2, color: '#94A3B8' },
  tabLabelActive: { color: '#10B981', fontWeight: '600' },

  // Sub-abas na Tela de Agendamentos
  subTabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 8, padding: 3, marginBottom: 16 },
  subTabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  subTabActive: { backgroundColor: '#FFFFFF' },
  subTabText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  subTabActiveText: { color: '#10B981', fontWeight: '700' },

  // Tela de Contatos
  contactContainer: { flex: 1, justifyContent: 'center' },
  contactCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  contactName: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, width: '100%' },
  contactInfo: { fontSize: 14, color: '#4B5563', marginLeft: 12 },

  // Agendamento (Cards e Botões)
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 10, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  card: { width: '48%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
  cardSelected: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  cardText: { fontSize: 13, color: '#475569' },
  cardTextSelected: { color: '#10B981', fontWeight: '600' },
  daysContainer: { flexDirection: 'row', marginBottom: 12 },
  dayCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', marginRight: 8, width: 75 },
  dayCardSelected: { borderColor: '#10B981', backgroundColor: '#10B981' },
  daySemana: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  dayData: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginTop: 2 },
  dayTextSelected: { color: '#FFFFFF' },
  gridHorarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  chip: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14 },
  chipSelected: { borderColor: '#10B981', backgroundColor: '#10B981' },
  chipText: { fontSize: 13, color: '#475569' },
  chipTextSelected: { color: '#FFFFFF' },
  primaryButton: { backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  appointmentCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 14, marginBottom: 10 },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  appointmentTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  appointmentBadge: { backgroundColor: '#DCFCE7', color: '#166534', fontSize: 11, fontWeight: '600', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  appointmentDetail: { fontSize: 13, color: '#475569', marginBottom: 2 },
  cancelButton: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' },
  cancelText: { color: '#EF4444', fontSize: 12, fontWeight: '600' }
});