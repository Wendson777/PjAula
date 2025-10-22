import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userName = email.split("@")[0];

      await AsyncStorage.setItem("user", userName);

      Alert.alert("Sucesso", `Bem-vindo(a), ${userName}!`);

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro de Login", "Credenciais inválidas. Tente novamente.");
      console.error("Erro simulado de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Acessar Minha Conta</Text>
          <Text style={styles.subtitle}>
            Entre com suas credenciais ou crie uma conta.
          </Text>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              disabled={isLoading}
            >
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Aguarde...</Text>
            ) : (
              <Text style={styles.buttonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Ainda não tem conta?</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Cadastro", "Navegar para a tela de Cadastro")
              }
            >
              <Text style={styles.registerLink}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#05419A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPassword: {
    color: "#05419A",
    fontSize: 14,
    alignSelf: "flex-end",
    marginBottom: 30,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#00A86B",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    fontSize: 14,
    color: "#05419A",
    fontWeight: "bold",
  },
});
