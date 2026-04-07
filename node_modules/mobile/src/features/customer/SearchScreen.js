import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './SearchScreen.styles';
import BottomNav from '../../components/BottomNav';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  const engineers = [
    { id: 1, name: 'Eng. Weston', service: 'Laptop Repair', distance: '3 km', top: '30%', left: '20%', rating: 4.8, jobs: 124 },
    { id: 2, name: 'Eng. Maria', service: 'PC Installation', distance: '1.2 km', top: '48%', left: '30%', rating: 4.9, jobs: 89 },
    { id: 3, name: 'Eng. Alan', service: 'Networking', distance: '2.5 km', top: '40%', left: '70%', rating: 4.7, jobs: 210 },
  ];

  const filteredEngineers = engineers.filter((eng) =>
    eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eng.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 1. MAP LAYER - Tap anywhere to deselect */}
      <TouchableWithoutFeedback onPress={() => setSelectedEngineer(null)}>
        <View style={styles.mapWrapper}>
          <Image
            source={require('../../assets/images/map-placeholder.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {filteredEngineers.map((eng) => {
            const isSelected = selectedEngineer?.id === eng.id;
            return (
              <TouchableOpacity
                key={eng.id}
                style={[styles.engineerMarkerContainer, { top: eng.top, left: eng.left }, isSelected && { zIndex: 99 }]}
                onPress={() => setSelectedEngineer(eng)}
                activeOpacity={1} // Removes the "shadow box" flash on tap
              >
                {/* Selection Glow */}
                <View style={[styles.pulseRing, isSelected && styles.pulseRingActive]} />
                
                {/* The Pin */}
                <View style={[styles.markerPin, isSelected && styles.markerPinActive]}>
                  <MaterialCommunityIcons 
                    name="tools" 
                    size={isSelected ? 16 : 14} 
                    color="#FFF" 
                  />
                </View>
                
                {/* Distance Label (Hidden when selected for clarity) */}
                {!isSelected && (
                  <View style={styles.markerLabel}>
                    <Text style={styles.markerLabelText}>{eng.distance}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* USER LOCATION INDICATOR */}
          <View style={[styles.userLocation, { top: '52%', left: '48%' }]}>
            <View style={styles.userPulse} />
            <View style={styles.userDot} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* 2. FLOATING QUICK VIEW CARD */}
      {selectedEngineer && (
        <View style={styles.quickViewContainer}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.quickViewCard}
            onPress={() => console.log("Navigate to profile")}
          >
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
                <Text style={styles.quickJobs}>• {selectedEngineer.jobs} jobs</Text>
              </View>
            </View>
            <View style={styles.quickAction}>
                <View style={styles.quickArrow}>
                    <Feather name="arrow-right" size={20} color="#FFF" />
                </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. SEARCH OVERLAY */}
      <SafeAreaView style={styles.overlayHeader} pointerEvents="box-none">
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#008080" style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find a professional technician..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(t) => { setSearchQuery(t); setSelectedEngineer(null); }}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <BottomNav active="search" />
    </View>
  );
}