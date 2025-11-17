# 🎨 Guia de Padrões React Native - iSelfToken
## Design Mobile Premium & Alto Padrão

## 🌈 Identidade Visual Sofisticada Mobile

### Cor Principal da Empresa
**#d500f9 - MAGENTA ELEGANTE**

**Aplicações Premium:**
- Acentos sutis em elementos estratégicos
- Estados de toque e foco minimalistas
- Elementos de navegação principal
- Detalhes de luxo e sofisticação

---

## 🎨 Paleta de Cores Mobile

### Sistema de Cores React Native
```javascript
// constants/colors.js
export const Colors = {
  // Fundos monocromáticos
  background: {
    primary: '#171719',      // Preto suave
    secondary: '#1f1f22',    // Cinza escuro
    tertiary: '#292929',     // Cinza médio
    card: '#232325',         // Cards premium
    surface: '#2e2e30',      // Superfícies
    
    // Acentos sutis
    accentPrimary: 'rgba(213, 0, 249, 0.05)',
    accentHover: 'rgba(213, 0, 249, 0.08)',
  },
  
  // Tipografia monocromática
  text: {
    primary: '#fafafa',      // Branco suave
    secondary: '#d9d9d9',    // Cinza claro
    tertiary: '#a6a6a6',     // Cinza médio
    muted: '#737373',        // Cinza escuro
    
    // Acentos em texto
    accent: '#d500f9',       // Destaques elegantes
    accentSubtle: 'rgba(213, 0, 249, 0.8)',
  },
  
  // Bordas invisíveis
  border: {
    subtle: '#2e2e30',       // Bordas sutis
    card: '#292929',         // Cards
    divider: '#232325',      // Divisores
    
    // Acentos em bordas
    accent: 'rgba(213, 0, 249, 0.2)',
    accentActive: 'rgba(213, 0, 249, 0.4)',
  },
  
  // Cor principal
  primary: '#d500f9',
  primaryDark: '#b800d4',
  primaryLight: '#e400e5',
  
  // Estados
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};
```

---

## 📐 Sistema de Espaçamento Mobile

### Espaçamentos Generosos
```javascript
// constants/spacing.js
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Paddings específicos
  padding: {
    screen: 20,
    card: 16,
    button: 12,
    input: 14,
  },
  
  // Gaps
  gap: {
    tiny: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
  },
};
```

---

## 🔤 Tipografia Sofisticada Mobile

### Sistema Tipográfico
```javascript
// constants/typography.js
export const Typography = {
  // Famílias de fonte
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Tamanhos
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  // Pesos
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};
```

---

## 🎴 Componentes de Estilo Premium

### Container Principal
```javascript
// styles/containers.js
import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants';

export const containerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  screenPadded: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    padding: Spacing.padding.screen,
  },
  
  content: {
    flex: 1,
    gap: Spacing.lg,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.padding.screen,
  },
  
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.padding.screen,
    gap: Spacing.lg,
  },
});
```

### Cards Minimalistas
```javascript
// styles/cards.js
export const cardStyles = StyleSheet.create({
  premium: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: Spacing.padding.card,
    borderWidth: 1,
    borderColor: Colors.border.card,
    
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    
    // Sombra Android
    elevation: 3,
  },
  
  elevated: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: Spacing.padding.card,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  
  flat: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: Spacing.padding.card,
  },
  
  bordered: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: Spacing.padding.card,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
});
```

---

## 🔘 Botões Sofisticados

### Estilos de Botões
```javascript
// styles/buttons.js
export const buttonStyles = StyleSheet.create({
  // Botão Principal
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  primaryPressed: {
    backgroundColor: Colors.primaryLight,
    transform: [{ scale: 0.98 }],
  },
  
  // Botão Sucesso (Luxuoso)
  success: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  
  successPressed: {
    backgroundColor: Colors.primaryLight,
    transform: [{ translateY: 2 }, { scale: 1.01 }],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
  },
  
  // Botão Secundário
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  
  secondaryPressed: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.accent,
  },
  
  // Botão Ghost
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ghostPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Botão Cancelar
  cancel: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  
  cancelPressed: {
    borderColor: Colors.primary,
    transform: [{ translateY: 2 }],
  },
  
  // Botão Desabilitado
  disabled: {
    backgroundColor: Colors.background.tertiary,
    opacity: 0.5,
  },
});

// Estilos de texto dos botões
export const buttonTextStyles = StyleSheet.create({
  primary: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  
  success: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  
  secondary: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  
  ghost: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
  },
  
  cancel: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },
  
  cancelPressed: {
    color: Colors.primary,
  },
});
```

---

## 📝 Inputs Elegantes

### Estilos de Input
```javascript
// styles/inputs.js
export const inputStyles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  
  label: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: 4,
  },
  
  premium: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    paddingVertical: Spacing.padding.input,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
  },
  
  focused: {
    borderColor: Colors.border.accent,
    backgroundColor: Colors.background.tertiary,
    
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  
  error: {
    borderColor: Colors.error,
  },
  
  disabled: {
    backgroundColor: Colors.background.primary,
    opacity: 0.5,
  },
  
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.xs,
    marginTop: 4,
  },
  
  helperText: {
    color: Colors.text.muted,
    fontSize: Typography.fontSize.xs,
    marginTop: 4,
  },
});
```

---

## 🎬 Animações Sutis

### Configurações de Animação
```javascript
// constants/animations.js
export const Animations = {
  // Durações
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Timing functions (para Animated)
  easing: {
    ease: { x: 0.4, y: 0 },
    easeIn: { x: 0.4, y: 0 },
    easeOut: { x: 0, y: 0.2 },
    easeInOut: { x: 0.4, y: 0 },
  },
  
  // Configurações pré-definidas
  spring: {
    tension: 40,
    friction: 7,
  },
  
  springBouncy: {
    tension: 100,
    friction: 8,
  },
};
```

### Exemplo de Hook de Animação
```javascript
// hooks/useButtonAnimation.js
import { useRef } from 'react';
import { Animated } from 'react-native';
import { Animations } from '../constants';

export const useButtonAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      ...Animations.springBouncy,
      useNativeDriver: true,
    }).start();
  };
  
  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...Animations.springBouncy,
      useNativeDriver: true,
    }).start();
  };
  
  return { scaleAnim, pressIn, pressOut };
};
```

---

## 🏗️ Componentes Exemplo

### Componente de Botão Premium
```javascript
// components/Button.jsx
import React from 'react';
import { Pressable, Text, Animated } from 'react-native';
import { buttonStyles, buttonTextStyles } from '../styles/buttons';
import { useButtonAnimation } from '../hooks/useButtonAnimation';

export const Button = ({ 
  variant = 'primary',
  onPress,
  disabled,
  children,
  style,
  textStyle,
}) => {
  const { scaleAnim, pressIn, pressOut } = useButtonAnimation();
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'success': return buttonStyles.success;
      case 'secondary': return buttonStyles.secondary;
      case 'ghost': return buttonStyles.ghost;
      case 'cancel': return buttonStyles.cancel;
      default: return buttonStyles.primary;
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'success': return buttonTextStyles.success;
      case 'secondary': return buttonTextStyles.secondary;
      case 'ghost': return buttonTextStyles.ghost;
      case 'cancel': return buttonTextStyles.cancel;
      default: return buttonTextStyles.primary;
    }
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        style={({ pressed }) => [
          getButtonStyle(),
          pressed && buttonStyles[`${variant}Pressed`],
          disabled && buttonStyles.disabled,
          style,
        ]}
      >
        <Text style={[getTextStyle(), textStyle]}>
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
```

### Componente de Card Premium
```javascript
// components/Card.jsx
import React from 'react';
import { View } from 'react-native';
import { cardStyles } from '../styles/cards';

export const Card = ({ 
  variant = 'premium',
  children,
  style,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated': return cardStyles.elevated;
      case 'flat': return cardStyles.flat;
      case 'bordered': return cardStyles.bordered;
      default: return cardStyles.premium;
    }
  };
  
  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};
```

### Componente de Input Premium
```javascript
// components/Input.jsx
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { inputStyles } from '../styles/inputs';
import { Colors } from '../constants';

export const Input = ({
  label,
  error,
  helperText,
  disabled,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={inputStyles.container}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      
      <TextInput
        style={[
          inputStyles.premium,
          isFocused && inputStyles.focused,
          error && inputStyles.error,
          disabled && inputStyles.disabled,
          style,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        placeholderTextColor={Colors.text.muted}
        {...props}
      />
      
      {error && <Text style={inputStyles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={inputStyles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};
```

---

## 📱 Layout Responsivo

### Utilitários de Layout
```javascript
// utils/layout.js
import { Dimensions, Platform } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getResponsiveSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Base iPhone X
  return Math.round(size * scale);
};

export const isSmallScreen = SCREEN_WIDTH < 375;
export const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
export const isLargeScreen = SCREEN_WIDTH >= 768;
```

---

## 🎯 Exemplo de Tela Completa

```javascript
// screens/ExampleScreen.jsx
import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { containerStyles } from '../styles/containers';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, Typography, Spacing } from '../constants';

export const ExampleScreen = () => {
  return (
    <SafeAreaView style={containerStyles.screen}>
      <ScrollView contentContainerStyle={containerStyles.scrollContent}>
        <Text style={{
          color: Colors.text.primary,
          fontSize: Typography.fontSize.xxxl,
          fontWeight: Typography.fontWeight.bold,
          letterSpacing: Typography.letterSpacing.tight,
        }}>
          iSelfToken
        </Text>
        
        <Card variant="premium">
          <Text style={{
            color: Colors.text.secondary,
            fontSize: Typography.fontSize.base,
            lineHeight: Typography.lineHeight.relaxed,
          }}>
            Design mobile premium e alto padrão
          </Text>
        </Card>
        
        <Input
          label="Email"
          placeholder="seu@email.com"
          helperText="Digite seu melhor email"
        />
        
        <Button variant="success" onPress={() => {}}>
          Continuar
        </Button>
        
        <Button variant="cancel" onPress={() => {}}>
          Cancelar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
```

---

## 📋 Checklist de Implementação

### Estrutura de Pastas Recomendada
```
src/
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   └── index.js
├── constants/
│   ├── colors.js
│   ├── spacing.js
│   ├── typography.js
│   ├── animations.js
│   └── index.js
├── styles/
│   ├── containers.js
│   ├── buttons.js
│   ├── cards.js
│   ├── inputs.js
│   └── index.js
├── hooks/
│   ├── useButtonAnimation.js
│   └── index.js
├── utils/
│   ├── layout.js
│   └── index.js
└── screens/
    └── ExampleScreen.jsx
```

### Passos de Implementação
1. ✅ Criar arquivo de cores (`constants/colors.js`)
2. ✅ Criar arquivo de espaçamento (`constants/spacing.js`)
3. ✅ Criar arquivo de tipografia (`constants/typography.js`)
4. ✅ Criar estilos de containers (`styles/containers.js`)
5. ✅ Criar estilos de botões (`styles/buttons.js`)
6. ✅ Criar estilos de cards (`styles/cards.js`)
7. ✅ Criar estilos de inputs (`styles/inputs.js`)
8. ✅ Criar componentes reutilizáveis
9. ✅ Implementar animações
10. ✅ Testar em diferentes tamanhos de tela

---

## 🎨 Princípios do Design Premium Mobile

### 1. Espaçamento Generoso
- Use padding e margins amplos
- Evite elementos apertados
- Mantenha áreas clicáveis de no mínimo 44x44pt

### 2. Tipografia Hierárquica
- Use diferentes tamanhos e pesos
- Mantenha contraste visual claro
- Limite a 3-4 tamanhos de fonte por tela

### 3. Cores Minimalistas
- Predominância de tons de cinza
- Use #d500f9 estrategicamente
- Mantenha alto contraste

### 4. Animações Sutis
- Transições suaves e naturais
- Feedback visual em interações
- Duração entre 150-350ms

### 5. Componentes Consistentes
- Reutilize estilos
- Mantenha padrões visuais
- Crie biblioteca de componentes

---

*Guia de padrões React Native otimizado para design mobile premium - iSelfToken*
