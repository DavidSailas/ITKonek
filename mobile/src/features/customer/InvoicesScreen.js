import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { styles } from './InvoicesScreen.styles';
import QRCode from 'react-native-qrcode-svg'; // You may need to install this: expo install react-native-qrcode-svg

export default function InvoicesScreen() {
  const router = useRouter();
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [invoices, setInvoices] = useState([]);

  // Fetch Invoices from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInvoices(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredInvoices = activeFilter === 'All' 
    ? invoices 
    : invoices.filter(inv => inv.status?.toLowerCase() === activeFilter.toLowerCase());

  const renderReceiptCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.receiptCard} 
      onPress={() => {
        setSelectedInvoice(item);
        setView('detail');
      }}
    >
      <View style={styles.receiptInfo}>
        <Text style={styles.receiptDate}>
          {item.date || 'Recent'} • {item.time || 'Scheduled'}
        </Text>
        <Text style={styles.receiptService}>{item.serviceName || 'IT Service'}</Text>
      </View>
      <View style={styles.receiptPriceContainer}>
        <Text style={styles.receiptPrice}>₱{item.totalAmount || '0.00'}</Text>
        <Feather name="chevron-right" size={18} color="#CCC" />
      </View>
    </TouchableOpacity>
  );

  // --- VIEW: LIST ---
  if (view === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Invoices</Text>
            <Text style={styles.headerSub}>Transaction History</Text>
          </View>
        </View>

        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['All', 'Pending', 'Completed', 'Cancelled'].map((status) => (
              <TouchableOpacity 
                key={status} 
                style={[styles.filterTab, activeFilter === status && styles.activeFilterTab]}
                onPress={() => setActiveFilter(status)}
              >
                <Text style={[styles.filterText, activeFilter === status && styles.activeFilterText]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredInvoices}
          keyExtractor={(item) => item.id}
          renderItem={renderReceiptCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={50} color="#EEE" />
              <Text style={styles.emptyText}>No invoices found</Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  // --- VIEW: DETAIL (The "Other Page" Logic) ---
  return (
    <SafeAreaView style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setView('list')} style={styles.closeBtn}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>E-Receipt</Text>
        <TouchableOpacity>
          <Feather name="download" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.receiptScroll}>
        <View style={styles.mainReceipt}>
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: selectedInvoice.status === 'Completed' ? '#E8F5E9' : '#FFF3E0' }]}>
            <Text style={[styles.statusBadgeText, { color: selectedInvoice.status === 'Completed' ? '#2E7D32' : '#E65100' }]}>
              {selectedInvoice.status?.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.detailPrice}>₱{selectedInvoice.totalAmount}</Text>
          <Text style={styles.detailServiceTitle}>{selectedInvoice.serviceName}</Text>
          
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice ID</Text>
            <Text style={styles.detailValue}>#{selectedInvoice.id.slice(0, 8).toUpperCase()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{selectedInvoice.date} | {selectedInvoice.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>Cash on Service</Text>
          </View>

          <View style={styles.divider} />

          {/* QR SECTION */}
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Verification QR</Text>
            <View style={styles.qrFrame}>
              <QRCode value={selectedInvoice.id} size={140} color="#000" />
            </View>
            <Text style={styles.qrSmallText}>Present this to your technician to verify the transaction completion.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}