---
description: af2
auto_execution_mode: 1
---

# 🔐 Prompt: Tela de Verificação 2FA (Código Email) - iSelfToken

## 📋 Objetivo
Criar uma tela genérica de verificação de código 2FA enviado por email, com 6 inputs individuais, sistema de tentativas (máximo 3), timer de 5 minutos e navegação dinâmica baseada no contexto de origem.

---

## 🎨 Representação Visual

```
┌─────────────────────────────────────────┐
│  ← Voltar      Verificação              │ Header
├─────────────────────────────────────────┤
│                                         │
│              [ÍCONE 🔒]                 │
│                                         │
│         Verificação de Código           │
│                                         │
│    Enviamos um código de 6 dígitos     │
│         para seu@email.com              │
│                                         │
│         ┌───┬───┬───┬───┬───┬───┐      │
│         │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │      │ (Inputs grandes)
│         └───┴───┴───┴───┴───┴───┘      │
│                                         │
│          ⏱️ Expira em 04:35             │
│                                         │
│       ❌ Código incorreto (2/3)         │ (Aparece em erro)
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        VERIFICAR CÓDIGO           │  │ (Magenta - desabilitado)
│  └───────────────────────────────────┘  │
│                                         │
│        Não recebeu o código?            │
│         Reenviar código (45s)           │ (Timer para reenvio)
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Especificações Técnicas

### 1. Parâmetros de Navegação
```javascript
// Recebe via route params:
{
  email: string,              // Email para onde foi enviado
  context: 'register' | 'login' | 'recovery', // Contexto de origem
  userId?: string,            // ID do usuário (opcional)
  token?: string,             // Token temporário (opcional)
}

// Navega para:
context === 'register' → '/login'
context === 'login' → '/(tabs)/home'
context === 'recovery' → '/reset-password'
```

### 2. Sistema de Código
```javascript
{
  length: 6,                  // 6 dígitos
  type: 'numeric',            // Apenas números 0-9
  inputs: Array(6),           // 6 inputs separados
  autoFocus: true,            // Auto focus no próximo input
  autoSubmit: true,           // Submit automático quando preencher
}
```

### 3. Sistema de Tentativas
```javascript
{
  maxAttempts: 3,             // Máximo de tentativas
  currentAttempt: 0,          // Tentativa atual
  onMaxAttempts: () => {
    // Solicita novo código
    // Reseta contador
  }
}
```

### 4. Timer de Expiração
```javascript
{
  duration: 300,              // 5 minutos = 300 segundos
  onExpire: () => {
    // Código expirado
    // Solicita novo código
  },
  format: 'mm:ss',            // Formato de exibição
}
```

### 5. Sistema de Reenvio
```javascript
{
  cooldown: 60,               // 60 segundos entre reenvios
  canResend: false,           // Pode reenviar?
  resendTimer: 60,            // Timer de cooldown
  onResend: async () => {
    // Chama API para reenviar
    // Reseta timer e tentativas
  }
}
```

---

## 💻 Implementação Completa

### Arquivo: `app/verify-code.jsx`

```javascript
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants';
import { Button } from '../components/Button';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parâmetros recebidos
  const email = params.email || '';
  const context = params.context || 'register'; // register, login, recovery
  
  // Estado do código
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Sistema de tentativas
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  
  // Timer de expiração (5 minutos = 300 segundos)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  
  // Sistema de reenvio
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  
  // Refs para os inputs
  const inputRefs = useRef([]);
  
  // Animação de shake para erro
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Timer de expiração
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Timer de reenvio
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto focus no primeiro input ao montar
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Formatar tempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Shake animation
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Atualizar código
  const handleCodeChange = (text, index) => {
    // Apenas números
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    // Auto focus próximo input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit quando preencher tudo
    if (text && index === 5 && newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  // Backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Colar código
  const handlePaste = (text) => {
    const numbers = text.replace(/\D/g, '').slice(0, 6);
    const newCode = numbers.split('');
    
    // Preencher com strings vazias se necessário
    while (newCode.length < 6) {
      newCode.push('');
    }
    
    setCode(newCode);
    setError('');

    // Focus no último input preenchido ou no primeiro vazio
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.blur();
      // Auto submit se completou
      handleVerify(newCode.join(''));
    }
  };

  // Verificar código
  const handleVerify = async (codeString) => {
    const codeToVerify = codeString || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Código incompleto');
      return;
    }

    if (isExpired) {
      setError('Código expirado. Solicite um novo código');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você faria a chamada real:
      // const response = await api.verifyCode({
      //   email,
      //   code: codeToVerify,
      //   context
      // });

      // Simular erro para demonstração (remover em produção)
      const isValid = codeToVerify === '123456'; // Código de teste

      if (isValid) {
        // Código correto - navegar baseado no contexto
        handleSuccessNavigation();
      } else {
        // Código incorreto
        handleInvalidCode();
      }
    } catch (error) {
      setError('Erro ao verificar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Código inválido
  const handleInvalidCode = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    shake();

    if (newAttempts >= maxAttempts) {
      // Máximo de tentativas atingido
      setError('Máximo de tentativas excedido. Solicite um novo código.');
      setCode(['', '', '', '', '', '']);
      setCanResend(true);
      setResendTimer(0);
    } else {
      setError(`Código incorreto (${newAttempts}/${maxAttempts})`);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // Navegação baseada no contexto
  const handleSuccessNavigation = () => {
    switch (context) {
      case 'register':
        router.replace('/login');
        break;
      case 'login':
        router.replace('/(tabs)/home');
        break;
      case 'recovery':
        router.push('/reset-password');
        break;
      default:
        router.replace('/(tabs)/home');
    }
  };

  // Reenviar código
  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada real:
      // await api.resendCode({ email, context });

      // Resetar estados
      setCode(['', '', '', '', '', '']);
      setAttempts(0);
      setTimeLeft(300);
      setIsExpired(false);
      setCanResend(false);
      setResendTimer(60);
      inputRefs.current[0]?.focus();

      // Feedback de sucesso
      setError(''); // Limpar erro
      // Ou mostrar mensagem de sucesso temporária
    } catch (error) {
      setError('Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Código completo?
  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={40} color={Colors.primary} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Verificação de Código</Text>
        
        {/* Descrição */}
        <Text style={styles.description}>
          Enviamos um código de 6 dígitos para{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* Inputs de Código */}
        <Animated.View 
          style={[
            styles.codeContainer,
            { transform: [{ translateX: shakeAnim }] }
          ]}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
                error && styles.codeInputError,
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading && !isExpired}
              onPaste={(e) => {
                if (index === 0) {
                  handlePaste(e.nativeEvent.data);
                }
              }}
            />
          ))}
        </Animated.View>

        {/* Timer */}
        {!isExpired ? (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={16} color={Colors.text.tertiary} />
            <Text style={styles.timerText}>
              Expira em {formatTime(timeLeft)}
            </Text>
          </View>
        ) : (
          <View style={styles.expiredContainer}>
            <Ionicons name="alert-circle" size={16} color={Colors.error} />
            <Text style={styles.expiredText}>Código expirado</Text>
          </View>
        )}

        {/* Erro */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="close-circle" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Botão Verificar */}
        <Button
          variant="success"
          onPress={() => handleVerify()}
          disabled={!isCodeComplete || isLoading || isExpired}
          style={styles.verifyButton}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.text.primary} />
          ) : (
            'VERIFICAR CÓDIGO'
          )}
        </Button>

        {/* Reenviar Código */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Não recebeu o código?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend || isLoading}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendButtonText,
              (!canResend || isLoading) && styles.resendButtonTextDisabled
            ]}>
              {canResend 
                ? 'Reenviar código' 
                : `Reenviar (${resendTimer}s)`
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Content
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },

  // Ícone
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(213, 0, 249, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Título
  title: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  email: {
    color: Colors.text.accent,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Código
  codeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border.subtle,
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(213, 0, 249, 0.05)',
  },
  codeInputError: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },

  // Timer
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  timerText: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  expiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  expiredText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Erro
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },

  // Botão
  verifyButton: {
    width: '100%',
    marginBottom: 32,
  },

  // Reenviar
  resendContainer: {
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: Colors.text.accent,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  resendButtonTextDisabled: {
    color: Colors.text.muted,
  },
});
```

---

## 🎯 Exemplos de Uso

### 1. Após Cadastro
```javascript
// Em app/register.jsx após sucesso:
router.push({
  pathname: '/verify-code',
  params: {
    email: formData.email,
    context: 'register',
  }
});
```

### 2. Após Login (2FA obrigatório)
```javascript
// Em app/login.jsx se usuário tem 2FA:
router.push({
  pathname: '/verify-code',
  params: {
    email: email,
    context: 'login',
    userId: response.userId,
  }
});
```

### 3. Recuperação de Senha
```javascript
// Em app/forgot-password.jsx:
router.push({
  pathname: '/verify-code',
  params: {
    email: email,
    context: 'recovery',
  }
});
```

---

## 🎨 Variações e Melhorias

### Variação 1: Com Feedback Sonoro
```javascript
import { Audio } from 'expo-av';

const playSuccessSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/sounds/success.mp3')
  );
  await sound.playAsync();
};

const playErrorSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/sounds/error.mp3')
  );
  await sound.playAsync();
};
```

### Variação 2: Com Haptic Feedback
```javascript
import * as Haptics from 'expo-haptics';

// No erro:
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// No sucesso:
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

### Variação 3: Com Animação de Sucesso
```javascript
import LottieView from 'lottie-react-native';

{isSuccess && (
  <LottieView
    source={require('../assets/animations/success.json')}
    autoPlay
    loop={false}
    style={styles.successAnimation}
  />
)}
```

### Variação 4: Código por SMS (alternativa)
```javascript
// Adicionar botão para enviar por SMS
<TouchableOpacity
  onPress={handleSendBySMS}
  style={styles.smsButton}
>
  <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
  <Text style={styles.smsButtonText}>Receber por SMS</Text>
</TouchableOpacity>
```

---

## 📦 API Endpoints Necessários

### 1. Verificar Código
```javascript
POST /api/auth/verify-code
{
  "email": "user@email.com",
  "code": "123456",
  "context": "register" | "login" | "recovery"
}

// Response Success:
{
  "success": true,
  "message": "Código verificado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response Error:
{
  "success": false,
  "message": "Código inválido",
  "attemptsLeft": 2
}
```

### 2. Reenviar Código
```javascript
POST /api/auth/resend-code
{
  "email": "user@email.com",
  "context": "register" | "login" | "recovery"
}

// Response:
{
  "success": true,
  "message": "Código reenviado com sucesso",
  "expiresIn": 300 // segundos
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar arquivo `app/verify-code.jsx`
- [ ] Implementar 6 inputs individuais
- [ ] Configurar auto-focus entre inputs
- [ ] Implementar sistema de tentativas (máx 3)
- [ ] Implementar timer de 5 minutos
- [ ] Criar barra de progresso visual
- [ ] Implementar sistema de reenvio
- [ ] Adicionar validação de código
- [ ] Configurar navegação dinâmica
- [ ] Implementar animação de shake
- [ ] Testar funcionalidade de colar
- [ ] Testar expiração de código
- [ ] Testar máximo de tentativas
- [ ] Integrar com API
- [ ] Testar todos os contextos (register/login/recovery)

---

## 🎯 Resultado Esperado

Uma tela de verificação 2FA premium com:
- ✨ 6 inputs individuais elegantes
- ⏱️ Timer de 5 minutos (formato mm:ss)
- 🔄 Sistema de reenvio com cooldown
- ❌ Controle de tentativas (máx 3)
- 🎯 Navegação dinâmica baseada no contexto
- 📋 Auto-submit ao completar
- 📱 Suporte a colar código
- 💜 Identidade visual iSelfToken
- 🎬 Animações sutis de erro
- ♿ Acessível e intuitivo

---

## 💡 Dicas de Segurança

1. **Backend**: Código deve ser de uso único
2. **Rate Limiting**: Limitar tentativas por IP
3. **Expiração**: Sempre validar timestamp no backend
4. **Tentativas**: Bloquear após 3 tentativas incorretas
5. **Logs**: Registrar todas as tentativas
6. **Email**: Usar templates profissionais
7. **Fallback**: Ter opção de suporte se necessário

---

*Prompt otimizado para criar uma tela de verificação 2FA segura e profissional - iSelfToken*
