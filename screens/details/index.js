import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../Components/Header";
import Carrossel from "../../Components/Carrossel";
import ProductSpecs from "../../Components/ProductSpecs";
import Favoritos from "../../Components/Favoritos";
import ShareButton from "../../Components/ShareButton";
import ProductReviews from "../../Components/ProductReviews"; // Importação

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

export default function Details() {
  const routes = useRoute();
  const produto = routes.params.produto;

  // CÁLCULO DO PREÇO ORIGINAL
  let precoOriginal = null;
  if (produto.discountPercentage && produto.discountPercentage > 0) {
    precoOriginal = produto.price / (1 - produto.discountPercentage / 100);
  }

  return (
    <View style={styles.outerContainer}>
      <Header />

      <ScrollView contentContainerStyle={styles.contentPadding}>
        <View style={styles.topLeftActions}>
          <ShareButton
            title={produto.title}
            url={`https://seusite.com/produto/${produto.id}`}
          />
        </View>

        <Carrossel
          images={produto.images}
          discount={produto.discountPercentage}
        />
        <Favoritos
          title={produto.title}
          rating={produto.rating}
          brand={produto.brand}
        />

        <View style={styles.priceContainer}>
          {precoOriginal && (
            <Text style={styles.originalPrice}>
              {formatarPreco(precoOriginal)}
            </Text>
          )}

          <Text style={styles.finalPrice}>{formatarPreco(produto.price)}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descrição:</Text>
          <Text style={styles.descriptionText}>{produto.description}</Text>
        </View>

        <ProductSpecs produto={produto} />

        <Text
          style={produto.stock > 0 ? styles.stockAvailable : styles.stockOut}
        >
          {produto.stock > 0
            ? `Em estoque: ${produto.stock} unidades`
            : "Fora de estoque"}
        </Text>

        <ProductReviews reviews={produto.reviews} />
      </ScrollView>

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          disabled={produto.stock <= 0}
        >
          <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowButton}
          disabled={produto.stock <= 0}
        >
          <Text style={styles.buttonText}>Comprar Agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const buttonBase = {
  padding: 15,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 10,
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topLeftActions: {
    position: "absolute",
    top: 18,
    left: 20,
    zIndex: 10,
  },
  contentPadding: {
    padding: 0,
    paddingBottom: 40,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    marginTop: 10,
  },
  originalPrice: {
    fontSize: 20,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  finalPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00A86B",
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  stockAvailable: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    marginVertical: 10,
  },
  stockOut: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    marginVertical: 10,
  },
  actionButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  addToCartButton: {
    ...buttonBase,
    backgroundColor: "#00A86B",
  },
  buyNowButton: {
    ...buttonBase,
    backgroundColor: "#6A5ACD",
    marginBottom: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
