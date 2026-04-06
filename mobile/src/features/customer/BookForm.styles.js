import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#FFF'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  formBody: { padding: 20, paddingBottom: 140 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  stepLine: { width: 50, height: 2, backgroundColor: '#EEE' },
  stepCircleActive: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
  stepTextActive: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stepText: { color: '#888', fontSize: 12 },
  
  group: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, height: 55, color: '#111', fontSize: 14 },
  textArea: { height: 120, backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, textAlignVertical: 'top', borderWidth: 1, borderColor: '#EEE' },

  urgencyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  urgencyBtn: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 25, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#EEE', width: '31%', alignItems: 'center' },
  urgencyBtnActive: { backgroundColor: '#111', borderColor: '#111' },
  urgencyText: { fontSize: 12, color: '#888' },
  urgencyTextActive: { color: '#FFF', fontWeight: 'bold' },
  
labelRow: { 
    flexDirection: 'row', 
    alignItems: 'center', // Centers items vertically against each other
    justifyContent: 'flex-start', // Keeps them grouped to the left
    marginBottom: 10,
    marginTop: 20, // Adds consistent spacing from the Urgency section
  },
  requirementLabel: { 
    fontSize: 12, 
    color: '#888', 
    marginLeft: 6,
    marginBottom: 10,
    fontWeight: '400',
  },
uploadCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  photoFrame: {
    height: 180, // Taller frame looks more professional
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEE'
  },
 photoFrameActive: {
    borderColor: '#F0F0F0',
    borderWidth: 1,
    backgroundColor: '#FFF'
  },
  previewImageRefined: { width: '100%', height: '100%', borderRadius: 15 },

  changeActionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 15, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEE',
  },
  changeActionText: { fontSize: 13, fontWeight: '600', color: '#007AFF', marginLeft: 8 },
  uploadBtnRefined: {
    height: 160, 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    borderStyle: 'dashed',
    borderRadius: 15,
    backgroundColor: '#F9FAFB'
  },
  uploadIconCircle: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
    marginBottom: 15, borderWidth: 1, borderColor: '#EEE'
  },
  uploadTextPrimary: { fontSize: 14, fontWeight: '700', color: '#111' },
  uploadTextSecondary: { fontSize: 12, color: '#6B7280', marginTop: 5, fontWeight: '500' },

  toggleRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 15, padding: 5, marginBottom: 15 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  toggleBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  toggleText: { fontWeight: '600', color: '#888' },
  toggleTextActive: { color: '#111' },

  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dateTimeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, width: '48%', borderWidth: 1, borderColor: '#EEE' },
  dateTimeText: { marginLeft: 10, fontSize: 14, color: '#111' },

  linkedOption: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F2F2F2',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  linkedOptionActive: { borderColor: '#111', borderWidth: 1.5, backgroundColor: '#FAFAFA' },
  methodAvatar: { width: 44, height: 44, borderRadius: 12, marginRight: 15, resizeMode: 'contain', backgroundColor: '#F9FAFB' },
  methodLabel: { fontSize: 16, fontWeight: '700', color: '#111' },
  methodIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  maskedNumber: { fontSize: 13, color: '#6B7280', marginTop: 2, letterSpacing: 0.5 },
  defaultBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  defaultText: { fontSize: 10, fontWeight: '800', color: '#374151' },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#DDD' },
  radioActive: { borderColor: '#111', borderWidth: 7 },
  cardInputContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  scanBtn: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#FFF' },
  submitBtn: { backgroundColor: '#111', height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#FFF', borderRadius: 30, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  modalButton: { backgroundColor: '#111', width: '100%', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  modalButtonText: { color: '#FFF', fontWeight: 'bold' },

  // Professional Linking Modal Styles
  authContainer: { 
    width: '90%', 
    backgroundColor: '#FFF', 
    borderRadius: 28, 
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10
  },
  authHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  authLogoSmall: { width: 30, height: 30, resizeMode: 'contain' },
  authHeaderTitle: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#111' },
  authBody: { padding: 25, alignItems: 'center' },
  authInstruction: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  authInputWrapper: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', 
    borderRadius: 16, width: '100%', paddingHorizontal: 15, borderWidth: 1, borderColor: '#E5E7EB'
  },
  countryCode: { fontSize: 16, fontWeight: '600', color: '#111', marginRight: 10 },
  authInputRefined: { flex: 1, height: 55, fontSize: 18, fontWeight: '600', color: '#111' },
  otpInput: { 
    width: '100%', height: 65, backgroundColor: '#F8F9FA', borderRadius: 16, 
    textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#111', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20
  },
  authSubmitPrimary: { backgroundColor: '#111', width: '100%', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  authSubmitText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  resendText: { marginTop: 20, color: '#007AFF', fontWeight: '600', fontSize: 13 },
  authFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, opacity: 0.5 },
  secureText: { fontSize: 10, color: '#888', marginLeft: 5, fontWeight: '600' },
  errorModalContainer: { 
    width: '85%', 
    backgroundColor: '#FFF', 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5
  },
  errorIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  errorModalTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#111',
    marginBottom: 10 
  },
  errorModalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20
  },
  errorList: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111',
    marginRight: 10
  },
  errorItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  errorModalButton: { 
    backgroundColor: '#111', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 18, 
    alignItems: 'center' 
  },
  errorModalButtonText: { 
    color: '#FFF', 
    fontWeight: '700',
    fontSize: 15 
  },
});