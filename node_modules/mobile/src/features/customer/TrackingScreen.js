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
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc, updateDoc } from 'firebase/firestore';

import styles from './TrackingScreen.styles';

const avatarNeutral = require('../../assets/images/avatar_neutral.png');

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
  const [eta, setEta] = useState('Calculating...');

  // Helper: Geocoding logic identical to SearchScreen
  const getEngineerCoords = async (detailsData, bookingData) => {
    // DEFAULT COORDINATES
    let lat = 10.3157;
    let lng = 123.8854;

    if (detailsData.address && (!detailsData.latitude || !detailsData.longitude)) {
      try {
        const geocodedLocation = await Location.geocodeAsync(detailsData.address);
        if (geocodedLocation.length > 0) {
          lat = geocodedLocation[0].latitude;
          lng = geocodedLocation[0].longitude;
        }
      } catch (error) {
        console.warn("Geocoding failed for tracking:", detailsData.address);
      }
    } else {
      // Prioritize booking-specific live location, fallback to profile static location
      lat = parseFloat(bookingData.engineerLat || detailsData.latitude) || lat;
      lng = parseFloat(bookingData.engineerLng || detailsData.longitude) || lng;
    }

    return { latitude: lat, longitude: lng };
  };

  const calculateETA = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    const timeInMinutes = Math.round((distance / 30) * 60) + 5; 
    return timeInMinutes < 5 ? "5-10" : `${timeInMinutes}-${timeInMinutes + 5}`;
  };

  useEffect(() => {
    if (userLocation && engineerLocation && mapRef.current) {
      mapRef.current.fitToCoordinates([userLocation, engineerLocation], {
        edgePadding: { top: 100, right: 100, bottom: 400, left: 100 },
        animated: true,
      });
    }
  }, [userLocation, engineerLocation]);

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
        const uLoc = {
          latitude: initialLoc.coords.latitude,
          longitude: initialLoc.coords.longitude,
        };
        setUserLocation(uLoc);

        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid),
            where("status", "in", ["Pending", "Active", "On the way", "Accepted"]),
            orderBy("createdAt", "desc"),
            limit(1)
          );

          unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!snapshot.empty) {
              const bookingDoc = snapshot.docs[0];
              const bookingData = bookingDoc.data();
              
              let detailsData = {};
              let engineerPhoto = null;

              if (bookingData.engineerId) {
                const detailsRef = doc(db, "users", bookingData.engineerId, "engineerProfile", "details");
                const detailsSnap = await getDoc(detailsRef);
                if (detailsSnap.exists()) {
                  detailsData = detailsSnap.data();
                  engineerPhoto = detailsData.userPhoto;
                }
              }

              // Use the SearchScreen coordinate logic
              const coords = await getEngineerCoords(detailsData, bookingData);
              
              setEngineerLocation(coords);
              setActiveBooking({
                id: bookingDoc.id,
                ...bookingData,
                engineerPhoto: engineerPhoto ? { uri: engineerPhoto } : avatarNeutral
              });
              setEta(calculateETA(coords.latitude, coords.longitude, uLoc.latitude, uLoc.longitude));
              setNoBookingModalVisible(false);
            } else {
              setActiveBooking(null);
              setNoBookingModalVisible(true);
            }
            setLoading(false);
          });
        }
      } catch (err) {
        console.error("Tracking setup error:", err);
        setLoading(false);
      }
    };

    setupTracking();
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleCancelBooking = async () => {
    try {
      if (activeBooking) {
        await updateDoc(doc(db, "bookings", activeBooking.id), {
          status: 'Cancelled',
          updatedAt: new Date()
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
        <Text style={styles.loadingText}>Connecting to specialist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
        <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }} >
          <View style={styles.userLocationContainer}>
            <View style={styles.userDot} />
          </View>
        </Marker>

        {engineerLocation && (
          <>
            <Polyline
              coordinates={[engineerLocation, userLocation]}
              strokeColor="#111"
              strokeWidth={2}
              lineDashPattern={[10, 10]}
            />
            <Marker 
              coordinate={engineerLocation} 
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.engineerMarkerWrapper}>
                <View style={styles.engineerMarkerPin}>
                  <MaterialCommunityIcons name="tools" size={14} color="#FFF" />
                </View>
              </View>
            </Marker>
          </>
        )}
      </MapView>

      <SafeAreaView style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
      </SafeAreaView>

      {activeBooking && (
        <View style={styles.infoCard}>
          <View style={styles.pullBar} />
          <View style={styles.headerRow}>
            <View style={[styles.statusBadge, { backgroundColor: activeBooking.status === 'On the way' ? '#111' : '#F3F4F6' }]}>
              <Text style={[styles.statusLabel, { color: activeBooking.status === 'On the way' ? '#FFF' : '#111' }]}>
                {activeBooking.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.etaBadge}>
              <Feather name="clock" size={12} color="#374151" />
              <Text style={styles.etaText}> ETA: {eta} MINS</Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>
            {activeBooking.status === "Pending" ? "Verifying Request" : "Specialist Assigned"}
          </Text>
          <Text style={styles.subTitle}>
            {activeBooking.engineerName || "Your technician"} is on the way.
          </Text>

          <View style={styles.divider} />

          <View style={styles.profileSection}>
            <Image source={activeBooking.engineerPhoto} style={styles.avatar} />
            <View style={styles.profileText}>
              <Text style={styles.nameText}>{activeBooking.engineerName || "Technician"}</Text>
              <Text style={styles.specialtyText}>Verified Hardware Specialist</Text>
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
              <Feather name="list" size={16} color="#111" />
              <Text style={styles.btnText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setCancelModalVisible(true)}>
              <Feather name="x-circle" size={16} color="#DC2626" />
              <Text style={[styles.btnText, { color: '#DC2626' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.messageBtn} 
            onPress={() => router.push({ pathname: '/chat/page', params: { engineerId: activeBooking.engineerId }})}
          >
            <MaterialCommunityIcons name="chat-processing" size={22} color="#FFF" />
            <Text style={styles.messageBtnText}>Message Engineer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODALS */}
      <Modal animationType="fade" transparent visible={noBookingModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.professionalModal}>
            <MaterialCommunityIcons name="map-marker-off" size={40} color="#111" />
            <Text style={styles.modalTitle}>No Active Tracking</Text>
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => router.push('/home/page')}>
              <Text style={styles.primaryActionText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={cancelModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather name="alert-circle" size={32} color="#DC2626" />
            <Text style={styles.modalTitle}>Cancel Service?</Text>
            <TouchableOpacity style={styles.keepBtn} onPress={() => setCancelModalVisible(false)}>
              <Text style={styles.keepBtnText}>No, Keep Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelBooking} style={styles.confirmCancelBtn}>
              <Text style={styles.confirmCancelText}>Yes, Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const mapStyle = [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];