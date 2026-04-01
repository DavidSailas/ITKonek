import React, { useEffect } from 'react';
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

  useEffect(() => {

    logoScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withTiming(1, {
      duration: 800,
    });

    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 800 });
      textTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, 400);

    const timer = setTimeout(() => {
      router.replace('/onboarding1/page');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/logo/logo.png')}
        style={[styles.logo, logoAnimatedStyle]}
        resizeMode="contain"
      />

      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.title}>ITKonek</Text>
        <Text style={styles.tagline}>By JMS One IT</Text>
      </Animated.View>
    </View>
  );
}