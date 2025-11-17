/**
 * Tela de Recuperação de Senha - Placeholder
 * Será implementada com design premium na Fase 2
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>Em implementação...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 24,
    color: Colors.primary, // MAGENTA do tema
  },
  subtitle: {
    marginTop: 16,
    color: Colors.text.secondary, // Tema dark
  },
});
