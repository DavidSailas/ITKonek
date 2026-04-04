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
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './SignUpScreen.styles';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [error, setError] = useState({});

  const handleSignUp = async () => {
    let tempError = {};
    if (!form.firstName) tempError.firstName = 'Required';
    if (!form.lastName) tempError.lastName = 'Required';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) tempError.email = 'Invalid Email';
    if (!form.contact) tempError.contact = 'Required';
    if (form.password.length < 6) tempError.password = 'Min 6 chars';
    if (form.password !== form.confirmPassword) tempError.confirmPassword = 'Mismatch';

    setError(tempError);
    if (Object.keys(tempError).length > 0) return;

    if (!recaptchaChecked) {
      setModalMessage('Please verify that you are not a robot.');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: 'customer',
        status: 'Active',
        createdAt: new Date(),
      });

      await setDoc(doc(db, 'users', user.uid, 'customerProfile', 'profile'), {
        contactNumber: form.contact,
        preferences: { notificationsEnabled: true, loyaltyPoints: 0 },
      });

      setModalMessage('Account created successfully!');
      setModalVisible(true);
      setTimeout(() => router.push('/login/page'), 2000);
    } catch (err) {
      let msg = 'Something went wrong.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email already taken.';
      setModalMessage(msg);
      setModalVisible(true);
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
        {icon === "email" ? <MaterialIcons name="email" size={20} color="#888" /> : 
         icon === "person" ? <MaterialIcons name="person" size={20} color="#888" /> : 
         <Ionicons name="lock-closed" size={20} color="#888" />}
        
        {key === "contact" && <Text style={{ marginLeft: 8, color: '#333' }}>+63 </Text>}
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={form[key]}
          onChangeText={(val) => setForm({ ...form, [key]: val })}
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              
              {/* HEADER: Flex 1 allows it to contract when keyboard opens */}
              <View style={styles.header}>
                <Image source={require('../../assets/logo/logo.png')} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Let’s get you Started</Text>
              </View>

              {/* FORM CONTAINER: Fixed to bottom */}
              <View style={styles.formContainer}>
                {renderInput("First Name", "firstName", "person", "Enter first name")}
                {renderInput("Last Name", "lastName", "person", "Enter last name")}
                {renderInput("Email", "email", "email", "example@jmsoneit.com", false, null, true, "email-address")}
                {renderInput("Contact Number", "contact", "person", "9123456789", false, null, true, "numeric")}
                {renderInput("Password", "password", "lock", "Enter password", true, () => setShowPassword(!showPassword), showPassword)}
                {renderInput("Confirm Password", "confirmPassword", "lock", "Confirm password", true, () => setShowConfirmPassword(!showConfirmPassword), showConfirmPassword)}

                <View style={styles.recaptcha}>
                  <View style={styles.recaptchaLeft}>
                    <TouchableOpacity onPress={() => setRecaptchaChecked(!recaptchaChecked)} style={[styles.checkbox, recaptchaChecked && styles.checkboxChecked]}>
                      {recaptchaChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.recaptchaText}>I'm not a robot</Text>
                  </View>
                  <View style={styles.recaptchaImageContainer}>
                    <Image source={require('../../assets/images/recaptcha.png')} style={styles.recaptchaImage} resizeMode="contain" />
                    <Text style={styles.recaptchaTitle}>reCAPTCHA</Text>
                    <Text style={styles.recaptchaSmall}>Privacy - Terms</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpText}>Sign Up</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login/page')}>
                  <Text style={styles.backToLoginText}>
                    Already have an account? <Text style={styles.boldText}>Login</Text>
                  </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                  By signing up, you agree to the <Text style={styles.boldText}>Terms of Service</Text> and <Text style={styles.boldText}>Data Privacy</Text>
                </Text>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="information-circle" size={40} color="#000" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Notice</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}