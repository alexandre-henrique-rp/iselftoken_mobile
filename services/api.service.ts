/**
 * Serviço de API - iSelfToken
 * Gerencia comunicação HTTP com interceptors para refresh automático de tokens
 * Implementa retry strategy e tratamento de erros robusto
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { storageService } from './storage.service';
import { config, API_ENDPOINTS } from '@/constants/config';
import { AuthTokens, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

/**
 * Interface para retry configuration
 */
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

/**
 * Classe de serviço de API com singleton pattern
 */
class ApiService {
  private axiosInstance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupRetryConfig();
  }

  /**
   * Configura interceptors para auth e refresh
   */
  private setupInterceptors(): void {
    // Request interceptor - adiciona token de acesso
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const tokens = await storageService.getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        
        // TODO: Implement enableLogging when config types are extended
        // if (config.enableLogging) {
        //   console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        // }
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - trata erros e refresh
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (config.enableLogging) {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (config.enableLogging) {
          console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
        }

        // Trata 401 - Unauthorized
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          return this.handle401Error(originalRequest);
        }

        // Trata outros erros HTTP
        if (error.response) {
          this.handleHttpError(error.response.status);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Trata erro 401 com refresh automático
   */
  private async handle401Error(originalRequest: AxiosRequestConfig & { _retry?: boolean }): Promise<any> {
    originalRequest._retry = true;

    // Se já está refreshing, aguarda a mesma promise
    if (this.refreshPromise) {
      try {
        const newToken = await this.refreshPromise;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return this.axiosInstance(originalRequest);
      } catch (error) {
        throw error;
      }
    }

    // Inicia processo de refresh usando método público
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return this.axiosInstance(originalRequest);
    } catch (refreshError) {
      // Se refresh falhar, faz logout
      await this.forceLogout();
      throw refreshError;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Executa refresh do token - método público para uso do AuthContext
   */
  async performTokenRefresh(): Promise<string> {
    try {
      const tokens = await storageService.getTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${config.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
        refreshToken: tokens.refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken, expiresAt } = response.data.tokens;
      
      const newTokens: AuthTokens = {
        accessToken,
        refreshToken: newRefreshToken || tokens.refreshToken,
        expiresAt,
      };

      // Atualiza tokens no storage
      await storageService.setItem('iself_access_token', accessToken);
      if (newRefreshToken) {
        await storageService.setItem('iself_refresh_token', newRefreshToken);
      }
      await storageService.setItem('iself_token_expires_at', expiresAt.toString());

      console.log('✅ Token refreshed successfully');
      return accessToken;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Trata diferentes erros HTTP
   */
  private handleHttpError(status: number): void {
    switch (status) {
      case 403:
        console.warn('⚠️ Access forbidden - insufficient permissions');
        break;
      case 404:
        console.warn('⚠️ Resource not found');
        break;
      case 500:
      case 502:
      case 503:
        console.warn('⚠️ Server error - please try again later');
        break;
      default:
        console.warn(`⚠️ HTTP Error ${status}`);
    }
  }

  /**
   * Configura retry strategy
   */
  private setupRetryConfig(): void {
    const retryConfig: RetryConfig = {
      retries: 3,
      retryDelay: 1000,
      retryCondition: (error: AxiosError) => {
        // Retry em erros de rede e 5xx
        return !error.response || (error.response.status >= 500 && error.response.status < 600);
      },
    };

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retryCount?: number };
        
        if (!config || !retryConfig.retryCondition?.(error)) {
          return Promise.reject(error);
        }

        config._retryCount = config._retryCount || 0;
        
        if (config._retryCount >= retryConfig.retries) {
          return Promise.reject(error);
        }

        config._retryCount += 1;
        
        // Exponential backoff
        const delay = retryConfig.retryDelay * Math.pow(2, config._retryCount - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`🔄 Retrying request (${config._retryCount}/${retryConfig.retries}): ${config.method?.toUpperCase()} ${config.url}`);
        
        return this.axiosInstance(config);
      }
    );
  }

  /**
   * Força logout em caso de falha crítica
   */
  private async forceLogout(): Promise<void> {
    try {
      await storageService.clearAuthData();
      // TODO: Navegar para tela de login via AuthContext
      console.log('🔒 Forced logout due to authentication failure');
    } catch (error) {
      console.error('❌ Error during forced logout:', error);
    }
  }

  /**
   * Métodos de autenticação
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const authData = response.data;

      // Salva tokens e usuário
      await storageService.saveAuthData(authData.tokens, authData.user);

      console.log('✅ Login successful');
      return authData;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw this.handleError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, credentials);
      const authData = response.data;

      // Salva tokens e usuário
      await storageService.saveAuthData(authData.tokens, authData.user);

      console.log('✅ Registration successful');
      return authData;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
      console.log('✅ Logout successful');
    } catch (error) {
      console.warn('⚠️ Logout request failed, proceeding with local cleanup');
    } finally {
      await storageService.clearAuthData();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(API_ENDPOINTS.AUTH.VALIDATE);
      return response.status === 200;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      return false;
    }
  }

  /**
   * Trata erros de API de forma padronizada
   */
  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.code === 'NETWORK_ERROR') {
      return new Error('Erro de conexão. Verifique sua internet.');
    }
    
    if (error.code === 'ECONNABORTED') {
      return new Error('Tempo esgotado. Tente novamente.');
    }
    
    return new Error('Ocorreu um erro inesperado. Tente novamente.');
  }

  /**
   * Retorna instância axios para uso direto se necessário
   */
  get axios(): AxiosInstance {
    return this.axiosInstance;
  }
}

/**
 * Exporta instância singleton do serviço
 */
export const apiService = new ApiService();
