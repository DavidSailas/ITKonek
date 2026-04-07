import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ImageBackground,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Keyboard, TouchableWithoutFeedback, StyleSheet, Modal
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import styles from './SignUpScreen.styles';

// Firebase Imports
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../../services/firebase'; 

export default function EngineerSignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPass, setGeneratedPass] = useState('');
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    address: '',
    primaryRole: '',
    idPhoto: null,
    userPhoto: null,
  });

  const roles = ["IT Support", "Network Engineer", "Hardware Specialist", "Software Specialist"];
  const specsList = ["Laptop Repair", "Desktop Repair", "Mobile Repair", "Network Setup", "Software Installation"];

  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [securityChecked, setSecurityChecked] = useState(false);
  const [error, setError] = useState({ general: '' });

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let retVal = "";
    for (let i = 0; i < 10; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return retVal;
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(generatedPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pickImage = async (key) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4, // Reduced quality slightly for faster Firestore writes
    });

    if (!result.canceled) {
      setForm({ ...form, [key]: result.assets[0].uri });
      setError(prev => ({...prev, [key]: false, general: ''}));
    }
  };

  const toggleSpec = (spec) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
    setError(prev => ({...prev, specs: '', general: ''}));
  };

  const handleEngineerSubmit = async () => {
    Keyboard.dismiss();
    let tempError = { general: '' };
    if (!form.firstName) tempError.firstName = 'Required';
    if (!form.lastName) tempError.lastName = 'Required';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) tempError.email = 'Invalid email';
    if (!form.contact) tempError.contact = 'Required';
    if (!form.primaryRole) tempError.primaryRole = 'Select a role';
    if (selectedSpecs.length === 0) tempError.specs = 'Select at least one skill';
    if (!form.idPhoto) tempError.idPhoto = true;
    if (!form.userPhoto) tempError.userPhoto = true;
    if (!securityChecked) tempError.general = 'Security verification required.';

    setError(tempError);
    if (Object.keys(tempError).length > 1 || tempError.general) return;

    setLoading(true);
    const password = generatePassword();
    setGeneratedPass(password);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, password);
      const user = userCredential.user;

      // 2. Main User Doc
      await setDoc(doc(db, 'users', user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        contact: form.contact,
        role: 'engineer',
        roleId: 'QsTPKDSom1VWm4WiPSWe',
        status: 'Active',
        isOnline: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3. Sub-collection details
      await setDoc(doc(db, 'users', user.uid, 'engineerProfile', 'details'), {
        address: form.address,
        primaryRole: form.primaryRole,
        specializations: selectedSpecs,
        idPhoto: form.idPhoto,
        userPhoto: form.userPhoto,
        verificationStatus: 'pending_approval',
        updatedAt: serverTimestamp(),
      });

      // Success!
      setShowSuccessModal(true);
      
      // Clear session so they have to login with the generated password
      await signOut(auth);

    } catch (err) {
      console.error("Signup Error Details:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError({ general: 'This email is already registered.' });
      } else if (err.code === 'permission-denied') {
        setError({ general: 'Database permission error. Check security rules.' });
      } else {
        setError({ general: 'Registration failed. Please check your connection.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, key, icon, placeholder, keyboard = "default", multiline = false) => (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {error[key] && <Text style={styles.error}>{error[key]}</Text>}
      </View>
      <View style={[styles.inputGroup, error[key] && styles.errorBorder, multiline && { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
        <MaterialIcons name={icon} size={20} color={error[key] ? "#DC2626" : "#888"} />
        {key === "contact" && <Text style={{ marginLeft: 8, color: '#333', fontWeight: '600' }}>+63 </Text>}
        <TextInput
          style={[styles.input, multiline && { textAlignVertical: 'top' }]}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={(val) => {
            setForm({ ...form, [key]: val });
            setError(prev => ({...prev, [key]: '', general: ''}));
          }}
          keyboardType={keyboard}
          multiline={multiline}
          autoCapitalize={key === "email" ? "none" : "words"}
          placeholderTextColor="#aaa"
        />
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/backgrounds/mobile-bg.png')} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <Image source={require('../../assets/logo/logo.png')} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Partner Application</Text>
                <Text style={styles.subtitle}>Professional Verification Process</Text>
              </View>

              <View style={styles.formContainer}>
                {renderInput("First Name", "firstName", "person", "Enter first name")}
                {renderInput("Last Name", "lastName", "person", "Enter last name")}
                {renderInput("Email Address", "email", "email", "work@example.com", "email-address")}
                {renderInput("Contact Number", "contact", "phone", "912 345 6789", "numeric")}
                {renderInput("Residential Address", "address", "location-on", "Street, Barangay, City", "default", true)}

                <Text style={[styles.label, { marginTop: 10, marginBottom: 12 }]}>Identity Verification</Text>
                <View style={localStyles.photoRow}>
                  <TouchableOpacity style={[localStyles.photoUploadBtn, error.idPhoto && styles.errorBorder]} onPress={() => pickImage('idPhoto')}>
                    {form.idPhoto ? <Image source={{ uri: form.idPhoto }} style={localStyles.previewImage} /> : 
                    <><MaterialIcons name="badge" size={28} color="#888" /><Text style={localStyles.photoText}>Government ID</Text></>}
                  </TouchableOpacity>
                  <TouchableOpacity style={[localStyles.photoUploadBtn, error.userPhoto && styles.errorBorder]} onPress={() => pickImage('userPhoto')}>
                    {form.userPhoto ? <Image source={{ uri: form.userPhoto }} style={localStyles.previewImage} /> : 
                    <><MaterialIcons name="add-a-photo" size={28} color="#888" /><Text style={localStyles.photoText}>Profile Photo</Text></>}
                  </TouchableOpacity>
                </View>

                <Text style={[styles.label, { marginTop: 10, marginBottom: 12 }]}>Primary Expertise {error.primaryRole && <Text style={styles.error}>({error.primaryRole})</Text>}</Text>
                <View style={localStyles.chipContainer}>
                  {roles.map(role => (
                    <TouchableOpacity key={role} style={[localStyles.chip, form.primaryRole === role && localStyles.chipActive]} onPress={() => {setForm({...form, primaryRole: role}); setError(prev => ({...prev, primaryRole: ''}))}}>
                      <Text style={[localStyles.chipText, form.primaryRole === role && localStyles.chipTextActive]}>{role}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.label, { marginTop: 20, marginBottom: 12 }]}>Specializations {error.specs && <Text style={styles.error}>({error.specs})</Text>}</Text>
                <View style={localStyles.chipContainer}>
                  {specsList.map(spec => (
                    <TouchableOpacity key={spec} style={[localStyles.chip, selectedSpecs.includes(spec) && localStyles.chipActiveMulti]} onPress={() => toggleSpec(spec)}>
                      <Text style={[localStyles.chipText, selectedSpecs.includes(spec) && localStyles.chipTextActive]}>{spec}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={[styles.recaptcha, {marginTop: 20}, error.general && {borderColor: '#DC2626'}]}>
                  <View style={styles.recaptchaLeft}>
                    <TouchableOpacity onPress={() => {setSecurityChecked(!securityChecked); setError(prev => ({...prev, general: ''}))}} style={[styles.checkbox, securityChecked && styles.checkboxChecked]}>
                      {securityChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.recaptchaText}>I confirm these details are accurate</Text>
                  </View>
                </View>

                {error.general ? (
                  <View style={styles.generalErrorBox}>
                    <MaterialIcons name="error-outline" size={18} color="#DC2626" />
                    <Text style={styles.generalErrorText}>{error.general}</Text>
                  </View>
                ) : null}

                <TouchableOpacity style={[styles.signUpBtn, loading && {opacity: 0.7}]} onPress={handleEngineerSubmit} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpText}>Submit Application</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login/page')} style={{ marginBottom: 20 }}>
                  <Text style={styles.backToLoginText}>Return to <Text style={styles.boldLink}>Sign In</Text></Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.successHeader}>
               <View style={localStyles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={40} color="#000" />
               </View>
               <Text style={localStyles.modalTitle}>Application Received</Text>
               <Text style={localStyles.modalSub}>Engineer credentials have been generated.</Text>
            </View>

            <View style={localStyles.passContainer}>
               <Text style={localStyles.passLabel}>TEMPORARY ACCESS KEY</Text>
               <View style={localStyles.passBox}>
                  <Text style={localStyles.passText}>{generatedPass}</Text>
                  <TouchableOpacity onPress={copyToClipboard} style={localStyles.copyBtn}>
                    <Feather name={copied ? "check" : "copy"} size={18} color={copied ? "#4CAF50" : "#666"} />
                  </TouchableOpacity>
               </View>
               {copied && <Text style={localStyles.copiedText}>Copied to clipboard!</Text>}
            </View>

            <View style={localStyles.instructions}>
               <Text style={localStyles.instructionHeader}>Next Steps:</Text>
               <View style={localStyles.step}><Text style={localStyles.stepText}>• Use your email and the key above to login.</Text></View>
               <View style={localStyles.step}><Text style={localStyles.stepText}>• Complete your profile verification inside.</Text></View>
            </View>

            <TouchableOpacity 
              style={localStyles.finishBtn} 
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/login/page');
              }}
            >
              <Text style={localStyles.finishBtnText}>Go to Login</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  photoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginBottom: 20 },
  photoUploadBtn: { flex: 1, height: 120, borderRadius: 16, borderWidth: 1.5, borderColor: '#EEE', borderStyle: 'dashed', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  photoText: { fontSize: 11, color: '#999', marginTop: 8, fontWeight: '700', textTransform: 'uppercase' },
  previewImage: { width: '100%', height: '100%' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 25, borderWidth: 1.5, borderColor: '#EEE', backgroundColor: '#FFF' },
  chipActive: { backgroundColor: '#000', borderColor: '#000' },
  chipActiveMulti: { backgroundColor: '#333', borderColor: '#333' },
  chipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 25 },
  modalContent: { backgroundColor: '#FFF', width: '100%', borderRadius: 30, padding: 30, alignItems: 'center' },
  successHeader: { alignItems: 'center', marginBottom: 25 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#111', textAlign: 'center' },
  modalSub: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 },
  passContainer: { width: '100%', marginBottom: 25 },
  passLabel: { fontSize: 10, fontWeight: '900', color: '#AAA', marginBottom: 8, letterSpacing: 1, textAlign: 'center' },
  passBox: { flexDirection: 'row', backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#EEE', borderRadius: 15, paddingHorizontal: 20, paddingVertical: 18, alignItems: 'center', justifyContent: 'space-between' },
  passText: { fontSize: 18, fontWeight: 'bold', color: '#000', letterSpacing: 1.5 },
  copyBtn: { padding: 5 },
  copiedText: { fontSize: 11, color: '#4CAF50', fontWeight: '700', marginTop: 8, textAlign: 'center' },
  instructions: { width: '100%', backgroundColor: '#FAFAFA', padding: 15, borderRadius: 15, marginBottom: 25 },
  instructionHeader: { fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 8 },
  step: { marginBottom: 4 },
  stepText: { fontSize: 12, color: '#666', lineHeight: 18 },
  finishBtn: { backgroundColor: '#000', width: '100%', height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  finishBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});