import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
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

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);

  // UPDATED: Using provided Filipino/Filipina names and Cebu coordinates
  const engineers = [
    { 
      id: 1, name: 'Engr. Mark Anthony Dela Cruz', service: 'Master Logic Board Tech', 
      rating: 4.8, jobs: 124, exp: '8 yrs', success: '98%', distance: 'Cebu City',
      bio: 'Specializing in micro-soldering and complex circuit repairs for high-end laptops and workstations in Cebu City.',
      skills: ['Micro-soldering', 'IC Replacement', 'Circuit Analysis'],
      latitude: 10.3157, longitude: 123.8854 
    },
    { 
      id: 2, name: 'Engr. Maria Angela Lopez', service: 'Network Architect', 
      rating: 4.9, jobs: 89, exp: '5 yrs', success: '100%', distance: 'Mandaue City',
      bio: 'Expert in enterprise networking and secure server configurations for businesses around Mandaue.',
      skills: ['Network Security', 'Server Config', 'Cloud Integration'],
      latitude: 10.3450, longitude: 123.9350 
    },
    { 
      id: 3, name: 'Engr. John Carlo Santos', service: 'Performance Engineer', 
      rating: 4.7, jobs: 210, exp: '12 yrs', success: '96%', distance: 'Lapu-Lapu City',
      bio: 'Specialist in custom liquid cooling loops and high-performance workstation optimization.',
      skills: ['Liquid Cooling', 'Overclocking', 'Optimization'],
      latitude: 10.3100, longitude: 123.9500 
    },
    { 
      id: 4, name: 'Engr. Jennifer Mae Villanueva', service: 'Hardware Diagnostic Expert', 
      rating: 4.9, jobs: 156, exp: '10 yrs', success: '99%', distance: 'Talisay City',
      bio: 'Focused on deep hardware diagnostics and preventative maintenance for professional hardware.',
      skills: ['Hardware Diag', 'Thermal Mgmt', 'Component Prep'],
      latitude: 10.2587, longitude: 123.8246
    },
    { 
      id: 5, name: 'Engr. Michael Angelo Reyes', service: 'Data Recovery Specialist', 
      rating: 4.8, jobs: 42, exp: '4 yrs', success: '95%', distance: 'Consolacion',
      bio: 'Certified in forensic data recovery from physical drive failures and corrupted SSD storage.',
      skills: ['HDD Recovery', 'SSD Forensics', 'RAID Repair'],
      latitude: 10.3800, longitude: 123.9600 
    },
    { 
      id: 6, name: 'Engr. Patricia Anne Castillo', service: 'CCTV & Security Systems', 
      rating: 4.6, jobs: 112, exp: '6 yrs', success: '94%', distance: 'Liloan, Cebu',
      bio: 'Designing and implementing high-security IP camera systems with remote monitoring.',
      skills: ['IP Cameras', 'NVR Config', 'Remote Access'],
      latitude: 10.4000, longitude: 123.9900 
    },
    { 
      id: 7, name: 'Engr. Kevin Louie Garcia', service: 'Software Architect', 
      rating: 4.9, jobs: 305, exp: '15 yrs', success: '100%', distance: 'Banilad, Cebu',
      bio: 'Expert in system kernel optimization and recovering bricked devices through software fixes.',
      skills: ['Kernel Opt', 'System Recovery', 'Firmware Flash'],
      latitude: 10.3400, longitude: 123.9100 
    },
    { 
      id: 8, name: 'Engr. Kristine Joy Navarro', service: 'Apple Certified Specialist', 
      rating: 5.0, jobs: 88, exp: '7 yrs', success: '100%', distance: 'Lahug, Cebu',
      bio: 'Apple-certified technician focused on MacBook, iMac, and iPad internal servicing.',
      skills: ['macOS Fix', 'iPad Display', 'iPhone Internals'],
      latitude: 10.3300, longitude: 123.8900 
    },
    { 
      id: 9, name: 'Engr. Christian Paul Mendoza', service: 'Thermal & Cooling Expert', 
      rating: 4.7, jobs: 134, exp: '9 yrs', success: '97%', distance: 'Cordova, Cebu',
      bio: 'Professional cleaning and thermal interface replacement for high-end GPUs and CPUs.',
      skills: ['Repasting', 'Fan Repair', 'Deep Clean'],
      latitude: 10.2600, longitude: 123.9400 
    },
    { 
      id: 10, name: 'Engr. Angelica Marie Torres', service: 'POS & Retail Systems', 
      rating: 4.8, jobs: 75, exp: '5 yrs', success: '99%', distance: 'Minglanilla',
      bio: 'Setup and maintenance of Point-of-Sale hardware and inventory tracking systems.',
      skills: ['POS Config', 'Barcode Setup', 'Retail Tech'],
      latitude: 10.2450, longitude: 123.7950 
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
      setUserLocation(region);
      setMapRegion(region);
      setLoading(false);
    })();
  }, []);

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={userLocation}
        onRegionChangeComplete={setMapRegion}
        customMapStyle={mapStyle}
        onPress={() => setSelectedEngineer(null)}
      >
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.userLocationContainer, { transform: [{ scale: getDynamicScale() }] }]}>
              <View style={styles.userPulse} />
              <View style={styles.userDot} />
            </View>
          </Marker>
        )}

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

      <SafeAreaView style={styles.overlayHeader}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#111" style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search verified professionals in Cebu..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {selectedEngineer && (
        <View style={styles.quickViewContainer}>
          <View style={styles.quickViewCard}>
            <Image
              source={require('../../assets/images/technician.png')}
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
                  source={require('../../assets/images/technician.png')}
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
                    <Text style={styles.heroStatValue}>{selectedEngineer?.distance}</Text>
                    <Text style={styles.heroStatLabel}>Location</Text>
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
                      engineerId: selectedEngineer.id,
                      engineerName: selectedEngineer.name,
                      serviceName: selectedEngineer.service,
                      engLat: selectedEngineer.latitude,
                      engLng: selectedEngineer.longitude
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

      <BottomNav active="search" />
    </View>
  );
}

const mapStyle = [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];