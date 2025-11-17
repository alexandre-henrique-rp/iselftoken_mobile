/**
 * Sistema de Espaçamento Mobile Premium - iSelfToken
 * Espaçamentos generosos para design sofisticado
 */

export const Spacing = {
  // Espaçamentos base
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Paddings específicos para mobile
  padding: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    screen: 20,        // Padding geral das telas
    card: 16,          // Padding dos cards
    button: 12,        // Padding dos botões
    input: 14,         // Padding dos inputs
    modal: 24,         // Padding dos modais
  },
  
  // Gaps para layouts
  gap: {
    tiny: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
    xxlarge: 32,
  },
  
  // Margens específicas
  margin: {
    screen: 20,        // Margem geral das telas
    card: 16,          // Margem dos cards
    button: 8,         // Margem entre botões
    section: 24,       // Margem entre seções
  },
  
  // Alturas mínimas para áreas clicáveis (acessibilidade)
  touchable: {
    min: 44,           // Mínimo recomendado pelo Apple
    comfortable: 48,   // Mais confortável
    large: 56,         // Para botões principais
  },
};
