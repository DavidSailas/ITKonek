import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCX9xz8QYnFNEbwK45hdKBoP7_zvbdKQ34",
  authDomain: "jms-one-it.firebaseapp.com",
  projectId: "jms-one-it",
  storageBucket: "jms-one-it.firebasestorage.app",
  messagingSenderId: "923030827484",
  appId: "1:923030827484:web:bea5e4978abdbdbe309f19",
  measurementId: "G-XF7F1X6Y21"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

let analytics = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, db, analytics, firebaseConfig };