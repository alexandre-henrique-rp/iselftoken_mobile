import { Stack } from 'expo-router';
import React from 'react';

/**
 * Layout para rotas privadas do aplicativo
 * Apenas usuários autenticados podem acessar
 */
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Configurações',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
