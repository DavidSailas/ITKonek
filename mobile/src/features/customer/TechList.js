import React, { useState } from 'react';
import {
  View,
  Text,
  FlatIcons,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './TechList.styles';

const ALL_ENGINEERS = [
  { id: '1', name: 'Engr. Mark Anthony Dela Cruz', specialty: 'Master Logic Board Tech', rating: 4.8, distance: 'Cebu City', image: require('../../assets/images/technician.png') },
  { id: '2', name: 'Engr. Maria Angela Lopez', specialty: 'Network Architect', rating: 4.9, distance: 'Mandaue City', image: require('../../assets/images/technician.png') },
  { id: '3', name: 'Engr. John Carlo Santos', specialty: 'Performance Engineer', rating: 4.7, distance: 'Lapu-Lapu City', image: require('../../assets/images/technician.png') },
  { id: '4', name: 'Engr. Jennifer Mae Villanueva', specialty: 'Hardware Diagnostic Expert', rating: 4.9, distance: 'Talisay City', image: require('../../assets/images/technician.png') },
  { id: '5', name: 'Engr. Michael Angelo Reyes', specialty: 'Data Recovery Specialist', rating: 4.8, distance: 'Consolacion', image: require('../../assets/images/technician.png') },
  { id: '6', name: 'Engr. Patricia Anne Castillo', specialty: 'CCTV & Security Systems', rating: 4.6, distance: 'Liloan, Cebu', image: require('../../assets/images/technician.png') },
  { id: '7', name: 'Engr. Kevin Louie Garcia', specialty: 'Software Architect', rating: 4.9, distance: 'Banilad, Cebu', image: require('../../assets/images/technician.png') },
  { id: '8', name: 'Engr. Kristine Joy Navarro', specialty: 'Apple Certified Specialist', rating: 5.0, distance: 'Lahug, Cebu', image: require('../../assets/images/technician.png') },
  { id: '9', name: 'Engr. Christian Paul Mendoza', specialty: 'Thermal & Cooling Expert', rating: 4.7, distance: 'Cordova, Cebu', image: require('../../assets/images/technician.png') },
  { id: '10', name: 'Engr. Angelica Marie Torres', specialty: 'POS & Retail Systems', rating: 4.8, distance: 'Minglanilla', image: require('../../assets/images/technician.png') },
];

export default function TechList() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredTechs = ALL_ENGINEERS.filter(tech => 
    tech.name.toLowerCase().includes(search.toLowerCase()) || 
    tech.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const renderTechItem = ({ item }) => (
    <View style={styles.techCard}>
      <Image source={item.image} style={styles.techAvatar} />
      <View style={styles.techInfo}>
        <Text style={styles.techName}>{item.name}</Text>
        <Text style={styles.techSpecialty}>{item.specialty}</Text>
        <View style={styles.statsRow}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.locationText}> • {item.distance}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.bookBtn}
        onPress={() => router.push({
          pathname: '/home/booking/page',
          params: { engineerName: item.name, serviceName: item.specialty }
        })}
      >
        <Feather name="plus" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Technicians</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput 
          placeholder="Search by name or expertise..." 
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredTechs}
        keyExtractor={(item) => item.id}
        renderItem={renderTechItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}