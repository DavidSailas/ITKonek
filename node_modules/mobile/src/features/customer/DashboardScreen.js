import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  Image, Dimensions, Animated, Easing, StatusBar, ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { 
  doc, getDoc, collection, query, where, 
  onSnapshot, limit
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import BottomNav from '../../components/BottomNav';
import styles from './DashboardScreen.styles';

const { width } = Dimensions.get('window');

const SERVICE_DATA = [
  { id: '1', title: 'Motherboard Cleaning', image: require('../../assets/images/cleaning.png') },
  { id: '2', title: 'System Unit Repair', image: require('../../assets/images/reparing.png') },
  { id: '3', title: 'Software Fix', image: require('../../assets/images/software_fix.png') },
  { id: '4', title: 'Data Recovery', image: require('../../assets/images/data_recovery.png') },
];

const SCROLL_DATA = [...SERVICE_DATA, ...SERVICE_DATA, ...SERVICE_DATA];

export default function DashboardScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [activeService, setActiveService] = useState(null);
  const [history, setHistory] = useState([]);
  const [onlineEngineers, setOnlineEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // --- UI Helpers ---
  const getStatusTheme = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending payment': return { icon: 'wallet-outline', color: '#E65100', bg: '#FFF3E0', label: 'Payment Due' };
      case 'completed': return { icon: 'check-decagram', color: '#2E7D32', bg: '#E8F5E9', label: 'Fixed' };
      case 'cancelled': return { icon: 'close-octagon', color: '#D32F2F', bg: '#FFEBEE', label: 'Cancelled' };
      case 'pending': return { icon: 'clock-fast', color: '#666', bg: '#F5F5F5', label: 'Searching...' };
      case 'accepted': return { icon: 'shield-check-outline', color: '#1565C0', bg: '#E3F2FD', label: 'Engineer Assigned' };
      case 'on the way': return { icon: 'moped', color: '#1565C0', bg: '#E3F2FD', label: 'In Transit' };
      case 'arrived': return { icon: 'map-marker-check', color: '#2E7D32', bg: '#E8F5E9', label: 'At Location' };
      case 'in progress': return { icon: 'progress-wrench', color: '#111', bg: '#EEE', label: 'Repairing' };
      default: return { icon: 'dots-horizontal-circle', color: '#757575', bg: '#F5F5F5', label: status || 'Processing' };
    }
  };

  const getProgressWidth = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return '15%';
    if (s === 'accepted') return '35%';
    if (s === 'on the way') return '50%';
    if (s === 'arrived') return '70%';
    if (s === 'in progress') return '85%';
    if (s === 'pending payment') return '95%';
    return '0%';
  };

  // --- Banner Animation ---
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

  // --- Real-time Data Management ---
  useEffect(() => {
    let unsubActive = null;
    let unsubHistory = null;
    let unsubEngineers = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch simple user data
        getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
          if (docSnap.exists()) setFullName(docSnap.data().firstName);
        });

        // 1. Online Engineers Listener
        const qEngineers = query(
          collection(db, "users"),
          where("role", "==", "engineer"),
          where("isOnline", "==", true)
        );
        unsubEngineers = onSnapshot(qEngineers, async (snapshot) => {
          const engineersList = [];
          for (const userDoc of snapshot.docs) {
            const userData = userDoc.data();
            const profileRef = doc(db, 'users', userDoc.id, 'engineerProfile', 'details');
            const profileSnap = await getDoc(profileRef);
            engineersList.push({
              id: userDoc.id,
              ...userData,
              profile: profileSnap.exists() ? profileSnap.data() : {}
            });
          }
          setOnlineEngineers(engineersList);
        }, (err) => console.log("Engineers listener detached safely."));

        // 2. Active Bookings Listener
        const qActive = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          where("status", "in", ["Pending", "Accepted", "On the way", "Arrived", "In Progress", "Pending Payment"])
        );
        unsubActive = onSnapshot(qActive, (snapshot) => {
          setActiveService(!snapshot.empty ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null);
          setLoading(false);
        }, (err) => console.log("Active service listener detached safely."));

        // 3. History Listener
        const qHistory = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          where("status", "in", ["Completed", "Cancelled", "Failed"]),
          limit(5)
        );
        unsubHistory = onSnapshot(qHistory, (snapshot) => {
          setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => console.log("History listener detached safely."));

      } else {
        // KILL LISTENERS IMMEDIATELY ON LOGOUT
        if (unsubActive) unsubActive();
        if (unsubHistory) unsubHistory();
        if (unsubEngineers) unsubEngineers();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubActive) unsubActive();
      if (unsubHistory) unsubHistory();
      if (unsubEngineers) unsubEngineers();
    };
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF'}}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingHeader}>CONTROL CENTER</Text>
            <Text style={styles.greeting}>Hello, {fullName || 'Operator'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput placeholder="Search hardware support..." style={styles.searchInput} placeholderTextColor="#888" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {activeService && (
          <View style={styles.activeServiceWrapper}>
            <View style={styles.serviceHeader}>
              <View style={styles.liveIndicator}>
                <View style={[styles.liveDot, { backgroundColor: activeService.status === 'Pending Payment' ? '#EF4444' : '#4CAF50' }]} />
                <Text style={styles.liveText}>
                    {activeService.status === 'Pending Payment' ? 'ACTION REQUIRED' : 'ONGOING SERVICE'}
                </Text>
              </View>
              <Text style={styles.ticketId}>#{activeService.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.serviceMain}>
              <View style={styles.serviceInfo}>
                <Text style={styles.mainServiceTitle}>{activeService.serviceName}</Text>
                <Text style={styles.techStatus}>
                    {activeService.engineerName ? `Engr. ${activeService.engineerName}` : 'Assigning Engineer...'}
                </Text>
                <View style={[styles.miniStatusBadge, { backgroundColor: getStatusTheme(activeService.status).bg }]}>
                  <Text style={{ color: getStatusTheme(activeService.status).color, fontSize: 10, fontWeight: '800' }}>
                    {getStatusTheme(activeService.status).label.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Image 
                source={activeService.engineerPhoto ? { uri: activeService.engineerPhoto } : require('../../assets/images/technician.png')} 
                style={styles.activeAvatar} 
              />
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: getProgressWidth(activeService.status) }]} /> 
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.trackButton, activeService.status === 'Pending Payment' && { backgroundColor: '#111' }]} 
              onPress={() => router.push({ 
                pathname: activeService.status === 'Pending Payment' ? '/home/payment/page' : '/home/tracking/page', 
                params: { bookingId: activeService.id } 
              })}
            >
              <Text style={styles.trackButtonText}>
                {activeService.status === 'Pending Payment' ? 'Pay PHP ' + activeService.totalAmount : 'Track Progress'}
              </Text>
              <Feather name={activeService.status === 'Pending Payment' ? 'credit-card' : 'arrow-right'} size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickActions}>
          {[
            { icon: 'plus-circle', label: 'Book', path: '/home/booking/page' },
            { icon: 'map', label: 'Track', path: '/home/tracking/page' },
            { icon: 'tag', label: 'Pricing', path: '/home/pricing/page' },
            { icon: 'file-text', label: 'Invoices', path: '/home/invoices/page' }
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.actionItem} onPress={() => router.push(item.path)}>
              <View style={styles.actionCircle}><Feather name={item.icon} size={20} color="#111" /></View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Maintenance Catalog</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false} style={{ marginBottom: 25 }}>
          {SCROLL_DATA.map((item, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <Image source={item.image} style={styles.gridImage} />
              <View style={styles.gridOverlay}><Text style={styles.gridItemText}>{item.title}</Text></View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginBottom: 5 }]}>
          <Text style={styles.sectionTitle}>Online Engineers</Text>
          <TouchableOpacity onPress={() => router.push('/home/techlist/page')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {onlineEngineers.map((tech) => (
            <TouchableOpacity key={tech.id} style={styles.onlineTechCard}>
              <View style={styles.techImageContainer}>
                <Image 
                  source={tech.profile?.userPhoto ? { uri: tech.profile.userPhoto } : require('../../assets/images/technician.png')} 
                  style={styles.onlineTechImage} 
                />
                <View style={styles.onlineIndicatorDot} />
              </View>
              <View style={styles.techInfoCenter}>
                <Text style={styles.onlineNameText} numberOfLines={1}>Engr. {tech.firstName}</Text>
                <View style={styles.specialtyRow}>
                  <MaterialIcons name="verified" size={12} color="#1565C0" />
                  <Text style={styles.onlineSubText}>{tech.profile?.primaryRole || 'Hardware Expert'}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.requestActionBtn}
                onPress={() => router.push({
                  pathname: '/home/booking/page',
                  params: { 
                    engineerId: tech.id, 
                    engineerName: tech.firstName,
                    engineerPhoto: tech.profile?.userPhoto || ''
                  }
                })}
              >
                <Text style={styles.requestActionText}>Consult</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
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
                    <Text style={styles.historyTitle}>{item.serviceName}</Text>
                    <Text style={[styles.statusTagText, { color: theme.color }]}>{theme.label}</Text>
                  </View>
                  <Text style={styles.historyPrice}>PHP {item.totalAmount || '0'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyHistory}>
            <MaterialCommunityIcons name="history" size={32} color="#DDD" />
            <Text style={styles.emptyHistoryText}>No records found.</Text>
          </View>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}