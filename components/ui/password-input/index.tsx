import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SimpleInput } from '../simple-input';
import { Colors } from '@/constants';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  style?: any;
  testID?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = '••••••••',
  error,
  style,
  testID,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SimpleInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      error={error}
      secureTextEntry={!showPassword}
      style={style}
      testID={testID}
      leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.text.muted} />}
      rightIcon={
        <TouchableOpacity onPress={togglePassword}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={Colors.text.muted}
          />
        </TouchableOpacity>
      }
    />
  );
};
