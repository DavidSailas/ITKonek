import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

// Firebase imports
import { db, auth } from '../../services/firebase'; 
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore';

import styles from './TrackingScreen.styles';

export default function TrackingScreen() {
  const router = useRouter();
  const mapRef = useRef(null);

  // States
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [engineerLocation, setEngineerLocation] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [noBookingModalVisible, setNoBookingModalVisible] = useState(false);

  // 1. Setup Tracking and Firestore Listener
  useEffect(() => {
    let unsubscribe;

    const setupTracking = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          router.back();
          return;
        }

        const initialLoc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: initialLoc.coords.latitude,
          longitude: initialLoc.coords.longitude,
        });

        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid),
            where("status", "in", ["Pending", "Active", "On the way", "Accepted"]),
            orderBy("createdAt", "desc"),
            limit(1)
          );

          unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
              setActiveBooking(data);
              setNoBookingModalVisible(false); // Hide "No Booking" if one is found
              
              if (data.engineerLat && data.engineerLng) {
                setEngineerLocation({
                  latitude: data.engineerLat,
                  longitude: data.engineerLng
                });
              }
            } else {
              setActiveBooking(null);
              setNoBookingModalVisible(true); // Show professional modal if empty
            }
            setLoading(false);
          });
        }
      } catch (err) {
        console.error("Tracking Error:", err);
        setLoading(false);
      }
    };

    setupTracking();
    return () => unsubscribe && unsubscribe();
  }, []);

  // 2. Cancellation Logic
  const handleCancelBooking = async () => {
    try {
      if (activeBooking) {
        await updateDoc(doc(db, "bookings", activeBooking.id), {
          status: 'Cancelled'
        });
        setCancelModalVisible(false);
        router.replace('/home/page');
      }
    } catch (error) {
      console.error("Cancel Error:", error);
    }
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>Connecting to Engineer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* MAP SECTION */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...userLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={mapStyle}
      >
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userLocationContainer}>
              <View style={styles.userDot} />
            </View>
          </Marker>
        )}

        {engineerLocation && (
          <>
            <Polyline
              coordinates={[engineerLocation, userLocation]}
              strokeColor="#111"
              strokeWidth={3}
              lineDashPattern={[1]}
            />
            <Marker coordinate={engineerLocation} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.engineerMarkerWrapper}>
                <View style={styles.engineerMarkerPin}>
                  <MaterialCommunityIcons name="moped" size={16} color="#FFF" />
                </View>
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText}>ENGINEER</Text>
                </View>
              </View>
            </Marker>
          </>
        )}
      </MapView>

      {/* FLOATING HEADER */}
      <SafeAreaView style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* BOOKING INFO CARD */}
      {activeBooking && (
        <View style={styles.infoCard}>
          <View style={styles.pullBar} />
          <View style={styles.headerRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusLabel}>{activeBooking.status.toUpperCase()}</Text>
            </View>
            <View style={styles.etaBadge}>
              <Feather name="clock" size={12} color="#374151" />
              <Text style={styles.etaText}> ETA: 5-10 MINS</Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>
            {activeBooking.status === "On the way" ? "Technician is moving" : "Finding Best Route"}
          </Text>
          <Text style={styles.subTitle}>
            {activeBooking.engineerName} is heading to your location for {activeBooking.serviceName} service.
          </Text>

          <View style={styles.divider} />

          <View style={styles.profileSection}>
            <Image 
              source={require('../../assets/images/technician.png')} 
              style={styles.avatar} 
            />
            <View style={styles.profileText}>
              <Text style={styles.nameText}>{activeBooking.engineerName}</Text>
              <Text style={styles.specialtyText}>Verified Professional</Text>
            </View>
            <TouchableOpacity style={styles.callCircle}>
              <Feather name="phone" size={18} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.secondaryBtn}
              onPress={() => router.push({ pathname: '/home/booking/page', params: { isEditing: 'true', ...activeBooking } })}
            >
              <Feather name="edit-3" size={16} color="#111" />
              <Text style={styles.btnText}>Modify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCancelModalVisible(true)}>
              <Feather name="x-circle" size={16} color="#DC2626" />
              <Text style={[styles.btnText, { color: '#DC2626' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.messageBtn} 
            onPress={() => router.push('/chat/page')}
          >
            <MaterialCommunityIcons name="chat-processing" size={22} color="#FFF" />
            <Text style={styles.messageBtnText}>Message Engineer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PROFESSIONAL NO BOOKING MODAL */}
      <Modal animationType="fade" transparent visible={noBookingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.professionalModal}>
            <View style={styles.noBookingIconBg}>
              <MaterialCommunityIcons name="shield-search" size={40} color="#111" />
            </View>
            <Text style={styles.modalTitle}>No Active Sessions</Text>
            <Text style={styles.modalSubText}>
              You don't have any ongoing repairs. Start a new request to connect with a technician.
            </Text>

            <View style={styles.benefitList}>
              <View style={styles.benefitItem}>
                <Feather name="check-circle" size={12} color="#10B981" />
                <Text style={styles.benefitText}>Verified Pros</Text>
              </View>
              <View style={styles.benefitItem}>
                <Feather name="check-circle" size={12} color="#10B981" />
                <Text style={styles.benefitText}>Live Tracking</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.primaryActionBtn} 
              onPress={() => router.push('/home/booking/page')} 
            >
              <Text style={styles.primaryActionText}>Book a Service Now</Text>
              <Feather name="arrow-right" size={18} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/home/page')} style={styles.textOnlyBtn}>
              <Text style={styles.textOnlyBtnLabel}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CANCELLATION MODAL */}
      <Modal animationType="fade" transparent visible={cancelModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBg}>
              <Feather name="alert-triangle" size={32} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Cancel Request?</Text>
            <Text style={styles.modalSub}>
              {activeBooking?.engineerName} is already assigned. Cancellation fees may apply.
            </Text>
            <TouchableOpacity style={styles.keepBtn} onPress={() => setCancelModalVisible(false)}>
              <Text style={styles.keepBtnText}>Keep Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelBooking} style={styles.confirmCancelBtn}>
              <Text style={styles.confirmCancelText}>Confirm Cancellation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const mapStyle = [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];