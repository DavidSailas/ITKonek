import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import styles from './DashboardScreen.styles';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import BottomNav from '../../components/BottomNav';

export default function DashboardScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // ✅ SAFE fallback if fields missing
            const firstName = data.firstName || '';
            const lastName = data.lastName || '';

            setFullName(`${firstName} ${lastName}`.trim());
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
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>
            Hello, {fullName ? fullName : 'User'}
          </Text>

          <View style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
            <View style={styles.notificationDot} />
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            placeholder="Laptop Screen Repair..."
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.body}>
        
        {/* ACTIVE SERVICE CARD */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceLabel}>Current Service</Text>
          <Text style={styles.ticket}>#AB26-18KFA9</Text>

          <View style={styles.serviceRow}>
            <Image
              source={require('../../assets/images/technician.png')}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.serviceTitle}>Laptop Repair</Text>
              <Text style={styles.serviceSub}>Eng. Weston</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <View style={styles.cardBtn} />
            <View style={styles.cardBtn} />
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActions}>
          {[
            { icon: 'plus-circle', label: 'Book' },
            { icon: 'map', label: 'Track' },
            { icon: 'headphones', label: 'Support' },
            { icon: 'heart', label: 'Favorites' },
          ].map((item, index) => (
            <View key={index} style={styles.actionItem}>
              <View style={styles.actionCircle}>
                <Feather name={item.icon} size={20} />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* POPULAR SERVICES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {/* CATEGORY CHIPS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipsContainer}>
            {['Repairing', 'Installation', 'Networking', 'Cleaning'].map(
              (item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                </View>
              )
            )}
          </View>
        </ScrollView>

        {/* SERVICE GRID */}
        <View style={styles.grid}>
          <View style={styles.gridItem} />
          <View style={styles.gridItem} />
        </View>

      </ScrollView>

  {/* ✅ NEW PROFESSIONAL BOTTOM NAV */}
  <BottomNav active="home" />

    </View>
  );
}
