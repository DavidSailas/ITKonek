import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, Keyboard, Image,
  ActivityIndicator, Alert, Modal
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// Firebase Imports
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider } from 'firebase/auth';
import { auth, db, firebaseConfig } from '../../services/firebase';

import styles from './BookForm.styles';

export default function BookForm() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState(null);

  // Local Image Assets
  const gcashLogo = require('../../assets/icons/gcash.png');
  const mayaLogo = require('../../assets/icons/maya.png');

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Linking & Auth States ---
  const [isGcashLinked, setIsGcashLinked] = useState(false);
  const [isMayaLinked, setIsMayaLinked] = useState(false);
  const [gcashNumber, setGcashNumber] = useState('');
  const [mayaNumber, setMayaNumber] = useState('');

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState(null);
  const [authStep, setAuthStep] = useState(1); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // --- Form States ---
  const [location, setLocation] = useState(params.location || '');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [serviceName, setServiceName] = useState(params.serviceName || '');
  const [description, setDescription] = useState(params.description || '');
  const [urgency, setUrgency] = useState('Standard');
  const [attachedImage, setAttachedImage] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  
  const [isScheduled, setIsScheduled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState('');

  const [paymentMethod, setPaymentMethod] = useState(null); 
  // NEW: Card Detail States
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  const [modalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  useEffect(() => {
    fetchLinkedStatus();
    if (!params.isEditing && !location) {
      getCurrentLocation();
    }
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle auto-trigger for OTP
  useEffect(() => {
    if (phoneNumber.length === 10 && authStep === 1 && !isSendingOtp) {
      handleSendOtp();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (otp.length === 6 && authStep === 2 && !isSubmitting) {
      finalizeLinking();
    }
  }, [otp]);

  const fetchLinkedStatus = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const profileRef = doc(db, "users", user.uid, "customerProfile", "profile");
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          const data = snap.data();
          setIsGcashLinked(data.isGcashLinked || false);
          setIsMayaLinked(data.isMayaLinked || false);
          if (data.gcashPhone) setGcashNumber(data.gcashPhone);
          if (data.paymayaPhone) setMayaNumber(data.paymayaPhone);
          if (data.preferredPaymentMethod) setPaymentMethod(data.preferredPaymentMethod);
        }
      } catch (err) {
        console.error("Error fetching linked status:", err);
      }
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to auto-fill your address.');
        return;
      }
      let pos = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      if (address.length > 0) {
        const item = address[0];
        setLocation(`${item.name || ''} ${item.street || ''}, ${item.city || ''}, ${item.region || ''}`.trim());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Error', 'Camera permission needed');
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
    if (!result.canceled) setAttachedImage(result.assets[0].uri);
  };

  // NEW: Handle Card Scanning Simulation
  const handleScanCard = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Error', 'Camera permission needed to scan card');
    
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled) {
      // Simulation of OCR auto-fill
      setCardDetails({ ...cardDetails, number: '4242 4242 4242 4242' });
      Alert.alert("Card Scanned", "Card number has been automatically detected.");
    }
  };

  const removeImage = () => setAttachedImage(null);

  const handlePaymentSelect = (method) => {
    if (method === 'Gcash') {
      isGcashLinked ? setPaymentMethod('Gcash') : startLinkingFlow('Gcash');
    } else if (method === 'Paymaya') {
      isMayaLinked ? setPaymentMethod('Paymaya') : startLinkingFlow('Paymaya');
    } else {
      setPaymentMethod('Card');
    }
  };

  const startLinkingFlow = (provider) => {
    setLinkingProvider(provider);
    setAuthStep(1);
    setPhoneNumber('');
    setOtp('');
    setShowAuthModal(true);
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10 || isSendingOtp) return;
    setIsSendingOtp(true);
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const fullNumber = `+63${phoneNumber}`;
      const id = await phoneProvider.verifyPhoneNumber(fullNumber, recaptchaVerifier.current);
      setVerificationId(id);
      setAuthStep(2);
      setCountdown(60);
    } catch (err) {
      Alert.alert("Error", "Failed to send SMS. Please check your connection.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const finalizeLinking = async () => {
    if (otp.length !== 6 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      const profileRef = doc(db, "users", user.uid, "customerProfile", "profile");
      const displayPhone = `+63 ${phoneNumber}`;
      const updateData = {
        [`is${linkingProvider}Linked`]: true,
        [`${linkingProvider.toLowerCase()}Phone`]: displayPhone,
        preferredPaymentMethod: linkingProvider,
        updatedAt: serverTimestamp()
      };
      await setDoc(profileRef, updateData, { merge: true });
      if (linkingProvider === 'Gcash') {
        setIsGcashLinked(true);
        setGcashNumber(displayPhone);
      } else {
        setIsMayaLinked(true);
        setMayaNumber(displayPhone);
      }
      setPaymentMethod(linkingProvider);
      setShowAuthModal(false);
      Alert.alert("Account Linked", `Your ${linkingProvider} is now ready.`);
    } catch (err) {
      Alert.alert("Verification Failed", "The code entered is invalid.");
    } finally {
      setIsSubmitting(false);
    }
  };

const saveToFirestore = async () => {
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found.");

      const bookingData = {
        userId: user.uid,
        location,
        serviceName,
        description,
        urgency,
        paymentMethod,
        isScheduled,
        scheduledDate: isScheduled ? dateText : 'Now',
        scheduledTime: isScheduled ? timeText : 'Now',
        cardLastFour: paymentMethod === 'Card' ? cardDetails.number.slice(-4) : null,
        
        engineerId: params.engineerId || null, 
        engineerName: params.engineerName || "Finding Technician...",

        engineerLat: params.engLat ? parseFloat(params.engLat) : 10.3157,
        engineerLng: params.engLng ? parseFloat(params.engLng) : 123.8854,
        
        status: 'Pending',
        imageUrl: attachedImage || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const bookingRef = await addDoc(collection(db, "bookings"), bookingData);

      await addDoc(collection(db, "payments"), {
        bookingId: bookingRef.id,
        userId: user.uid,
        method: paymentMethod,
        amount: 0, 
        status: 'Authorized',
        createdAt: serverTimestamp(),
      });

      setModalVisible(true);
    } catch (err) {
      console.error("Firestore Save Error:", err);
      Alert.alert("Error", "Could not save booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const missing = [];
      if (!location.trim()) missing.push("Location/Address");
      if (!serviceName.trim()) missing.push("Service Name");
      if (!description.trim()) missing.push("Issue Description");
      if (missing.length > 0) {
        setErrorMessages(missing);
        setShowErrorModal(true);
        return;
      }
      setCurrentStep(2);
    } else {
      if (!paymentMethod) {
        setErrorMessages(["Please select a payment method"]);
        setShowErrorModal(true);
        return;
      }
      if (paymentMethod === 'Card' && !cardDetails.number) {
        setErrorMessages(["Please provide card details"]);
        setShowErrorModal(true);
        return;
      }
      saveToFirestore();
    }
  };

  const onPickerChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (pickerMode === 'date') {
        setDateText(selectedDate.toLocaleDateString());
      } else {
        setTimeText(selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
  };

  const renderStepOne = () => (
    <View>
      <View style={styles.group}>
        <Text style={styles.label}>Your Location</Text>
        <View style={styles.inputWrapper}>
          <Feather name="map-pin" size={18} color="#888" style={styles.inputIcon} />
          <TextInput placeholder="Address..." style={styles.input} value={location} onChangeText={setLocation} />
          {loadingLocation ? <ActivityIndicator size="small" color="#111" /> : (
            <TouchableOpacity onPress={getCurrentLocation}><Ionicons name="refresh-circle" size={24} color="#111" /></TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.group}>
        <Text style={styles.label}>What needs fixing?</Text>
        <View style={styles.inputWrapper}>
          <Feather name="tool" size={18} color="#888" style={styles.inputIcon} />
          <TextInput placeholder="e.g. System Repair" style={styles.input} value={serviceName} onChangeText={setServiceName} />
        </View>
      </View>
      <View style={styles.group}>
        <Text style={styles.label}>Issue Description</Text>
        <TextInput placeholder="Describe the problem..." style={styles.textArea} multiline value={description} onChangeText={setDescription} />
      </View>
      
      <Text style={styles.label}>Urgency Level</Text>
      <View style={styles.urgencyRow}>
        {['Standard', 'Urgent', 'Critical'].map((level) => (
          <TouchableOpacity key={level} style={[styles.urgencyBtn, urgency === level && styles.urgencyBtnActive]} onPress={() => setUrgency(level)}>
            <Text style={[styles.urgencyText, urgency === level && styles.urgencyTextActive]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labelRow}>
          <Text style={styles.label}>Device/Issue Photo</Text>
          <Text style={styles.requirementLabel}>(Optional)</Text>
      </View>

      <View style={styles.uploadCard}>
        {attachedImage ? (
          <>
            <View style={[styles.photoFrame, styles.photoFrameActive]}>
              <Image source={{ uri: attachedImage }} style={styles.previewImageRefined} resizeMode="cover" />
              <TouchableOpacity style={styles.removeImageBadge} onPress={removeImage}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.changeActionBtn} onPress={handlePickImage}>
              <Feather name="edit-2" size={14} color="#007AFF" />
              <Text style={styles.changeActionText}>Change Photo</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.uploadBtnRefined} onPress={handlePickImage}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="add" size={24} color="#111" />
            </View>
            <Text style={styles.uploadTextPrimary}>Attach Image</Text>
            <Text style={styles.uploadTextSecondary}>Max size 5MB (JPG/PNG)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStepTwo = () => (
    <View>
      <Text style={styles.label}>Service Schedule</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggleBtn, !isScheduled && styles.toggleBtnActive]} onPress={() => setIsScheduled(false)}>
          <Text style={[styles.toggleText, !isScheduled && styles.toggleTextActive]}>Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, isScheduled && styles.toggleBtnActive]} onPress={() => setIsScheduled(true)}>
          <Text style={[styles.toggleText, isScheduled && styles.toggleTextActive]}>Schedule</Text>
        </TouchableOpacity>
      </View>
      {isScheduled && (
        <View style={styles.scheduleRow}>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => { setPickerMode('date'); setShowPicker(true); }}>
            <Feather name="calendar" size={16} color="#111" /><Text style={styles.dateTimeText}>{dateText || 'Select Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeBtn} onPress={() => { setPickerMode('time'); setShowPicker(true); }}>
            <Feather name="clock" size={16} color="#111" /><Text style={styles.dateTimeText}>{timeText || 'Select Time'}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={[styles.label, {marginTop: 25, marginBottom: 15}]}>Linked Methods</Text>
      <View style={styles.paymentContainer}>
        <TouchableOpacity style={[styles.linkedOption, paymentMethod === 'Gcash' && styles.linkedOptionActive]} onPress={() => handlePaymentSelect('Gcash')}>
          <Image source={gcashLogo} style={styles.methodAvatar} /> 
          <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.methodLabel}>GCash</Text>
                {isGcashLinked && <View style={styles.defaultBadge}><Text style={styles.defaultText}>LINKED</Text></View>}
              </View>
              <Text style={styles.maskedNumber}>{isGcashLinked ? gcashNumber : 'Tap to link account'}</Text> 
          </View>
          <View style={[styles.radioCircle, paymentMethod === 'Gcash' && styles.radioActive]} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.linkedOption, paymentMethod === 'Paymaya' && styles.linkedOptionActive]} onPress={() => handlePaymentSelect('Paymaya')}>
          <Image source={mayaLogo} style={styles.methodAvatar} />
          <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.methodLabel}>Maya</Text>
                {isMayaLinked && <View style={styles.defaultBadge}><Text style={styles.defaultText}>LINKED</Text></View>}
              </View>
              <Text style={styles.maskedNumber}>{isMayaLinked ? mayaNumber : 'Tap to link account'}</Text>
          </View>
          <View style={[styles.radioCircle, paymentMethod === 'Paymaya' && styles.radioActive]} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, {marginTop: 25, marginBottom: 15}]}>Add Methods</Text>
      <TouchableOpacity style={[styles.linkedOption, paymentMethod === 'Card' && styles.linkedOptionActive]} onPress={() => setPaymentMethod('Card')}>
          <View style={styles.methodIconBox}><Feather name="credit-card" size={20} color="#111" /></View>
          <View style={{flex: 1}}><Text style={styles.methodLabel}>Credit or Debit Cards</Text></View>
          <View style={[styles.radioCircle, paymentMethod === 'Card' && styles.radioActive]} />
      </TouchableOpacity>

      {/* NEW: Card Input Fields with Camera Scan */}
      {paymentMethod === 'Card' && (
        <View style={styles.cardInputContainer}>
          <Text style={styles.label}>Card Information</Text>
          <View style={styles.inputWrapper}>
            <Feather name="credit-card" size={18} color="#888" style={styles.inputIcon} />
            <TextInput 
              placeholder="Card Number" 
              style={styles.input} 
              keyboardType="numeric"
              value={cardDetails.number}
              onChangeText={(t) => setCardDetails({...cardDetails, number: t})}
            />
            <TouchableOpacity onPress={handleScanCard} style={styles.scanBtn}>
               <Feather name="camera" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
              <TextInput 
                placeholder="MM/YY" 
                style={styles.input} 
                keyboardType="numeric"
                value={cardDetails.expiry}
                onChangeText={(t) => setCardDetails({...cardDetails, expiry: t})}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <TextInput 
                placeholder="CVV" 
                style={styles.input} 
                keyboardType="numeric" 
                secureTextEntry
                maxLength={4}
                value={cardDetails.cvv}
                onChangeText={(t) => setCardDetails({...cardDetails, cvv: t})}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification={true} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => currentStep === 2 ? setCurrentStep(1) : router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review & Confirm</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formBody}>
          <View style={styles.stepper}>
              <View style={[styles.stepCircleActive]}><Text style={styles.stepTextActive}>1</Text></View>
              <View style={[styles.stepLine, currentStep === 2 && { backgroundColor: '#111' }]} />
              <View style={currentStep === 2 ? styles.stepCircleActive : styles.stepCircle}>
                <Text style={currentStep === 2 ? styles.stepTextActive : styles.stepText}>2</Text>
              </View>
          </View>
          {currentStep === 1 ? renderStepOne() : renderStepTwo()}
        </ScrollView>
      </KeyboardAvoidingView>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleNextStep} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#FFF" /> : (
              <><Text style={styles.submitBtnText}>{currentStep === 1 ? 'Continue' : 'Confirm Booking'}</Text><Feather name="arrow-right" size={20} color="#FFF" /></>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Auth Modal (Gcash/Maya) */}
      <Modal visible={showAuthModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={styles.authContainer}>
            <View style={styles.authHeader}>
              <Image source={linkingProvider === 'Gcash' ? gcashLogo : mayaLogo} style={styles.authLogoSmall} />
              <Text style={styles.authHeaderTitle}>Secure Link</Text>
              <TouchableOpacity onPress={() => setShowAuthModal(false)}><Ionicons name="close" size={24} color="#CCC" /></TouchableOpacity>
            </View>
            <View style={styles.authBody}>
              <Text style={styles.authInstruction}>
                {authStep === 1 ? `Enter your ${linkingProvider} mobile number.` : `Enter the 6-digit security code sent to ${phoneNumber}`}
              </Text>
              {authStep === 1 ? (
                <View style={styles.authInputWrapper}>
                  <Text style={styles.countryCode}>+63</Text>
                  <TextInput style={styles.authInputRefined} placeholder="9XX XXX XXXX" keyboardType="numeric" value={phoneNumber} onChangeText={setPhoneNumber} maxLength={10} autoFocus />
                </View>
              ) : (
                <TextInput style={styles.otpInput} placeholder="0 0 0 0 0 0" letterSpacing={10} keyboardType="numeric" value={otp} onChangeText={setOtp} maxLength={6} autoFocus />
              )}
              <TouchableOpacity style={[styles.authSubmitPrimary, (isSendingOtp || isSubmitting) && { opacity: 0.7 }]} onPress={authStep === 1 ? handleSendOtp : finalizeLinking} disabled={isSendingOtp || isSubmitting}>
                {isSendingOtp || isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.authSubmitText}>{authStep === 1 ? "Send Verification Code" : "Confirm & Link Account"}</Text>}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="check-decagram" size={70} color="#111" />
            <Text style={styles.modalTitle}>Booking Success!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); router.replace('/home/tracking/page'); }}>
              <Text style={styles.modalButtonText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Validation Error Modal */}
      <Modal visible={showErrorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContainer}>
            <View style={styles.errorIconCircle}><Feather name="alert-circle" size={32} color="#111" /></View>
            <Text style={styles.errorModalTitle}>Missing Information</Text>
            <View style={styles.errorList}>
              {errorMessages.map((msg, index) => (
                <View key={index} style={styles.errorItem}><View style={styles.errorDot} /><Text style={styles.errorItemText}>{msg}</Text></View>
              ))}
            </View>
            <TouchableOpacity style={styles.errorModalButton} onPress={() => setShowErrorModal(false)}><Text style={styles.errorModalButtonText}>Got it</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showPicker && <DateTimePicker value={date} mode={pickerMode} onChange={onPickerChange} is24Hour={false} />}
    </View>
  );
}

