import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../../features/onboarding/onboarding.styles';

export default function SlideItem({ item }) {
  return (
    <View style={styles.slide}>
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}