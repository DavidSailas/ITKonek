import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './BookForm.styles';

export default function BookForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // --- Form States ---
  const [urgency, setUrgency] = useState('Standard');
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState(''); // String for rendering
  const [timeText, setTimeText] = useState(''); // String for rendering
  
  // --- UI States ---
  const [modalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [error, setError] = useState({});

  // Keyboard Listener to hide footer
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleNextStep = () => {
    let tempError = {};
    if (currentStep === 1) {
      if (!serviceName.trim()) tempError.serviceName = 'Required';
      if (!description.trim()) tempError.description = 'Required';
      
      setError(tempError);
      if (Object.keys(tempError).length === 0) setCurrentStep(2);
    } else {
      if (!dateText) tempError.date = 'Required';
      if (!timeText) tempError.time = 'Required';
      
      setError(tempError);
      if (Object.keys(tempError).length === 0) {
        setModalVisible(true);
      }
    }
  };

  const onPickerChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false);
    
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (pickerMode === 'date') {
        const formattedDate = currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: '2-digit', 
          year: 'numeric' 
        });
        setDateText(formattedDate);
        setError({ ...error, date: null });
      } else {
        const formattedTime = currentDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        setTimeText(formattedTime);
        setError({ ...error, time: null });
      }
    }
  };

  const renderStepOne = () => (
    <View>
      <View style={styles.group}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>What needs fixing?</Text>
          {error.serviceName && <Text style={styles.error}>{error.serviceName}</Text>}
        </View>
        <View style={[styles.inputWrapper, error.serviceName && styles.errorBorder]}>
          <Feather name="tool" size={18} color="#888" style={styles.inputIcon} />
          <TextInput 
            placeholder="e.g. MacBook Screen Replacement" 
            style={styles.input} 
            placeholderTextColor="#AAA"
            value={serviceName}
            onChangeText={(val) => { setServiceName(val); setError({...error, serviceName: null}); }}
          />
        </View>
      </View>

      <View style={styles.group}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Issue Description</Text>
          {error.description && <Text style={styles.error}>{error.description}</Text>}
        </View>
        <TextInput
          placeholder="Describe the problem in detail..."
          style={[styles.textArea, error.description && styles.errorBorder]}
          multiline
          value={description}
          onChangeText={(val) => { setDescription(val); setError({...error, description: null}); }}
          placeholderTextColor="#AAA"
        />
      </View>

      <Text style={styles.label}>Urgency Level</Text>
      <View style={styles.urgencyRow}>
        {['Standard', 'Urgent', 'Critical'].map((level) => (
          <TouchableOpacity 
            key={level} 
            style={[styles.urgencyBtn, urgency === level && styles.urgencyBtnActive]}
            onPress={() => setUrgency(level)}
          >
            <Text style={[styles.urgencyText, urgency === level && styles.urgencyTextActive]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStepTwo = () => (
    <View>
      <View style={styles.group}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Preferred Schedule</Text>
          {(error.date || error.time) && <Text style={styles.error}>Selection Required</Text>}
        </View>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.dateTimeBtn, error.date && styles.errorBorder]} 
            onPress={() => { setPickerMode('date'); setShowPicker(true); }}
          >
            <Feather name="calendar" size={18} color="#111" />
            <Text style={styles.dateTimeText}>{dateText || 'Select Date'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.dateTimeBtn, error.time && styles.errorBorder]} 
            onPress={() => { setPickerMode('time'); setShowPicker(true); }}
          >
            <Feather name="clock" size={18} color="#111" />
            <Text style={styles.dateTimeText}>{timeText || 'Select Time'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Attach Photos (Optional)</Text>
      <TouchableOpacity style={styles.uploadBtn}>
        <Feather name="camera" size={24} color="#888" />
        <Text style={styles.uploadText}>Upload device photos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.backStepLink}>
        <Text style={styles.backStepText}>Edit details (Step 1)</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => currentStep === 2 ? setCurrentStep(1) : router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking: Step {currentStep}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formBody}>
          <View style={styles.stepper}>
            <View style={[styles.stepLine, currentStep >= 1 && { backgroundColor: '#111' }]} />
            <View style={styles.stepCircleActive}><Text style={styles.stepTextActive}>1</Text></View>
            <View style={[styles.stepLine, currentStep === 2 && { backgroundColor: '#111' }]} />
            <View style={currentStep === 2 ? styles.stepCircleActive : styles.stepCircle}>
              <Text style={currentStep === 2 ? styles.stepTextActive : styles.stepText}>2</Text>
            </View>
            <View style={styles.stepLine} />
          </View>

          {currentStep === 1 ? renderStepOne() : renderStepTwo()}

          {showPicker && (
            <DateTimePicker
              value={date}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onPickerChange}
              minimumDate={new Date()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleNextStep}>
            <Text style={styles.submitBtnText}>
              {currentStep === 1 ? 'Continue' : 'Confirm Booking'}
            </Text>
            <Feather name={currentStep === 1 ? "arrow-right" : "check-circle"} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#000" style={{ marginBottom: 15 }} />
            <Text style={styles.modalTitle}>Request Received</Text>
            <Text style={styles.modalMessage}>We've scheduled your service for {dateText} at {timeText}.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => router.replace('/home/page')}>
              <Text style={styles.modalButtonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}