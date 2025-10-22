import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SpecificationRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function ProductSpecs({ produto }) {
  const dimensionsValue = produto.dimensions
    ? `${produto.dimensions.width} x ${produto.dimensions.height} x ${produto.dimensions.depth} cm`
    : null;

  return (
    <View style={styles.specificationsContainer}>
      <Text style={styles.specificationsTitle}>Informações Adicionais</Text>

      <SpecificationRow label="Peso" value={`${produto.weight} kg`} />
      <SpecificationRow label="Dimensões (LxAxP)" value={dimensionsValue} />
      <SpecificationRow label="Garantia" value={produto.warrantyInformation} />
      <SpecificationRow label="Envio" value={produto.shippingInformation} />
      <SpecificationRow
        label="Política de Devolução"
        value={produto.returnPolicy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  specificationsContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fafafa",
  },
  specLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  specValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});
