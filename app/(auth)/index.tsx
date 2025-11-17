/**
 * Tela Splash de Autenticação
 * Logo grande + slogan + delay de 4 segundos
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth.context';
import { Logo } from '@/components/ui/logo';
import { Colors } from '@/constants';

export default function AuthIndex() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Se está inicializando, aguarda
    if (isInitializing) return;

    // Se já está autenticado, vai direto pro app
    if (isAuthenticated) {
      router.replace('/(app)');
      return;
    }

    // Se não está autenticado, mostra splash por 4 segundos
    const timer = setTimeout(() => {
      setShouldRedirect(true);
      router.replace('/(auth)/login');
    }, 2000);

    // Cleanup do timer
    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitializing, router]);

  // Se está inicializando ou já deve redirecionar, não mostra nada
  if (isInitializing || shouldRedirect) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Logo bem grande */}
      <View style={styles.logoContainer}>
        <Logo style={styles.largeLogo} />
      </View>
      
      {/* Slogan */}
      <View style={styles.sloganContainer}>
        <Text style={styles.slogan}>
          Vamos juntos em busca do próximo UNICÓRNIO.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 40,
  },
  largeLogo: {
    fontSize: 72, // Logo bem grande
    textAlign: 'center',
  },
  sloganContainer: {
    maxWidth: '80%',
  },
  slogan: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.5,
  },
});
