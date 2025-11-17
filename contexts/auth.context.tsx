/**
 * Contexto de Autenticação - iSelfToken
 * Gerencia estado de autenticação com UX premium sem flickers
 * Implementa revalidação event-driven e prevenção de race conditions
 */

import React, { createContext, useContext, useEffect, useReducer, useRef, useCallback, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { apiService } from '@/services/api.service';
import { storageService } from '@/services/storage.service';
import { AuthState, AuthContextType, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

/**
 * Action types para o reducer de autenticação
 */
type AuthAction =
  | { type: 'START_INITIALIZING' }
  | { type: 'FINISH_INITIALIZING' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

/**
 * Estado inicial do autenticação - BYPASS TEMPORÁRIO
 */
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: false, // BYPASS: Forçado para desbloquear desenvolvimento
};

/**
 * Reducer para gerenciar estado de autenticação
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log('Reducer: Action received:', action.type, 'Current isInitializing:', state.isInitializing);
  
  switch (action.type) {
    case 'START_INITIALIZING':
      console.log('Reducer: Processing START_INITIALIZING');
      return {
        ...state,
        isInitializing: true,
        isLoading: false,
      };
    
    case 'FINISH_INITIALIZING':
      console.log('Reducer: Processing FINISH_INITIALIZING - setting isInitializing to false');
      return {
        ...state,
        isInitializing: false,
        isLoading: false,
      };
    
    case 'SET_LOADING':
      console.log('Reducer: Processing SET_LOADING:', action.payload);
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_USER':
      console.log('Reducer: Processing SET_USER');
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
      };
    
    case 'CLEAR_USER':
      console.log('Reducer: Processing CLEAR_USER');
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
      };
    
    default:
      console.log('Reducer: Unknown action type:', action.type);
      return state;
  }
};

/**
 * Contexto de autenticação
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider do contexto de autenticação
 */
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Flags para prevenção de race conditions
  const isLoggingInRef = useRef(false);
  const isLoggingOutRef = useRef(false);
  const isRevalidatingRef = useRef(false);

  /**
   * Realiza logout do usuário
   */
  const logout = useCallback(async (): Promise<void> => {
    // Prevenção de race condition
    if (isLoggingOutRef.current) {
      return;
    }

    try {
      isLoggingOutRef.current = true;
      
      // Cancela operações pendentes
      isRevalidatingRef.current = false;
      
      await apiService.logout();
      dispatch({ type: 'CLEAR_USER' });
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Força logout mesmo em caso de erro
      await storageService.clearAuthData();
      dispatch({ type: 'CLEAR_USER' });
    } finally {
      isLoggingOutRef.current = false;
    }
  }, []);

  /**
   * Atualiza token de acesso
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await apiService.performTokenRefresh();
      console.log('✅ Token refreshed successfully');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      await logout();
      throw error;
    }
  }, [logout]);

  /**
   * Revalida dados do usuário
   */
  const revalidateUser = useCallback(async (): Promise<void> => {
    // Prevenção de race conditions
    if (
      isRevalidatingRef.current ||
      isLoggingInRef.current ||
      isLoggingOutRef.current ||
      !state.isAuthenticated ||
      state.isLoading
    ) {
      return;
    }

    try {
      isRevalidatingRef.current = true;
      
      // Verifica expiração do token
      const isExpired = await storageService.isTokenExpired();
      if (isExpired) {
        await refreshToken();
      }
      
      // Valida com servidor
      const isValid = await apiService.validateToken();
      if (!isValid) {
        await logout();
        return;
      }
      
      // Atualiza dados do usuário (se necessário)
      const user = await storageService.getUser();
      if (user && JSON.stringify(user) !== JSON.stringify(state.user)) {
        dispatch({ type: 'SET_USER', payload: user });
      }
      
      console.log('✅ User revalidated successfully');
    } catch (error) {
      console.error('❌ User revalidation failed:', error);
      await logout();
    } finally {
      isRevalidatingRef.current = false;
    }
  }, [state.isAuthenticated, state.isLoading, state.user, logout, refreshToken]);

  /**
   * Realiza login do usuário
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    // Prevenção de race condition
    if (isLoggingInRef.current || state.isLoading) {
      return;
    }

    try {
      isLoggingInRef.current = true;
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const authResponse = await apiService.login(credentials);
      
      dispatch({ type: 'SET_USER', payload: authResponse.user });
      console.log('✅ Login successful');
    } catch (error) {
      console.error('❌ Login failed:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      isLoggingInRef.current = false;
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.isLoading]);

  /**
   * Realiza registro do usuário
   */
  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    // Prevenção de race condition
    if (isLoggingInRef.current || state.isLoading) {
      return;
    }

    try {
      isLoggingInRef.current = true;
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const authResponse = await apiService.register(credentials);
      
      dispatch({ type: 'SET_USER', payload: authResponse.user });
      console.log('✅ Registration successful');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      isLoggingInRef.current = false;
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.isLoading]);
  
  /**
   * Inicializa autenticação ao montar o componente - STUB TEST
   */
  const initializeAuth = async (): Promise<void> => {
  // STUB TEST: Apenas dispatch imediato, sem nenhuma lógica
  dispatch({ type: 'FINISH_INITIALIZING' });
};

  /**
   * Inicializa autenticação ao montar o componente
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Configura listeners para revalidação event-driven
   */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && !state.isInitializing && state.isAuthenticated) {
        // App voltou ao primeiro plano, revalida usuário
        revalidateUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [state.isInitializing, state.isAuthenticated, revalidateUser]);

  /**
   * Valor do contexto
   */
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    revalidateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar o contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
