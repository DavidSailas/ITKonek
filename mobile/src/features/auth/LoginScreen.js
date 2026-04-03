import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      const userSnap = await getDoc(doc(db, 'users', uid));

      if (!userSnap.exists()) {
        Alert.alert('Error', 'User data not found.');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // Handle Remember Me Logic
      if (rememberMe) {
        await AsyncStorage.setItem('@remembered_email', email);
        await AsyncStorage.setItem('@remember_me', 'true');
      } else {
        await AsyncStorage.removeItem('@remembered_email');
        await AsyncStorage.setItem('@remember_me', 'false');
      }

      // Role Based Navigation
      if (userData.role === 'customer') {
        router.replace('/home/page');
      } else if (userData.role === 'engineer') {
        router.replace('/engineer-home/page');
      } else {
        Alert.alert('Error', 'Unauthorized role.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgrounds/mobile-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              
              {/* HEADER */}
              <View style={styles.header}>
                <Image
                  source={require('../../assets/logo/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
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
                    <TextInput 
                      style={styles.input} 
                      placeholder="example@jmsoneit.com" 
                      value={email} 
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
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
                      placeholder="Enter your password" 
                      secureTextEntry={!showPassword} 
                      value={password} 
                      onChangeText={setPassword} 
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CONTROLS */}
                <View style={styles.controls}>
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View style={{ 
                      width: 20, height: 20, borderRadius: 4, borderWidth: 1, 
                      borderColor: '#ccc', alignItems: 'center', justifyContent: 'center', 
                      marginRight: 8, backgroundColor: rememberMe ? '#555' : 'transparent' 
                    }}>
                      {rememberMe && <FontAwesome name="check" size={12} color="#fff" />}
                    </View>
                    <Text style={styles.remember}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* LOGIN BUTTON */}
                <TouchableOpacity 
                  style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Log in'}</Text>
                </TouchableOpacity>

                <Text style={styles.divider}>or continue with</Text>

                {/* SOCIALS */}
                <View style={styles.socials}>
                  <TouchableOpacity style={styles.socialBtn}>
                    <Image source={require('../../assets/images/google.png')} style={{ width: 22, height: 22 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialBtn}>
                    <Image source={require('../../assets/images/apple.png')} style={{ width: 22, height: 22 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialBtn}>
                    <Image source={require('../../assets/images/facebook.png')} style={{ width: 22, height: 22 }} />
                  </TouchableOpacity>
                </View>

                {/* FOOTER */}
                <Text style={styles.footer}>
                  Don't have an account?{' '}
                  <Text onPress={() => router.push('/signup/page')} style={styles.signUpLink}>Sign Up</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}