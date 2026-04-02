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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './ChatScreen.styles';
import BottomNav from '../../components/BottomNav';

// Mock previous messages (replace with Firebase later)
const mockMessages = [
  { id: '1', sender: 'engineer', text: 'Hello! How can I help you?', time: '09:00 AM' },
  { id: '2', sender: 'customer', text: 'My laptop screen is broken.', time: '09:01 AM' },
  { id: '3', sender: 'engineer', text: 'I see. Can you tell me the model?', time: '09:02 AM' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'customer' ? styles.customerMessage : styles.engineerMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/images/technician.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.engineerName}>Eng. Weston</Text>
            <Text style={styles.engineerStatus}>Online</Text>
          </View>
        </View>
        <Ionicons name="call-outline" size={24} color="#000" />
      </View>

      {/* CHAT MESSAGES */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />

      {/* INPUT BAR */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* BOTTOM NAV */}
      <BottomNav active="chat" />
    </KeyboardAvoidingView>
  );
}