import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './TechList.styles';

// Firebase Imports
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const avatarNeutral = require('../../assets/images/avatar_neutral.png');

export default function TechList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      // 1. Get all users with the role 'engineer'
      const q = query(collection(db, "users"), where("role", "==", "engineer"));
      const querySnapshot = await getDocs(q);
      
      const techData = await Promise.all(querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        
        // 2. Fetch the specific sub-collection where the engineer photo is stored
        const detailsRef = doc(db, "users", userDoc.id, "engineerProfile", "details");
        const detailsSnap = await getDoc(detailsRef);
        const detailsData = detailsSnap.exists() ? detailsSnap.data() : {};

        return {
          id: userDoc.id,
          name: `${userData.firstName} ${userData.lastName}`,
          // Engineers use 'primaryRole' from the signup form
          specialty: userData.primaryRole || detailsData.primaryRole || 'Professional Technician',
          rating: userData.rating || 5.0,
          // Use 'address' from sub-collection or main doc
          distance: detailsData.address || userData.address || 'Nearby',
          // KEY FIX: Use 'userPhoto' for engineers, fallback to 'profileImage' or neutral avatar
          image: detailsData.userPhoto 
            ? { uri: detailsData.userPhoto } 
            : (userData.profileImage ? { uri: userData.profileImage } : avatarNeutral),
        };
      }));

      setEngineers(techData);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechs = engineers.filter(tech => 
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
          params: { 
            engineerId: item.id, 
            engineerName: item.name, 
            serviceName: item.specialty 
          }
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

      {/* List logic */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={filteredTechs}
          keyExtractor={(item) => item.id}
          renderItem={renderTechItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>
              No technicians found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}