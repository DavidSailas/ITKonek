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
      const userSnap = await getDoc(doc(db, 'users', userCred.user.uid));

      if (!userSnap.exists()) {
        Alert.alert('Error', 'User data not found.');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      if (rememberMe) {
        await AsyncStorage.setItem('@remembered_email', email);
        await AsyncStorage.setItem('@remember_me', 'true');
      } else {
        await AsyncStorage.removeItem('@remembered_email');
        await AsyncStorage.setItem('@remember_me', 'false');
      }

      if (userData.role === 'customer') {
        router.replace('/home/page');
      } else if (userData.role === 'engineer') {
        router.replace('/engineer-home/page');
      }
    } catch (err) {
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* HEADER: Flex 1 allows this area to shrink when keyboard shows */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Log in to your Account</Text>
            <Text style={styles.subtitle}>All IT services in one place</Text>
          </View>

          {/* FORM CONTAINER: No flex 1 here so it keeps its shape */}
          <View style={styles.formContainer}>
            
            <View style={styles.group}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>
                {error.email ? <Text style={styles.error}>{error.email}</Text> : null}
              </View>
              <View style={[styles.inputGroup, error.email && styles.errorBorder]}>
                <MaterialIcons name="email" size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="customer@jmsoneit.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

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
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <FontAwesome name="check" size={10} color="#fff" />}
                </View>
                <Text style={styles.remember}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Log in'}</Text>
            </TouchableOpacity>

            <Text style={styles.divider}>or continue with</Text>

            <View style={styles.socials}>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={require('../../assets/images/apple.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>

            <Text style={styles.footer}>
              Don't have an account?{' '}
              <Text onPress={() => router.push('/signup/page')} style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}