import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './SignUpScreen.styles';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
  const [error, setError] = useState({ general: '' });

  const handleSignUp = async () => {
    Keyboard.dismiss();
    let tempError = { general: '' };
    
    if (!form.firstName) tempError.firstName = 'First name required';
    if (!form.lastName) tempError.lastName = 'Last name required';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) tempError.email = 'Valid email required';
    if (!form.contact) tempError.contact = 'Contact required';
    if (form.password.length < 6) tempError.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) tempError.confirmPassword = 'Passwords do not match';
    if (!securityChecked) tempError.general = 'Please verify security check.';

    setError(tempError);
    if (Object.keys(tempError).length > 1 || tempError.general) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      const batch = writeBatch(db);

      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: 'customer',
        roleId: "8yjULaDRsG7blgNBf1sg", 
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const profileRef = doc(db, 'users', user.uid, 'customerProfile', 'profile');
      batch.set(profileRef, {
        address: "",
        contactNumber: form.contact,
        dateOfBirth: "",
        preferences: {
          loyaltyPoints: 0,
          membershipStatus: "Active",
          notificationsEnabled: true,
          preferredPaymentMethod: "",
          profilePictureUrl: "",
          savedLocations: []
        }
      });

      await batch.commit();

      setSuccess(true);
      // Notifying the user to check email
      setTimeout(() => router.push('/login/page'), 3000);
    } catch (err) {
      console.error("Firestore Error:", err);
      let msg = 'Registration failed. Check your permissions or network.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already in use.';
      setError({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, key, icon, placeholder, secure = false, toggle = null, isVisible = true, keyboard = "default") => (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {error[key] && <Text style={styles.error}>{error[key]}</Text>}
      </View>
      <View style={[styles.inputGroup, error[key] && styles.errorBorder]}>
        <MaterialIcons name={icon === "lock" ? "lock-outline" : icon} size={20} color={error[key] ? "#DC2626" : "#888"} />
        {key === "contact" && <Text style={{ marginLeft: 8, color: '#111', fontWeight: '700' }}>+63 </Text>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={(val) => {
            setForm({ ...form, [key]: val });
            setError(prev => ({ ...prev, [key]: '', general: '' }));
          }}
          secureTextEntry={secure && !isVisible}
          keyboardType={keyboard}
          autoCapitalize={key === "email" ? "none" : "words"}
          placeholderTextColor="#aaa"
        />
        {toggle && (
          <TouchableOpacity onPress={toggle}>
            <Ionicons name={isVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/backgrounds/mobile-bg.png')} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Prevents "destroying" the layout on Android
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false} 
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* CRITICAL FIX: 
                We give this View the background color of your form (F8F9FA) 
                to ensure that when the keyboard pushes the view up, 
                you don't see the ImageBackground "gap" at the bottom.
            */}
            <View style={{ minHeight: Dimensions.get('window').height, backgroundColor: 'transparent' }}>
              <View style={styles.header}>
                <Image source={require('../../assets/logo/logo.png')} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join our network of IT professionals</Text>
              </View>

              <View style={[styles.formContainer, { flex: 1 }]}>
                {renderInput("First Name", "firstName", "person", "John")}
                {renderInput("Last Name", "lastName", "person", "Doe")}
                {renderInput("Email Address", "email", "email", "name@example.com", false, null, true, "email-address")}
                {renderInput("Contact Number", "contact", "phone", "912 345 6789", false, null, true, "numeric")}
                {renderInput("Password", "password", "lock", "••••••••", true, () => setShowPassword(!showPassword), showPassword)}
                {renderInput("Confirm Password", "confirmPassword", "lock", "••••••••", true, () => setShowConfirmPassword(!showConfirmPassword), showConfirmPassword)}

                <View style={[styles.recaptcha, error.general && { borderColor: '#DC2626' }]}>
                  <View style={styles.recaptchaLeft}>
                    <TouchableOpacity 
                      onPress={() => {
                        setSecurityChecked(!securityChecked);
                        setError(prev => ({...prev, general: ''}));
                      }} 
                      style={[styles.checkbox, securityChecked && styles.checkboxChecked]}
                    >
                      {securityChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.recaptchaText}>I am not a robot</Text>
                  </View>
                  <View style={styles.recaptchaImageContainer}>
                    <FontAwesome name="shield" size={18} color="#fff" />
                    <Text style={styles.recaptchaTitle}>SECURITY</Text>
                    <Text style={styles.recaptchaSmall}>Verified</Text>
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
                    <Text style={styles.successText}>Success! Check your email for a welcome message.</Text>
                  </View>
                ) : null}

                <TouchableOpacity 
                  style={[styles.signUpBtn, (loading || success) && { opacity: 0.7 }]} 
                  onPress={handleSignUp} 
                  disabled={loading || success}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpText}>Create Account</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login/page')}>
                  <Text style={styles.backToLoginText}>
                    Already have an account? <Text style={styles.boldLink}>Sign In</Text>
                  </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                  By creating an account, you agree to our{"\n"}
                  <Text style={styles.boldText}>Terms of Service</Text> and <Text style={styles.boldText}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}