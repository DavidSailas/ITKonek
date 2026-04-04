import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons'; 
import styles, { scale, verticalScale } from './BottomNav.styles'; // Import scaling utilities
import { useRouter, usePathname } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home', route: '/home/page' },
    { name: 'search', icon: 'search-outline', activeIcon: 'search', label: 'Search', route: '/search/page' },
    { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Chat', route: '/chat/page' },
    { name: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile', route: '/profile/page' },
  ];

  useEffect(() => {
    if (!pathname) return;
    const match = tabs.find(t => pathname.includes(t.name));
    if (match) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setActiveTab(match.name);
    }
  }, [pathname]);

  const handlePress = (tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActiveTab(tab.name);
    router.push(tab.route);
  };

  return (
    <View style={styles.container}>
      {/* SVG Background - Scaled proportionally */}
      <View style={{ position: 'absolute', bottom: 0 }}>
        <Svg width={screenWidth} height={verticalScale(80)} viewBox={`0 0 ${screenWidth} 80`}>
          <Path
            d={`M0 20 L${screenWidth} 20 L${screenWidth} 80 L0 80 Z`}
            fill="#1A1A1A"
          />
        </Svg>
      </View>

      <View style={styles.contentHolder}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.iconWrapper}
              onPress={() => handlePress(tab)}
              activeOpacity={0.8}
            >
              {isActive && (
                <View style={styles.activeCircle}>
                  <Ionicons name={tab.activeIcon} size={scale(28)} color="#1A1A1A" />
                </View>
              )}

              {!isActive && <Ionicons name={tab.icon} size={scale(24)} color="#fff" />}

              <Text style={isActive ? styles.label : styles.inactiveLabel}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNav;