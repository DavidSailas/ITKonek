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
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './DashboardScreen.styles';
import BottomNav from '../../components/BottomNav';

const { width } = Dimensions.get('window');

const SERVICE_DATA = [
  { id: '1', title: 'Motherboard Cleaning', image: require('../../assets/images/cleaning.png') },
  { id: '2', title: 'System Unit Repair', image: require('../../assets/images/reparing.png') },
  { id: '3', title: 'Software Fix', image: require('../../assets/images/software_fix.png') },
  { id: '4', title: 'Data Recovery', image: require('../../assets/images/data_recovery.png') },
];

const ONLINE_TECH = [
  { id: '1', name: 'Engr. Mark Anthony Dela Cruz', specialty: 'Master Logic Board Tech', distance: 'Cebu City', image: require('../../assets/images/technician.png') },
  { id: '2', name: 'Engr. Maria Angela Lopez', specialty: 'Network Architect', distance: 'Mandaue City', image: require('../../assets/images/technician.png') },
  { id: '3', name: 'Engr. John Carlo Santos', specialty: 'Performance Engineer', distance: 'Lapu-Lapu City', image: require('../../assets/images/technician.png') },
  { id: '4', name: 'Engr. Jennifer Mae Villanueva', specialty: 'Hardware Diagnostic Expert', distance: 'Talisay City', image: require('../../assets/images/technician.png') },
  { id: '5', name: 'Engr. Michael Angelo Reyes', specialty: 'Data Recovery Specialist', distance: 'Consolacion', image: require('../../assets/images/technician.png') },
];

const SCROLL_DATA = [...SERVICE_DATA, ...SERVICE_DATA, ...SERVICE_DATA];

export default function DashboardScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [activeService, setActiveService] = useState(null);
  const [history, setHistory] = useState([]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const getStatusTheme = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'completed': return { icon: 'check-decagram', color: '#2E7D32', bg: '#E8F5E9', label: 'Completed' };
      case 'cancelled': return { icon: 'close-octagon', color: '#D32F2F', bg: '#FFEBEE', label: 'Cancelled' };
      case 'failed': return { icon: 'alert-decagram', color: '#E65100', bg: '#FFF3E0', label: 'Failed' };
      case 'pending': return { icon: 'clock-fast', color: '#F9A825', bg: '#FFFDE7', label: 'Pending' };
      case 'in progress': return { icon: 'progress-wrench', color: '#1565C0', bg: '#E3F2FD', label: 'In Progress' };
      default: return { icon: 'dots-horizontal-circle', color: '#757575', bg: '#F5F5F5', label: status || 'Processed' };
    }
  };

  const getProgressWidth = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return '25%';
    if (s === 'active' || s === 'accepted') return '60%';
    if (s === 'on the way') return '80%';
    if (s === 'in progress') return '95%';
    return '15%';
  };

  const handleQuickAction = (label) => {
    const routes = {
      'Book': '/home/booking/page',
      'Track': '/home/tracking/page',
      'Pricing': '/home/pricing/page',
      'Invoices': '/home/invoices/page',
    };
    if (routes[label]) router.push(routes[label]);
  };

  useEffect(() => {
    const itemWidth = width * 0.45 + 15;
    const scrollDistance = SERVICE_DATA.length * itemWidth;
    const animation = Animated.loop(
      Animated.timing(scrollX, { toValue: 1, duration: 25000, easing: Easing.linear, useNativeDriver: true })
    );
    animation.start();
    const listener = scrollX.addListener(({ value }) => {
      if (scrollViewRef.current) scrollViewRef.current.scrollTo({ x: value * scrollDistance, animated: false });
    });
    return () => { scrollX.removeListener(listener); animation.stop(); };
  }, []);

  // --- CRITICAL STEP: FIXING FIREBASE LISTENERS ---
  useEffect(() => {
    let unsubActive = () => {};
    let unsubHistory = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch static user data
        getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
          if (docSnap.exists()) setFullName(docSnap.data().firstName);
        }).catch(err => console.log("User fetch error:", err));

        // Listener for Active Bookings
        const qActive = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          where("status", "in", ["Pending", "pending", "Accepted", "On the way", "Arrived", "In Progress"])
        );

        unsubActive = onSnapshot(qActive, (snapshot) => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            setActiveService({ id: snapshot.docs[0].id, ...docData });
          } else {
            setActiveService(null);
          }
        }, (error) => console.log("Active snapshot error handled"));

        // Listener for History
        const qHistory = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          where("status", "in", ["Completed", "completed", "Cancelled", "cancelled", "Failed", "failed"]),
          limit(5)
        );

        unsubHistory = onSnapshot(qHistory, (snapshot) => {
          const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHistory(historyData);
        }, (error) => console.log("History snapshot error handled"));

      } else {
        // If user is null (signed out), clean up local state
        setFullName('');
        setActiveService(null);
        setHistory([]);
      }
    });

    // Final Cleanup: stop listening to everything when the component is destroyed
    return () => {
      unsubscribeAuth();
      unsubActive();
      unsubHistory();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hello, {fullName || 'User'}</Text>
          <TouchableOpacity style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput placeholder="Search IT Services..." style={styles.searchInput} placeholderTextColor="#888" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        
        {activeService && (
          <View style={styles.activeServiceWrapper}>
            <View style={styles.serviceHeader}>
              <View style={styles.liveIndicator}><View style={styles.liveDot} /><Text style={styles.liveText}>ONGOING SERVICE</Text></View>
              <Text style={styles.ticketId}>#{activeService.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.serviceMain}>
              <View style={styles.serviceInfo}>
                <Text style={styles.mainServiceTitle}>{activeService.serviceName || 'Service'}</Text>
                <Text style={styles.techStatus}>Engineer: {activeService.engineerName || 'Assigning...'}</Text>
                <Text style={styles.techStatus}>Status: {activeService.status}</Text>
              </View>
              <Image source={require('../../assets/images/technician.png')} style={styles.activeAvatar} />
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: getProgressWidth(activeService.status) }]} /> 
              </View>
            </View>
            <TouchableOpacity style={styles.trackButton} onPress={() => router.push({ pathname: '/home/tracking/page', params: { bookingId: activeService.id } })}>
              <Text style={styles.trackButtonText}>Track Progress</Text>
              <Feather name="arrow-right" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[{ icon: 'plus-circle', label: 'Book' }, { icon: 'map', label: 'Track' }, { icon: 'tag', label: 'Pricing' }, { icon: 'file-text', label: 'Invoices' }].map((item, index) => (
            <TouchableOpacity key={index} style={styles.actionItem} onPress={() => handleQuickAction(item.label)}>
              <View style={styles.actionCircle}><Feather name={item.icon} size={20} color="#111" /></View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <TouchableOpacity onPress={() => router.push('/home/services/all')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef} 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          scrollEnabled={false} 
          style={{ marginBottom: 25 }}
        >
          {SCROLL_DATA.map((item, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <Image source={item.image} style={styles.gridImage} />
              <View style={styles.gridOverlay}>
                <Text style={styles.gridItemText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginBottom: 5 }]}>
          <Text style={styles.sectionTitle}>Online Technicians</Text>
          <TouchableOpacity onPress={() => router.push('/home/techlist/page')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {ONLINE_TECH.slice(0, 5).map((tech) => (
            <TouchableOpacity key={tech.id} style={styles.onlineTechCard}>
              <View style={styles.techImageContainer}>
                <Image source={tech.image} style={styles.onlineTechImage} />
                <View style={styles.onlineIndicatorDot} />
              </View>
              <View style={styles.techInfoCenter}>
                <Text style={styles.onlineNameText} numberOfLines={1}>{tech.name}</Text>
                <View style={styles.specialtyRow}>
                  <MaterialIcons name="verified" size={12} color="#1565C0" />
                  <Text style={styles.onlineSubText}>{tech.specialty}</Text>
                </View>
              </View>
              <View style={styles.distanceRow}>
                <View style={styles.statusBadge}><View style={styles.statusDotGreen} /><Text style={styles.onlineStatusText}>Online</Text></View>
                <Text style={styles.dotSeparator}>•</Text>
                <View style={styles.locationBadge}><Ionicons name="navigate-outline" size={10} color="#888" /><Text style={styles.onlineDistanceText}>{tech.distance}</Text></View>
              </View>

              <TouchableOpacity 
                style={styles.requestActionBtn}
                onPress={() => router.push({
                  pathname: '/home/booking/page',
                  params: { engineerName: tech.name, serviceName: tech.specialty }
                })}
              >
                <Text style={styles.requestActionText}>Request Service</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginTop: 15 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        {history.length > 0 ? (
          <View style={styles.historyContainer}>
            {history.map((item) => {
              const theme = getStatusTheme(item.status);
              return (
                <TouchableOpacity key={item.id} style={styles.historyItem}>
                  <View style={[styles.historyIconBox, { backgroundColor: theme.bg }]}>
                    <MaterialCommunityIcons name={theme.icon} size={22} color={theme.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.historyTitle}>{item.serviceName || 'Technical Support'}</Text>
                    <View style={styles.statusBadgeContainer}>
                       <Text style={[styles.statusTagText, { color: theme.color }]}>{theme.label}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#CCC" />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyHistory}>
            <MaterialCommunityIcons name="history" size={40} color="#EEE" />
            <Text style={styles.emptyHistoryText}>No past activities found.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
}