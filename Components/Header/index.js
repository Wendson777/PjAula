import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  useNavigation,
  useRoute,
  DrawerActions,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function Header() {
  const navigation = useNavigation();
  const route = useRoute();

  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      AsyncStorage.getItem("user").then((name) => {
        if (name) setUserName(name);
        else setUserName(null);
      });
    });

    return unsubscribe;
  }, [navigation]);

  const shouldShowBackButton =
    route.name === "Details" || route.name === "Carrinho";

  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menu}
        onPress={() => {
          if (shouldShowBackButton || canGoBack) {
            navigation.goBack();
          } else {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }
        }}
      >
        {shouldShowBackButton || canGoBack ? (
          <Feather name="arrow-left" size={28} color="white" />
        ) : (
          <Feather name="menu" size={28} color="white" />
        )}
      </TouchableOpacity>

      <View style={styles.conteinerPesquisa}>
        <TextInput style={styles.searchInput} placeholder="Pesquisa..." />
        <AntDesign name="search" size={20} color="black" />
      </View>

      <View>
        {!userName ? (
          <TouchableOpacity
            style={styles.LoginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.LoginText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => console.log("Usuário logado. Perfil pendente.")}
          >
            <Feather name="user" size={24} color="#00A86B" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cart}>
        <TouchableOpacity onPress={() => navigation.navigate("Carrinho")}>
          <AntDesign name="shopping" size={24} color="#00A86B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 90,
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 40,
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menu: {
    marginRight: 10,
  },
  conteinerPesquisa: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 25,
    paddingRight: 10,
    paddingLeft: 10,
    height: 38,
  },
  searchInput: {
    fontSize: 14,
    flex: 1,
  },
  LoginButton: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  LoginText: {
    color: "#00A86B",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    backgroundColor: "white",
    borderRadius: 100,
    marginLeft: 5,
  },
  cart: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    backgroundColor: "white",
    borderRadius: 100,
    marginLeft: 10,
  },
});
