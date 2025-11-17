/**
 * Serviço de Armazenamento Seguro
 * Gerencia tokens e dados sensíveis usando expo-secure-store
 * Com fallback para web development
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AuthTokens, User } from '@/types/auth';

/**
 * Chaves para armazenamento seguro
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'iself_access_token',
  REFRESH_TOKEN: 'iself_refresh_token',
  TOKEN_EXPIRES_AT: 'iself_token_expires_at',
  USER_DATA: 'iself_user_data',
} as const;

/**
 * Serviço de armazenamento com fallback para web
 */
class StorageService {
  /**
   * Verifica se SecureStore está disponível
   */
  private isSecureStoreAvailable(): boolean {
    return Platform.OS !== 'web';
  }

  /**
   * Salva dados de autenticação de forma segura
   */
  async saveAuthData(tokens: AuthTokens, user: User): Promise<void> {
    try {
      const promises = [
        this.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
        this.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
        this.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, tokens.expiresAt.toString()),
        this.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      ];

      await Promise.all(promises);
      console.log('✅ Dados de autenticação salvos com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar dados de autenticação:', error);
      throw new Error('Falha ao salvar dados de autenticação');
    }
  }

  /**
   * Recupera tokens de autenticação
   */
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const [accessToken, refreshToken, expiresAtStr] = await Promise.all([
        this.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        this.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        this.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT),
      ]);

      if (!accessToken || !refreshToken || !expiresAtStr) {
        return null;
      }

      const expiresAt = parseInt(expiresAtStr, 10);
      if (isNaN(expiresAt)) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      console.error('❌ Erro ao recuperar tokens:', error);
      return null;
    }
  }

  /**
   * Recupera dados do usuário
   */
  async getUser(): Promise<User | null> {
    try {
      const userDataStr = await this.getItem(STORAGE_KEYS.USER_DATA);
      if (!userDataStr) {
        return null;
      }

      const userData = JSON.parse(userDataStr);
      return userData as User;
    } catch (error) {
      console.error('❌ Erro ao recuperar dados do usuário:', error);
      return null;
    }
  }

  /**
   * Verifica se o token de acesso está expirado
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        return true;
      }

      // Adiciona margem de 5 minutos antes da expiração
      const now = Date.now();
      const expiryWithMargin = tokens.expiresAt - 5 * 60 * 1000;
      
      return now >= expiryWithMargin;
    } catch (error) {
      console.error('❌ Erro ao verificar expiração do token:', error);
      return true;
    }
  }

  /**
   * Limpa todos os dados de autenticação
   */
  async clearAuthData(): Promise<void> {
    try {
      const promises = Object.values(STORAGE_KEYS).map(key => 
        this.removeItem(key)
      );

      await Promise.all(promises);
      console.log('✅ Dados de autenticação removidos com sucesso');
    } catch (error) {
      console.error('❌ Erro ao limpar dados de autenticação:', error);
      throw new Error('Falha ao limpar dados de autenticação');
    }
  }

  /**
   * Salva um item no armazenamento (com fallback) - método público para uso do ApiService
   */
  async setItem(key: string, value: string): Promise<void> {
    if (this.isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(key, value);
    } else {
      // Fallback para web development
      localStorage.setItem(key, value);
    }
  }

  /**
   * Recupera um item do armazenamento (com fallback)
   */
  private async getItem(key: string): Promise<string | null> {
    if (this.isSecureStoreAvailable()) {
      return await SecureStore.getItemAsync(key);
    } else {
      // Fallback para web development
      return localStorage.getItem(key);
    }
  }

  /**
   * Remove um item do armazenamento (com fallback)
   */
  private async removeItem(key: string): Promise<void> {
    if (this.isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(key);
    } else {
      // Fallback para web development
      localStorage.removeItem(key);
    }
  }
}

/**
 * Exporta instância singleton do serviço
 */
export const storageService = new StorageService();
