// src/screens/onboarding/OnboardingScreen2.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import styles from './OnboardingScreen2.styles';
import { useRouter } from 'expo-router';

export default function OnboardingScreen2() {
  const router = useRouter();

  const handleNext = () => {
  router.push('/onboarding3/page'); // navigate to next onboarding screen
  };

  const handleSkip = () => {
  router.replace('/login/page'); // skip to login
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/technician.png')} // replace with your image
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Text Block */}
      <Text style={styles.title}>Book & Track Services</Text>
      <Text style={styles.description}>
        Schedule instantly and follow every step in real time
      </Text>

      {/* Pagination */}
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
  <Text style={styles.description}>This is the second onboarding screen.</Text>
    </View>
  );
}