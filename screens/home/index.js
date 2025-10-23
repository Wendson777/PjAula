import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import Header from "../../Components/Header";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 15 * 3) / 2;

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

function Item(props) {
  const navigation = useNavigation();

  function mudarTela() {
    navigation.navigate("Details", { produto: props.produto });
  }

  return (
    <TouchableOpacity onPress={mudarTela} style={styles.gridContainer}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={{ uri: props.produto.thumbnail }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.containerInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {props.produto.title}
        </Text>
        <Text style={styles.price}>{formatarPreco(props.produto.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function getProducts() {
    try {
      setIsError(false);
      setIsLoading(true);
      const response = await fetch("https://dummyjson.com/products?limit=30");

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const productsData = await response.json();
      setProducts(productsData?.products || []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
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
        key={`flatlist-columns-${2}`}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item produto={item} />}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
      />
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
  flatListContent: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  gridContainer: {
    width: itemWidth,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  imgContainer: {
    width: "100%",
    height: itemWidth,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  img: {
    width: "90%",
    height: "90%",
  },

  containerInfo: {
    padding: 8,
    justifyContent: "space-between",
    minHeight: 80,
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 5,
    textAlign: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00A86B",
    marginTop: 5,
    textAlign: "center",
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
