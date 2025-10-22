import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, // Importado para mostrar loading
} from "react-native";

import Header from "../../Components/Header"; // Certifique-se que o caminho está correto

// Função para formatar o preço, adaptada do seu primeiro código
function formatarPreco(valor) {
  if (typeof valor !== "number" || isNaN(valor)) {
    // Pode retornar o valor bruto ou um texto de erro se a API retornar dados inconsistentes
    return `R$ ${valor}`;
  }

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatter.format(valor);
}

// Componente para renderizar cada item (produto) na lista
function Item(props) {
  const navigation = useNavigation();

  function mudarTela() {
    navigation.navigate("Details", { produto: props.produto });
  }

  return (
    <TouchableOpacity onPress={mudarTela} style={styles.container}>
      <Image style={styles.img} source={{ uri: props.produto.thumbnail }} />
      <View style={styles.containerInfo}>
        <Text style={styles.title}>{props.produto.title}</Text>
        <Text style={styles.description}>
          {formatarPreco(props.produto.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Componente principal Home
export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para carregar
  const [isError, setIsError] = useState(false);

  async function getProducts() {
    try {
      setIsError(false);
      setIsLoading(true); // Inicia o carregamento
      const response = await fetch("https://dummyjson.com/products");

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const productsData = await response.json();
      // A API dummyjson retorna os produtos dentro da chave 'products'
      setProducts(productsData?.products || []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setIsError(true);
      // Você pode adicionar um alerta aqui se quiser: alert("Erro ao buscar produtos, tente novamente mais tarde!");
    } finally {
      setIsLoading(false); // Finaliza o carregamento, independente de sucesso ou erro
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.containerFull, styles.loading]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.containerFull}>
        <Text style={styles.errorText}>Opssss.... erro ao buscar produtos</Text>
        <TouchableOpacity onPress={getProducts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.containerFull}>
      <Header />
      <FlatList
        data={products}
        // Usamos item.id (da API dummyjson) como keyExtractor
        keyExtractor={(item) => item.id.toString()}
        // Passamos o produto (item) para o componente Item
        renderItem={({ item }) => <Item produto={item} />}
      />
    </View>
  );
}

// Estilos (mantidos e ajustados)
const styles = StyleSheet.create({
  containerFull: {
    flex: 1, // Adicionado para ocupar a tela inteira, importante para FlatList
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    marginBottom: 2,
    padding: 10, // Adicionado padding para melhor visualização
    borderBottomWidth: 1, // Separador
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  img: {
    width: 100,
    height: 100,
    resizeMode: "contain", // Para garantir que a imagem se ajuste bem
    marginRight: 10,
  },
  containerInfo: {
    paddingVertical: 5,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16, // Um pouco menor para melhor adaptação
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    fontWeight: "400", // Corrigido para string
    color: "#00A86B", // Cor para o preço
    marginTop: 5,
  },
  errorText: {
    textAlign: "center",
    padding: 20,
    color: "red",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
