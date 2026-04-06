import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCX9xz8QYnFNEbwK45hdKBoP7_zvbdKQ34",
  authDomain: "jms-one-it.firebaseapp.com",
  projectId: "jms-one-it",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "923030827484",
  appId: "1:923030827484:web:bea5e4978abdbdbe309f19"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


export const getUserRole = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().role; 
  }
  return "user"; 
};