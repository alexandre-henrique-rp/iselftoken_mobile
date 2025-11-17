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

interface SimpleInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle; // Container style
  inputStyle?: any; // TextInput style
  testID?: string;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  testID,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputWrapper}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          testID={testID}
          style={[styles.input, inputStyle]}
          placeholderTextColor={Colors.text.muted}
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
    color: Colors.text.primary, // Tema dark
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle, // Tema dark
    borderRadius: 8,
    backgroundColor: Colors.background.card, // Tema dark
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary, // Tema dark
    minHeight: 44,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error, // Usando Colors.error
    marginTop: 4,
  },
});
