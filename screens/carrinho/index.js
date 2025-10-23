import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../Components/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

function formatarPreco(valor) {
  if (typeof valor !== "number" || isNaN(valor)) {
    return `R$ ${valor}`;
  }

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatter.format(valor);
}

function CarrinhoItem({ item, onUpdateQuantity, onRemove }) {
  const precoTotalItem = item.price * item.quantity;

  return (
    <View style={styles.itemCarrinhoContainer}>
      <Image
        style={styles.itemCarrinhoImage}
        source={{ uri: item.thumbnail }}
        resizeMode="contain"
      />

      <View style={styles.itemCarrinhoInfo}>
        <Text style={styles.itemCarrinhoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemCarrinhoPrice}>
          {formatarPreco(precoTotalItem)}
        </Text>
        <Text style={styles.unitPrice}>
          {formatarPreco(item.price)} por unidade
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Feather
            name="minus"
            size={18}
            color={item.quantity <= 1 ? "#ccc" : "#00A86B"}
          />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Feather name="plus" size={18} color="#00A86B" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <AntDesign name="closecircle" size={24} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );
}

export default function Carrinho() {
  const [produtosCarrinho, setProdutosCarrinho] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const userId = 1;

  const buscarCarrinho = useCallback(async () => {
    try {
      setIsError(false);
      setIsLoading(true);

      const response = await fetch(`https://dummyjson.com/carts/${userId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar o carrinho");
      }

      const dadosCarrinho = await response.json();

      setProdutosCarrinho(dadosCarrinho?.products || []);
      setValorTotal(dadosCarrinho?.total || 0);
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const atualizarQuantidadeAPI = useCallback(
    async (produtoId, newQuantity) => {
      if (newQuantity < 1) return;

      try {
        const response = await fetch(`https://dummyjson.com/carts/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merge: true,
            products: [{ id: produtoId, quantity: newQuantity }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Falha ao atualizar quantidade: ${response.status}`);
        }

        buscarCarrinho();
        Alert.alert("Sucesso", "Quantidade atualizada!");
      } catch (error) {
        console.error("Erro na atualização do carrinho:", error);
        Alert.alert("Erro", "Não foi possível atualizar a quantidade.");
      }
    },
    [buscarCarrinho, userId]
  );

  const removerItemAPI = useCallback(
    async (produtoId) => {
      Alert.alert(
        "Confirmar Remoção",
        "Tem certeza que deseja remover este item?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Remover",
            onPress: async () => {
              try {
                const updatedProducts = produtosCarrinho
                  .filter((p) => p.id !== produtoId)
                  .map((p) => ({ id: p.id, quantity: p.quantity }));

                const response = await fetch(
                  `https://dummyjson.com/carts/${userId}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      products: updatedProducts,
                    }),
                  }
                );

                if (!response.ok) {
                  throw new Error(`Falha ao remover item: ${response.status}`);
                }

                buscarCarrinho();
                Alert.alert("Sucesso", "Item removido do carrinho.");
              } catch (error) {
                console.error("Erro na remoção do carrinho:", error);
                Alert.alert("Erro", "Não foi possível remover o item.");
              }
            },
          },
        ]
      );
    },
    [produtosCarrinho, buscarCarrinho, userId]
  );

  useEffect(() => {
    buscarCarrinho();
  }, [buscarCarrinho]);

  if (isLoading) {
    return (
      <View style={[styles.containerFull, styles.loading]}>
        <ActivityIndicator size="large" color="#00A86B" />
        <Text style={styles.loadingText}>Buscando seu carrinho...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.containerFull}>
        <Header />
        <View style={styles.centerMessage}>
          <Text style={styles.errorText}>Erro ao carregar o carrinho.</Text>
          <TouchableOpacity onPress={buscarCarrinho} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (produtosCarrinho.length === 0) {
    return (
      <View style={styles.containerFull}>
        <Header />
        <View style={styles.centerMessage}>
          <Text style={styles.emptyCartText}>Seu carrinho está vazio!</Text>
          <AntDesign
            name="shoppingcart"
            size={60}
            color="#ccc"
            style={{ marginTop: 10 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.containerFull}>
      <Header />

      <FlatList
        data={produtosCarrinho}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CarrinhoItem
            item={item}
            onUpdateQuantity={atualizarQuantidadeAPI}
            onRemove={removerItemAPI}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.resumoCarrinho}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total do Carrinho:</Text>
          <Text style={styles.totalValue}>{formatarPreco(valorTotal)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            Alert.alert(
              "Finalizar Compra",
              "Pronto para finalizar a compra! (Simulação de checkout)"
            )
          }
        >
          <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#00A86B",
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#00A86B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 10,
  },
  itemCarrinhoContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  itemCarrinhoImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 4,
  },
  itemCarrinhoInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemCarrinhoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemCarrinhoPrice: {
    fontSize: 18,
    color: "#00A86B",
    fontWeight: "700",
  },
  unitPrice: {
    fontSize: 12,
    color: "#666",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#eee",
  },
  removeButton: {
    padding: 5,
  },
  resumoCarrinho: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 15,
    backgroundColor: "#fff",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00A86B",
  },
  checkoutButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
