import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import styles from './LoginScreen.styles';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@remembered_email');
        const flag = await AsyncStorage.getItem('@remember_me');
        if (flag === 'true') {
          setRememberMe(true);
          if (saved) setEmail(saved);
        }
      } catch (e) {
        console.warn('Remember me load error', e);
      }
    })();
  }, []);

  const handleLogin = async () => {
    let tempError = { email: '', password: '' };

    if (!email) tempError.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) tempError.email = 'Invalid email format';

    if (!password) tempError.password = 'Password is required';

    setError(tempError);
    if (tempError.email || tempError.password) return;

    try {
      // LOGIN
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log('signIn success', userCred);
      const uid = userCred.user.uid;

      // GET USER DATA
      const userSnap = await getDoc(doc(db, 'users', uid));
      console.log('userSnap exists?', userSnap.exists && userSnap.exists());

      if (!userSnap.exists()) {
        Alert.alert('Error', 'User data not found for UID: ' + uid);
        return;
      }

      const userData = userSnap.data();
      console.log('User data:', userData);

      // CHECK ROLE
      if (userData.role === 'customer') {
        console.log('navigating to customer home');
        // persist remembered email if requested
        try {
          if (rememberMe) {
            await AsyncStorage.setItem('@remembered_email', email);
            await AsyncStorage.setItem('@remember_me', 'true');
          } else {
            await AsyncStorage.removeItem('@remembered_email');
            await AsyncStorage.setItem('@remember_me', 'false');
          }
        } catch (e) {
          console.warn('Remember me save error', e);
        }
        router.replace('/home/page');
      } else if (userData.role === 'engineer') {
        console.log('navigating to engineer home');
        try {
          if (rememberMe) {
            await AsyncStorage.setItem('@remembered_email', email);
            await AsyncStorage.setItem('@remember_me', 'true');
          } else {
            await AsyncStorage.removeItem('@remembered_email');
            await AsyncStorage.setItem('@remember_me', 'false');
          }
        } catch (e) {
          console.warn('Remember me save error', e);
        }
        router.replace('/engineer-home/page');
      } else {
        Alert.alert('Error', 'Unauthorized role: ' + (userData.role || 'unknown'));
      }
    } catch (err) {
      console.error('Login error', err);
      const message = err?.message || 'Login failed. Try again.';
      Alert.alert('Login error', message);
      if (err?.code === 'auth/user-not-found') {
        setError({ email: 'No account found with this email', password: '' });
      } else if (err?.code === 'auth/wrong-password') {
        setError({ email: 'Incorrect password', password: '' });
      } else {
        setError({ email: message, password: '' });
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgrounds/mobile-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo/logo.png')}
          style={{ width: 72, height: 72, marginBottom: 12, alignSelf: 'center', tintColor: '#fff' }}
          resizeMode="contain"
          accessibilityLabel="ITKonek logo"
        />
        <Text style={styles.title}>Log in to your Account</Text>
        <Text style={styles.subtitle}>All IT services in one place</Text>
      </View>

      {/* FORM CONTAINER */}
      <View style={styles.formContainer}>
        {/* EMAIL */}
        <View style={styles.group}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Email</Text>
            {error.email ? <Text style={styles.error}>{error.email}</Text> : null}
          </View>

          <View style={[styles.inputGroup, error.email && styles.errorBorder]}>
            <MaterialIcons name="email" size={20} color="#888" />
            <TextInput style={styles.input} placeholder="example@jmsoneit.com" value={email} onChangeText={setEmail} />
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
            <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTROLS */}
        <View style={[styles.controls, { alignItems: 'center' }]}>
          <TouchableOpacity
            onPress={async () => {
              const next = !rememberMe;
              setRememberMe(next);
              try {
                await AsyncStorage.setItem('@remember_me', next ? 'true' : 'false');
                if (!next) await AsyncStorage.removeItem('@remembered_email');
              } catch (e) {
                console.warn('Remember me toggle error', e);
              }
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
          >
            <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center', marginRight: 8, backgroundColor: rememberMe ? '#4285F4' : 'transparent' }}>
              {rememberMe ? <FontAwesome name="check" size={12} color="#fff" /> : null}
            </View>
            <Text style={styles.remember}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        {/* DIVIDER */}
        <Text style={styles.divider}>or continue with</Text>

        {/* SOCIALS */}
        <View style={styles.socials}>
          <TouchableOpacity
            style={[styles.socialBtn, { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 }]}
            accessibilityLabel="Sign in with Google"
          >
            <Image source={require('../../assets/images/google.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require('../../assets/images/apple.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require('../../assets/images/facebook.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
          <Text style={styles.footer}>
          Don't have an account?{' '}
          <Text onPress={() => router.push('/signup/page')} style={{ fontWeight: 'bold' }}>Sign Up</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}