/**
 * Componente de Loading Premium - iSelfToken
 * Exibido durante inicialização da autenticação
 * Design elegante sem flickers
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Colors } from '@/constants';

interface AuthLoadingProps {
  message?: string;
}

export function AuthLoading({ 
  message = 'Carregando...' 
}: AuthLoadingProps) {
  // Criar valores animados para cada quadrado (posição + rotação)
  // Posição inicial em formato de DIAMANTE mais agrupado
  const square1Pos = useRef(new Animated.ValueXY({ x: 0, y: -24 })).current;  // topo
  const square2Pos = useRef(new Animated.ValueXY({ x: -24, y: 0 })).current; // esquerda
  const square3Pos = useRef(new Animated.ValueXY({ x: 24, y: 0 })).current;  // direita
  const square4Pos = useRef(new Animated.ValueXY({ x: 0, y: 24 })).current;  // baixo
  
  const square1Rotate = useRef(new Animated.Value(45)).current;
  const square2Rotate = useRef(new Animated.Value(45)).current;
  const square3Rotate = useRef(new Animated.Value(45)).current;
  const square4Rotate = useRef(new Animated.Value(45)).current;
  
  // Referências para as animações (para cleanup)
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // Função para criar animação completa de 4 ciclos
    const createFourCycleAnimation = (
      position: Animated.ValueXY, 
      rotation: Animated.Value,
      expandPos: { x: number, y: number },
      originalPos: { x: number, y: number }
    ) => {
      // Sequência de 4 ciclos: cada ciclo afasta → rotaciona → reagrupa
      const animation = Animated.loop(
        Animated.sequence([
          // Ciclo 1: 45° → 135°
          Animated.sequence([
            // 1. Afastar (sem rotacionar)
            Animated.timing(position, {
              toValue: expandPos,
              duration: 400,
              useNativeDriver: true,
            }),
            // 2. Rotacionar (já afastado)
            Animated.timing(rotation, {
              toValue: 135,
              duration: 400,
              useNativeDriver: true,
            }),
            // 3. Reagrupar (mantendo rotação)
            Animated.timing(position, {
              toValue: originalPos,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          
          // Ciclo 2: 135° → 225°
          Animated.sequence([
            // 1. Afastar
            Animated.timing(position, {
              toValue: expandPos,
              duration: 400,
              useNativeDriver: true,
            }),
            // 2. Rotacionar
            Animated.timing(rotation, {
              toValue: 225,
              duration: 400,
              useNativeDriver: true,
            }),
            // 3. Reagrupar
            Animated.timing(position, {
              toValue: originalPos,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          
          // Ciclo 3: 225° → 315°
          Animated.sequence([
            // 1. Afastar
            Animated.timing(position, {
              toValue: expandPos,
              duration: 400,
              useNativeDriver: true,
            }),
            // 2. Rotacionar
            Animated.timing(rotation, {
              toValue: 315,
              duration: 400,
              useNativeDriver: true,
            }),
            // 3. Reagrupar
            Animated.timing(position, {
              toValue: originalPos,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          
          // Ciclo 4: 315° → 45° (completa 360°)
          Animated.sequence([
            // 1. Afastar
            Animated.timing(position, {
              toValue: expandPos,
              duration: 400,
              useNativeDriver: true,
            }),
            // 2. Rotacionar
            Animated.timing(rotation, {
              toValue: 405, // 315° + 90° = 405°
              duration: 400,
              useNativeDriver: true,
            }),
            // 3. Reagrupar + Reset
            Animated.parallel([
              Animated.timing(position, {
                toValue: originalPos,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(rotation, {
                toValue: 45, // Reset para 45°
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      );
      
      // Armazenar referência da animação
      animationsRef.current.push(animation);
      animation.start();
      
      return animation;
    };

    // Limpar animações anteriores
    animationsRef.current = [];

    // Iniciar animações para cada quadrado com gap maior (24px → 35px)
    createFourCycleAnimation(square1Pos, square1Rotate, { x: 0, y: -35 }, { x: 0, y: -24 });  // topo
    createFourCycleAnimation(square2Pos, square2Rotate, { x: -35, y: 0 }, { x: -24, y: 0 });  // esquerda
    createFourCycleAnimation(square3Pos, square3Rotate, { x: 35, y: 0 }, { x: 24, y: 0 });   // direita
    createFourCycleAnimation(square4Pos, square4Rotate, { x: 0, y: 35 }, { x: 0, y: 24 });   // baixo

    // Cleanup correto ao desmontar
    return () => {
      animationsRef.current.forEach(animation => {
        animation.stop();
      });
      animationsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {/* Container centralizado onde todos os quadrados se sobrepõem */}
      <View style={styles.squaresContainer}>
        <Animated.View 
          style={[
            styles.square, 
            {
              transform: [
                { translateX: square1Pos.x },
                { translateY: square1Pos.y },
                { rotate: square1Rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.square, 
            {
              transform: [
                { translateX: square2Pos.x },
                { translateY: square2Pos.y },
                { rotate: square2Rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.square, 
            {
              transform: [
                { translateX: square3Pos.x },
                { translateY: square3Pos.y },
                { rotate: square3Rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.square, 
            {
              transform: [
                { translateX: square4Pos.x },
                { translateY: square4Pos.y },
                { rotate: square4Rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
            }
          ]} 
        />
      </View>
      
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squaresContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  square: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
