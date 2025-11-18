import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors } from '@/constants';
import { mask } from 'remask';

interface PhoneInputProps extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle; // Container style
  inputStyle?: any; // TextInput style
  testID?: string;
  value?: string; // Apenas números
  onChangeText?: (value: string) => void; // Retorna apenas números
}

/**
 * Componente de input de telefone com máscara automática
 * Formata visualmente como (XX) XXXXX-XXXX mas armazena apenas números
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  testID,
  value = '',
  onChangeText,
  ...textInputProps
}) => {
  // Máscara para telefone celular brasileiro
  const phoneMask = ['(99) 9999-9999','(99) 9 9999-9999'];

  // Aplica máscara para exibição (stateless)
  const displayValue = mask(value, phoneMask);

  /**
   * Processa entrada do usuário e retorna apenas números
   * @param rawValue Valor bruto do input
   */
  const handleTextChange = (rawValue: string) => {
    // Remove todos os caracteres não numéricos
    const numbersOnly = rawValue.replace(/\D/g, '');
    
    // Limita a 11 dígitos (telefone celular)
    const limitedNumbers = numbersOnly.slice(0, 11);
    
    // Retorna apenas números para o componente pai
    onChangeText?.(limitedNumbers);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputWrapper}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          testID={testID}
          style={[styles.input, inputStyle]}
          placeholderTextColor={Colors.text.muted}
          value={displayValue}
          onChangeText={handleTextChange}
          keyboardType="phone-pad"
          maxLength={16} // (XX) XXXXX-XXXX = 15 caracteres
          {...textInputProps}
        />
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: 8,
    backgroundColor: Colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 44,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});
