import React, { useState } from 'react';
import Cardapio from './src/screens/cardapio';
import Login from './src/screens/login';
import Cadastro from './src/screens/cadastro';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('cardapio'); // Inicia direto no Cardápio
  const [isLogado, setIsLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Ao realizar login com sucesso
  const handleLoginSuccess = (dadosUsuario) => {
    setIsLogado(true);
    setUsuario(dadosUsuario || { nome: 'Cliente' });
    setTelaAtual('cardapio'); // Volta para o cardápio/carrinho para finalizar
  };

  // Ao realizar cadastro com sucesso
  const handleCadastroSuccess = (dadosUsuario) => {
    setIsLogado(true);
    setUsuario(dadosUsuario || { nome: 'Cliente' });
    setTelaAtual('cardapio'); // Volta para o cardápio/carrinho para finalizar
  };

  // Logout
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