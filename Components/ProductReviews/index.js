import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Constante para definir quantas reviews mostrar por padrão
const INITIAL_REVIEWS_COUNT = 2;

// Função auxiliar para renderizar estrelas
function renderReviewRating(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);

  const StarIcon = ({ filled }) => (
    <Text
      style={{
        color: filled ? "#FFC700" : "#E0E0E0",
        fontSize: 16,
        marginRight: 2,
      }}
    >
      {filled ? "★" : "☆"}
    </Text>
  );

  for (let i = 0; i < 5; i++) {
    stars.push(<StarIcon key={i} filled={i < fullStars} />);
  }
  return <View style={styles.ratingContainer}>{stars}</View>;
}

export default function ProductReviews({ reviews }) {
  // Estado para controlar se todas as reviews devem ser mostradas
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Define quais reviews exibir
  const reviewsToShow = showAll
    ? reviews
    : reviews.slice(0, INITIAL_REVIEWS_COUNT);

  const totalReviews = reviews.length;
  const isMoreThanInitial = totalReviews > INITIAL_REVIEWS_COUNT;

  return (
    <View style={styles.reviewSection}>
      <Text style={styles.reviewTitle}>
        Avaliações dos Clientes ({totalReviews})
      </Text>

      {reviewsToShow.map((review, index) => (
        <View key={index} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            {renderReviewRating(review.rating)}
            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          <Text style={styles.reviewDate}>
            - {review.date.substring(0, 10)}
          </Text>
        </View>
      ))}

      {/* BOTÃO MOSTRAR MAIS/MENOS */}
      {isMoreThanInitial && (
        <TouchableOpacity onPress={() => setShowAll((prev) => !prev)}>
          <Text style={styles.toggleReviewsText}>
            {showAll
              ? "Mostrar menos ▲"
              : `Mostrar mais (${
                  totalReviews - INITIAL_REVIEWS_COUNT
                }) avaliações ▼`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#00A86B",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    flex: 1,
    textAlign: "right",
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },
  toggleReviewsText: {
    color: "#6A5ACD",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 5,
  },
});
