import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './LogoScreen.styles';
import { useRouter } from 'expo-router';

export default function LogoScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding1/page');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>ITKonek</Text>
      <Text style={styles.tagline}>By JMS One IT</Text>
    </View>
  );
}