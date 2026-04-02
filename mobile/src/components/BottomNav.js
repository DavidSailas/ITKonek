import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import styles from './BottomNav.styles';
import { useRouter } from 'expo-router';

const tabs = [
  { name: 'home', icon: 'home', route: '/home/page' },
  { name: 'search', icon: 'search', route: '/search/page' },
  { name: 'chat', icon: 'chatbubble-outline', route: '/chat/page' },
  { name: 'profile', icon: 'person-outline', route: '/profile/page' },
];

function TabButton({ tab, isActive }) {
  const router = useRouter();
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    // Smooth spring-like transition for active tab
    progress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isActive]);

  const aniStyle = useAnimatedStyle(() => {
    const s = progress.value;
    const translateY = interpolate(s, [0, 1], [0, -10]);
    const scale = interpolate(s, [0, 1], [0.9, 1.05]);
    return {
      transform: [{ translateY }, { scale }],
      opacity: 0.95 + s * 0.05, // subtle fade
    };
  });

  const pressScale = useSharedValue(1);

    <TouchableOpacity
    onPressIn={() => { pressScale.value = withSpring(0.9); }}
    onPressOut={() => { pressScale.value = withSpring(1); handlePress(); }}
    ></TouchableOpacity>

  const handlePress = async () => {
    try {
      await router.push(tab.route);
    } catch (err) {
      console.error('BottomNav navigation failed for', tab.route, err);
    }
  };

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        {isActive ? (
          <Animated.View style={[styles.activeCircle, aniStyle]}>
            <Ionicons name={tab.icon} size={22} color="#fff" />
          </Animated.View>
        ) : (
          <Ionicons name={tab.icon} size={22} color="#888" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function BottomNav({ active }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.name}
          tab={tab}
          isActive={active === tab.name}
        />
      ))}
    </View>
  );
}