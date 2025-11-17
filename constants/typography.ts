/**
 * Sistema Tipográfico Mobile Premium - iSelfToken
 * Tipografia hierárquica para design sofisticado
 */

export const Typography = {
  // Famílias de fonte (System do React Native)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Tamanhos de fonte otimizados para mobile
  fontSize: {
    xs: 11,              // Labels pequenos
    sm: 13,              // Textos secundários
    base: 15,            // Texto base
    lg: 17,              // Textos importantes
    xl: 20,              // Subtítulos
    xxl: 24,             // Títulos de seção
    xxxl: 32,            // Títulos principais
    display: 40,         // Títulos de destaque
  },
  
  // Pesos das fontes (tipos literais para React Native)
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Altura de linha para legibilidade mobile
  lineHeight: {
    tight: 1.2,          // Títulos compactos
    normal: 1.5,         // Texto normal
    relaxed: 1.7,        // Textos longos
  },
  
  // Espaçamento entre caracteres
  letterSpacing: {
    tight: -0.5,         // Mais compacto
    normal: 0,           // Normal
    wide: 0.5,           // Mais espaçado
    wider: 1,            // Muito espaçado
  },
  
  // Combinações pré-definidas para componentes
  heading: {
    large: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    medium: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    small: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.3,
      letterSpacing: 0,
    },
  },
  
  body: {
    large: {
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    regular: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    small: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  },
  
  label: {
    large: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
    regular: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 1.3,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
  },
};
