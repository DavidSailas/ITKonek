import * as WebBrowser from 'expo-web-browser';
import { getFunctions, httpsCallable } from 'firebase/functions';

const handleLinking = async (walletType) => {
  const functions = getFunctions();
  const createPaymentLink = httpsCallable(functions, 'createPaymentLink');

  try {
    // 1. Call your new Cloud Function
    const result = await createPaymentLink({ 
      amount: 100, // Testing with 100 pesos
      type: walletType === 'Gcash' ? 'gcash' : 'paymaya' 
    });

    const { checkoutUrl } = result.data;

    // 2. Open the browser for the REAL SMS OTP
    // This is not a simulation. This is the official PayMongo/GCash page.
    const browserResult = await WebBrowser.openAuthSessionAsync(checkoutUrl, 'exp://');

    if (browserResult.type === 'success') {
      // 3. Update your Firestore 'isGcashLinked' state here
      Alert.alert("Verified", "Your wallet has been successfully linked!");
    }
  } catch (error) {
    Alert.alert("Error", "Could not reach payment gateway.");
  }
};