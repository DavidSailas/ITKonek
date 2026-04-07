import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons'; 
import styles, { scale, verticalScale } from './BottomNav.styles';
import { useRouter, usePathname } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');

const BottomNav = ({ isEngineer = false }) => {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();
  const pathname = usePathname();

  const customerTabs = [
    { name: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home', route: '/home/page' },
    { name: 'search', icon: 'search-outline', activeIcon: 'search', label: 'Search', route: '/search/page' },
    { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Chat', route: '/chat/page' },
    { name: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile', route: '/profile/page' },
  ];

  const engineerTabs = [
    { name: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home', route: '/engineer/dashboard' },
    { name: 'jobs', icon: 'briefcase-outline', activeIcon: 'briefcase', label: 'Jobs', route: '/engineer/jobs' },
    { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Chat', route: '/engineer/chat' },
    { name: 'schedule', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Schedule', route: '/engineer/schedule' },
    { name: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile', route: '/engineer/profile' },
  ];

  const currentTabs = isEngineer ? engineerTabs : customerTabs;

  useEffect(() => {
    if (!pathname) return;
    const match = currentTabs.find(t => pathname.includes(t.name));
    if (match) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setActiveTab(match.name);
    }
  }, [pathname, isEngineer]);

  const handlePress = (tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActiveTab(tab.name);
    router.push(tab.route);
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', bottom: 0 }}>
        <Svg width={screenWidth} height={verticalScale(85)} viewBox={`0 0 ${screenWidth} 85`}>
          <Path
            d={`M0 25 L${screenWidth} 25 L${screenWidth} 85 L0 85 Z`}
            fill="#1A1A1A" 
          />
        </Svg>
      </View>

      <View style={styles.contentHolder}>
        {currentTabs.map((tab) => {
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
                  <Ionicons name={tab.activeIcon} size={scale(22)} color="#1A1A1A" />
                </View>
              )}

              {!isActive && (
                <Ionicons name={tab.icon} size={scale(20)} color="#FFF" />
              )}

              <Text 
                numberOfLines={1} 
                style={[
                    isActive ? styles.label : styles.inactiveLabel,
                    { color: isActive ? '#FFF' : '#AAA' } 
                ]}
              >
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