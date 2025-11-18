/**
 * Tela de Cadastro Premium - iSelfToken
 * Layout completo com validação e componentes customizados
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/button';
import { SimpleInput } from '@/components/ui/simple-input';
import { PasswordInput } from '@/components/ui/password-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { DDISelect } from '@/components/ui/ddi-select';
import { Colors } from '@/constants';
import { useLoading } from '@/contexts';
import { validateRegisterForm } from '@/utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import generateA2fCode from '@/utils/af2';


export default function RegisterScreen() {
  const router = useRouter();
  const { stopLoading } = useLoading();
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    ddi: '+55',
    senha: '',
    confirmarSenha: '',
    termosAceitos: false,
    politicaAceita: false,
  });

  // Estado de erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado de erro geral (API, rede, etc.)
  const [generalError, setGeneralError] = useState<string>('');

  // Handlers
  const handleBack = () => {
    router.back();
  };

  const handleRegister = async () => {
    
    // Validação do formulário
    const validation = validateRegisterForm(
      formData.nome,
      formData.email,
      formData.senha,
      formData.confirmarSenha
    );
    
    // Validações adicionais
    const additionalErrors: Record<string, string> = {};
    
    // Valida telefone
    if (!formData.telefone) {
      additionalErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.length < 10) {
      additionalErrors.telefone = 'Telefone incompleto';
    }
    
    // Valida termos
    if (!formData.termosAceitos) {
      additionalErrors.termos = 'Aceite os Termos de Uso';
    }
    
    if (!formData.politicaAceita) {
      additionalErrors.politica = 'Aceite a Política de Privacidade';
    }
    
    // Combina erros de validação
    const allErrors = { ...validation.errors, ...additionalErrors };
    setErrors(allErrors);
    
    // Se houver erros, não continua
    if (Object.keys(allErrors).length > 0) {
      console.log("❌ Erros de validação:", allErrors);
      return;
    }
    
    // Limpa erro geral ao tentar novo cadastro
    setGeneralError('');
    
    // Concatenando DDI + telefone para formato completo
    const telefoneCompleto = `${formData.ddi}${formData.telefone}`;
    
    // Dados formatados para API
    const dadosParaApi = {
      ...formData,
      telefone: telefoneCompleto,
    };
    
    // Simulando operação assíncrona (API call)
    try {
      const codigo = generateA2fCode();
      
      // Operações AsyncStorage com tratamento de erro
      try {
        await AsyncStorage.setItem("formRegister", JSON.stringify(dadosParaApi));
        await AsyncStorage.setItem("method", 'POST');
        await AsyncStorage.setItem("redirect", '/(auth)/login');
        await AsyncStorage.setItem("codigo", codigo);
      } catch {
        throw new Error('Erro ao salvar dados localmente. Verifique o espaço de armazenamento.');
      }

      // Para o loading antes de navegar
      stopLoading();
      
      // Navega para login após sucesso
      router.replace('/(auth)/auth_af2');
      
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      
      // Extrai mensagem de erro amigável
      let errorMessage = 'Erro ao cadastrar. Tente novamente.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message) || errorMessage;
      }
      
      // Define erro geral para exibir ao usuário
      setGeneralError(errorMessage);
      
      // Para o loading mesmo em caso de erro
      stopLoading();
    }
  };

  const handleLogin = () => {
    router.replace('/(auth)/login');
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa erro geral quando usuário começa a digitar novamente
    if (generalError) {
      setGeneralError('');
    }
    
    // Limpa erro do campo quando usuário começa a digitar
    // Mapeamento correto dos nomes de campos
    const errorFieldMap: Record<string, string> = {
      nome: 'name',
      email: 'email',
      telefone: 'telefone',
      senha: 'password',
      confirmarSenha: 'passwordConfirmation',
      termosAceitos: 'termos',
      politicaAceita: 'politica',
    };
    
    const errorField = errorFieldMap[field];
    if (errorField && errors[errorField]) {
      setErrors(prev => ({ ...prev, [errorField]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cadastro</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Banner de erro geral */}
            {generalError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning-outline" size={20} color={Colors.error} />
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}
            {/* Nome Completo */}
            <SimpleInput
              label="Nome completo"
              placeholder="João da Silva"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
              style={styles.input}
              testID="nome-input"
              error={errors.name}
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.text.muted}
                />
              }
            />

            {/* Email */}
            <SimpleInput
              label="Email"
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              testID="email-input"
              error={errors.email}
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={Colors.text.muted}
                />
              }
            />

            {/* Telefone com Select de País */}
            <Text style={styles.phoneLabel}>Telefone</Text>
            <View style={styles.phoneContainer}>
              <DDISelect
                value={formData.ddi}
                onSelect={(ddi) => updateField('ddi', ddi)}
                testID="ddi-select"
              />
              
              <PhoneInput
                placeholder="(11) 98765-4321"
                value={formData.telefone}
                onChangeText={(value) => updateField('telefone', value)}
                style={styles.phoneInput}
                testID="phone-input"
                error={errors.telefone}
                leftIcon={
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={Colors.text.muted}
                  />
                }
              />
            </View>

            {/* Senha */}
            <PasswordInput
              label="Senha"
              value={formData.senha}
              onChangeText={(value) => updateField('senha', value)}
              style={styles.input}
              testID="senha-input"
              error={errors.password}
            />
            
            {/* Indicador de força da senha */}
            <PasswordStrengthIndicator
              password={formData.senha}
              showStrengthBar={true}
              showRequirements={true}
            />

            {/* Confirmar Senha */}
            <PasswordInput
              label="Confirmar senha"
              value={formData.confirmarSenha}
              onChangeText={(value) => updateField('confirmarSenha', value)}
              style={styles.input}
              testID="confirmar-senha-input"
              error={errors.passwordConfirmation}
            />

            {/* Checkboxes - Stub básico */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => updateField('termosAceitos', !formData.termosAceitos)}
            >
              <View style={[styles.checkbox, formData.termosAceitos && styles.checkboxChecked, errors.termos && styles.checkboxError]}>
                {formData.termosAceitos && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Aceito os{' '}
                <Text style={styles.checkboxLink}>Termos de Uso</Text>
              </Text>
            </TouchableOpacity>
            {errors.termos && <Text style={styles.checkboxErrorText}>{errors.termos}</Text>}

            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => updateField('politicaAceita', !formData.politicaAceita)}
            >
              <View style={[styles.checkbox, formData.politicaAceita && styles.checkboxChecked, errors.politica && styles.checkboxError]}>
                {formData.politicaAceita && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Aceito a{' '}
                <Text style={styles.checkboxLink}>Política de Privacidade</Text>
              </Text>
            </TouchableOpacity>
            {errors.politica && <Text style={styles.checkboxErrorText}>{errors.politica}</Text>}

            {/* Botão Criar Conta */}
            <Button
              title="CRIAR CONTA"
              onPress={handleRegister}
              variant="success"
              style={styles.registerButton}
            />

            {/* Link para Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Entrar</Text>
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
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  countrySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
    height: 62,
  },
  countryEmoji: {
    fontSize: 20,
  },
  countryCode: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: 'transparent',
  },
  checkboxLabel: {
    flex: 1,
    color: Colors.text.tertiary,
    fontSize: 14,
    lineHeight: 20,
  },
  checkboxLink: {
    color: Colors.text.accent,
    fontWeight: '500',
  },
  checkboxErrorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 32,
  },
  registerButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)', // Vermelho com 10% opacidade
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
    color: Colors.error,
    marginLeft: 8,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.text.tertiary,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.text.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
