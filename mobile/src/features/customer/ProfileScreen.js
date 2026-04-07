import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Image, TextInput, 
  ActivityIndicator, Modal, KeyboardAvoidingView, Platform, 
  SafeAreaView, StatusBar, Alert, Pressable 
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; 
import { auth, db } from '../../services/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from 'firebase/auth';
import BottomNav from '../../components/BottomNav';
import { styles } from './ProfileScreen.styles';

const avatarNeutral = require('../../assets/images/avatar_neutral.png');
const avatarMale = require('../../assets/images/avatar_male.png');
const avatarFemale = require('../../assets/images/avatar_female.png');

export default function ProfileScreen() {
  const router = useRouter();
  const [view, setView] = useState('main');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Modals & Feedback
  const [passwordModal, setPasswordModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false); 
  
  const [userData, setUserData] = useState({
    firstName: '', lastName: '', email: '', contactNumber: '',
    address: '', city: '', zipCode: '', dateOfBirth: '', gender: '', role: 'customer',
    profileImage: null 
  });

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    // 1. Listen for Auth Changes to handle cleanup safely
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        // If user is gone, stop loading and clear data
        setFetching(false);
        setUserData({ firstName: '', lastName: '', email: '' });
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener on unmount
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const profileRef = doc(db, "users", uid, "customerProfile", "profile");
      
      const [uSnap, pSnap] = await Promise.all([getDoc(userRef), getDoc(profileRef)]);
      
      if (uSnap.exists()) {
        const u = uSnap.data();
        const p = pSnap.exists() ? pSnap.data() : {};
        setUserData({
          firstName: u.firstName || '', lastName: u.lastName || '',
          email: u.email || auth.currentUser?.email, role: u.role || 'customer',
          contactNumber: p.contactNumber || '', address: p.address || '', 
          city: p.city || '', zipCode: p.zipCode || '',
          dateOfBirth: p.dateOfBirth || '', gender: p.gender || '', 
          profileImage: p.profileImage || null
        });
      }
    } catch (e) { 
      console.error("Fetch Error:", e); 
    } finally { 
      setFetching(false); 
    }
  };

  const executeSignOut = async () => {
    setLoading(true);
    try {
      setSignOutModal(false);
      // We clear the state immediately before signing out to stop re-renders
      setUserData({ firstName: '', lastName: '', email: '' }); 

      await auth.signOut();
      
      // Use replace to ensure the user cannot go "back" into a protected screen
      router.replace('/login/page');
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    setMediaModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Gallery access is needed to change your photo.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) { saveProfileImage(result.assets[0].uri); }
  };

  const handleTakePhoto = async () => {
    setMediaModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Camera access is required to take a photo.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) { saveProfileImage(result.assets[0].uri); }
  };

  const saveProfileImage = async (uri) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const profileRef = doc(db, "users", user.uid, "customerProfile", "profile");
      await updateDoc(profileRef, { profileImage: uri, updatedAt: serverTimestamp() });
      setUserData(prev => ({ ...prev, profileImage: uri }));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save photo.");
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { firstName: userData.firstName, lastName: userData.lastName });
      await updateDoc(doc(db, "users", user.uid, "customerProfile", "profile"), {
        contactNumber: userData.contactNumber, address: userData.address,
        city: userData.city, zipCode: userData.zipCode, gender: userData.gender,
        updatedAt: serverTimestamp()
      });
      setView('main');
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const onUpdatePassword = async () => {
    if (passwords.next !== passwords.confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, passwords.current);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, passwords.next);
      setModalSuccess(true);
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => { setPasswordModal(false); setModalSuccess(false); }, 2200);
    } catch (e) { 
      Alert.alert("Auth Error", "Current password may be incorrect.");
    } finally { setLoading(false); }
  };

  const renderAvatar = () => {
    if (userData.profileImage) { return <Image source={{ uri: userData.profileImage }} style={styles.avatar} />; }
    const g = userData.gender?.toLowerCase();
    const src = g === 'male' ? avatarMale : g === 'female' ? avatarFemale : avatarNeutral;
    return <Image source={src} style={styles.avatar} />;
  };

  if (fetching) return <View style={styles.loader}><ActivityIndicator color="#000" size="large" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {view === 'main' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileHero}>
            <View style={styles.avatarWrapper}>
              {renderAvatar()}
              <TouchableOpacity style={styles.editBadge} onPress={() => setMediaModal(true)} activeOpacity={0.7}>
                {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Feather name="camera" size={14} color="#FFF" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{userData.firstName ? `${userData.firstName} ${userData.lastName}` : 'User'}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>Jobs</Text></View>
            <View style={[styles.statBox, styles.statBorder]}><Text style={styles.statNum}>4.9</Text><Text style={styles.statLabel}>Rating</Text></View>
            <View style={styles.statBox}><Text style={styles.statNum}>2</Text><Text style={styles.statLabel}>Active</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <MenuOption icon="user" label="Personal Information" subLabel="Name, Phone, Gender" onPress={() => setView('editProfile')} />
            <MenuOption icon="map-pin" label="Saved Addresses" subLabel="Street, City, Zip Code" onPress={() => setView('savedAddress')} />
            <MenuOption icon="shield" label="Security & Login" subLabel="Manage your password" onPress={() => setView('security')} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <MenuOption icon="help-circle" label="Help Center" onPress={() => {}} />
            <MenuOption icon="message-square" label="Technician Chat" onPress={() => router.push('/chat/page')} />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => setSignOutModal(true)}>
            <Feather name="log-out" size={18} color="#FF3B30" /><Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>ITKonek v1.0.6</Text>
          <View style={{height: 120}} />
        </ScrollView>
      ) : (
        <View style={styles.subViewContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setView('main')}><Feather name="chevron-left" size={24} color="#000" /></TouchableOpacity>
            <Text style={styles.headerTitle}>
              {view === 'editProfile' ? 'Personal Info' : view === 'savedAddress' ? 'Saved Address' : 'Security'}
            </Text>
            {view !== 'security' ? (
              <TouchableOpacity onPress={handleSave}>
                {loading ? <ActivityIndicator size="small" color="#000"/> : <Text style={styles.saveText}>Save</Text>}
              </TouchableOpacity>
            ) : <View style={{width: 24}} />}
          </View>

          <ScrollView style={styles.formContainer}>
            {view === 'editProfile' && (
              <>
                <InputBlock label="First Name" value={userData.firstName} onChange={(t) => setUserData({...userData, firstName: t})} />
                <InputBlock label="Last Name" value={userData.lastName} onChange={(t) => setUserData({...userData, lastName: t})} />
                <InputBlock label="Phone" value={userData.contactNumber} onChange={(t) => setUserData({...userData, contactNumber: t})} keyboard="phone-pad" />
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  {['Male', 'Female'].map(g => (
                    <TouchableOpacity key={g} style={[styles.genderBtn, userData.gender === g && styles.genderActive]} onPress={() => setUserData({...userData, gender: g})}>
                      <Text style={[styles.genderBtnText, userData.gender === g && styles.genderTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {view === 'savedAddress' && (
              <>
                <InputBlock label="Street" value={userData.address} onChange={(t) => setUserData({...userData, address: t})} multiline />
                <InputBlock label="City" value={userData.city} onChange={(t) => setUserData({...userData, city: t})} />
                <InputBlock label="Zip" value={userData.zipCode} onChange={(t) => setUserData({...userData, zipCode: t})} keyboard="number-pad" />
              </>
            )}

            {view === 'security' && (
              <View style={{marginTop: 10}}>
                <MenuOption icon="lock" label="Change Password" subLabel="Last updated recently" onPress={() => setPasswordModal(true)} />
                <MenuOption icon="mail" label="Verified Email" subLabel={userData.email} />
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* PHOTO PICKER MODAL */}
      <Modal visible={mediaModal} animationType="slide" transparent={true}>
        <Pressable style={styles.modalOverlayBottom} onPress={() => setMediaModal(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitleCenter}>Profile Photo</Text>
            <View style={styles.sheetActionContainer}>
              <TouchableOpacity style={styles.sheetActionBtn} onPress={handleTakePhoto}>
                <View style={styles.sheetActionIcon}><Feather name="camera" size={20} color="#000" /></View>
                <Text style={styles.sheetActionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetActionBtn} onPress={handlePickImage}>
                <View style={styles.sheetActionIcon}><Feather name="image" size={20} color="#000" /></View>
                <Text style={styles.sheetActionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <View style={styles.sheetDivider} />
              <TouchableOpacity style={[styles.sheetActionBtn, { marginBottom: 0 }]} onPress={() => setMediaModal(false)}>
                <View style={[styles.sheetActionIcon, { backgroundColor: '#FEE' }]}><Feather name="x" size={20} color="#FF3B30" /></View>
                <Text style={[styles.sheetActionText, { color: '#FF3B30' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* PASSWORD MODAL */}
      <Modal visible={passwordModal} animationType="fade" transparent>
        <View style={styles.modalOverlayCenter}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {!modalSuccess ? (
                <>
                  <View style={styles.modalHeader}>
                    <View><Text style={styles.modalTitle}>Update Security</Text><Text style={styles.modalSub}>Manage credentials</Text></View>
                    <TouchableOpacity onPress={() => setPasswordModal(false)}><Feather name="x" size={20} color="#888" /></TouchableOpacity>
                  </View>
                  <InputBlock label="Current Password" password value={passwords.current} onChange={(t) => setPasswords({...passwords, current: t})} />
                  <InputBlock label="New Password" password value={passwords.next} onChange={(t) => setPasswords({...passwords, next: t})} />
                  <InputBlock label="Confirm New Password" password value={passwords.confirm} onChange={(t) => setPasswords({...passwords, confirm: t})} />
                  <TouchableOpacity style={styles.primaryBtnFull} onPress={onUpdatePassword} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Update Credentials</Text>}
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <View style={styles.successCircle}><Ionicons name="checkmark" size={40} color="#000" /></View>
                  <Text style={styles.successTitle}>Security Updated</Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* SIGN OUT MODAL */}
      <Modal visible={signOutModal} animationType="slide" transparent={true}>
        <Pressable style={styles.modalOverlayBottom} onPress={() => setSignOutModal(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.signOutHeader}>
                <View style={styles.signOutIconContainer}>
                    <MaterialCommunityIcons name="logout-variant" size={28} color="#FF3B30" />
                </View>
                <Text style={styles.signOutTitle}>Log Out of ITKonek?</Text>
                <Text style={styles.signOutSubtitle}>You will need to re-enter your credentials to access your account again.</Text>
            </View>
            <View style={styles.signOutActionRow}>
                <TouchableOpacity style={styles.signOutCancelBtn} onPress={() => setSignOutModal(false)}>
                    <Text style={styles.signOutCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signOutConfirmBtn} onPress={executeSignOut} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.signOutConfirmText}>Logout</Text>}
                </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <BottomNav activeTab="profile" />
    </SafeAreaView>
  );
}

const MenuOption = ({ icon, label, subLabel, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.menuLeft}>
      <View style={styles.iconCircle}><Feather name={icon} size={18} color="#000" /></View>
      <View><Text style={styles.menuLabel}>{label}</Text>{subLabel && <Text style={styles.menuSubLabel}>{subLabel}</Text>}</View>
    </View>
    {onPress && <Feather name="chevron-right" size={16} color="#CCC" />}
  </TouchableOpacity>
);

const InputBlock = ({ label, value, onChange, keyboard = "default", multiline = false, password = false }) => (
  <View style={{marginBottom: 18}}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      style={[styles.input, multiline && {height: 80, textAlignVertical: 'top'}]} 
      value={value} onChangeText={onChange} keyboardType={keyboard} multiline={multiline} 
      secureTextEntry={password} placeholderTextColor="#BBB"
    />
  </View>
);