import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from './SearchScreen.styles';
import BottomNav from '../../components/BottomNav';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mocked engineer data
const engineers = [
  { id: 1, name: 'Eng. Weston', service: 'Laptop Repair', distance: '1.2 km', top: '30%', left: '20%' },
  { id: 2, name: 'Eng. Maria', service: 'PC Installation', distance: '2.5 km', top: '60%', left: '50%' },
  { id: 3, name: 'Eng. Alan', service: 'Networking', distance: '3 km', top: '40%', left: '70%' },
];

  const handleNavigation = (route) => {
    // Replace with actual navigation
    console.log('Navigate to:', route);
    // navigation.navigate(route);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Nearby Engineers</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by service or engineer..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

        {/* MAP WITH ENGINEER LOCATIONS */}
        <View style={styles.mapContainer}>
        <Image
            source={require('../../assets/images/map-placeholder.png')}
            style={styles.mapImage}
            resizeMode="cover"
        />

        {engineers.map((eng, index) => (
            <TouchableOpacity
            key={eng.id}
            style={[
                styles.engineerDot,
                { top: eng.top, left: eng.left }, 
            ]}
            onPress={() => alert(`${eng.name} - ${eng.service}`)}
            />
        ))}
        </View>

      {/* SEARCH RESULTS */}
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {engineers
          .filter((eng) =>
            eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            eng.service.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((eng) => (
            <View key={eng.id} style={styles.resultCard}>
              <View style={styles.engineerInfo}>
                <Image
                  source={require('../../assets/images/technician.png')}
                  style={styles.avatar}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.engineerName}>{eng.name}</Text>
                  <Text style={styles.engineerService}>{eng.service}</Text>
                  <Text style={styles.engineerDistance}>{eng.distance} away</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

  {/* BOTTOM NAV */}
  <BottomNav active="search" />

    </View>
  );
}