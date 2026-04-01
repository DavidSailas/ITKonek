// src/screens/onboarding/OnboardingScreen3.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import styles from './OnboardingScreen3.styles';
import { useRouter } from 'expo-router';

export default function OnboardingScreen3() {
  const router = useRouter();

  const handleStart = () => {
  router.replace('/login/page'); // Navigate to Login or main app
  };

  return (
    <View style={styles.container}>
      {/* No skip button on final screen */}

      {/* Main Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/technician.png')} // replace with your image
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Text Block */}
        <Text style={styles.title}>Onboarding 3</Text>
        <Text style={styles.description}>Final onboarding step.</Text>

      {/* Pagination */}
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Start Button */}
  <TouchableOpacity style={styles.nextButton} onPress={() => router.replace('/login/page')}>
          <Text style={styles.nextButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}