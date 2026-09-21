import React, { useState } from 'react';
import Cardapio from './src/screens/cardapio.js';
import Login from './src/screens/login.js';
import Cadastro from './src/screens/cadastro.js';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('cardapio');
  const [isLogado, setIsLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const handleLoginSuccess = (dadosUsuario) => {
    setIsLogado(true);
    setUsuario(dadosUsuario || { nome: 'Cliente' });
    setTelaAtual('cardapio');
  };

  const handleCadastroSuccess = (dadosUsuario) => {
    setIsLogado(true);
    setUsuario(dadosUsuario || { nome: 'Cliente' });
    setTelaAtual('cardapio');
  };

  const handleLogout = () => {
    setIsLogado(false);
    setUsuario(null);
  };

  if (telaAtual === 'login') {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onNavigateToCadastro={() => setTelaAtual('cadastro')}
        onVoltarCardapio={() => setTelaAtual('cardapio')}
      />
    );
  }

  if (telaAtual === 'cadastro') {
    return (
      <Cadastro 
        onCadastroSuccess={handleCadastroSuccess}
        onNavigateToLogin={() => setTelaAtual('login')}
        onVoltarCardapio={() => setTelaAtual('cardapio')}
      />
    );
  }

  return (
    <Cardapio 
      isLogado={isLogado}
      usuario={usuario}
      onRequererAutenticacao={() => setTelaAtual('login')}
      onLogout={handleLogout}
    />
  );
}