import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SimpleInput } from "@/components/ui/simple-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Colors } from "@/constants";


export default function LoginScreen() {
  const router = useRouter();
  const { isLoading } = useAuth();
  
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("=== SUBMIT LOGIN ===");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Tentativa de login iniciada");
    // Aqui vai a lógica de login futuramente
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Logo />
            <Text style={styles.subtitle}>Bem-vindo de volta</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <SimpleInput
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              testID="email-input"
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={Colors.text.muted}
                />
              }
            />

            {/* Password Input */}
            <PasswordInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              testID="password-input"
            />

            {/* Forgot Password Link */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title="ENTRAR"
              onPress={handleLogin}
              disabled={isLoading}
              variant="success"
              style={styles.loginButton}
            />

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Não tem uma conta?{" "}
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Crie sua conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary, // Tema dark
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24, // Padding horizontal conforme prompt
    paddingVertical: 40,   // Padding vertical conforme prompt
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24, // Conforme prompt
  },
  subtitle: {
    fontSize: 16, // Conforme prompt
    fontWeight: "400",
    color: Colors.text.secondary, // Tema dark
    textAlign: "center",
    marginTop: 8,
    marginBottom: 48, // Conforme prompt
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16, // Espaçamento entre inputs
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 32, // Conforme prompt
  },
  forgotPasswordText: {
    fontSize: 14, // Conforme prompt
    fontWeight: "500",
    color: Colors.text.accent, // MAGENTA do tema
  },
  loginButton: {
    marginBottom: 32, // Conforme prompt
    height: 52, // Altura conforme prompt
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14, // Conforme prompt
    fontWeight: "400",
    color: Colors.text.tertiary, // Tema dark
  },
  registerLink: {
    fontSize: 14, // Conforme prompt
    fontWeight: "600",
    color: Colors.text.accent, // MAGENTA do tema
  },
});