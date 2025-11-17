/**
 * Componente Card Premium - iSelfToken
 * Card elegante com design system consistente e múltiplas variantes
 * Suporta diferentes estilos para UX premium e flexibilidade
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Spacing } from '@/constants';

/**
 * Variantes do card
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

/**
 * Props do componente Card
 */
interface CardProps {
  /** Children do card */
  children: React.ReactNode;
  /** Variante visual */
  variant?: CardVariant;
  /** Card clicável */
  pressable?: boolean;
  /** Função ao pressionar (se pressable=true) */
  onPress?: () => void;
  /** Estilo customizado */
  style?: ViewStyle;
  /** Padding customizado */
  padding?: number;
  /** Test ID para testes */
  testID?: string;
  /** Props adicionais para TouchableOpacity */
  touchableProps?: Omit<TouchableOpacityProps, 'style' | 'onPress' | 'children'>;
}

/**
 * Mapeamento de estilos por variante
 */
const getVariantStyles = (variant: CardVariant) => {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: Colors.background.card,
        borderColor: Colors.border.card,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      };
    case 'outlined':
      return {
        backgroundColor: Colors.background.card,
        borderColor: Colors.border.accent,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
      };
    case 'flat':
      return {
        backgroundColor: Colors.background.card,
        borderColor: 'transparent',
        borderWidth: 0,
        shadowColor: 'transparent',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      };
    case 'default':
    default:
      return {
        backgroundColor: Colors.background.card,
        borderColor: Colors.border.card,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      };
  }
};

/**
 * Componente Card Premium
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  pressable = false,
  onPress,
  style,
  padding = Spacing.padding.md,
  testID,
  touchableProps,
}) => {
  /**
   * Combina estilos
   */
  const cardStyles = [
    styles.container,
    getVariantStyles(variant),
    {
      padding,
    },
    style,
  ];

  /**
   * Renderiza card clicável ou estático
   */
  if (pressable) {
    return (
      <TouchableOpacity
        testID={testID}
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.8}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={cardStyles}>
      {children}
    </View>
  );
};

/**
 * Estilos base do componente
 */
const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    // Bordas arredondadas generosas para design premium
    // Sombra e elevação já aplicadas nas variantes
  },
});
