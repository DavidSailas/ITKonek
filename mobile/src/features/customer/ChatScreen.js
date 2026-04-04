import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, Image, StatusBar, Keyboard
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles, { verticalScale } from './ChatScreen.styles';
import BottomNav from '../../components/BottomNav';

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: '1', sender: 'engineer', text: 'Hello! I am Engr. Weston. I am reviewing your request.', time: '09:00 AM' },
    { id: '2', sender: 'customer', text: 'Great, thanks. It is a Dell XPS 13.', time: '09:01 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={require('../../assets/images/technician.png')} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>Engr. Weston</Text>
            <Text style={styles.statusText}>● Active Now</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callIcon}>
          <Feather name="phone" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(10) : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.msgWrapper, item.sender === 'customer' ? styles.msgRight : styles.msgLeft]}>
              <View style={[styles.bubble, item.sender === 'customer' ? styles.customerBubble : styles.engineerBubble]}>
                <Text style={item.sender === 'customer' ? styles.textWhite : styles.textBlack}>{item.text}</Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          )}
          contentContainerStyle={styles.listPadding}
        />

        <View style={[styles.inputArea, !isKeyboardVisible && styles.inputAreaWithNav]}>
          <View style={styles.searchStyleInput}>
            <TouchableOpacity style={{marginRight: 10}}><Feather name="plus" size={20} color="#999" /></TouchableOpacity>
            <TextInput
              style={styles.inputField}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!inputText.trim()}>
              <Ionicons name="send" size={20} color={inputText.trim() ? "#16A34A" : "#CCC"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {!isKeyboardVisible && <BottomNav active="chat" />}
    </View>
  );
}