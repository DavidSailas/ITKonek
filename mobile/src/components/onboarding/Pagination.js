import React from 'react';
import { View, Animated } from 'react-native';
import styles from '../../features/onboarding/onboarding.styles';

export default function Pagination({ data, scrollX, width }) {
  return (
    <View style={styles.pagination}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const widthAnim = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacityAnim = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[styles.dot, { width: widthAnim, opacity: opacityAnim }]}
          />
        );
      })}
    </View>
  );
}