import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Favoritos({ title, rating, brand }) {
  const [isFavorite, setIsFavorite] = useState(false);

  function toggleFavorite() {
    setIsFavorite((prev) => !prev);
  }

  function renderRating(currentRating) {
    const stars = [];
    const fullStars = Math.floor(currentRating);
    const hasHalfStar = currentRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      let icon = "☆";
      if (i < fullStars) {
        icon = "★";
      } else if (i === fullStars && hasHalfStar) {
        icon = "½";
      }

      stars.push(
        <Text key={i} style={{ color: "#FFC700", fontSize: 18 }}>
          {icon}
        </Text>
      );
    }

    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}> ({currentRating} / 5)</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={24}
            color={isFavorite ? "red" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {renderRating(rating)}

      <Text style={styles.brand}>Marca: {brand}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    maxWidth: "85%",
  },
  favoriteButton: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  brand: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
    color: "#666",
  },
});
