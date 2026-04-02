import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './SignUpScreen.styles';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !contact || !password || !confirmPassword) {
      setModalMessage('Please complete all required fields before proceeding.');
      setModalVisible(true);
      return;
    }

    let tempError = {
      firstName: !firstName ? 'First name is required' : '',
      lastName: !lastName ? 'Last name is required' : '',
      email: !email
        ? 'Email is required'
        : !/^\S+@\S+\.\S+$/.test(email)
        ? 'Invalid email format'
        : '',
      contact: !contact ? 'Contact number is required' : '',
      password: !password ? 'Password is required' : '',
      confirmPassword:
        !confirmPassword
          ? 'Confirm your password'
          : password !== confirmPassword
          ? 'Passwords do not match'
          : '',
    };

    setError(tempError);

    if (Object.values(tempError).some((v) => v !== '')) return;

    if (!recaptchaChecked) {
      setModalMessage('Please verify that you are not a robot.');
      setModalVisible(true);
      return;
    }

    try {
      // 🔐 Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Save main user document
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role: 'customer',
        roleId: '8yjUIaDRsG7blgNBf1sg',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 🔹 Save subcollection 'customerProfile'
      try {
        await setDoc(doc(db, 'users', user.uid, 'customerProfile', 'profile'), {
          address: '',
          contactNumber: contact,
          dateOfBirth: '',
          preferences: {
            notificationsEnabled: true,
            preferredPaymentMethod: '',
            savedLocations: [],
            profilePictureUrl: '',
            membershipStatus: 'Active',
            loyaltyPoints: 0,
          },
        });
        console.log('Subcollection created successfully');
      } catch (subError) {
        console.error('Error creating customerProfile subcollection:', subError);
        setModalMessage('Account created, but failed to create profile data. Contact admin.');
        setModalVisible(true);
        return;
      }

      setModalMessage('Account created successfully!');
      setModalVisible(true);

      setTimeout(() => {
        router.push('/login/page');
      }, 1500);

    } catch (err) {
      console.error('SignUp Error:', err); // Logs the full Firebase error
      let message = 'Something went wrong. Please try again.';
      if (err.code === 'auth/email-already-in-use') message = 'Email is already registered.';
      else if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      else if (err.code === 'auth/invalid-email') message = 'Invalid email address.';
      setModalMessage(message);
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgrounds/mobile-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={{ width: 72, height: 72, marginBottom: 12, alignSelf: 'center', tintColor: '#fff' }}
            resizeMode="contain"
            accessibilityLabel="ITKonek logo"
          />
          <Text style={styles.title}>Let’s get you Started</Text>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>

          {/* FIRST NAME */}
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>First Name</Text>
              {error.firstName ? <Text style={styles.error}>{error.firstName}</Text> : null}
            </View>

            <View style={[styles.inputGroup, error.firstName && styles.errorBorder]}>
              <MaterialIcons name="person" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          {/* LAST NAME */}
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Last Name</Text>
              {error.lastName ? <Text style={styles.error}>{error.lastName}</Text> : null}
            </View>

            <View style={[styles.inputGroup, error.lastName && styles.errorBorder]}>
              <MaterialIcons name="person" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* EMAIL */}
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Email</Text>
              {error.email ? <Text style={styles.error}>{error.email}</Text> : null}
            </View>

            <View style={[styles.inputGroup, error.email && styles.errorBorder]}>
              <MaterialIcons name="email" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="example@jmsoneit.com"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* CONTACT */}
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Contact Number</Text>
              {error.contact ? <Text style={styles.error}>{error.contact}</Text> : null}
            </View>

            <View style={[styles.inputGroup, error.contact && styles.errorBorder]}>
              <Text style={{ marginRight: 8 }}>🇵🇭 +63</Text>
              <TextInput
                style={styles.input}
                placeholder="9123456789"
                keyboardType="numeric"
                value={contact}
                onChangeText={setContact}
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              {error.password ? <Text style={styles.error}>{error.password}</Text> : null}
            </View>

            <View style={[styles.inputGroup, error.password && styles.errorBorder]}>
              <Ionicons name="lock-closed" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.group}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Confirm Password</Text>
              {error.confirmPassword ? <Text style={styles.error}>{error.confirmPassword}</Text> : null}
            </View>

            <View style={[styles.inputGroup, error.confirmPassword && styles.errorBorder]}>
              <Ionicons name="lock-closed" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* RECAPTCHA */}
          <View style={styles.recaptcha}>
            <View style={styles.recaptchaLeft}>
              <TouchableOpacity
                onPress={() => setRecaptchaChecked(!recaptchaChecked)}
                style={[styles.checkbox, recaptchaChecked && styles.checkboxChecked]}
              >
                {recaptchaChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.recaptchaText}>I'm not a robot</Text>
            </View>

            <View style={styles.recaptchaImageContainer}>
              <Image
                source={require('../../assets/images/recaptcha.png')}
                style={styles.recaptchaImage}
              />
              <Text style={styles.recaptchaTitle}>reCAPTCHA</Text>
              <Text style={styles.recaptchaSmall}>Privacy - Terms</Text>
            </View>
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <TouchableOpacity style={styles.backToLoginBtn} onPress={() => router.push('/login/page')}>
            <Text style={styles.backToLoginText}>
              Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
            </Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <Text style={styles.footer}>
            By signing up, you agree to the{' '}
            <Text style={{ fontWeight: 'bold' }}>Terms of Service</Text> and{' '}
            <Text style={{ fontWeight: 'bold' }}>Data Privacy Agreement</Text>
          </Text>

        </View>
      </ScrollView>

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle" size={40} color="#000" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Notice</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}