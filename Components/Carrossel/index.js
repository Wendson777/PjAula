import React from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");

function ImageSlide({ uri }) {
  return (
    <View style={styles.slideContainer}>
      <Image style={styles.carouselImage} source={{ uri: uri }} />
    </View>
  );
}

export default function Carrossel({ images, discount }) {
  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Sem Imagens</Text>
      </View>
    );
  }

  const discountText = `${Math.round(discount)}% OFF`;

  return (
    <View style={styles.carouselWrapper}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ImageSlide uri={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      {discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discountText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselWrapper: {
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  emptyContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  slideContainer: {
    width: width,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
