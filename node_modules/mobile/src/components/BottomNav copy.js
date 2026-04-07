import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons'; 
import { styles } from './BottomNav.styles';
import { useRouter, usePathname } from 'expo-router';

// Enable LayoutAnimation for Android
if (typeof Platform !== 'undefined' && Platform && Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
      // Smoothly animate the transition when the route changes
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setActiveTab(match.name);
    }
  }, [pathname]);

  const handlePress = (tab) => {
    // Simple, clean animation trigger
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActiveTab(tab.name);
    router.push(tab.route);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {/* SVG Background - Clean Black foundation */}
      <View style={{ position: 'absolute', bottom: 0 }}>
        <Svg width={screenWidth} height={80} viewBox={`0 0 ${screenWidth} 80`}>
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
              {/* This circle now slides smoothly between tabs */}
              {isActive && (
                <View style={styles.activeCircle}>
                  <Ionicons name={tab.activeIcon} size={28} color="#1A1A1A" />
                </View>
              )}

              {!isActive && <Ionicons name={tab.icon} size={24} color="#fff" />}

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