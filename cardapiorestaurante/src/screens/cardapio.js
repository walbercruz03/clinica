import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIAS = ['Todos', 'Hambúrgueres', 'Bebidas', 'Sobremesas'];

const PRATOS = [
  {
    id: '1',
    nome: 'Burguer Classic',
    categoria: 'Hambúrgueres',
    preco: 32.90,
    descricao: 'Pão brioche, blend 180g, queijo cheddar e molho da casa.',
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    id: '2',
    nome: 'Double Bacon',
    categoria: 'Hambúrgueres',
    preco: 38.50,
    descricao: '2x smash 90g, muito bacon crocante e queijo prato.',
    imagem: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400'
  },
  {
    id: '3',
    nome: 'Coca-Cola Zero 350ml',
    categoria: 'Bebidas',
    preco: 7.00,
    descricao: 'Lata trincando de gelada.',
    imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400'
  },
  {
    id: '4',
    nome: 'Milkshake Nutella',
    categoria: 'Sobremesas',
    preco: 22.00,
    descricao: 'Sorvete de baunilha, Nutella pura e chantilly.',
    imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'
  }
];

const FORMAS_PAGAMENTO = [
  { id: 'pix', nome: 'PIX (Aprovação Instantânea)' },
  { id: 'cartao', nome: 'Cartão de Crédito/Débito' },
  { id: 'dinheiro', nome: 'Dinheiro na entrega' }
];

export default function Cardapio({ isLogado, usuario, onRequererAutenticacao, onLogout }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [carrinho, setCarrinho] = useState([]);
  const [abaAtual, setAbaAtual] = useState('cardapio'); // 'cardapio' | 'carrinho' | 'sucesso'
  const [formaPagamento, setFormaPagamento] = useState('pix');

  const pratosFiltrados = categoriaAtiva === 'Todos' 
    ? PRATOS 
    : PRATOS.filter(item => item.categoria === categoriaAtiva);

  const adicionarAoCarrinho = (prato) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.id === prato.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === prato.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { ...prato, quantidade: 1 }];
    });
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(prev =>
      prev.map(item => {
        if (item.id === id) {
          const novaQtd = item.quantidade + delta;
          return novaQtd > 0 ? { ...item, quantidade: novaQtd } : item;
        }
        return item;
      })
    );
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const handleFinalizarPedido = () => {
    if (!isLogado) {
      // Se não estiver logado, direciona para o login antes de confirmar
      onRequererAutenticacao();
    } else {
      // Se já estiver logado, conclui o pedido
      setAbaAtual('sucesso');
      setCarrinho([]);
    }
  };

  if (abaAtual === 'sucesso') {
    return (
      <SafeAreaView style={styles.containerSucesso}>
        <Ionicons name="checkmark-circle" size={80} color="#16a34a" />
        <Text style={styles.tituloSucesso}>Pedido Confirmado!</Text>
        <Text style={styles.subtituloSucesso}>
          Obrigado, {usuario?.nome || 'Cliente'}! Seu pedido já foi enviado para a cozinha.
        </Text>
        <TouchableOpacity style={styles.botaoVoltarHome} onPress={() => setAbaAtual('cardapio')}>
          <Text style={styles.textoBotaoVoltar}>Voltar ao Cardápio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (abaAtual === 'carrinho') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerCarrinho}>
          <TouchableOpacity onPress={() => setAbaAtual('cardapio')}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.tituloHeader}>Meu Carrinho</Text>
          <View style={{ width: 24 }} />
        </View>

        {carrinho.length === 0 ? (
          <View style={styles.carrinhoVazio}>
            <Ionicons name="cart-outline" size={64} color="#9ca3af" />
            <Text style={styles.textoCarrinhoVazio}>Seu carrinho está vazio</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollCarrinho}>
            <Text style={styles.secaoTitulo}>Itens do Pedido</Text>
            {carrinho.map(item => (
              <View key={item.id} style={styles.cardItemCarrinho}>
                <Image source={{ uri: item.imagem }} style={styles.imagemCarrinho} />
                <View style={styles.infoItemCarrinho}>
                  <Text style={styles.nomeItemCarrinho}>{item.nome}</Text>
                  <Text style={styles.precoItemCarrinho}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
                  <View style={styles.controlesQtd}>
                    <TouchableOpacity onPress={() => alterarQuantidade(item.id, -1)} style={styles.botaoQtd}>
                      <Ionicons name="remove" size={16} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.textoQtd}>{item.quantidade}</Text>
                    <TouchableOpacity onPress={() => alterarQuantidade(item.id, 1)} style={styles.botaoQtd}>
                      <Ionicons name="add" size={16} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removerDoCarrinho(item.id)} style={styles.botaoDeletar}>
                  <Ionicons name="trash-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.secaoTitulo}>Forma de Pagamento</Text>
            {FORMAS_PAGAMENTO.map(forma => (
              <TouchableOpacity
                key={forma.id}
                style={[styles.opcaoPagamento, formaPagamento === forma.id && styles.opcaoPagamentoSelecionada]}
                onPress={() => setFormaPagamento(forma.id)}
              >
                <Ionicons 
                  name={formaPagamento === forma.id ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={formaPagamento === forma.id ? "#dc2626" : "#9ca3af"} 
                />
                <Text style={styles.textoPagamento}>{forma.nome}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.resumoContainer}>
              <View style={styles.linhaResumo}>
                <Text style={styles.labelResumo}>Subtotal</Text>
                <Text style={styles.valorResumo}>R$ {totalCarrinho.toFixed(2)}</Text>
              </View>
              <View style={styles.linhaResumo}>
                <Text style={styles.labelResumo}>Taxa de Entrega</Text>
                <Text style={styles.valorResumo}>R$ 5.00</Text>
              </View>
              <View style={[styles.linhaResumo, styles.linhaTotal]}>
                <Text style={styles.labelTotal}>Total</Text>
                <Text style={styles.valorTotal}>R$ {(totalCarrinho + 5.00).toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {carrinho.length > 0 && (
          <View style={styles.footerCheckout}>
            <TouchableOpacity style={styles.botaoFinalizar} onPress={handleFinalizarPedido}>
              <Text style={styles.textoBotaoFinalizar}>
                {isLogado ? 'Finalizar Pedido' : 'Entrar / Cadastrar para Finalizar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.subtituloHeader}>
            {isLogado ? `Olá, ${usuario?.nome || 'Cliente'}` : 'Bem-vindo ao'}
          </Text>
          <Text style={styles.tituloApp}>DevBurger 🍔</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.iconeCarrinhoContainer} onPress={() => setAbaAtual('carrinho')}>
            <Ionicons name="cart-outline" size={24} color="#1f2937" />
            {totalItens > 0 && (
              <View style={styles.badgeCarrinho}>
                <Text style={styles.textoBadge}>{totalItens}</Text>
              </View>
            )}
          </TouchableOpacity>

          {isLogado ? (
            <TouchableOpacity style={styles.iconeCarrinhoContainer} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.iconeCarrinhoContainer} onPress={onRequererAutenticacao}>
              <Ionicons name="person-outline" size={24} color="#1f2937" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIAS.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chipCategoria, categoriaAtiva === cat && styles.chipCategoriaAtiva]}
              onPress={() => setCategoriaAtiva(cat)}
            >
              <Text style={[styles.textoCategoria, categoriaAtiva === cat && styles.textoCategoriaAtiva]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={pratosFiltrados}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listaPratos}
        renderItem={({ item }) => (
          <View style={styles.cardPrato}>
            <Image source={{ uri: item.imagem }} style={styles.imagemPrato} />
            <View style={styles.infoPrato}>
              <Text style={styles.nomePrato}>{item.nome}</Text>
              <Text style={styles.descricaoPrato} numberOfLines={2}>{item.descricao}</Text>
              <View style={styles.rodapePrato}>
                <Text style={styles.precoPrato}>R$ {item.preco.toFixed(2)}</Text>
                <TouchableOpacity style={styles.botaoAdicionar} onPress={() => adicionarAoCarrinho(item)}>
                  <Ionicons name="add" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  subtituloHeader: { fontSize: 13, color: '#6b7280' },
  tituloApp: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  iconeCarrinhoContainer: { position: 'relative', padding: 8, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  badgeCarrinho: { position: 'absolute', top: -4, right: -4, backgroundColor: '#dc2626', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  textoBadge: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  categoriasContainer: { paddingVertical: 10, paddingLeft: 20 },
  chipCategoria: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffffff', marginRight: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  chipCategoriaAtiva: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  textoCategoria: { color: '#4b5563', fontWeight: '500' },
  textoCategoriaAtiva: { color: '#ffffff', fontWeight: 'bold' },
  listaPratos: { paddingHorizontal: 20, paddingBottom: 40 },
  cardPrato: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6' },
  imagemPrato: { width: 85, height: 85, borderRadius: 12 },
  infoPrato: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  nomePrato: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  descricaoPrato: { fontSize: 13, color: '#6b7280' },
  rodapePrato: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precoPrato: { fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
  botaoAdicionar: { backgroundColor: '#dc2626', padding: 6, borderRadius: 8 },
  headerCarrinho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tituloHeader: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  carrinhoVazio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoCarrinhoVazio: { marginTop: 16, fontSize: 16, color: '#6b7280' },
  scrollCarrinho: { flex: 1, paddingHorizontal: 20 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginTop: 20, marginBottom: 12 },
  cardItemCarrinho: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  imagemCarrinho: { width: 50, height: 50, borderRadius: 8 },
  infoItemCarrinho: { flex: 1, marginLeft: 12 },
  nomeItemCarrinho: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  precoItemCarrinho: { fontSize: 14, color: '#dc2626', fontWeight: 'bold', marginVertical: 2 },
  controlesQtd: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  botaoQtd: { backgroundColor: '#f3f4f6', padding: 4, borderRadius: 6 },
  textoQtd: { fontWeight: 'bold', fontSize: 14 },
  botaoDeletar: { padding: 8 },
  opcaoPagamento: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb', gap: 10 },
  opcaoPagamentoSelecionada: { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
  textoPagamento: { fontSize: 14, fontWeight: '500', color: '#374151' },
  resumoContainer: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginTop: 12, marginBottom: 30 },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  labelResumo: { color: '#6b7280' },
  valorResumo: { color: '#374151', fontWeight: '500' },
  linhaTotal: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 8, marginTop: 4 },
  labelTotal: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  valorTotal: { fontSize: 18, fontWeight: 'bold', color: '#dc2626' },
  footerCheckout: { padding: 20, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  botaoFinalizar: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center' },
  textoBotaoFinalizar: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  containerSucesso: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#ffffff' },
  tituloSucesso: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 20 },
  subtituloSucesso: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  botaoVoltarHome: { backgroundColor: '#dc2626', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  textoBotaoVoltar: { color: '#ffffff', fontWeight: 'bold' }
});