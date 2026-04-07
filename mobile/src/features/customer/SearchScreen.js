import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import styles from './SearchScreen.styles';
import BottomNav from '../../components/BottomNav';

// Firebase Imports
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const avatarNeutral = require('../../assets/images/avatar_neutral.png');

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    (async () => {
      // 1. Get Device Location to center the map initially
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        };
        setUserLocation(region);
        setMapRegion(region);
      }

      // 2. Fetch Engineers and their specific Geo-locations
      await fetchEngineersFromDB();
      setLoading(false);
    })();
  }, []);

  const fetchEngineersFromDB = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "engineer"));
      const querySnapshot = await getDocs(q);
      
      const techData = await Promise.all(querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const detailsRef = doc(db, "users", userDoc.id, "engineerProfile", "details");
        const detailsSnap = await getDoc(detailsRef);
        const detailsData = detailsSnap.exists() ? detailsSnap.data() : {};

        // DEFAULT COORDINATES (Cebu City Center)
        let lat = 10.3157;
        let lng = 123.8854;

        // GEOCODING LOGIC: If address exists but lat/lng don't, find them
        if (detailsData.address && (!detailsData.latitude || !detailsData.longitude)) {
          try {
            const geocodedLocation = await Location.geocodeAsync(detailsData.address);
            if (geocodedLocation.length > 0) {
              lat = geocodedLocation[0].latitude;
              lng = geocodedLocation[0].longitude;
            }
          } catch (error) {
            console.warn("Could not geocode address: ", detailsData.address);
          }
        } else {
          // If they ALREADY exist in DB, use them
          lat = parseFloat(detailsData.latitude) || lat;
          lng = parseFloat(detailsData.longitude) || lng;
        }

        return {
          id: userDoc.id,
          name: `${userData.firstName} ${userData.lastName}`,
          service: detailsData.primaryRole || userData.primaryRole || 'Technician',
          rating: userData.rating || 5.0,
          distance: detailsData.address || 'Cebu',
          // Use the calculated or retrieved coordinates
          latitude: lat,
          longitude: lng,
          image: detailsData.userPhoto ? { uri: detailsData.userPhoto } : avatarNeutral,
          bio: detailsData.bio || '',
          skills: detailsData.specializations || [] 
        };
      }));

      setEngineers(techData);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const getDynamicScale = () => {
    if (!mapRegion) return 1;
    const delta = mapRegion.latitudeDelta;
    if (delta > 0.15) return 0.7;
    if (delta < 0.02) return 1.25;
    return 1;
  };

  const filteredEngineers = engineers.filter((eng) =>
    eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eng.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={{ marginTop: 10 }}>Locating Professionals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={userLocation || {
          latitude: 10.3157,
          longitude: 123.8854,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        onRegionChangeComplete={setMapRegion}
        customMapStyle={mapStyle}
        onPress={() => setSelectedEngineer(null)}
      >
        {/* User Current Location Dot */}
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.userLocationContainer, { transform: [{ scale: getDynamicScale() }] }]}>
              <View style={styles.userPulse} />
              <View style={styles.userDot} />
            </View>
          </Marker>
        )}

        {/* Engineer Address Markers */}
        {filteredEngineers.map((eng) => {
          const isSelected = selectedEngineer?.id === eng.id;
          return (
            <Marker
              key={eng.id}
              coordinate={{ latitude: eng.latitude, longitude: eng.longitude }}
              onPress={() => setSelectedEngineer(eng)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.markerWrapper, { transform: [{ scale: isSelected ? 1.3 : getDynamicScale() }] }]}>
                <View style={[styles.markerPin, isSelected && styles.markerPinActive]}>
                  <MaterialCommunityIcons name="tools" size={14} color="#FFF" />
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Header Search */}
      <SafeAreaView style={styles.overlayHeader}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#111" style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or expertise..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Quick View Card when a marker is tapped */}
      {selectedEngineer && (
        <View style={styles.quickViewContainer}>
          <View style={styles.quickViewCard}>
            <Image
              source={selectedEngineer.image}
              style={styles.quickAvatar}
            />
            <View style={styles.quickTextGroup}>
              <Text style={styles.quickName}>{selectedEngineer.name}</Text>
              <Text style={styles.quickService}>{selectedEngineer.service}</Text>
              <View style={styles.quickStats}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.quickRating}>{selectedEngineer.rating}</Text>
                <Text style={styles.quickDistance}> • {selectedEngineer.distance}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => setProfileModalVisible(true)}
            >
              <Feather name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Full Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Specialist Profile</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.profileHero}>
                <Image
                  source={selectedEngineer?.image}
                  style={styles.largeAvatar}
                />
                <Text style={styles.heroName}>{selectedEngineer?.name}</Text>
                <Text style={styles.heroService}>{selectedEngineer?.service}</Text>
                
                <View style={styles.heroStatsRow}>
                  <View style={styles.heroStatItem}>
                    <Text style={styles.heroStatValue}>{selectedEngineer?.rating}</Text>
                    <Text style={styles.heroStatLabel}>Rating</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.heroStatItem}>
                    <Text style={styles.heroStatValue}>{selectedEngineer?.jobs}</Text>
                    <Text style={styles.heroStatLabel}>Jobs</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.heroStatItem}>
                    <Text style={styles.heroStatValue}>{selectedEngineer?.success}</Text>
                    <Text style={styles.heroStatLabel}>Success</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>About Specialist</Text>
                <Text style={styles.sectionText}>{selectedEngineer?.bio}</Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Key Expertise</Text>
                <View style={styles.skillsGrid}>
                  {selectedEngineer?.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.bookActionBtn}
                onPress={() => {
                  setProfileModalVisible(false);
                  router.push({
                    pathname: '/home/booking/page', 
                    params: { 
                      serviceName: selectedEngineer.service,
                      category: "HARDWARE",
                    }
                  });
                }}
              >
                <Text style={styles.bookActionText}>Book Service Request</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNav activeTab="search" />
    </View>
  );
}

const mapStyle = [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];