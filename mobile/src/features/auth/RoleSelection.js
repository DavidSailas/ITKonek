import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './LoginScreen.styles'; // Import shared styles

export default function RoleSelection() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../../assets/backgrounds/mobile-bg.png')} style={styles.container} resizeMode="cover">
      <View style={styles.header}>
        <Image source={require('../../assets/logo/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Join as a...</Text>
        <Text style={styles.subtitle}>Choose your path in ITKonek</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.label, { marginBottom: 20, textAlign: 'center' }]}>Select Account Type</Text>

        {/* Customer Choice */}
        <TouchableOpacity style={localStyles.card} onPress={() => router.push('/signup/page')}>
          <View style={localStyles.iconBox}>
            <MaterialIcons name="person" size={28} color="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={localStyles.cardTitle}>Customer</Text>
            <Text style={localStyles.cardSub}>I need my devices repaired</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BBB" />
        </TouchableOpacity>

        {/* Engineer Choice */}
        <TouchableOpacity style={localStyles.card} onPress={() => router.push('/signup/engineer')}>
          <View style={localStyles.iconBox}>
            <FontAwesome5 name="tools" size={22} color="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={localStyles.cardTitle}>IT Engineer</Text>
            <Text style={localStyles.cardSub}>I want to provide IT services</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BBB" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login/page')} style={{ marginTop: 20 }}>
          <Text style={styles.footer}>
            Back to <Text style={styles.signUpLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  cardSub: { fontSize: 12, color: '#888' },
});