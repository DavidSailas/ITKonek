import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import styles from '../../features/onboarding/onboarding.styles';

const { width } = Dimensions.get('window');

export default function SlideItem({ item, index, scrollX }) {
  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.95, 1, 0.95]);
    const translateY = interpolate(scrollX.value, inputRange, [10, -20, 10]);
    const rotateY = interpolate(scrollX.value, inputRange, [-15, 0, 15]);
    return {
      transform: [
        { perspective: 1000 },
        { scale },
        { translateY },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const imgScale = interpolate(scrollX.value, inputRange, [0.95, 1.15, 0.95]);
    const imgTranslateY = interpolate(scrollX.value, inputRange, [5, -35, 5]);
    return {
      transform: [
        { scale: imgScale },
        { translateY: imgTranslateY },
      ],
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.imageWrapper, wrapperAnimatedStyle]}>
        <Animated.Image
          source={item.image}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
      </Animated.View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}