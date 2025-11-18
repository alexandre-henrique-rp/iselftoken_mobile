import { Button } from "@/components/ui/button";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function AuthAf2() {
  const router = useRouter();

  // Estado do código
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [storedCode, setStoredCode] = useState("");
  const [Method, setMethod] = useState("");
  const [Form, setForm] = useState<any | null>(null);
  const [Redirect, setRedirect] = useState("");

  // Refs para os inputs
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animação de shake para erro
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Carregar dados do AsyncStorage ao montar
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const formRegister = await AsyncStorage.getItem("formRegister");
        const codigo = await AsyncStorage.getItem("codigo");
        const redirect = await AsyncStorage.getItem("redirect");
        const method = await AsyncStorage.getItem("method");


        if (formRegister) {
          const formData = JSON.parse(formRegister);
          setEmail(formData.email || "");
          setForm(formData);
        }

        if (redirect) {
          setRedirect(redirect);
        }

        if (codigo) {
          setStoredCode(codigo);
        }

        if (method) {
          setMethod(method);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Erro ao carregar dados. Tente novamente.");
      }
    };

    loadStoredData();
  }, [router]);

  // Auto focus no primeiro input ao montar
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Shake animation
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  // Atualizar código
  const handleCodeChange = (text: string, index: number) => {
    // Apenas números
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError("");

    // Auto focus próximo input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit quando preencher tudo
    if (text && index === 5 && newCode.every((digit) => digit !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  // Backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verificar código
  const handleVerify = async (codeString?: string) => {
    const codeToVerify = codeString || code.join("");

    if (codeToVerify.length !== 6) {
      setError("Código incompleto");
      return;
    }

    if (!storedCode) {
      setError("Código não encontrado. Solicite um novo código.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simular chamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar se o código digitado corresponde ao código armazenado
      if (codeToVerify === storedCode) {
        // Código correto - navegar para redirect
        handleSuccess();
      } else {
        // Código incorreto
        handleInvalidCode();
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setError("Erro ao verificar código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Código inválido
  const handleInvalidCode = () => {
    shake();
    setError("Código incorreto. Tente novamente.");
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Sucesso na verificação
  const handleSuccess = async () => {
    try {
      // Limpar dados do AsyncStorage
      await AsyncStorage.multiRemove([
        "formRegister",
        "codigo",
        "method",
        "redirect"
      ]);

      if (Method === "POST") {
        console.log('formRegister', Form)
        
      }

      // Navegar para redirect path ou login como fallback
      // if (redirectPath) {
      //   router.replace(redirectPath as any);
      // } else {
      //   router.replace("/(auth)/login");
      // }
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      // Mesmo com erro, tenta navegar
      router.replace("/(auth)/login");
    }
  };

  // Código completo?
  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificação</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="lock-closed-outline"
              size={40}
              color={Colors.primary}
            />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Verificação de Código</Text>

        {/* Descrição */}
        <Text style={styles.description}>
          Enviamos um código de 6 dígitos para{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* Inputs de Código */}
        <Animated.View
          style={[
            styles.codeContainer,
            { transform: [{ translateX: shakeAnim }] }
          ]}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref;
                }
              }}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
                error && styles.codeInputError
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
            />
          ))}
        </Animated.View>

        {/* Erro */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="close-circle" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Botão Verificar */}
        <Button
          title="VERIFICAR CÓDIGO"
          onPress={() => handleVerify()}
          disabled={!isCodeComplete || isLoading}
          variant="success"
          style={styles.verifyButton}
        />

        {/* Reenviar Código - Placeholder para Fase 2 */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Não recebeu o código?</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.resendButton}
          >
            <Text style={styles.resendButtonText}>Voltar e solicitar novo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: Colors.background.primary
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 8,
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text.primary
  },
  placeholder: {
    width: 40
  },

  // Content
  scroll: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center"
  },

  // Ícone
  iconContainer: {
    marginBottom: 24
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(213, 0, 249, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },

  // Título
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    color: Colors.text.tertiary,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22
  },
  email: {
    color: Colors.text.accent,
    fontWeight: "600"
  },

  // Código
  codeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border.subtle,
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center"
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(213, 0, 249, 0.05)"
  },
  codeInputError: {
    borderColor: Colors.error,
    backgroundColor: "rgba(239, 68, 68, 0.05)"
  },

  // Erro
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%"
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "500",
    flex: 1
  },

  // Botão
  verifyButton: {
    width: "100%",
    marginBottom: 32
  },

  // Reenviar
  resendContainer: {
    alignItems: "center",
    gap: 8
  },
  resendText: {
    color: Colors.text.tertiary,
    fontSize: 14
  },
  resendButton: {
    padding: 8
  },
  resendButtonText: {
    color: Colors.text.accent,
    fontSize: 14,
    fontWeight: "600"
  }
});
