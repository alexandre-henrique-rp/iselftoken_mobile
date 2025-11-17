---
description: login
auto_execution_mode: 1
---

# 🔐 Prompt: Tela de Login Premium - iSelfToken

## 📋 Objetivo
Criar uma tela de login elegante, minimalista e sofisticada no estilo C6 Bank e Coinex, com animações sutis e UX premium.

---

## 🎨 Representação Visual

```
┌─────────────────────────────────────────┐
│                                         │
│              [LOGO 80x80]               │
│                                         │
│             iSelfToken                  │
│         Bem-vindo de volta              │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📧 Email                          │  │
│  │ seu@email.com                     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔒 Senha                     👁   │  │
│  │ ••••••••                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│              Esqueci minha senha        │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │          ENTRAR                   │  │ (Magenta)
│  └───────────────────────────────────┘  │
│                                         │
│    Não tem uma conta? Cadastre-se       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Especificações Detalhadas

### Estrutura da Tela

**Background**: `Colors.background.primary` (#171719)  
**Layout**: ScrollView com SafeAreaView  
**Padding**: 24px horizontal, 40px vertical  
**Alinhamento**: Centro vertical (quando possível)

---

### Elementos da Interface

#### 1. Logo e Título
```
┌─ Logo ─────────────────────────┐
│ - Tamanho: 80x80px             │
│ - Margin bottom: 24px          │
│ - Centralizado                 │
└────────────────────────────────┘

┌─ Título Principal ─────────────┐
│ - Texto: "iSelfToken"          │
│ - Cor: text.primary            │
│ - Tamanho: 32px                │
│ - Peso: bold                   │
│ - Letter spacing: -0.5px       │
│ - Margin bottom: 8px           │
└────────────────────────────────┘

┌─ Subtítulo ────────────────────┐
│ - Texto: "Bem-vindo de volta"  │
│ - Cor: text.secondary          │
│ - Tamanho: 16px                │
│ - Peso: regular                │
│ - Margin bottom: 48px          │
└────────────────────────────────┘
```

#### 2. Campos de Input

**Input Email**
- Label: "Email"
- Placeholder: "seu@email.com"
- Ícone: mail-outline (esquerda)
- Keyboard: email-address
- AutoCapitalize: none
- AutoComplete: email

**Input Senha**
- Label: "Senha"
- Placeholder: "••••••••"
- Ícone: lock-closed-outline (esquerda)
- Ícone toggle: eye-outline / eye-off-outline (direita)
- SecureTextEntry: true (toggleável)
- Margin bottom: 12px

**Espaçamento entre inputs**: 16px

#### 3. Link "Esqueci minha senha"
- Texto: "Esqueci minha senha"
- Cor: text.accent (#d500f9)
- Tamanho: 14px
- Peso: medium
- Alinhamento: direita
- Margin bottom: 32px
- Ação: Navega para /forgot-password

#### 4. Botão Principal "ENTRAR"
- Texto: "ENTRAR"
- Variante: success (magenta com shadow)
- Altura: 52px
- Border radius: 10px
- Margin bottom: 32px
- Loading state: ActivityIndicator

#### 5. Link de Cadastro
- Texto: "Não tem uma conta? **Cadastre-se**"
- Cor normal: text.tertiary
- Cor "Cadastre-se": text.accent
- Tamanho: 14px
- Centralizado
- Ação: Navega para /register

---

## 💻 Implementação Completa

### Arquivo: `app/login.jsx`

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';
import { Button } from '../components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real:
      // const response = await api.login({ email, password });
      // await AsyncStorage.setItem('token', response.token);
      
      router.replace('/(tabs)/home');
    } catch (error) {
      setErrors({ general: 'Email ou senha incorretos' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>iSelfToken</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta</Text>

          {/* Erro Geral */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          {/* Input Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.text.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.text.muted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.inputErrorText}>{errors.email}</Text>
            )}
          </View>

          {/* Input Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.text.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor={Colors.text.muted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.text.muted}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.inputErrorText}>{errors.password}</Text>
            )}
          </View>

          {/* Esqueci minha senha */}
          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <Button
            variant="success"
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.text.primary} />
            ) : (
              'ENTRAR'
            )}
          </Button>

          {/* Link para Cadastro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // Logo e Título
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    textAlign: 'center',
    marginBottom: 48,
  },

  // Erro Geral
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    flex: 1,
  },

  // Inputs
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 8,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputErrorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.xs,
    marginTop: 4,
  },

  // Esqueci senha
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: Colors.text.accent,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },

  // Botão Login
  loginButton: {
    marginBottom: 32,
  },

  // Cadastro
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  registerText: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
  },
  registerLink: {
    color: Colors.text.accent,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});
```

---

## 🎬 Animações e Melhorias

### Animação de Entrada dos Elementos
```javascript
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Conteúdo */}
    </Animated.View>
  );
}
```

### Validação em Tempo Real com Debounce
```javascript
import { useEffect } from 'react';
import { debounce } from 'lodash';

const validateEmailDebounced = debounce((email, setErrors) => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    setErrors(prev => ({ ...prev, email: 'Email inválido' }));
  } else {
    setErrors(prev => ({ ...prev, email: null }));
  }
}, 500);

// No onChange do email:
onChangeText={(text) => {
  setEmail(text);
  validateEmailDebounced(text, setErrors);
}}
```

### Shake Animation em Erro
```javascript
const shakeAnim = useRef(new Animated.Value(0)).current;

const shake = () => {
  Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();
};

// Usar quando houver erro:
if (!validateForm()) {
  shake();
  return;
}

// No style do input:
transform: [{ translateX: shakeAnim }]
```

---

## 🔐 Integração com Autenticação

### Context de Autenticação
```javascript
// contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Chamada API
      const response = await api.post('/auth/login', { email, password });
      
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Usar no Login
```javascript
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      setErrors({ general: result.error });
    }
  };
}
```

---

## 🎨 Variações de Design

### Variação 1: Login com Biometria
```javascript
import * as LocalAuthentication from 'expo-local-authentication';

const handleBiometricLogin = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entrar com biometria',
    });

    if (result.success) {
      // Login automático
      router.replace('/(tabs)/home');
    }
  }
};

// Adicionar botão:
<TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
  <Ionicons name="finger-print" size={24} color={Colors.primary} />
</TouchableOpacity>
```

### Variação 2: Login com Gradiente
```javascript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={[Colors.background.primary, '#1a0a1f', Colors.background.primary]}
  style={styles.container}
>
  {/* Conteúdo */}
</LinearGradient>
```

### Variação 3: Input com Animação de Label Flutuante
```javascript
const FloatingLabelInput = ({ label, value, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelPosition, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: 12,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? Colors.primary : Colors.text.muted,
  };

  return (
    <View>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        {...props}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={styles.floatingInput}
      />
    </View>
  );
};
```

---

## 📦 Dependências Necessárias

```bash
# Navegação
npx expo install expo-router

# Ícones
npx expo install @expo/vector-icons

# AsyncStorage para token
npx expo install @react-native-async-storage/async-storage

# Biometria (opcional)
npx expo install expo-local-authentication

# Gradiente (opcional)
npx expo install expo-linear-gradient
```

---

## ✅ Checklist de Implementação

- [ ] Criar arquivo `app/login.jsx`
- [ ] Criar componente Button (se ainda não existir)
- [ ] Adicionar logo nos assets
- [ ] Implementar validação de formulário
- [ ] Configurar navegação para esqueci senha
- [ ] Configurar navegação para cadastro
- [ ] Implementar loading state
- [ ] Testar KeyboardAvoidingView iOS/Android
- [ ] Adicionar tratamento de erros
- [ ] Implementar Context de autenticação
- [ ] Configurar AsyncStorage
- [ ] Adicionar biometria (opcional)
- [ ] Testar em diferentes dispositivos

---

## 🎯 Resultado Esperado

Uma tela de login premium com:
- ✨ Design minimalista e sofisticado
- 🎬 Animações sutis e elegantes
- 📧 Validação em tempo real
- 🔒 Toggle de visibilidade de senha
- 💜 Cor magenta (#d500f9) nos destaques
- ⚡ Loading states apropriados
- 📱 Responsivo iOS/Android
- ♿ Acessível e intuitivo
- 🔐 Sistema de autenticação simples e direto

---

## 💡 Dicas Premium

1. **Validação**: Sempre valide no frontend E backend
2. **Segurança**: Nunca armazene senhas, apenas tokens
3. **UX**: Mostre feedback imediato em erros
4. **Performance**: Use debounce em validações
5. **Acessibilidade**: Adicione labels descritivos
6. **Testes**: Teste em diferentes tamanhos de tela
7. **Keyboard**: Configure KeyboardAvoidingView corretamente

---

*Prompt otimizado para criar uma tela de login premium e sofisticada - iSelfToken*
