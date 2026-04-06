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
  ActivityIndicator
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
import styles from './ChatScreen.styles';
import BottomNav from '../../components/BottomNav';

export default function ChatScreen() {
  const router = useRouter();
  const [allBookings, setAllBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubBookings = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllBookings(fetchedBookings);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubBookings();
  }, []);

  useEffect(() => {
    if (!selectedBooking) {
      setMessages([]);
      return;
    }

    const msgQuery = query(
      collection(db, "bookings", selectedBooking.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubMsgs = onSnapshot(msgQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      // MARK AS READ: If the last message is from engineer, mark it read
      msgs.forEach(msg => {
        if (msg.sender === 'engineer' && !msg.read) {
          updateDoc(doc(db, "bookings", selectedBooking.id, "messages", msg.id), { read: true });
        }
      });

      // Also update the main booking doc to reflect that the latest message is now read
      if (selectedBooking.latestSender === 'engineer') {
          updateDoc(doc(db, "bookings", selectedBooking.id), { lastRead: true });
      }

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);
    });

    return () => unsubMsgs();
  }, [selectedBooking?.id]);

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedBooking) return;
    const textToSend = inputText;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInputText('');

    try {
      await addDoc(collection(db, "bookings", selectedBooking.id, "messages"), {
        text: textToSend,
        sender: 'customer',
        read: false,
        createdAt: serverTimestamp(),
        time: currentTime,
      });

      // Update booking doc with latest message preview and time
      await updateDoc(doc(db, "bookings", selectedBooking.id), {
        latestMsg: textToSend,
        latestSender: 'customer',
        latestTime: currentTime,
        lastRead: false 
      });
    } catch (error) {
      console.error("Message Error:", error);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isCustomer = item.sender === 'customer';
    const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== item.sender;
    const isLastMessageTotal = index === messages.length - 1;
    
    return (
      <View style={[
        styles.msgWrapper, 
        isCustomer ? styles.msgRight : styles.msgLeft,
        { marginBottom: isLastInGroup ? 18 : 4 }
      ]}>
        <View style={[
          styles.bubble, 
          isCustomer ? styles.customerBubble : styles.engineerBubble,
          !isLastInGroup && (isCustomer ? { borderBottomRightRadius: 20 } : { borderBottomLeftRadius: 20 })
        ]}>
          <Text style={isCustomer ? styles.textWhite : styles.textBlack}>{item.text}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: isCustomer ? 'flex-end' : 'flex-start', alignItems: 'center', marginTop: 4 }}>
          <Text style={styles.timeText}>{item.time}</Text>
          {isCustomer && isLastMessageTotal && item.read && (
            <Text style={styles.seenText}> • Seen</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="small" color="#111" /></View>;

  if (!selectedBooking) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Messages</Text>
        </View>

        {allBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}><Feather name="message-square" size={32} color="#AAA" /></View>
            <Text style={styles.emptyTitle}>Direct support starts here</Text>
          </View>
        ) : (
          <FlatList
            data={allBookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isUnread = item.latestSender === 'engineer' && item.lastRead === false;
              const isCustomerLast = item.latestSender === 'customer';
              
              return (
                <TouchableOpacity style={styles.inboxItem} onPress={() => setSelectedBooking(item)}>
                  <Image source={require('../../assets/images/technician.png')} style={styles.inboxAvatar} />
                  <View style={styles.inboxContent}>
                    <View style={styles.inboxRow}>
                      <Text style={styles.inboxName}>Technical Support</Text>
                      <Text style={[styles.inboxStatusText, { color: item.status === 'Cancelled' ? '#DC2626' : '#22C55E' }]}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                    
                    <View style={styles.inboxMessageRow}>
                      <Text 
                        style={[
                          styles.inboxSub, 
                          isUnread ? styles.unreadText : styles.readText
                        ]} 
                        numberOfLines={1}
                      >
                        {isCustomerLast ? `You: ` : ""}{item.latestMsg || `Support session regarding ${item.serviceName}...`}
                      </Text>
                      <Text style={styles.inboxTimeSmall}> • {item.latestTime || ""}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
        <BottomNav active="chat" />
      </View>
    );
  }

  const isFinished = ['completed', 'cancelled'].includes(selectedBooking.status?.toLowerCase());

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => setSelectedBooking(null)}>
          <Feather name="chevron-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>Technical Support</Text>
          <Text style={styles.statusText}>{selectedBooking.status}</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listPadding}
          ListFooterComponent={isFinished ? (
            <View style={styles.completionSummary}>
              <MaterialCommunityIcons 
                name={selectedBooking.status === 'Cancelled' ? "close-circle" : "check-decagram"} 
                size={32} 
                color={selectedBooking.status === 'Cancelled' ? "#DC2626" : "#111"} 
              />
              <Text style={styles.summaryTitle}>Service {selectedBooking.status}</Text>
              <Text style={styles.summaryText}>
                This session has been marked as {selectedBooking.status.toLowerCase()}.
              </Text>
            </View>
          ) : null}
        />

        {!isFinished ? (
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, !inputText.trim() && { opacity: 0.3 }]} disabled={!inputText.trim()}>
                <Ionicons name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.readOnlyWrapper}>
            <Text style={styles.readOnlyText}>CONVERSATION ARCHIVED</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}