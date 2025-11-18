import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';
import { usePasswordStrength, PasswordStrengthResult } from '@/hooks/use-password-strength';

interface PasswordStrengthIndicatorProps {
  password: string;
  style?: ViewStyle;
  showStrengthBar?: boolean;
  showRequirements?: boolean;
}

/**
 * Componente visual para indicar força da senha e requisitos
 * Mostra barra de força e lista de requisitos com status visual
 */
export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  style,
  showStrengthBar = true,
  showRequirements = true,
}) => {
  const strengthResult = usePasswordStrength(password);

  if (!showStrengthBar && !showRequirements) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Barra de força */}
      {showStrengthBar && (
        <View style={styles.strengthSection}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthLabel}>Força da senha</Text>
            <Text style={[styles.strengthText, getStrengthColor(strengthResult.strength)]}>
              {getStrengthLabel(strengthResult.strength)}
            </Text>
          </View>
          
          <View style={styles.strengthBarContainer}>
            <View 
              style={[
                styles.strengthBar,
                { width: `${strengthResult.percentage}%` },
                { backgroundColor: getStrengthColor(strengthResult.strength).color },
              ]} 
            />
          </View>
        </View>
      )}

      {/* Lista de requisitos */}
      {showRequirements && (
        <View style={styles.requirementsSection}>
          <Text style={styles.requirementsTitle}>Requisitos obrigatórios:</Text>
          {strengthResult.requirements.map((requirement) => (
            <View key={requirement.id} style={styles.requirementItem}>
              <Ionicons
                name={requirement.met ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={requirement.met ? Colors.success : Colors.text.muted}
                style={styles.requirementIcon}
              />
              <Text style={[
                styles.requirementText,
                requirement.met && styles.requirementMet,
              ]}>
                {requirement.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

/**
 * Obtém rótulo da força da senha
 */
const getStrengthLabel = (strength: PasswordStrengthResult['strength']): string => {
  switch (strength) {
    case 'weak':
      return 'Fraca';
    case 'medium':
      return 'Média';
    case 'strong':
      return 'Forte';
    default:
      return 'Fraca';
  }
};

/**
 * Obtém cor da força da senha
 */
const getStrengthColor = (strength: PasswordStrengthResult['strength']): { color: string } => {
  switch (strength) {
    case 'weak':
      return { color: Colors.error };
    case 'medium':
      return { color: '#FF9500' }; // Laranja
    case 'strong':
      return { color: Colors.success };
    default:
      return { color: Colors.error };
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  strengthSection: {
    marginBottom: 16,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: Colors.background.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  requirementsSection: {
    // Sem espaçamento extra aqui para ficar próximo do input
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.tertiary,
    lineHeight: 18,
  },
  requirementMet: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
});
