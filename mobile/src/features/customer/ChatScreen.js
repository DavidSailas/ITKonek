import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Keyboard,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from './ChatScreen.styles';
import BottomNav from '../../components/BottomNav';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'engineer', text: 'Hello! I am Engr. Weston. I am reviewing your request regarding the laptop screen.', time: '09:00 AM' },
    { id: '2', sender: 'customer', text: 'Great, thanks. It is a Dell XPS 13.', time: '09:01 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Android handles this better with 'undefined' + windowSoftInputMode
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.msgWrapper, item.sender === 'customer' ? styles.msgRight : styles.msgLeft]}>
              <View style={[styles.bubble, item.sender === 'customer' ? styles.customerBubble : styles.engineerBubble]}>
                <Text style={item.sender === 'customer' ? styles.textWhite : styles.textBlack}>
                  {item.text}
                </Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          )}
          contentContainerStyle={styles.listPadding}
        />

        {/* INPUT AREA: Permanent position at the bottom of the flex container */}
        <View style={[styles.inputArea, !isKeyboardVisible && styles.inputAreaWithNav]}>
          <View style={styles.searchStyleInput}>
            <TouchableOpacity style={styles.actionBtn}>
              <Feather name="plus" size={20} color="#999" />
            </TouchableOpacity>
            <TextInput
              style={styles.inputField}
              placeholder="Type a message..."
              placeholderTextColor="#AAA"
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200)}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!inputText.trim()}>
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? "#16A34A" : "#CCC"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* NAV stays absolute at the bottom */}
      {!isKeyboardVisible && <BottomNav active="chat" />}
    </View>
  );
}