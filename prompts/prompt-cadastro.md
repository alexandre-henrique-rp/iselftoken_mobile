---
description: cadastro
auto_execution_mode: 1
---

# 📝 Prompt: Tela de Cadastro Premium - iSelfToken

## 📋 Objetivo
Criar uma tela de cadastro elegante e completa com validação de formulário, seletor de país com API própria, máscara de telefone e aceite de termos.

---

## 🎨 Representação Visual

```
┌─────────────────────────────────────────┐
│  ← Voltar         Cadastro              │ Header
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 👤 Nome completo                  │  │
│  │ João da Silva                     │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📧 Email                          │  │
│  │ joao@email.com                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Telefone                               │
│  ┌──────┬──────────────────────────┐   │
│  │🇧🇷 +55│ (11) 98765-4321         │   │
│  └──────┴──────────────────────────┘   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔒 Senha                     👁   │  │
│  │ ••••••••                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔒 Confirmar senha           👁   │  │
│  │ ••••••••                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ☐ Aceito os Termos de Uso              │
│                                         │
│  ☐ Aceito a Política de Privacidade     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │       CRIAR CONTA                 │  │ (Magenta)
│  └───────────────────────────────────┘  │
│                                         │
│     Já tem uma conta? Entrar            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Especificações dos Campos

### 1. Nome Completo
```javascript
{
  label: "Nome completo",
  placeholder: "João da Silva",
  icon: "person-outline",
  type: "text",
  validation: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/ // Apenas letras e espaços
  }
}
```

### 2. Email
```javascript
{
  label: "Email",
  placeholder: "seu@email.com",
  icon: "mail-outline",
  type: "email",
  keyboard: "email-address",
  validation: {
    required: true,
    pattern: /\S+@\S+\.\S+/
  }
}
```

### 3. Telefone (com código de país)

#### Select de País (Modal)
```javascript
{
  // API própria retorna:
  countries: [
    {
      emoji: "🇧🇷",
      phoneCode: "55", // SEM o símbolo +
      name: "Brasil",
      code: "BR"
    },
    {
      emoji: "🇺🇸",
      phoneCode: "1",
      name: "Estados Unidos",
      code: "US"
    },
    // ... outros países
  ]
}
```

**Componente do Select**:
- Botão mostra: `emoji + +phoneCode` (ex: 🇧🇷 +55)
- Ao clicar: Abre modal com lista de países
- Modal tem: Campo de busca + lista scrollável
- Seleção: Fecha modal e atualiza campo

#### Input Telefone (com máscara)
```javascript
{
  label: "Telefone",
  placeholder: "(99) 99999-9999",
  icon: "call-outline",
  type: "phone",
  keyboard: "phone-pad",
  masks: [
    "(99) 9999-9999",    // Fixo: 10 dígitos
    "(99) 9 9999-9999"   // Celular: 11 dígitos
  ],
  validation: {
    required: true,
    minLength: 10
  }
}
```

### 4. Senha
```javascript
{
  label: "Senha",
  placeholder: "••••••••",
  icon: "lock-closed-outline",
  type: "password",
  toggleIcon: "eye-outline" / "eye-off-outline",
  validation: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, // 1 maiúscula, 1 minúscula, 1 número
  },
  strengthIndicator: true // Barra de força da senha
}
```

### 5. Confirmar Senha
```javascript
{
  label: "Confirmar senha",
  placeholder: "••••••••",
  icon: "lock-closed-outline",
  type: "password",
  toggleIcon: "eye-outline" / "eye-off-outline",
  validation: {
    required: true,
    matchField: "senha"
  }
}
```

### 6. Termos de Uso
```javascript
{
  type: "checkbox",
  label: "Aceito os Termos de Uso",
  linkText: "Termos de Uso",
  linkAction: () => router.push('/terms'),
  validation: {
    required: true,
    message: "Você deve aceitar os Termos de Uso"
  }
}
```

### 7. Política de Privacidade
```javascript
{
  type: "checkbox",
  label: "Aceito a Política de Privacidade",
  linkText: "Política de Privacidade",
  linkAction: () => router.push('/privacy'),
  validation: {
    required: true,
    message: "Você deve aceitar a Política de Privacidade"
  }
}
```

---

## 💻 Implementação Completa

### Arquivo: `app/register.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';
import { Button } from '../components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    codigoInternacional: {
      emoji: '🇧🇷',
      phoneCode: '55',
      name: 'Brasil',
      code: 'BR'
    },
    telefone: '',
    senha: '',
    confirmarSenha: '',
    termosAceitos: false,
    politicaAceita: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Buscar países da API
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      // Substitua pela sua API
      const response = await fetch('https://sua-api.com/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Erro ao buscar países:', error);
      // Fallback com alguns países
      setCountries([
        { emoji: '🇧🇷', phoneCode: '55', name: 'Brasil', code: 'BR' },
        { emoji: '🇺🇸', phoneCode: '1', name: 'Estados Unidos', code: 'US' },
        { emoji: '🇵🇹', phoneCode: '351', name: 'Portugal', code: 'PT' },
        { emoji: '🇦🇷', phoneCode: '54', name: 'Argentina', code: 'AR' },
      ]);
    }
  };

  // Máscara de telefone
  const applyPhoneMask = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
      // Formato: (99) 9999-9999
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Formato: (99) 9 9999-9999
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3');
    }
  };

  // Atualizar campo
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validação
  const validateForm = () => {
    const newErrors = {};

    // Nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nome)) {
      newErrors.nome = 'Nome deve conter apenas letras';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Telefone
    const phoneNumbers = formData.telefone.replace(/\D/g, '');
    if (!phoneNumbers) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (phoneNumbers.length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }

    // Senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
      newErrors.senha = 'Senha deve conter maiúscula, minúscula e número';
    }

    // Confirmar senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    // Termos
    if (!formData.termosAceitos) {
      newErrors.termosAceitos = 'Você deve aceitar os Termos de Uso';
    }

    // Política
    if (!formData.politicaAceita) {
      newErrors.politicaAceita = 'Você deve aceitar a Política de Privacidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cadastrar
  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const dataToSend = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        codigoInternacional: formData.codigoInternacional.phoneCode,
        telefone: formData.telefone.replace(/\D/g, ''),
        senha: formData.senha,
      };

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real:
      // const response = await api.register(dataToSend);
      // await AsyncStorage.setItem('token', response.token);
      
      router.replace('/(tabs)/home');
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar países
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.phoneCode.includes(countrySearch)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Erro Geral */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.text.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                placeholder="João da Silva"
                placeholderTextColor={Colors.text.muted}
                value={formData.nome}
                onChangeText={(text) => updateField('nome', text)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            {errors.nome && (
              <Text style={styles.inputErrorText}>{errors.nome}</Text>
            )}
          </View>

          {/* Email */}
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
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
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

          {/* Telefone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <View style={styles.phoneContainer}>
              {/* Select de País */}
              <TouchableOpacity
                style={styles.countrySelect}
                onPress={() => setShowCountryModal(true)}
              >
                <Text style={styles.countryEmoji}>
                  {formData.codigoInternacional.emoji}
                </Text>
                <Text style={styles.countryCode}>
                  +{formData.codigoInternacional.phoneCode}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={Colors.text.muted}
                />
              </TouchableOpacity>

              {/* Input de Telefone */}
              <View style={[styles.inputWrapper, styles.phoneInput]}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={Colors.text.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, errors.telefone && styles.inputError]}
                  placeholder="(99) 99999-9999"
                  placeholderTextColor={Colors.text.muted}
                  value={formData.telefone}
                  onChangeText={(text) => {
                    const masked = applyPhoneMask(text);
                    updateField('telefone', masked);
                  }}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            </View>
            {errors.telefone && (
              <Text style={styles.inputErrorText}>{errors.telefone}</Text>
            )}
          </View>

          {/* Senha */}
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
                style={[styles.input, errors.senha && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor={Colors.text.muted}
                value={formData.senha}
                onChangeText={(text) => updateField('senha', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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
            {errors.senha && (
              <Text style={styles.inputErrorText}>{errors.senha}</Text>
            )}
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.text.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.confirmarSenha && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor={Colors.text.muted}
                value={formData.confirmarSenha}
                onChangeText={(text) => updateField('confirmarSenha', text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.text.muted}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmarSenha && (
              <Text style={styles.inputErrorText}>{errors.confirmarSenha}</Text>
            )}
          </View>

          {/* Termos de Uso */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => updateField('termosAceitos', !formData.termosAceitos)}
          >
            <View style={[
              styles.checkbox,
              formData.termosAceitos && styles.checkboxChecked,
              errors.termosAceitos && styles.checkboxError
            ]}>
              {formData.termosAceitos && (
                <Ionicons name="checkmark" size={16} color={Colors.text.primary} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              Aceito os{' '}
              <Text
                style={styles.checkboxLink}
                onPress={() => router.push('/terms')}
              >
                Termos de Uso
              </Text>
            </Text>
          </TouchableOpacity>
          {errors.termosAceitos && (
            <Text style={styles.inputErrorText}>{errors.termosAceitos}</Text>
          )}

          {/* Política de Privacidade */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => updateField('politicaAceita', !formData.politicaAceita)}
          >
            <View style={[
              styles.checkbox,
              formData.politicaAceita && styles.checkboxChecked,
              errors.politicaAceita && styles.checkboxError
            ]}>
              {formData.politicaAceita && (
                <Ionicons name="checkmark" size={16} color={Colors.text.primary} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              Aceito a{' '}
              <Text
                style={styles.checkboxLink}
                onPress={() => router.push('/privacy')}
              >
                Política de Privacidade
              </Text>
            </Text>
          </TouchableOpacity>
          {errors.politicaAceita && (
            <Text style={styles.inputErrorText}>{errors.politicaAceita}</Text>
          )}

          {/* Botão Cadastrar */}
          <Button
            variant="success"
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.registerButton}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.text.primary} />
            ) : (
              'CRIAR CONTA'
            )}
          </Button>

          {/* Link para Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Seleção de País */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o país</Text>
              <TouchableOpacity
                onPress={() => setShowCountryModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Campo de Busca */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={Colors.text.muted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar país..."
                placeholderTextColor={Colors.text.muted}
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
            </View>

            {/* Lista de Países */}
            <ScrollView style={styles.countryList}>
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => {
                    updateField('codigoInternacional', country);
                    setShowCountryModal(false);
                    setCountrySearch('');
                  }}
                >
                  <Text style={styles.countryItemEmoji}>{country.emoji}</Text>
                  <Text style={styles.countryItemName}>{country.name}</Text>
                  <Text style={styles.countryItemCode}>+{country.phoneCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Content
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
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

  // Telefone
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countrySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
  },
  countryEmoji: {
    fontSize: 20,
  },
  countryCode: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  phoneInput: {
    flex: 1,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxError: {
    borderColor: Colors.error,
  },
  checkboxLabel: {
    flex: 1,
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
  },
  checkboxLink: {
    color: Colors.text.accent,
    fontWeight: Typography.fontWeight.medium,
  },

  // Botão
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },

  // Login
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
  },
  loginLink: {
    color: Colors.text.accent,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  modalTitle: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  modalCloseButton: {
    padding: 4,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    paddingVertical: 12,
  },

  // Lista de países
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  countryItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  countryItemName: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
  },
  countryItemCode: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
});
```

---

## 🎨 Componente de Indicador de Força da Senha

```javascript
// components/PasswordStrength.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants';

export const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { level: 0, text: '', color: Colors.text.muted };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: 'Fraca', color: Colors.error };
    if (strength <= 4) return { level: 2, text: 'Média', color: Colors.warning };
    return { level: 3, text: 'Forte', color: Colors.success };
  };

  const strength = getStrength();

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              level <= strength.level && { backgroundColor: strength.color }
            ]}
          />
        ))}
      </View>
      {strength.text && (
        <Text style={[styles.text, { color: strength.color }]}>
          {strength.text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 4,
  },
  bars: {
    flexDirection: 'row',
    gap: 4,
  },
  bar: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.border.subtle,
    borderRadius: 2,
  },
  text: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
});
```

---

## 📦 API de Países (Exemplo de estrutura)

### Endpoint: `GET /api/countries`

```json
{
  "countries": [
    {
      "emoji": "🇧🇷",
      "phoneCode": "55",
      "name": "Brasil",
      "code": "BR"
    },
    {
      "emoji": "🇺🇸",
      "phoneCode": "1",
      "name": "Estados Unidos",
      "code": "US"
    },
    {
      "emoji": "🇵🇹",
      "phoneCode": "351",
      "name": "Portugal",
      "code": "PT"
    },
    {
      "emoji": "🇦🇷",
      "phoneCode": "54",
      "name": "Argentina",
      "code": "AR"
    },
    {
      "emoji": "🇲🇽",
      "phoneCode": "52",
      "name": "México",
      "code": "MX"
    }
  ]
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar arquivo `app/register.jsx`
- [ ] Implementar máscara de telefone
- [ ] Criar componente PasswordStrength
- [ ] Configurar API de países
- [ ] Implementar modal de seleção de país
- [ ] Adicionar validação de formulário
- [ ] Criar checkboxes customizados
- [ ] Configurar navegação para termos e política
- [ ] Testar todos os campos
- [ ] Validar máscaras de telefone
- [ ] Testar modal de países
- [ ] Verificar KeyboardAvoidingView
- [ ] Testar em iOS e Android

---

## 🎯 Resultado Esperado

Uma tela de cadastro premium com:
- ✨ Design minimalista e profissional
- 📱 Seletor de país com busca
- 🎭 Máscaras de telefone automáticas
- 🔒 Indicador de força da senha
- ✅ Validação completa de formulário
- 📋 Checkboxes elegantes
- 💜 Identidade visual iSelfToken
- 📱 Responsivo e fluido

---

*Prompt otimizado para criar uma tela de cadastro premium e completa - iSelfToken*
