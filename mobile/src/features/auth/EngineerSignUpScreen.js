import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ImageBackground,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Keyboard, TouchableWithoutFeedback, StyleSheet, Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import styles from './SignUpScreen.styles';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function EngineerSignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const pickImage = async (key) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Access Denied", "We need camera access to verify your identity.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
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
    try {
      const applicationRef = doc(db, 'engineer_applications', form.email);
      await setDoc(applicationRef, {
        ...form,
        specializations: selectedSpecs,
        status: 'pending_approval',
        appliedAt: new Date(),
        role: 'engineer'
      });

      setSuccess(true);
      setTimeout(() => router.push('/login/page'), 3000);
    } catch (err) {
      setError({ general: 'Failed to submit application. Please check your connection.' });
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

                {success ? (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                    <Text style={styles.successText}>Application Sent! We'll be in touch.</Text>
                  </View>
                ) : null}

                <TouchableOpacity style={[styles.signUpBtn, (loading || success) && {opacity: 0.7}]} onPress={handleEngineerSubmit} disabled={loading || success}>
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
  chipTextActive: { color: '#FFF', fontWeight: 'bold' }
});