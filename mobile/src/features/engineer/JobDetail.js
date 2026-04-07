import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Image, 
  ActivityIndicator, Alert, Linking, Platform, Modal, TextInput 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './JobDetail.styles';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Payment States
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [customPrice, setCustomPrice] = useState('');

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "bookings", id), (docSnap) => {
      if (docSnap.exists()) {
        setJob({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert("Error", "Job record not found.");
        router.back();
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  const updateStatus = async (nextStatus, additionalData = {}) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "bookings", id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
        ...additionalData,
        [`${nextStatus.toLowerCase().replace(/\s/g, '')}At`]: serverTimestamp()
      });
    } catch (error) {
      Alert.alert("Update Failed", "Check your connection.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSetFinalPrice = () => {
    if (!customPrice || isNaN(customPrice)) {
      Alert.alert("Invalid Amount", "Please enter a valid numeric value.");
      return;
    }
    setShowPriceModal(false);
    updateStatus('Pending Payment', { totalAmount: parseFloat(customPrice) });
  };

  const openNavigation = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${job?.engineerLat || 0},${job?.engineerLng || 0}`;
    const url = Platform.select({
      ios: `${scheme}Client@${latLng}`,
      android: `${scheme}${latLng}(Client)`
    });
    Linking.openURL(url);
  };

  if (loading) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#111" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONTROL PANEL</Text>
        <TouchableOpacity onPress={openNavigation}>
          <Feather name="navigation" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Status Tracker */}
        <View style={styles.statusBanner}>
          <Text style={styles.statusLabel}>CURRENT PHASE</Text>
          <Text style={styles.statusValue}>{job.status?.toUpperCase()}</Text>
        </View>

        {/* Payment Terminal View (Only when status is Pending Payment) */}
        {job.status === 'Pending Payment' ? (
          <View style={styles.terminalContainer}>
            <Text style={styles.terminalTitle}>COLLECT PAYMENT</Text>
            <View style={styles.qrCard}>
              {job.paymentMethod === 'Cash' ? (
                <MaterialCommunityIcons name="cash-multiple" size={80} color="#111" />
              ) : (
                <MaterialCommunityIcons name="qrcode-scan" size={180} color="#111" />
              )}
              <Text style={styles.terminalAmount}>PHP {job.totalAmount?.toLocaleString()}</Text>
              <Text style={styles.terminalSubtext}>
                {job.paymentMethod === 'Card' ? "Use Company Card Terminal" : "Scan Company QR Code"}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Client Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CLIENT DETAILS</Text>
              <View style={styles.clientCard}>
                <Image 
                  source={job.userPhoto ? { uri: job.userPhoto } : require('../../assets/images/avatar_neutral.png')} 
                  style={styles.clientAvatar} 
                />
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{job.userName || 'Customer'}</Text>
                  <Text style={styles.clientAddress}>{job.address}</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL(`tel:${job.userPhone}`)}>
                  <Feather name="phone" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Issue Details */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>HARDWARE DIAGNOSIS</Text>
              <View style={styles.detailBox}>
                <Text style={styles.serviceTitle}>{job.serviceName}</Text>
                <Text style={styles.descriptionText}>{job.description}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        {job.status === 'Accepted' && (
          <TouchableOpacity style={styles.mainActionBtn} onPress={() => updateStatus('On the way')}>
            <Text style={styles.actionBtnText}>START TRAVEL</Text>
          </TouchableOpacity>
        )}

        {job.status === 'On the way' && (
          <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: '#F9A825' }]} onPress={() => updateStatus('Arrived')}>
            <Text style={styles.actionBtnText}>MARK AS ARRIVED</Text>
          </TouchableOpacity>
        )}

        {job.status === 'Arrived' && (
          <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: '#2E7D32' }]} onPress={() => updateStatus('In Progress')}>
            <Text style={styles.actionBtnText}>START REPAIR</Text>
          </TouchableOpacity>
        )}

        {job.status === 'In Progress' && (
          <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: '#111' }]} onPress={() => setShowPriceModal(true)}>
            <Text style={styles.actionBtnText}>COMPLETE & SET PRICE</Text>
          </TouchableOpacity>
        )}

        {job.status === 'Pending Payment' && (
          <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: '#4CAF50' }]} onPress={() => updateStatus('Completed')}>
            <Text style={styles.actionBtnText}>CONFIRM PAYMENT RECEIVED</Text>
          </TouchableOpacity>
        )}

        {job.status === 'Completed' && (
          <View style={styles.completedBox}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.completedText}>Transaction Finalized</Text>
          </View>
        )}
      </View>

      {/* Price Input Modal */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.priceModal}>
            <Text style={styles.modalHeader}>Final Repair Cost</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyLabel}>PHP</Text>
              <TextInput 
                style={styles.priceInput}
                keyboardType="numeric"
                placeholder="0.00"
                value={customPrice}
                onChangeText={setCustomPrice}
                autoFocus
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPriceModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleSetFinalPrice}>
                <Text style={styles.confirmBtnText}>Submit Price</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}