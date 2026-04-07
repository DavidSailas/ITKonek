import React, { useRef, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { slides } from '../../src/features/onboarding/onboardingData';
import SlideItem from '../../src/components/onboarding/SlideItem';
import Pagination from '../../src/components/onboarding/Pagination';
import styles from '../../src/features/onboarding/onboarding.styles';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef();
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/login/page');
    }
  };

  const handleSkip = () => {
    router.replace('/login/page');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => <SlideItem item={item} index={index} scrollX={scrollX} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <Pagination data={slides} scrollX={scrollX} width={width} />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}