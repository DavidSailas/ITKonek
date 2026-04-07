import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
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
  const [error, setError] = useState({ email: '', password: '', general: '' });
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
        console.warn('Persistence load error', e);
      }
    })();
  }, []);

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'That email address doesn\'t look right. Please check the format.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'The email or password you entered is incorrect. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a moment before trying again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'We couldn\'t log you in right now. Please try again later.';
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    let tempError = { email: '', password: '', general: '' };
    
    if (!email) tempError.email = 'Please enter your email';
    else if (!/^\S+@\S+\.\S+$/.test(email)) tempError.email = 'Please enter a valid email';
    
    if (!password) tempError.password = 'Please enter your password';

    setError(tempError);
    if (tempError.email || tempError.password) return;

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, 'users', userCred.user.uid));

      if (!userSnap.exists()) {
        setError(prev => ({ ...prev, general: 'Account profile not found. Please sign up.' }));
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
        router.replace('/workspace/page');
      }
    } catch (err) {
      const friendlyMsg = getFriendlyErrorMessage(err.code);
      setError(prev => ({ ...prev, general: friendlyMsg }));
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
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to access your services</Text>
          </View>

          <View style={styles.formContainer}>
            
            <View style={styles.group}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email Address</Text>
                {error.email ? <Text style={styles.errorText}>{error.email}</Text> : null}
              </View>
              <View style={[styles.inputGroup, error.email && styles.errorBorder]}>
                <MaterialIcons name="email" size={20} color={error.email ? "#DC2626" : "#888"} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if(error.email || error.general) setError(prev => ({...prev, email: '', general: ''}));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            <View style={styles.group}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                {error.password ? <Text style={styles.errorText}>{error.password}</Text> : null}
              </View>
              <View style={[styles.inputGroup, error.password && styles.errorBorder]}>
                <Ionicons name="lock-closed" size={20} color={error.password ? "#DC2626" : "#888"} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if(error.password || error.general) setError(prev => ({...prev, password: '', general: ''}));
                  }}
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
                <Text style={styles.remember}>Keep me logged in</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {error.general ? (
              <View style={styles.generalErrorBox}>
                <MaterialIcons name="error-outline" size={18} color="#DC2626" />
                <Text style={styles.generalErrorText}>{error.general}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginText}>Log In</Text>
              )}
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
              New here?{' '}
              <Text onPress={() => router.push('/selection/page')} style={styles.signUpLink}>Create an account</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}