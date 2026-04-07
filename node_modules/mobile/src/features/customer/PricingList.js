import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './PricingList.styles';

const PRICING_DATA = [
  {
    id: '1',
    category: 'Hardware Maintenance',
    services: [
      { name: 'Motherboard Deep Cleaning', price: '₱800 - ₱1,500', detail: 'Includes thermal paste re-application and dust removal.' },
      { name: 'System Unit Assembly', price: '₱1,200', detail: 'Full cable management and POST testing.' },
      { name: 'Component Replacement', price: '₱500+', detail: 'Labor only. Parts excluded.' },
    ]
  },
  {
    id: '2',
    category: 'Software & OS',
    services: [
      { name: 'OS Reinstallation', price: '₱1,000', detail: 'Windows/Linux with driver updates.' },
      { name: 'Software Troubleshooting', price: '₱600 - ₱2,000', detail: 'Registry fixes, bug resolution, or driver conflicts.' },
      { name: 'Virus & Malware Removal', price: '₱850', detail: 'Deep system scan and security hardening.' },
    ]
  },
  {
    id: '3',
    category: 'Data Services',
    services: [
      { name: 'Basic Data Recovery', price: '₱1,500+', detail: 'Recovery from deleted partitions or formatted drives.' },
      { name: 'Backup Configuration', price: '₱700', detail: 'Cloud and local redundancy setup.' },
    ]
  },
  {
    id: '4',
    category: 'Networking',
    services: [
      { name: 'Router/AP Configuration', price: '₱800', detail: 'Optimization for gaming or work-from-home.' },
      { name: 'Cabling per Node', price: '₱350', detail: 'Excludes cable materials.' },
    ]
  }
];

export default function PricingList() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(PRICING_DATA[0].id);

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
      <Text style={styles.serviceDetail}>{item.detail}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.estimateBadge}>
          <Feather name="clock" size={12} color="#666" />
          <Text style={styles.estimateText}>Est. 1-3 Hours</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookSmallBtn}
          onPress={() => router.push('/home/booking/page')}
        >
          <Text style={styles.bookSmallText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Service Pricing</Text>
            <Text style={styles.headerSub}>Transparent rates for quality work</Text>
        </View>
        </View>

      {/* Category Tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {PRICING_DATA.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              onPress={() => setSelectedCategory(cat.id)}
              style={[styles.tab, selectedCategory === cat.id && styles.activeTab]}
            >
              <Text style={[styles.tabText, selectedCategory === cat.id && styles.activeTabText]}>
                {cat.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={PRICING_DATA.find(c => c.id === selectedCategory).services}
        keyExtractor={(item) => item.name}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
            <View style={styles.disclaimerBox}>
                <Feather name="info" size={16} color="#888" />
                <Text style={styles.disclaimerText}>
                    Prices listed are labor estimates. Final costs may vary depending on parts required and issue complexity.
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}