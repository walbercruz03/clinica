import React, { useState, useEffect } from 'react';
import Login from './src/screens/login';
import Cadastro from './src/screens/cadastro';
import Agendamento from './src/screens/agendamento';
import { conectarBD } from './src/database/database';

export default function App() {
  // Define a tela inicial. Opções: 'login', 'cadastro', 'agendamento'
  const [telaAtual, setTelaAtual] = useState('login');

  useEffect(() => {
    // Executa a conexão assim que o app carrega
    conectarBD();
  }, []);

  if (telaAtual === 'cadastro') {
    return <Cadastro onNavigateToLogin={() => setTelaAtual('login')} />;
  }

  if (telaAtual === 'agendamento') {
    return <Agendamento onLogout={() => setTelaAtual('login')} />;
  }

  // Por padrão, exibe a tela de Login
  return (
    <Login 
      onLoginSuccess={() => setTelaAtual('agendamento')} 
      onNavigateToCadastro={() => setTelaAtual('cadastro')} 
    />
  );
}