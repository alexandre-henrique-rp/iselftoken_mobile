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
import { DDISelect } from '@/components/ui/ddi-select';
import { Colors } from '@/constants';
import { useLoading } from '@/contexts'; // 🚀 Import para controle manual

export default function RegisterScreen() {
  const router = useRouter();
  const { stopLoading } = useLoading(); // 🚀 Controle manual do loading
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    ddi: '+55', // 🌍 Adicionado estado para DDI
    senha: '',
    confirmarSenha: '',
    termosAceitos: false,
    politicaAceita: false,
  });

  // Handlers
  const handleBack = () => {
    router.back();
  };

  const handleRegister = async () => {
    console.log("=== SUBMIT CADASTRO ===");
    console.log("Dados completos:", formData);
    
    // Concatenando DDI + telefone para formato completo
    const telefoneCompleto = `${formData.ddi}${formData.telefone}`;
    console.log("Telefone completo:", telefoneCompleto);
    
    // Dados formatados para API
    const dadosParaApi = {
      ...formData,
      telefone: telefoneCompleto,
    };
    console.log("Dados para API:", dadosParaApi);
    console.log("Tentativa de cadastro iniciada");
    
    // Simulando operação assíncrona (API call)
    try {
      // Aqui iria a chamada real para API
      // await PublicApi.register(dadosParaApi);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula 2s de API
      
      console.log("✅ Cadastro realizado com sucesso!");
      
      // 🚀 Para o loading manualmente quando a operação termina
      stopLoading();
      
      // Navega para login após sucesso
      router.replace('/(auth)/login');
      
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      
      // 🚀 Para o loading mesmo em caso de erro
      stopLoading();
    }
  };

  const handleLogin = () => {
    router.replace('/(auth)/login');
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            {/* Nome Completo */}
            <SimpleInput
              label="Nome completo"
              placeholder="João da Silva"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
              style={styles.input}
              testID="nome-input"
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
              
              <SimpleInput
                placeholder="(11) 98765-4321"
                value={formData.telefone}
                onChangeText={(value) => updateField('telefone', value)}
                keyboardType="phone-pad"
                style={styles.phoneInput}
                testID="phone-input"
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
            />

            {/* Confirmar Senha */}
            <PasswordInput
              label="Confirmar senha"
              value={formData.confirmarSenha}
              onChangeText={(value) => updateField('confirmarSenha', value)}
              style={styles.input}
              testID="confirmar-senha-input"
            />

            {/* Checkboxes - Stub básico */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => updateField('termosAceitos', !formData.termosAceitos)}
            >
              <View style={[styles.checkbox, formData.termosAceitos && styles.checkboxChecked]}>
                {formData.termosAceitos && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Aceito os{' '}
                <Text style={styles.checkboxLink}>Termos de Uso</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => updateField('politicaAceita', !formData.politicaAceita)}
            >
              <View style={[styles.checkbox, formData.politicaAceita && styles.checkboxChecked]}>
                {formData.politicaAceita && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Aceito a{' '}
                <Text style={styles.checkboxLink}>Política de Privacidade</Text>
              </Text>
            </TouchableOpacity>

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
  registerButton: {
    marginTop: 24,
    marginBottom: 32,
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
