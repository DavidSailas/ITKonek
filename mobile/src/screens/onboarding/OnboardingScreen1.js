import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './OnboardingScreen1.styles';
import { useRouter } from 'expo-router';

export default function OnboardingScreen1() {
  const router = useRouter();

  const handleNext = () => {
  router.push('/onboarding2/page'); 
  };

  const handleSkip = () => {
  router.replace('/login/page');
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Featured Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/technician.png')} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Text Block */}
      <Text style={styles.title}>IT Services In One App</Text>
      <Text style={styles.description}>
        Find and book trusted IT related services near you in just a few taps away.
      </Text>

      {/* Pagination Indicator */}
      <View style={styles.pagination}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}