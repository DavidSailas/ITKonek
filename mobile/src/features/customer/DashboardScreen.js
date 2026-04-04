import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import styles from './DashboardScreen.styles';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import BottomNav from '../../components/BottomNav';

const { width } = Dimensions.get('window');

const SERVICE_DATA = [
  { id: '1', title: 'Motherboard Cleaning', image: require('../../assets/images/cleaning.png') },
  { id: '2', title: 'System Unit Repair', image: require('../../assets/images/reparing.png') },
  { id: '3', title: 'Software Fix', image: require('../../assets/images/software_fix.png') },
  { id: '4', title: 'Data Recovery', image: require('../../assets/images/data_recovery.png') },
];

const TECH_DATA = [
  { id: '1', name: 'Engr. Weston', specialty: 'Hardware Specialist', rating: '4.9', image: require('../../assets/images/technician.png') },
  { id: '2', name: 'Alex Rivera', specialty: 'Software Architect', rating: '4.8', image: require('../../assets/images/technician.png') },
];

const SCROLL_DATA = [...SERVICE_DATA, ...SERVICE_DATA, ...SERVICE_DATA];

export default function DashboardScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // --- QUICK ACTION HANDLER ---
  const handleQuickAction = (label) => {
    if (label === 'Book') {
      router.push('/home/booking/page'); 
    } else if (label === 'Track') {
      router.push('/home/tracking/page');
    } else if (label === 'Support') {
      router.push('/home/support/page');
    } else if (label === 'Invoices') {
      router.push('/home/invoices/page');
    }
  };

  useEffect(() => {
    const itemWidth = width * 0.45 + 15;
    const scrollDistance = SERVICE_DATA.length * itemWidth;

    const startScrolling = () => {
      scrollX.setValue(0);
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: 1,
          duration: 25000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startScrolling();

    const listener = scrollX.addListener(({ value }) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: value * scrollDistance,
          animated: false,
        });
      }
    });

    return () => scrollX.removeListener(listener);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFullName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
          }
        } catch (error) {
          console.log('Error fetching user:', error);
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      
      {/* FIXED HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hello, {fullName ? fullName : 'User'}</Text>
          <View style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
            <View style={styles.notificationDot} />
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput placeholder="Search IT Services..." style={styles.searchInput} />
        </View>
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        
        {/* CATEGORIES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {['Laptops', 'Desktops', 'Networking', 'Printers', 'Servers'].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ACTIVE SERVICE CARD */}
        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.9}>
          <Text style={styles.serviceLabel}>Active Request</Text>
          <Text style={styles.ticket}>#AB26-18KFA9</Text>
          <View style={styles.serviceRow}>
            <Image source={require('../../assets/images/technician.png')} style={styles.avatar} />
            <View>
              <Text style={styles.serviceTitle}>Laptop Repair</Text>
              <Text style={styles.serviceSub}>Eng. Weston • Arriving in 15m</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActions}>
          {[
            { icon: 'plus-circle', label: 'Book' }, 
            { icon: 'map', label: 'Track' }, 
            { icon: 'headphones', label: 'Support' }, 
            { icon: 'file-text', label: 'Invoices' }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionItem}
              onPress={() => handleQuickAction(item.label)}
            >
              <View style={styles.actionCircle}><Feather name={item.icon} size={20} /></View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* POPULAR SERVICES CAROUSEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false} style={{ marginBottom: 25 }}>
          {SCROLL_DATA.map((item, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <Image source={item.image} style={styles.gridImage} />
              <View style={styles.gridOverlay}>
                <Text style={styles.gridItemText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TOP RATED TECHNICIANS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated Technicians</Text>
        </View>
        {TECH_DATA.map((tech) => (
          <TouchableOpacity key={tech.id} style={styles.techCard}>
            <Image source={tech.image} style={styles.techImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.techName}>{tech.name}</Text>
              <Text style={styles.techSub}>{tech.specialty}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{tech.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* TRUST BANNER */}
        <View style={styles.trustBanner}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#111" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.trustTitle}>Service Warranty</Text>
            <Text style={styles.trustSub}>30-days guarantee on all repairs</Text>
          </View>
        </View>

      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
}