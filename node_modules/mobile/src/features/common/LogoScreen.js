import React, { useEffect, useRef } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './LogoScreen.styles';
import { useRouter } from 'expo-router';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function LogoScreen() {
  const router = useRouter();

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);

  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  // refs to keep track of timers and to avoid starting animation twice
  const navTimerRef = useRef(null);
  const textTimerRef = useRef(null);
  const startedRef = useRef(false);

  // Start the animation sequence only after the image has finished loading.
  const startAnimations = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    logoScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withTiming(1, {
      duration: 800,
    });

    textTimerRef.current = setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 800 });
      textTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, 400);

    navTimerRef.current = setTimeout(() => {
      router.replace('/onboarding/page');
    }, 2500);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const screenOpacity = useSharedValue(0);

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      if (textTimerRef.current) clearTimeout(textTimerRef.current);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <Animated.Image
        source={require('../../assets/logo/logo.png')}
        style={[styles.logo, logoAnimatedStyle]}
        resizeMode="contain"
        onLoad={startAnimations}
      />

      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.title}>ITKonek</Text>
        <Text style={styles.tagline}>By JMS One IT</Text>
      </Animated.View>
    </Animated.View>
  );
}