/**
 * Configuração de Ambiente - iSelfToken
 * Define URLs e configurações baseadas no ambiente
 */

import Constants from 'expo-constants';

/**
 * Ambientes disponíveis
 */
const ENVIRONMENTS = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    timeout: 10000,
    enableLogging: true,
  },
  staging: {
    apiUrl: 'https://staging-api.iselftoken.com/api',
    timeout: 8000,
    enableLogging: true,
  },
  production: {
    apiUrl: 'https://api.iselftoken.com/api',
    timeout: 6000,
    enableLogging: false,
  },
} as const;

/**
 * Determina o ambiente atual
 */
const getCurrentEnvironment = () => {
  // Em desenvolvimento, usa __DEV__
  if (__DEV__) {
    return ENVIRONMENTS.development;
  }

  // Em produção, verifica release channel ou usa produção por padrão
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  
  switch (releaseChannel) {
    case 'staging':
      return ENVIRONMENTS.staging;
    default:
      return ENVIRONMENTS.production;
  }
};

/**
 * Configuração exportada para uso na aplicação
 */
export const config = getCurrentEnvironment();

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VALIDATE: '/auth/validate',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Usuário
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  // Outros endpoints serão adicionados conforme necessidade
} as const;

/**
 * Headers padrão para requisições
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
