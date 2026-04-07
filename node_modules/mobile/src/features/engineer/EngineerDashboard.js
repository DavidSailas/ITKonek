import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image,
  StatusBar, Switch, ActivityIndicator, Alert, Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { 
  doc, getDoc, collection, query, where, 
  onSnapshot, updateDoc, serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import BottomNav from '../../components/BottomNav';
import styles from './EngineerDashboard.styles';

const avatarPlaceholder = require('../../assets/images/avatar_neutral.png');

export default function EngineerDashboard() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [incomingJobs, setIncomingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [performance, setPerformance] = useState({ 
    efficiency: '94%', 
    jobsDone: '08', 
    rating: '4.8',
    techsOnline: 15
  });

  const getStatusTheme = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'in progress': return { color: '#1565C0', bg: '#E3F2FD' };
      case 'on the way': return { color: '#F9A825', bg: '#FFFDE7' };
      case 'accepted': return { color: '#2E7D32', bg: '#E8F5E9' };
      default: return { color: '#111', bg: '#F3F4F6' };
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 1. Get Engineer Profile
        getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFullName(data.firstName);
            setProfilePic(data.profileImage);
            setIsOnline(data.isOnline || false);
          }
        });

        // 2. Real-time Incoming Jobs (Not yet assigned)
        const qPending = query(
          collection(db, "bookings"),
          where("status", "==", "Pending"),
          where("engineerId", "==", null)
        );
        const unsubJobs = onSnapshot(qPending, (snapshot) => {
          setIncomingJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });

        // 3. Real-time Active Job (Assigned to THIS engineer)
        const qActive = query(
          collection(db, "bookings"),
          where("engineerId", "==", user.uid),
          where("status", "in", ["Accepted", "On the way", "Arrived", "In Progress"])
        );
        const unsubActive = onSnapshot(qActive, (snapshot) => {
          if (!snapshot.empty) {
            setActiveJob({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
          } else {
            setActiveJob(null);
          }
        });

        return () => { unsubJobs(); unsubActive(); };
      }
    });
    return unsubscribeAuth;
  }, []);

  // --- ACTION HANDLERS ---

  const handleAcceptJob = async (jobId) => {
    const user = auth.currentUser;
    if (!isOnline) {
      Alert.alert("System Offline", "You must toggle your status to ONLINE to claim tasks.");
      return;
    }

    try {
      await updateDoc(doc(db, "bookings", jobId), {
        engineerId: user.uid,
        engineerName: fullName,
        status: "Accepted",
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Task Secured", "Mission parameters synced. Proceed to control panel.");
    } catch (error) {
      console.error("Error claiming task:", error);
      Alert.alert("Error", "Could not claim task. It may have been taken by another node.");
    }
  };

  const handleDeclineJob = (jobId) => {
    Alert.alert(
      "Decline Request",
      "Are you sure you want to skip this hardware request?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Skip", 
          style: "destructive", 
          onPress: () => {
            // Filter locally so it disappears from the current session view
            setIncomingJobs(prev => prev.filter(job => job.id !== jobId));
          } 
        }
      ]
    );
  };

  const toggleOnlineStatus = async (value) => {
    setIsOnline(value);
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { isOnline: value });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfoRow}>
            <View style={styles.profilePicWrapper}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profileLetter}>{fullName?.charAt(0) || 'E'}</Text>
                </View>
              )}
              <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#4CAF50' : '#777' }]} />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.greeting}>SYSTEM OPERATOR</Text>
              <Text style={styles.engName}>Engr. {fullName || 'Technician'}</Text>
            </View>
          </View>

          <View style={styles.statusToggleContainer}>
             <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#333', true: '#4CAF50' }}
              thumbColor={'#FFF'}
            />
            <Text style={[styles.statusToggleText, { color: isOnline ? '#4CAF50' : '#777' }]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        <View style={styles.systemStatusRow}>
          <View style={[styles.pulseDot, { backgroundColor: isOnline ? '#4CAF50' : '#777' }]} />
          <Text style={styles.systemStatusText}>
            Enterprise Link Active • {performance.techsOnline} Nodes Online
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
               <Feather name="zap" size={12} color="#4CAF50" />
               <Text style={styles.statLabel}>EFFICIENCY</Text>
            </View>
            <Text style={styles.statValue}>{performance.efficiency}</Text>
            <Text style={styles.statSub}>Performance</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
               <Feather name="layers" size={12} color="#2196F3" />
               <Text style={styles.statLabel}>QUEUE</Text>
            </View>
            <Text style={styles.statValue}>{incomingJobs.length < 10 ? `0${incomingJobs.length}` : incomingJobs.length}</Text>
            <Text style={styles.statSub}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
               <Ionicons name="star" size={12} color="#FFD700" />
               <Text style={styles.statLabel}>QUALITY</Text>
            </View>
            <Text style={styles.statValue}>{performance.rating}</Text>
            <Text style={styles.statSub}>Avg. Rating</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        
        {/* ACTIVE ASSIGNMENT - TOP PRIORITY CARD */}
        {activeJob && (
          <View style={styles.activeServiceWrapper}>
            <View style={styles.serviceHeader}>
              <View style={styles.liveIndicator}>
                <View style={[styles.liveDot, {backgroundColor: '#1565C0'}]} />
                <Text style={[styles.liveText, {color: '#1565C0'}]}>MISSION CRITICAL</Text>
              </View>
              <Text style={styles.ticketId}>#{activeJob.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            
            <View style={styles.serviceMain}>
              <View style={styles.serviceInfo}>
                <Text style={styles.mainServiceTitle}>{activeJob.serviceName}</Text>
                <Text style={styles.techStatus}>Client: {activeJob.userName || 'Customer'}</Text>
                <View style={styles.locationBadge}>
                   <Ionicons name="location-sharp" size={14} color="#888" />
                   <Text style={styles.locationText} numberOfLines={1}>{activeJob.address}</Text>
                </View>
              </View>
              <View style={[styles.statusTag, {backgroundColor: getStatusTheme(activeJob.status).bg}]}>
                 <Text style={[styles.statusTagText, {color: getStatusTheme(activeJob.status).color}]}>
                    {activeJob.status}
                 </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.trackButton} 
              onPress={() => router.push({ pathname: '/workspace/jobdetail/page', params: { id: activeJob.id } })}
            >
              <Text style={styles.trackButtonText}>Open Control Panel</Text>
              <Feather name="terminal" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Incoming Requests</Text>
            <Text style={styles.sectionSub}>Nearby hardware failures detected</Text>
          </View>
        </View>

        {/* INCOMING REQUESTS LIST */}
        {loading ? (
            <ActivityIndicator color="#111" style={{ marginTop: 20 }} />
        ) : incomingJobs.length > 0 ? (
            incomingJobs.map((job) => (
                <View key={job.id} style={styles.jobCard}>
                    <View style={styles.jobCardTop}>
                        <View style={{flex: 1}}>
                            <Text style={styles.jobCardTitle}>{job.serviceName}</Text>
                            <View style={styles.tagRow}>
                                <View style={styles.miniTag}>
                                  <Text style={styles.miniTagText}>{job.urgency?.toUpperCase() || 'STANDARD'}</Text>
                                </View>
                                <View style={[styles.miniTag, {backgroundColor: '#FEF2F2'}]}>
                                  <Text style={[styles.miniTagText, {color: '#DC2626'}]}>EST. {job.paymentMethod === 'Card' ? 'Card' : 'E-Wallet'}</Text>
                                </View>
                            </View>
                        </View>
                        <Image 
                          source={job.userPhoto ? { uri: job.userPhoto } : avatarPlaceholder} 
                          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6' }} 
                        />
                    </View>
                    
                    <View style={styles.jobDetailRow}>
                       <Ionicons name="person-outline" size={14} color="#666" />
                       <Text style={styles.jobDetailText}>{job.userName || 'Client Request'}</Text>
                    </View>

                    <View style={styles.jobCardFooter}>
                        <View style={styles.timeInfo}>
                            <Feather name="map-pin" size={12} color="#AAA" />
                            <Text style={styles.timeText} numberOfLines={1}>{job.address?.split(',')[0] || 'Location Shared'}</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          {/* DECLINE ACTION */}
                          <TouchableOpacity 
                            style={[styles.acceptBtn, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#EEE' }]}
                            onPress={() => handleDeclineJob(job.id)}
                          >
                              <Text style={[styles.acceptBtnText, { color: '#666' }]}>Skip</Text>
                          </TouchableOpacity>

                          {/* ACCEPT ACTION */}
                          <TouchableOpacity 
                            style={styles.acceptBtn}
                            onPress={() => handleAcceptJob(job.id)}
                          >
                              <Text style={styles.acceptBtnText}>Claim Task</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))
        ) : (
            <View style={styles.emptyHistory}>
                <MaterialCommunityIcons name="radar" size={40} color="#DDD" />
                <Text style={styles.emptyHistoryText}>Scanning for hardware issues...</Text>
            </View>
        )}
      </ScrollView>

      <BottomNav isEngineer={true} />
    </View>
  );
}