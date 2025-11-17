/**
 * Página inicial do aplicativo autenticado
 * Redireciona para a primeira aba (home/tabs)
 */

import { Redirect } from 'expo-router';

export default function AppIndex() {
  return <Redirect href="/(app)/(tabs)" />;
}
