import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/auth.context';
import { LoadingProvider, useLoading } from '@/contexts/loading-context';
import { AuthLoading } from '@/components/loading/auth-loading';

/**
 * Componente de Loading para Navegação (Overlay)
 * Aparece sobre o conteúdo durante mudanças de rota
 */
function NavigationLoadingOverlay() {
  return (
    <View style={styles.overlay}>
      <AuthLoading message="Carregando..." />
    </View>
  );
}

const styles = {
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};

/**
 * Componente que gerencia redirecionamento baseado no estado de autenticação
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const { startLoading } = useLoading();
  const segments = useSegments();
  const router = useRouter();

  // Detecta TODAS as mudanças de rota para loading automático
  useEffect(() => {
    // Guard: não ativar loading durante inicialização ou segments vazios
    if (!segments.length || isInitializing) return;

    // Whitelist para rota de desenvolvimento - skip loading
    if ((segments[0] as string) === 'dev') return;

    // 🚀 Inicia loading em qualquer mudança de rota
    startLoading();
  }, [segments, isInitializing, startLoading]);

  useEffect(() => {
    // Guard: não navegar se segments estiver vazio (Root Layout não montado)
    if (!segments.length) return;

    // Whitelist para rota de desenvolvimento - skip lógica de redirect
    if ((segments[0] as string) === 'dev') return;

    // Verifica se está em rota de autenticação
    const inAuthGroup = segments[0] === '(auth)';
    
    // Se não está autenticado e não está em rota de auth, redireciona para splash
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');  // 🎯 Splash primeiro (sem /index)
      return;
    }
    
    // Se está autenticado e está em rota de auth, redireciona para app
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)');
      return;
    }
  }, [isAuthenticated, isInitializing, segments, router]);

  // Exibe loading durante inicialização
  if (isInitializing) {
    return <AuthLoading message="Inicializando autenticação..." />;
  }

  return <>{children}</>;
}

/**
 * Layout principal do aplicativo
 */

export const unstable_settings = {
  anchor: '(app)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <LoadingProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NavigationLoadingManager>
            <AuthGuard>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="light" />
            </AuthGuard>
          </NavigationLoadingManager>
        </ThemeProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}

/**
 * Componente que gerencia o overlay de loading de navegação
 */
function NavigationLoadingManager({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();

  return (
    <>
      {children}
      {isLoading && <NavigationLoadingOverlay />}
    </>
  );
}
