import React from "react";
import { TouchableOpacity, StyleSheet, Share } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function ShareButton({ title, url }) {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Confira este produto: ${title}. Compre agora em: ${url}`,
        url: url,
        title: "Compartilhar Produto",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error.message);
    }
  };

  return (
    <TouchableOpacity onPress={onShare} style={styles.shareIcon}>
      <Feather name="share-2" size={24} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shareIcon: {
    padding: 5,
  },
});
