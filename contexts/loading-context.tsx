/**
 * Loading Context - Sistema de Loading Global
 * Controla loading automático em mudanças de tela
 * Timer de 3 segundos + controle manual
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Provider do Loading Context
 * Gerencia estado global de loading com timer automático
 */
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Inicia loading com timer automático de 3 segundos
   */
  const startLoading = () => {
    setIsLoading(true);
    
    // Limpa timer anterior se existir
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Timer automático de 3 segundos
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      timerRef.current = null;
    }, 3000);
  };

  /**
   * Para loading manualmente (cancela timer automático)
   */
  const stopLoading = () => {
    setIsLoading(false);
    
    // Limpa timer se existir
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  /**
   * Cleanup do timer ao desmontar
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const value: LoadingContextType = {
    isLoading,
    startLoading,
    stopLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook para usar o Loading Context
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
