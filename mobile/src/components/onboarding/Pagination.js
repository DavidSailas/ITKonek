import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';

export default function Pagination({ data, scrollX, width }) {
  return (
    <View style={styles.pagination}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const animatedStyle = useAnimatedStyle(() => {
          const w = interpolate(scrollX.value, inputRange, [10, 20, 10]);
          const o = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);
          return {
            width: w,
            opacity: o,
          };
        });

        return <Animated.View key={i.toString()} style={[styles.dot, animatedStyle]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
});