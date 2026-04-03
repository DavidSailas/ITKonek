import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './SearchScreen.styles';
import BottomNav from '../../components/BottomNav';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mocked engineer data
  const engineers = [
    { id: 1, name: 'Eng. Weston', service: 'Laptop Repair', distance: '1.2 km', top: '30%', left: '20%' },
    { id: 2, name: 'Eng. Maria', service: 'PC Installation', distance: '2.5 km', top: '55%', left: '45%' },
    { id: 3, name: 'Eng. Alan', service: 'Networking', distance: '3 km', top: '40%', left: '70%' },
  ];

  const filteredEngineers = engineers.filter((eng) =>
    eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eng.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 1. FULL SCREEN MAP BACKGROUND */}
      <View style={styles.mapWrapper}>
        <Image
          source={require('../../assets/images/map-placeholder.png')}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* ENGINEER PIN DROPS */}
        {filteredEngineers.map((eng) => (
          <TouchableOpacity
            key={eng.id}
            style={[styles.engineerMarkerContainer, { top: eng.top, left: eng.left }]}
            onPress={() => setSelectedEngineer(eng)} 
          >
            {/* Animated Shadow/Pulse */}
            <View style={styles.pulseRing} />
            
            {/* Professional Icon Pin */}
            <View style={styles.markerPin}>
              <MaterialCommunityIcons name="tools" size={14} color="#FFF" />
            </View>
            
            {/* Small Label (Optional for Professional Look) */}
            <View style={styles.markerLabel}>
              <Text style={styles.markerLabelText}>{eng.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* YOUR LOCATION (GREEN) */}
        <View style={[styles.userLocation, { top: '50%', left: '50%' }]}>
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>

        {/* 2. ZOOM CONTROLS (MATCHING REFERENCE) */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn}><Feather name="plus" size={24} color="#333" /></TouchableOpacity>
          <TouchableOpacity style={[styles.zoomBtn, styles.zoomSeparator]}><Feather name="minus" size={24} color="#333" /></TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn}><MaterialCommunityIcons name="navigation-variant" size={24} color="#333" /></TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn}><Feather name="navigation" size={22} color="#333" /></TouchableOpacity>
        </View>
      </View>

      {/* 3. OVERLAY SEARCH BAR */}
      <SafeAreaView style={styles.overlayHeader}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#008080" style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="What service do you need?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

        {/* 4. OVERLAY SEARCH RESULTS (VERTICAL BOTTOM SHEET) */}
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Engineers near you'}
          </Text>
          
          {/* Changed to Vertical ScrollView */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsScroll}
          >
            {filteredEngineers.map((eng) => (
              <View key={eng.id} style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <Image
                    source={require('../../assets/images/technician.png')}
                    style={styles.avatar}
                  />
                  <View style={styles.textGroup}>
                    <Text style={styles.engineerName}>{eng.name}</Text>
                    <Text style={styles.engineerService}>{eng.service}</Text>
                    <Text style={styles.engineerDistance}>📍 {eng.distance} away</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

      <BottomNav active="search" />
    </View>
  );
}