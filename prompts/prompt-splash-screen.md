---
description: tela incial do sistema
auto_execution_mode: 1
---

# 🎯 Prompt: Tela de Apresentação (Splash Screen) - iSelfToken

## 📋 Objetivo
Criar uma tela de apresentação minimalista e elegante que exibe apenas o logo da empresa iSelfToken com animações sutis e sofisticadas.

---

## 🎨 Especificações Visuais

### Layout
- **Fundo**: `Colors.background.primary` (#171719 - preto suave)
- **Centralização**: Logo perfeitamente centralizado vertical e horizontalmente
- **Minimalismo**: Sem textos, sem botões, apenas o logo

### Logo
- **Tamanho**: 120x120 pixels (responsivo)
- **Formato**: PNG ou SVG com transparência
- **Cor**: Magenta #d500f9 ou branco, dependendo do design
- **Posicionamento**: Centro absoluto da tela

---

## ✨ Animações Premium

### Animação de Entrada
1. **Fade In** (0-800ms)
   - Opacidade: 0 → 1
   - Duração: 800ms
   - Easing: ease-out

2. **Scale Up** (0-800ms)
   - Scale: 0.8 → 1
   - Duração: 800ms
   - Easing: spring bounce
   - Executa simultaneamente com fade

3. **Glow Sutil** (após entrada)
   - Shadow color: #d500f9
   - Shadow opacity: 0 → 0.3 → 0
   - Duração: 2000ms
   - Loop: infinito suave

### Animação de Saída (opcional)
- **Fade Out** + **Scale Down**
- Duração: 400ms
- Transição suave para próxima tela

---

## 📱 Estrutura do Componente

### Arquivo: `app/_layout.jsx` ou `app/index.jsx`

```javascript
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Image, 
  Animated, 
  StyleSheet,
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de brilho contínuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Navegar para próxima tela após 3 segundos
    const timer = setTimeout(() => {
      router.replace('/home'); // ou sua rota inicial
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              shadowOpacity: shadowOpacity,
            },
          ]}
        >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
});
```

---

## 🎯 Variações de Implementação

### Variação 1: Com Pulso Sutil
```javascript
// Adicionar animação de pulso
const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

// No style:
transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }]
```

### Variação 2: Com Rotação Suave
```javascript
const rotateAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(rotateAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

const rotation = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

// No style:
transform: [{ rotate: rotation }]
```

### Variação 3: Minimalista Puro (Mais Simples)
```javascript
export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      router.replace('/home');
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}
```

---

## 📦 Assets Necessários

### Logo da Empresa
**Localização**: `assets/logo.png` ou `assets/images/logo.png`

**Especificações**:
- Formato: PNG com transparência
- Tamanhos recomendados:
  - `logo.png` - 120x120px (@1x)
  - `logo@2x.png` - 240x240px (@2x)
  - `logo@3x.png` - 360x360px (@3x)
- Cores: Magenta #d500f9 ou branco sobre transparência

---

## ⚙️ Configuração Expo

### app.json
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#171719"
    }
  }
}
```

---

## 🎨 Melhorias Opcionais

### 1. Loading Indicator Sutil (após logo)
```javascript
<View style={styles.loadingContainer}>
  <ActivityIndicator 
    color={Colors.primary} 
    size="small"
    style={{ marginTop: 40 }}
  />
</View>
```

### 2. Versão com Texto (opcional)
```javascript
<Text style={styles.companyName}>iSelfToken</Text>

const styles = StyleSheet.create({
  companyName: {
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 2,
    marginTop: 20,
  },
});
```

### 3. Gradiente de Fundo
```javascript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={[
    Colors.background.primary,
    '#1a0a1f', // Tom roxo escuro sutil
    Colors.background.primary
  ]}
  style={styles.container}
>
  {/* Logo aqui */}
</LinearGradient>
```

---

## 🚀 Fluxo de Navegação

### Opção 1: Navegação Automática
```javascript
setTimeout(() => {
  router.replace('/home');
}, 3000);
```

### Opção 2: Com Verificação de Autenticação
```javascript
import { useAuth } from '../contexts/AuthContext';

const { isAuthenticated } = useAuth();

setTimeout(() => {
  if (isAuthenticated) {
    router.replace('/home');
  } else {
    router.replace('/onboarding');
  }
}, 3000);
```

### Opção 3: Com AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

useEffect(() => {
  const checkFirstLaunch = async () => {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    
    setTimeout(() => {
      if (hasLaunched) {
        router.replace('/home');
      } else {
        await AsyncStorage.setItem('hasLaunched', 'true');
        router.replace('/onboarding');
      }
    }, 3000);
  };
  
  checkFirstLaunch();
}, []);
```

---

## ✅ Checklist de Implementação

- [ ] Criar pasta `assets/` se não existir
- [ ] Adicionar logo.png (3 tamanhos se possível)
- [ ] Criar arquivo `app/index.jsx` ou `app/_layout.jsx`
- [ ] Implementar animações de entrada
- [ ] Configurar tempo de exibição (2-3 segundos)
- [ ] Definir rota de navegação pós-splash
- [ ] Testar em iOS e Android
- [ ] Ajustar timing das animações
- [ ] Verificar performance
- [ ] Configurar splash nativo no app.json

---

## 🎯 Resultado Esperado

Uma tela elegante e minimalista que:
- ✨ Exibe apenas o logo centralizado
- 🎬 Anima suavemente na entrada
- 💜 Mantém a identidade visual premium
- ⚡ Carrega rapidamente
- 🔄 Transita suavemente para próxima tela
- 📱 Funciona perfeitamente em todos os dispositivos

---

## 💡 Dicas Premium

1. **Timing**: 2.5-3 segundos é o ideal
2. **Performance**: Use `useNativeDriver: true` sempre que possível
3. **Consistência**: Mantenha o mesmo fundo da splash nativa
4. **Simplicidade**: Menos é mais - evite excesso de animações
5. **Teste**: Sempre teste em dispositivos reais

---

*Prompt otimizado para criar uma splash screen premium e sofisticada - iSelfToken*
