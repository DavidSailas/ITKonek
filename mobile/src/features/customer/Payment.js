import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  doc, onSnapshot, serverTimestamp, 
  updateDoc, collection, addDoc 
} from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import styles from './Payment.styles';

export default function PaymentScreen() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) return;
    const unsub = onSnapshot(doc(db, "bookings", bookingId), (docSnap) => {
      if (docSnap.exists()) setBooking({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    });
    return () => unsub();
  }, [bookingId]);

  const processGcashPayment = async () => {
    setProcessing(true);
    
    // Simulate "Redirecting to GCash" delay
    setTimeout(async () => {
      try {
        const paymentRef = collection(db, "payments");
        const bookingRef = doc(db, "bookings", bookingId);

        // 1. Create the payment record in your collection
        await addDoc(paymentRef, {
          amount: booking.totalAmount,
          bookingId: bookingId,
          userId: auth.currentUser.uid,
          method: "Gcash",
          status: "Success",
          createdAt: serverTimestamp()
        });

        // 2. Update booking to Completed
        await updateDoc(bookingRef, {
          status: 'Completed',
          paidAt: serverTimestamp(),
          paymentMethod: 'Gcash'
        });

        setProcessing(false);
        Alert.alert("GCash Success", "Payment received via GCash terminal.", [
          { text: "Return to Dashboard", onPress: () => router.replace('/home/page') }
        ]);
      } catch (error) {
        setProcessing(false);
        Alert.alert("Error", "GCash transaction failed to sync.");
      }
    }, 2500); // 2.5 second fake loading for realism
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator color="#111" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GCASH CHECKOUT</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {processing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#007DFF" />
            <Text style={styles.processingText}>Connecting to GCash...</Text>
            <Text style={styles.subProcessingText}>Do not close the app</Text>
          </View>
        ) : (
          <>
            <View style={styles.gcashBanner}>
              <Text style={styles.gcashLogo}>GCash</Text>
            </View>

            <View style={styles.amountCard}>
              <Text style={styles.label}>AMOUNT TO PAY</Text>
              <Text style={styles.amount}>PHP {booking?.totalAmount?.toLocaleString()}</Text>
              <Text style={styles.refText}>Ref: {booking?.id.slice(0,8).toUpperCase()}</Text>
            </View>

            <View style={styles.instructionCard}>
              <Ionicons name="phone-portrait-outline" size={20} color="#007DFF" />
              <Text style={styles.instructionText}>
                You will be charged via your registered GCash number. Ensure you have enough balance.
              </Text>
            </View>

            <View style={styles.qrContainer}>
               <View style={styles.qrFrame}>
                  {/* Simulated GCash Merchant QR */}
                  <MaterialCommunityIcons name="qrcode-scan" size={180} color="#111" />
               </View>
               <Text style={styles.qrHint}>Scan Merchant QR to Pay</Text>
            </View>
          </>
        )}
      </ScrollView>

      {!processing && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.gcashButton} 
            onPress={processGcashPayment}
          >
            <Text style={styles.gcashButtonText}>PAY WITH GCASH</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}